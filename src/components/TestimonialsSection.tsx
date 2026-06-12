import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";
import type { Testimonial } from "@/lib/types";

const PLATFORM_ICON: Record<string, string> = {
  linkedin: "M13.6 13.6h-2.37V9.9c0-.88-.02-2.02-1.23-2.02-1.23 0-1.42.96-1.42 1.95v3.77H6.2V6h2.28v1.04h.03c.32-.6 1.1-1.23 2.26-1.23 2.4 0 2.85 1.58 2.85 3.64v4.15ZM3.56 4.96a1.38 1.38 0 1 1 0-2.76 1.38 1.38 0 0 1 0 2.76ZM4.75 13.6H2.37V6h2.38v7.6ZM14.78 0H1.2C.54 0 0 .53 0 1.18v13.64C0 15.47.54 16 1.2 16h13.58c.66 0 1.22-.53 1.22-1.18V1.18C16 .53 15.44 0 14.78 0Z",
  twitter: "M12.6 1.5h2.28l-5 5.71L16 14.5h-4.6l-3.6-4.7-4.13 4.7H1.4l5.34-6.1L0 1.5h4.72l3.26 4.31L12.6 1.5Zm-.8 11.64h1.27L4.27 2.8H2.9l8.9 10.34Z",
  instagram: "M8 1.44c2.14 0 2.39 0 3.23.05.78.03 1.2.16 1.49.27.37.14.64.32.92.6.28.28.46.55.6.92.1.28.24.7.27 1.49.04.84.05 1.09.05 3.23s0 2.39-.05 3.23c-.03.78-.16 1.2-.27 1.49-.14.37-.32.64-.6.92-.28.28-.55.46-.92.6-.28.1-.71.24-1.49.27-.84.04-1.09.05-3.23.05s-2.39 0-3.23-.05c-.78-.03-1.2-.16-1.49-.27a2.48 2.48 0 0 1-.92-.6 2.48 2.48 0 0 1-.6-.92c-.1-.28-.24-.71-.27-1.49C1.44 10.39 1.44 10.14 1.44 8s0-2.39.05-3.23c.03-.78.16-1.2.27-1.49.14-.37.32-.64.6-.92.28-.28.55-.46.92-.6.28-.1.71-.24 1.49-.27C5.61 1.44 5.86 1.44 8 1.44ZM8 0C5.82 0 5.55.01 4.7.05c-.85.04-1.43.17-1.94.37-.53.2-.98.48-1.42.93-.45.44-.72.89-.93 1.42-.2.51-.33 1.09-.37 1.94C.01 5.55 0 5.82 0 8s.01 2.45.05 3.3c.04.85.17 1.43.37 1.94.2.53.48.98.93 1.42.44.45.89.72 1.42.93.51.2 1.09.33 1.94.37.85.04 1.12.05 3.3.05s2.45-.01 3.3-.05c.85-.04 1.43-.17 1.94-.37.53-.2.98-.48 1.42-.93.45-.44.72-.89.93-1.42.2-.51.33-1.09.37-1.94.04-.85.05-1.12.05-3.3s-.01-2.45-.05-3.3c-.04-.85-.17-1.43-.37-1.94a3.9 3.9 0 0 0-.93-1.42A3.9 3.9 0 0 0 13.24.42c-.51-.2-1.09-.33-1.94-.37C10.45.01 10.18 0 8 0Zm0 3.89a4.11 4.11 0 1 0 0 8.22 4.11 4.11 0 0 0 0-8.22Zm0 6.78a2.67 2.67 0 1 1 0-5.34 2.67 2.67 0 0 1 0 5.34Zm5.23-6.94a.96.96 0 1 1-1.92 0 .96.96 0 0 1 1.92 0Z",
  website: "M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm5.92 5.5h-2.36a12.4 12.4 0 0 0-1.1-2.84A6.53 6.53 0 0 1 13.92 5.5Zm-3.92 0H6c.4-1.36 1.1-2.5 2-3.3.9.8 1.6 1.94 2 3.3ZM1.55 9.5a6.5 6.5 0 0 1 0-3h2.7a13.6 13.6 0 0 0 0 3H1.55Zm.53 1.5h2.36a12.4 12.4 0 0 0 1.1 2.84A6.53 6.53 0 0 1 2.08 11Zm2.36-5.5H2.08a6.53 6.53 0 0 1 3.46-2.84A12.4 12.4 0 0 0 4.44 5.5ZM8 14.3c-.9-.8-1.6-1.94-2-3.3h4c-.4 1.36-1.1 2.5-2 3.3Zm2.32-4.8H5.68a12 12 0 0 1 0-3h4.64a12 12 0 0 1 0 3Zm.14 4.34a12.4 12.4 0 0 0 1.1-2.84h2.36a6.53 6.53 0 0 1-3.46 2.84Zm1.29-4.34a13.6 13.6 0 0 0 0-3h2.7a6.5 6.5 0 0 1 0 3h-2.7Z",
};

const VIDEO_RE = /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i;
const isVideo = (url: string | null) => Boolean(url && VIDEO_RE.test(url));

const FALLBACKS: Testimonial[] = [
  { id: "f1", created_at: "", updated_at: "", name: "Seed-stage founder", role: "Founder", company: null, quote: "Built our MVP in 3 weeks with a 4-person team. Fastest we have ever shipped.", caption: "Zero-to-one SaaS MVP with auth, billing and dashboards.", image_url: null, social_url: null, social_platform: null, display_order: 0, active: true },
  { id: "f2", created_at: "", updated_at: "", name: "Series A ops lead", role: "Operations Lead", company: null, quote: "Cut our development cost by 40% without sacrificing quality.", caption: "Internal automation replacing 12 hours of manual ops weekly.", image_url: null, social_url: null, social_platform: null, display_order: 1, active: true },
  { id: "f3", created_at: "", updated_at: "", name: "VP Engineering, fintech", role: "VP Engineering", company: null, quote: "Shipped faster than our in-house team. Production-ready from day one.", caption: "Full-stack platform with real-time data, built in 6 weeks.", image_url: null, social_url: null, social_platform: null, display_order: 2, active: true },
];

function Media({ name, url, large }: { name: string; url: string | null; large?: boolean }) {
  const cls = large ? "testi-avatar testi-avatar--lg" : "testi-avatar";
  if (url && isVideo(url)) {
    return (
      <video className={cls} src={url} muted loop autoPlay playsInline aria-label={name} />
    );
  }
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={cls} src={url} alt={name} loading="lazy" />;
  }
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return <div className={`${cls} testi-avatar--initials`}>{initials}</div>;
}

function SocialIcon({ platform }: { platform: string | null }) {
  const d = PLATFORM_ICON[platform ?? "website"] ?? PLATFORM_ICON.website;
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="testi-social-icon">
      <path d={d} />
    </svg>
  );
}

function TestiCard({ t, featured }: { t: Testimonial; featured?: boolean }) {
  return (
    <figure className={featured ? "testi-card testi-card--featured n-lg" : "testi-card n-card"}>
      <div className="testi-quote-wrap">
        <span className="testi-open-quote" aria-hidden="true">&ldquo;</span>
        <blockquote className="testi-quote">{t.quote}</blockquote>
      </div>
      {t.caption && (
        <div className="testi-caption">
          <span className="testi-caption-dot" />
          {t.caption}
        </div>
      )}
      <figcaption className="testi-meta">
        <Media name={t.name} url={t.image_url} large={featured} />
        <div className="testi-meta-text">
          <span className="testi-name">{t.name}</span>
          {(t.role || t.company) && (
            <span className="testi-role">{[t.role, t.company].filter(Boolean).join(" · ")}</span>
          )}
        </div>
        {t.social_url && (
          <a
            href={t.social_url}
            target="_blank"
            rel="noreferrer"
            className="testi-social"
            aria-label={`${t.name} profile`}
          >
            <SocialIcon platform={t.social_platform} />
          </a>
        )}
      </figcaption>
    </figure>
  );
}

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const items = (testimonials.length > 0 ? testimonials : FALLBACKS).slice(0, 5);
  const [featured, ...rest] = items;
  if (!featured) return null;

  return (
    <section id="results" className="section testi-section">
      <Reveal as="div" className="section-header">
        <div className="tag">Client results</div>
        <h2>Receipts beat promises.</h2>
        <p>Real outcomes from real builds, in our clients&apos; own words.</p>
      </Reveal>

      <div className="testi-layout">
        <Reveal delay={0.05}>
          <TestiCard t={featured} featured />
        </Reveal>

        {rest.length > 0 && (
          <RevealGroup as="div" className="testi-stack" amount={0.1}>
            {rest.map((t) => (
              <RevealItem key={t.id} as="div">
                <TestiCard t={t} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
