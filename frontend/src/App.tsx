import { useState } from "react";
import SideMenu from "./components/SideMenu";
import InteractiveMap from "./components/InteractiveMap";
import VideoModal from "./components/VideoModal";
import type { Point } from "./data/points";

export default function App() {
  const [video, setVideo] = useState<string | null>(null);
  const [activePointId, setActivePointId] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 🧭 LAYOUT LATERAL */}
      <SideMenu
        onSelectVideo={(video, pointId) => {
          setVideo(video);
          setActivePointId(pointId);
        }}
      />

      {/* 🗺️ MAPA */}
      <InteractiveMap
        activePointId={activePointId}
        onSelect={(point: Point) => {
          setVideo(point.video);
          setActivePointId(point.id);
        }}
      />

      {/* 🎥 VIDEO MODAL (FLOTANTE) */}
      <VideoModal
        video={video}
        onClose={() => {
          setVideo(null);
          setActivePointId(null);
        }}
      />
    </div>
  );
}
