import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/docs/$slug")({
  component: DocsPage,
});

function DocsPage() {
  const { slug } = Route.useParams();
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/docs/${encodeURIComponent(slug)}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then((text) => {
        const stripped = text.replace(/^---[\s\S]*?---\n*/, "");
        setContent(stripped);
      })
      .catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">文档未找到</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  if (content === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground text-sm">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.002_255)]">
      <header className="sticky top-0 z-40 border-b border-[oklch(0.92_0.01_255)] bg-[oklch(0.97_0.008_255)] px-5 py-3">
        <div className="max-w-[800px] mx-auto flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            返回
          </Link>
          <span className="text-[11px] text-muted-foreground/50">|</span>
          <span className="text-[12px] text-muted-foreground truncate">{decodeURIComponent(slug)}</span>
        </div>
      </header>
      <main className="max-w-[800px] mx-auto px-5 py-10 lg:py-14">
        <article className="markdown-body">
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </article>
      </main>
    </div>
  );
}
