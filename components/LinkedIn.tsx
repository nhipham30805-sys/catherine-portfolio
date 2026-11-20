import { CONTACT } from "@/lib/content";

// Opens Catherine's LinkedIn profile in a new tab.
export default function LinkedIn({ label = "LinkedIn profile", className = "underline underline-offset-4 hover:text-paper" }: { label?: string; className?: string }) {
  return (
    <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
      <span aria-hidden> ↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
