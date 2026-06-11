import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Brand mark: the flame dot on a dark rounded square (reads well at favicon size).
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14171E",
          borderRadius: "16px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "999px",
            background: "linear-gradient(135deg,#FFC700,#FF6A1A,#FF2D4F)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
