// True when the page should sit still: only when the visitor asked their device for less motion.
// (Recruiter mode used to switch motion off too; it is now just a link to The Trail.)
export const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
