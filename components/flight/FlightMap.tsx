"use client";

import greatCircle from "@turf/great-circle";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import { key, Keys, stageAt } from "./timeline";
import type { Apply } from "./Scene";

type LngLat = [number, number];

const HOA_BINH: LngLat = [105.34, 20.81];
const HANOI: LngLat = [105.85, 21.03];
const SINGAPORE: LngLat = [103.86, 1.28];
const MELBOURNE: LngLat = [144.96, -37.81];
const CAMPS: { name: string; at: LngLat }[] = [
  { name: "Hòa Bình", at: HOA_BINH },
  { name: "Hanoi", at: HANOI },
  { name: "Singapore", at: SINGAPORE },
  { name: "Melbourne", at: MELBOURNE },
];

function arc(a: LngLat, b: LngLat, n: number): LngLat[] {
  return greatCircle(a, b, { npoints: n }).geometry.coordinates as unknown as LngLat[];
}

const LEG_PATHS = [arc(HOA_BINH, HANOI, 30), arc(HANOI, SINGAPORE, 200), arc(SINGAPORE, MELBOURNE, 300)];
const ROUTE = [...LEG_PATHS[0], ...LEG_PATHS[1].slice(1), ...LEG_PATHS[2].slice(1)];

// Cumulative mercator length, which is what line-progress is measured in.
const CUM = (() => {
  const out = [0];
  for (let i = 1; i < ROUTE.length; i++) {
    const a = mapboxgl.MercatorCoordinate.fromLngLat(ROUTE[i - 1]);
    const b = mapboxgl.MercatorCoordinate.fromLngLat(ROUTE[i]);
    out.push(out[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
  }
  return out;
})();

// Position on the whole route as a float index.
const LEG_STARTS = [0, LEG_PATHS[0].length - 1, LEG_PATHS[0].length + LEG_PATHS[1].length - 2, ROUTE.length - 1];
const ROUTE_INDEX: Keys = [
  [0, 0],
  [0.3, LEG_STARTS[1] * 0.12],
  [0.4, LEG_STARTS[1]],
  [0.65, LEG_STARTS[2]],
  [0.9, LEG_STARTS[3]],
];

// Metres. Interpolated in log space so big climbs feel even.
const ALTITUDE: Keys = [
  [0, 3500],
  [0.3, 4200],
  [0.35, 12000],
  [0.4, 9000],
  [0.5, 1100000],
  [0.6, 300000],
  [0.65, 2500],
  [0.7, 400000],
  [0.78, 2200000],
  [0.86, 250000],
  [0.9, 1200],
  [1, 1000],
].map(([p, a]) => [p, Math.log(a)]) as Keys;

const PITCH: Keys = [[0, 72], [0.3, 70], [0.4, 58], [0.5, 40], [0.65, 62], [0.78, 38], [0.9, 70], [1, 80]];
const BEARING: Keys = [[0, 40], [0.3, 55], [0.4, 120], [0.5, 190], [0.65, 185], [0.75, 140], [0.9, 150], [1, 150]];

// Mapbox's camera can't roll, so the FPV bank comes from turning the whole map a little.
const ROLL: Keys = [[0, 0], [0.3, -0.03], [0.45, 0.035], [0.6, -0.03], [0.75, 0.035], [0.9, 0], [1, 0]];

const LIGHT: { sun: [number, number]; fog: mapboxgl.FogSpecification }[] = [
  { sun: [90, 88], fog: { color: "#7A848D", "high-color": "#3E4852", "horizon-blend": 0.12, "space-color": "#0E1216", "star-intensity": 0 } },
  { sun: [90, 80], fog: { color: "#7A848D", "high-color": "#222A32", "horizon-blend": 0.08, "space-color": "#0E1216", "star-intensity": 0.2 } },
  { sun: [270, 92], fog: { color: "#B5682A", "high-color": "#5C3A24", "horizon-blend": 0.14, "space-color": "#161B21", "star-intensity": 0.3 } },
  { sun: [60, 89], fog: { color: "#D98B32", "high-color": "#2E3740", "horizon-blend": 0.14, "space-color": "#0E1216", "star-intensity": 0.1 } },
  { sun: [60, 84], fog: { color: "#F7DDA8", "high-color": "#4F5A64", "horizon-blend": 0.18, "space-color": "#2E3740", "star-intensity": 0 } },
];

export default function FlightMap({
  register,
  onReady,
  onFail,
}: {
  register: (fn: Apply) => () => void;
  onReady: () => void;
  onFail: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!box.current) return;
    let unregister = () => {};
    let map: mapboxgl.Map;
    try {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
      map = new mapboxgl.Map({
        container: box.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        projection: "mercator",
        interactive: false,
        center: HOA_BINH,
        zoom: 11,
        pitch: 72,
      });
    } catch {
      onFail();
      return;
    }

    let ready = false;
    map.on("error", (e) => {
      if (!ready) {
        console.warn("Mapbox failed, using the stylised flight", e.error);
        onFail();
      }
    });

    map.on("load", () => {
      map.addSource("mapbox-dem", { type: "raster-dem", url: "mapbox://mapbox.mapbox-terrain-dem-v1", tileSize: 512 });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.4 });
      map.addLayer({
        id: "sky",
        type: "sky",
        paint: { "sky-type": "atmosphere", "sky-atmosphere-sun": LIGHT[0].sun, "sky-atmosphere-sun-intensity": 12 },
      });
      map.setFog(LIGHT[0].fog);

      map.addSource("route", {
        type: "geojson",
        lineMetrics: true,
        data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: ROUTE } },
      });
      const gradient: mapboxgl.ExpressionSpecification = ["interpolate", ["linear"], ["line-progress"], 0, "#F0C27A", 1, "#D98B32"];
      map.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-gradient": gradient, "line-width": 12, "line-blur": 10, "line-opacity": 0.55, "line-trim-offset": [0, 1] },
      });
      map.addLayer({
        id: "route-core",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-gradient": gradient, "line-width": 3, "line-trim-offset": [0, 1] },
      });

      for (const c of CAMPS) {
        const el = document.createElement("div");
        el.className = "flex flex-col items-center";
        el.setAttribute("aria-hidden", "true");
        const tag = document.createElement("span");
        tag.className = "bg-night/80 px-2 py-1 text-[11px] uppercase tracking-[0.15em] text-paper";
        tag.textContent = c.name;
        const beam = document.createElement("span");
        beam.style.cssText = "width:2px;height:64px;background:linear-gradient(transparent,#D98B32)";
        el.append(tag, beam);
        new mapboxgl.Marker({ element: el, anchor: "bottom" }).setLngLat(c.at).addTo(map);
      }

      let lastStage = 0;
      let lastTrim = -1;
      const apply: Apply = (p) => {
        const idx = Math.min(ROUTE.length - 1.001, key(p, ROUTE_INDEX));
        const i = Math.floor(idx);
        const f = idx - i;
        const lng = ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * f;
        const lat = ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * f;

        const alt = Math.exp(key(p, ALTITUDE));
        const pitch = key(p, PITCH);
        const bearing = key(p, BEARING);
        const back = alt * Math.tan((Math.min(pitch, 80) * Math.PI) / 180);
        const rad = (bearing * Math.PI) / 180;
        const camLat = lat - (back * Math.cos(rad)) / 111320;
        const camLng = lng - (back * Math.sin(rad)) / (111320 * Math.cos((lat * Math.PI) / 180));

        const cam = map.getFreeCameraOptions();
        cam.position = mapboxgl.MercatorCoordinate.fromLngLat([camLng, Math.max(-80, Math.min(80, camLat))], alt);
        cam.setPitchBearing(pitch, bearing);
        map.setFreeCameraOptions(cam);
        if (box.current) box.current.style.transform = `rotate(${key(p, ROLL)}rad) scale(1.1)`;

        const trim = (CUM[i] + (CUM[i + 1] - CUM[i]) * f) / CUM[CUM.length - 1];
        if (Math.abs(trim - lastTrim) > 0.0005) {
          lastTrim = trim;
          // Trims off everything ahead of the camera, so the line draws as it flies.
          const range: [number, number] = [Math.min(0.9999, trim), 1];
          map.setPaintProperty("route-core", "line-trim-offset", range);
          map.setPaintProperty("route-glow", "line-trim-offset", range);
        }

        const stage = stageAt(p);
        if (stage !== lastStage) {
          lastStage = stage;
          map.setFog(LIGHT[stage].fog);
          map.setPaintProperty("sky", "sky-atmosphere-sun", LIGHT[stage].sun);
        }
      };

      unregister = register(apply);
      map.once("idle", () => {
        ready = true;
        onReady();
      });
    });

    return () => {
      unregister();
      map.remove();
    };
  }, [register, onReady, onFail]);

  return <div ref={box} aria-hidden className="absolute inset-0" />;
}
