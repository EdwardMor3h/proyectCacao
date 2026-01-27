import { useState } from "react";
import { points, type Point } from "../data/points";

interface Props {
  onSelect: (point: Point) => void;
  activePointId: number | null;
}

export default function InteractiveMap({ onSelect, activePointId }: Props) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  // 🎯 Zoom con rueda
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) =>
      Math.min(Math.max(prev + (e.deltaY > 0 ? -0.1 : 0.1), 1), 3)
    );
  };

  // 🖐 Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({ x: e.clientX - start.x, y: e.clientY - start.y });
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <div
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={styles.container}
    >
      <div
        style={{
          ...styles.mapWrapper,
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
      >
        <img
          src="/mapa/mapa_cacao.png"
          alt="Mapa Cacao"
          style={styles.map}
          draggable={false}
        />

        {points.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelect(p)}
            title={p.name}
            style={{
              ...styles.point,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background:
                activePointId === p.id ? "#22c55e" : "#ef4444",
              boxShadow:
                activePointId === p.id
                  ? "0 0 15px #22c55e"
                  : "0 0 10px #ef4444",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    flex: 1,
    overflow: "hidden",
    cursor: "grab",
    background: "#e5e7eb",
  },
  mapWrapper: {
    position: "relative",
    transformOrigin: "center",
    transition: "transform 0.2s ease-out",
  },
  map: {
    width: "100%",
    display: "block",
    userSelect: "none",
    pointerEvents: "none",
  },
  point: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: "50%",
    cursor: "pointer",
    animation: "pulse 1.5s infinite",
  },
};
