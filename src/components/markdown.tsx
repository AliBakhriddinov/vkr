import ReactMarkdown, { type Components } from "react-markdown";

const components: Components = {
  h2: ({ node, ...props }) => (
    <h2 className="mt-10 font-display text-2xl font-bold tracking-tight" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="mt-8 text-xl font-semibold" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="mt-4 leading-relaxed text-foreground/90" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="mt-4 list-disc space-y-1.5 pl-6 text-foreground/90" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="mt-4 list-decimal space-y-1.5 pl-6 text-foreground/90" {...props} />
  ),
  a: ({ node, ...props }) => (
    <a className="text-primary underline underline-offset-2" {...props} />
  ),
  strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
  code: ({ node, ...props }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 text-sm" {...props} />
  ),
};

export function Markdown({ children }: { children: string }) {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
}
