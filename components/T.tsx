// Renders copy, outlining any [bracketed placeholder] so it can't be missed.
export default function T({ children }: { children: string }) {
  return (
    <>
      {children.split(/(\[[^\]]+\])/).map((part, i) =>
        part.startsWith("[") ? (
          <span key={i} className="ph">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
