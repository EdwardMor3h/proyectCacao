import type { CSSProperties } from "react";

export default function VideoModal({
  video,
  onClose,
}: {
  video: string | null;
  onClose: () => void;
}) {
  if (!video) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        
        {/* 🟢 LOGO SUPERIOR DERECHO */}
        <img
          src="/mapa/logo.png"
          alt="Logo"
          style={logo}
        />

        {/* 🎥 VIDEO */}
        <video
          src={video}
          controls
          autoPlay
          style={{ width: "100%", borderRadius: 8 }}
        />
      </div>
    </div>
  );
}
const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.75)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal: CSSProperties = {
  position: "relative",
  width: "75%",
  maxWidth: 1100,
  background: "#000",
  borderRadius: 12,
  padding: 14,
};

const logo: CSSProperties = {
  position: "absolute",
  top: 12,
  right: 12,
  width: 200,          // 👈 pequeño
  opacity: 0.9,
  pointerEvents: "none", // 👈 no interfiere con controles
};
