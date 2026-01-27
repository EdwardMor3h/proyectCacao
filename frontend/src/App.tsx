import { useState } from "react";
import VideoModal from "./components/VideoModal";
import SideMenu from "./components/SideMenu";
import InteractiveMap from "./components/InteractiveMap";
import InfoPanel from "./components/InfoPanel";
import type { Point } from "./data/points";

export default function App() {
  const [video, setVideo] = useState<string | null>(null);
  const [activePointId, setActivePointId] = useState<number | null>(null);
  const [activePoint, setActivePoint] = useState<Point | null>(null);

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
        onSelect={(point) => {
          setVideo(point.video);
          setActivePoint(point);
          setActivePointId(point.id);
        }}
        activePointId={activePointId}
      />

      <VideoModal
        video={video}
        onClose={() => {
          setVideo(null);
          setActivePoint(null);
          setActivePointId(null);
        }}
      />

      {/* Panel informativo */}
      {!video && <InfoPanel point={activePoint} />}
    </div>
  );
}
