"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14171E",
          color: "#ECECEC",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: 24, maxWidth: 360 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Something went wrong.
          </h1>
          <p style={{ color: "rgba(236,236,236,0.6)", marginTop: 8, fontSize: 14 }}>
            Please refresh the page and try again.
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: 18,
              padding: "11px 22px",
              borderRadius: 999,
              border: 0,
              cursor: "pointer",
              fontWeight: 600,
              color: "#14171E",
              background: "linear-gradient(135deg, #FFC700 0%, #FF6A1A 50%, #FF2D4F 100%)",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
