import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "999px",
            background: "linear-gradient(135deg,#FFC700,#FF6A1A,#FF2D4F)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
