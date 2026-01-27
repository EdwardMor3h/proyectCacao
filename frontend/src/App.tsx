import { useState } from "react";
import VideoModal from "./components/VideoModal";
import SideMenu from "./components/SideMenu";
import InteractiveMap from "./components/InteractiveMap";
import type { Point } from "./data/points";

export default function App() {
  const [video, setVideo] = useState<string | null>(null);
  const [activePoint, setActivePoint] = useState<Point | null>(null);
  const [activePointId, setActivePointId] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      <SideMenu
        onSelectVideo={(video) => {
          setVideo(video);
          setActivePoint(null);
          setActivePointId(null);
        }}
      />

      <InteractiveMap
        activePointId={activePointId}
        onSelect={(point) => {
          setVideo(point.video);
          setActivePoint(point);
          setActivePointId(point.id);
        }}
      />

      <VideoModal
        video={video}
        point={activePoint}
        onClose={() => {
          setVideo(null);
          setActivePoint(null);
          setActivePointId(null); // 👈 AQUÍ SÍ EXISTE
        }}
      />
    </div>
  );
}
