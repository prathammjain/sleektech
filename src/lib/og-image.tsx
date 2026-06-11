import { ImageResponse } from "next/og";
import { SITE, OG } from "./site";

/**
 * Shared 1200x630 social card, rendered by both the Open Graph and Twitter
 * image routes. Uses the default runtime font for reliability (no network
 * font fetch) and the brand flame palette for impact.
 */
export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#14171E",
          color: "#ECECEC",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(900px circle at 82% 112%, rgba(255,45,79,0.38), rgba(255,199,0,0.14) 40%, transparent 70%)",
          }}
        />

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "999px",
              background: "linear-gradient(135deg,#FFC700,#FF6A1A,#FF2D4F)",
            }}
          />
          <div style={{ fontSize: "28px", letterSpacing: "8px", fontWeight: 600 }}>
            SLEEKTECH
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: "84px",
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-3px",
            }}
          >
            We build software
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "84px",
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-3px",
              color: "#FF6A1A",
            }}
          >
            that just works.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "30px",
              fontSize: "30px",
              color: "rgba(236,236,236,0.68)",
            }}
          >
            Websites · Web &amp; Mobile Apps · Automations · AI
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              height: "6px",
              width: "190px",
              borderRadius: "999px",
              background: "linear-gradient(90deg,#FFC700,#FF6A1A,#FF2D4F)",
            }}
          />
          <div style={{ display: "flex", fontSize: "26px", color: "rgba(236,236,236,0.6)" }}>
            {SITE.domain}
          </div>
        </div>
      </div>
    ),
    { width: OG.width, height: OG.height },
  );
}
