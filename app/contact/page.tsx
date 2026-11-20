import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact Catherine Pham | Melbourne Marketing",
  description: "Hiring, a project, or a coffee in the CBD? Get in touch with Catherine Pham.",
};

// The same section that ends the homepage, so links to /contact still land somewhere.
export default function Contact() {
  return <ContactSection page />;
}
