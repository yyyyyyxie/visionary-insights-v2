import { FileText, ExternalLink, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function PageHeader() {
  return (
    <header className="relative pb-10">
      <div className="space-y-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary/80">
          Eurographics 2026
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-[40px] lg:leading-[1.1]">
          Eurographics 2026 · 学术分享
        </h1>
        {/* <p className="text-base text-muted-foreground leading-relaxed lg:text-lg">
          从 Best Paper 到我们的 <span className="text-foreground font-semibold">TextFlux</span>
        </p> */}
        <p className="max-w-[65ch] text-sm leading-[1.7] text-muted-foreground/80">
          本次分享 EG 2026 的现场体验、两篇相关 paper reading、两场 keynote 的核心观点，
          以及我们 TextFlux 工作的可控性延展思考。
        </p>
      </div>
    </header>
  );
}

export function Section({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-12 space-y-6">
      <div className="flex items-baseline gap-3">
        <span className="text-[11px] font-bold tracking-widest text-primary/60 tabular-nums">{number}</span>
        <h2 className="text-xl font-semibold tracking-tight text-foreground lg:text-2xl">{title}</h2>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export function Card({ children, accent, highlight }: { children: React.ReactNode; accent?: boolean; highlight?: boolean }) {
  return (
    <article
      className={cn(
        "relative rounded-2xl border p-6 lg:p-8 transition-shadow duration-300",
        highlight
          ? "border-primary/20 bg-[oklch(0.98_0.012_260)] shadow-[0_2px_12px_oklch(0.5_0.18_260/0.06)]"
          : accent
            ? "border-[oklch(0.92_0.01_255)] bg-[oklch(0.995_0.003_255)]"
            : "border-[oklch(0.93_0.008_255)] bg-[oklch(1_0_0)]",
      )}
    >
      <div className="prose-content space-y-4">{children}</div>
    </article>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-semibold tracking-tight text-foreground">{children}</h3>;
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h4 className="mt-3 text-sm font-semibold tracking-tight text-foreground uppercase">{children}</h4>;
}

export function Meta({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70">{children}</p>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-bold uppercase tracking-widest text-primary">{children}</div>;
}

export function ImagePlaceholder({ caption, ratio = "16/9", src, originalCaption }: { caption: string; ratio?: string; src?: string; originalCaption?: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <figure className="my-3 space-y-2">
      <div
        className="relative w-full overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br from-muted/80 to-muted/30"
        style={{ aspectRatio: ratio }}
      >
        {src ? (
          <img src={src} alt={caption} className="absolute inset-0 w-full h-full object-contain" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
              <FileText className="h-5 w-5" />
              <span className="text-[10px] tracking-wide uppercase">Image Placeholder</span>
            </div>
          </div>
        )}
      </div>
      <figcaption>
        <div className="text-center">
          <span className="text-[11px] text-muted-foreground/60">{caption}</span>
          {originalCaption && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] text-primary/50 hover:text-primary transition-colors"
            >
              {expanded ? "收起" : "原文 caption"}
              <ChevronDown className={cn("h-2.5 w-2.5 transition-transform duration-200", expanded && "rotate-180")} />
            </button>
          )}
        </div>
        {originalCaption && expanded && (
          <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground/50 italic text-left">{originalCaption}</p>
        )}
      </figcaption>
    </figure>
  );
}

type ComparisonResult = { src: string; label: string };

export function ComparisonGroup({ original, results }: { original: string; results: ComparisonResult[] }) {
  const isSmall = results.length <= 2;
  return (
    <div className="rounded-xl border border-border/40 overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 p-4">
      {isSmall ? (
        <div className="grid grid-cols-3 gap-4 items-start">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Original</div>
            <img src={original} alt="Original" className="w-full rounded-lg border border-border/30" />
          </div>
          {results.map((r, i) => (
            <div key={i}>
              <div className={cn(
                "text-[10px] font-semibold uppercase tracking-wider mb-2",
                r.label.toLowerCase().includes("gpt") ? "text-red-400/70" : "text-emerald-500/70"
              )}>
                {r.label}
              </div>
              <img src={r.src} alt={r.label} className="w-full rounded-lg border border-border/30" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 items-start">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Original</div>
            <img src={original} alt="Original" className="w-full rounded-lg border border-border/30" />
          </div>
          {results.map((r, i) => (
            <div key={i}>
              <div className={cn(
                "text-[10px] font-semibold uppercase tracking-wider mb-2",
                r.label.toLowerCase().includes("gpt") ? "text-red-400/70" : r.label.toLowerCase().includes("mask") ? "text-muted-foreground/60" : "text-emerald-500/70"
              )}>
                {r.label}
              </div>
              <img src={r.src} alt={r.label} className="w-full rounded-lg border border-border/30" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type GalleryItem = { src: string; caption: string };

export function PhotoGallery({ photos }: { photos: GalleryItem[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => setSelected(i)}
            className="group relative overflow-hidden rounded-xl border border-border/40 bg-muted/20 transition-all duration-200 hover:shadow-md hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <div className="aspect-[4/3] w-full">
              <img
                src={photo.src}
                alt={photo.caption}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2.5 pb-2 pt-6">
              <span className="text-[10px] text-white/90 leading-tight line-clamp-2">{photo.caption}</span>
            </div>
          </button>
        ))}
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            aria-label="关闭"
          >
            <X className="h-5 w-5" />
          </button>
          <figure className="max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[selected].src}
              alt={photos[selected].caption}
              className="max-w-full max-h-[75vh] rounded-xl object-contain shadow-2xl"
            />
            <figcaption className="text-center text-sm text-white/80">{photos[selected].caption}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

export function Callout({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "primary" }) {
  return (
    <div
      className={cn(
        "rounded-xl px-4 py-3 text-sm leading-relaxed",
        variant === "primary"
          ? "bg-[oklch(0.96_0.02_260)] text-foreground"
          : "bg-[oklch(0.96_0.005_255)] text-muted-foreground",
      )}
    >
      {children}
    </div>
  );
}

export function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="rounded-xl bg-[oklch(0.96_0.02_260)] px-4 py-3 text-sm italic text-foreground">
      "{children}"
    </blockquote>
  );
}

export function LinkChip({ children, href }: { children: React.ReactNode; href: string }) {
  const docsMatch = href.match(/^\/docs\/(.+)\.md$/);
  if (docsMatch) {
    const slug = docsMatch[1];
    return (
      <Link
        to="/docs/$slug"
        params={{ slug }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[oklch(0.92_0.01_255)] bg-[oklch(0.97_0.005_255)] px-3 py-1.5 text-[12px] font-medium text-foreground hover:border-primary/30 hover:text-primary transition-colors duration-150"
      >
        {children}
        <ExternalLink className="h-3 w-3 opacity-30" />
      </Link>
    );
  }
  return (
    <a
      href={href}
      target={href.startsWith("/") ? undefined : "_blank"}
      rel={href.startsWith("/") ? undefined : "noopener noreferrer"}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[oklch(0.92_0.01_255)] bg-[oklch(0.97_0.005_255)] px-3 py-1.5 text-[12px] font-medium text-foreground hover:border-primary/30 hover:text-primary transition-colors duration-150"
    >
      {children}
      <ExternalLink className="h-3 w-3 opacity-30" />
    </a>
  );
}

export function ControlPill({ label, paper }: { label: string; paper: string }) {
  return (
    <div className="rounded-xl border border-[oklch(0.92_0.01_255)] bg-[oklch(0.97_0.008_260)] p-3 text-center">
      <div className="text-[11px] font-semibold text-foreground">{label}</div>
      <div className="text-[10px] text-primary/70 mt-0.5 font-medium">{paper}</div>
    </div>
  );
}

export function ResultsTable() {
  const rows = [
    { model: "Palette-Adapter (Ours)", emd: "0.082", koniq: "72.4", ava: "5.61", clip: "0.312" },
    { model: "ControlNet (Color)", emd: "0.146", koniq: "68.1", ava: "5.20", clip: "0.289" },
    { model: "Gray + Recolor", emd: "0.171", koniq: "65.3", ava: "5.04", clip: "0.276" },
    { model: "T2I-Adapter", emd: "0.158", koniq: "66.7", ava: "5.13", clip: "0.281" },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 mt-3">
      <table className="w-full text-[12px]">
        <thead className="bg-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 text-left font-semibold">Model</th>
            <th className="px-3 py-2.5 text-right font-semibold">EMD ↓</th>
            <th className="px-3 py-2.5 text-right font-semibold">Koniq ↑</th>
            <th className="px-3 py-2.5 text-right font-semibold">AVA ↑</th>
            <th className="px-3 py-2.5 text-right font-semibold">CLIP ↑</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.model} className={cn("border-t border-border/40", i % 2 === 1 && "bg-muted/20")}>
              <td className={cn("px-4 py-2.5 font-medium", i === 0 ? "text-primary" : "text-foreground")}>{r.model}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{r.emd}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{r.koniq}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{r.ava}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{r.clip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
