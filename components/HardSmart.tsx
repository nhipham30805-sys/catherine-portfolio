"use client";

import { useState } from "react";
import T from "./T";
import Tabs from "./Tabs";

const VIEWS = [
  { id: "hard", label: "Hard" },
  { id: "smart", label: "Smart" },
];

// Hard is the effort, on graph paper in handwriting. Smart is the shortcut, clean and lit.
export default function HardSmart({ hard, smart, label }: { hard: string; smart: string; label: string }) {
  const [view, setView] = useState("hard");
  const isHard = view === "hard";

  return (
    <div className={`hs rounded-[20px] p-5 transition-colors duration-500 md:p-6 ${isHard ? "graph" : "hs-smart"}`}>
      <Tabs items={VIEWS} value={view} onChange={setView} label={`Hard or smart: ${label}`} light={!isHard} />
      <div key={view} className="tab-in mt-4" aria-live="polite">
        {isHard ? (
          <p className="font-hand text-2xl leading-snug md:text-[1.7rem]">
            <T>{hard}</T>
          </p>
        ) : (
          <p className="text-lg font-medium leading-snug">
            <T>{smart}</T>
          </p>
        )}
      </div>
    </div>
  );
}
