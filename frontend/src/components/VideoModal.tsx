import type { CSSProperties } from "react";
import InfoPanel from "./InfoPanel";
import type { Point } from "../data/points";

export default function VideoModal({
  video,
  point,
  onClose,
}: {
  video: string | null;
  point: Point | null;
  onClose: () => void;
}) {
  if (!video || !point) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={videoBox}>
          <video src={video} controls autoPlay style={{ width: "100%" }} />
        </div>

        <div style={panelBox}>
          <InfoPanel point={point} />
        </div>
      </div>
    </div>
  );
}

const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100,
};

const modal: CSSProperties = {
  display: "flex",
  width: "85%",
  maxWidth: 1200,
  background: "#000",
  borderRadius: 14,
  overflow: "hidden",
};

const videoBox: CSSProperties = {
  flex: 2,
};

const panelBox: CSSProperties = {
  flex: 1,
  background: "#fff",
};
