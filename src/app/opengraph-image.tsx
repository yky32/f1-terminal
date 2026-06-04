import { ImageResponse } from "next/og";
import { brandLogoMarkDataUrl } from "@/lib/brand-logo-mark";
import { PRODUCT_NAME, SITE_DESCRIPTION } from "@/lib/metadata";

export const alt = PRODUCT_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px 80px",
          background: "linear-gradient(145deg, #0a0a0a 0%, #1a2332 55%, #0f172a 100%)",
          color: "#f8fafc",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img
            src={brandLogoMarkDataUrl({ ink: "#f8fafc" })}
            alt=""
            width={64}
            height={64}
          />
          <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em" }}>
            {PRODUCT_NAME}
          </span>
        </div>

        <p
          style={{
            margin: 0,
            maxWidth: 880,
            fontSize: 52,
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
          }}
        >
          Monitor F1 everywhere.
        </p>

        <p style={{ margin: 0, fontSize: 28, lineHeight: 1.4, color: "#94a3b8" }}>
          {SITE_DESCRIPTION}
        </p>
      </div>
    ),
    { ...size },
  );
}
