import ContactSection from "@/components/ContactSection";
import Flight from "@/components/flight/Flight";
import { HardSmartSplit, StatsStrip } from "@/components/HomeBits";

export default function Home() {
  return (
    <>
      <Flight />

      <StatsStrip />
      <HardSmartSplit />

      <ContactSection />
    </>
  );
}
