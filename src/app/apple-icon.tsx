import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// SleekTech "ST" monogram on the brand-dark tile (iOS home screen icon).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#070B14",
        }}
      >
        <svg width="180" height="180" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#070B14" />
          <path
            d="M62 58 Q62 48 74 48 L118 48 Q130 48 130 60 Q130 72 118 72 L82 72 Q70 72 70 84 Q70 96 82 96 L118 96 Q130 96 130 108 Q130 120 118 120 L82 120 Q70 120 70 132"
            stroke="#4AF4FF"
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
          />
          <line x1="90" y1="48" x2="162" y2="48" stroke="#4AF4FF" strokeWidth="11" strokeLinecap="round" />
          <line x1="138" y1="48" x2="138" y2="152" stroke="#4AF4FF" strokeWidth="11" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
