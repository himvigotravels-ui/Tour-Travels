/**
 * Renders one or more Schema.org JSON-LD blocks.
 *
 * Server component — emits a <script type="application/ld+json"> per object.
 * `undefined` values are dropped by JSON.stringify, so builders can spread
 * optional fields conditionally without leaving null noise in the output.
 */
type JsonLdData = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.filter(Boolean).map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Schema content is build/server generated, never user-controlled raw HTML.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}

export default JsonLd;
