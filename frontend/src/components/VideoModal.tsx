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
        <video src={video} controls autoPlay style={{ width: "100%" }} />
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
  width: "75%",
  maxWidth: 1100,
  background: "#000",
  borderRadius: 12,
  padding: 10,
};