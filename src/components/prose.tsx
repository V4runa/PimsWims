/** Minimal, dependency-free renderer for the CMS body text.
 *  Supports blank-line paragraphs, `## H2`, `### H3`, and `- ` bullet lists. */
export default function Prose({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-5 text-lg leading-relaxed text-ink/85">
      {blocks.map((block, i) => {
        if (block.startsWith("### ")) {
          return <h3 key={i} className="pt-2 text-2xl">{block.slice(4)}</h3>;
        }
        if (block.startsWith("## ")) {
          return <h2 key={i} className="pt-3 text-3xl">{block.slice(3)}</h2>;
        }
        if (block.split("\n").every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-6">
              {block.split("\n").map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}
