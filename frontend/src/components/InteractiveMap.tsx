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

  // 🎯 Zoom con rueda (suave)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) =>
      Math.min(Math.max(prev + (e.deltaY > 0 ? -0.1 : 0.1), 1), 3)
    );
  };

  // 🖐 Drag mapa
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
      style={{
        ...styles.container,
        cursor: dragging ? "grabbing" : "grab",
      }}
    >
      {/* 🗺️ MAP WRAPPER */}
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

        {/* 📍 PUNTOS */}
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
                  ? "0 0 16px rgba(34,197,94,0.9)"
                  : "0 0 12px rgba(239,68,68,0.9)",
              transform:
                activePointId === p.id
                  ? "translate(-50%, -50%) scale(1.3)"
                  : "translate(-50%, -50%) scale(1)",
            }}
          />
        ))}
      </div>

      {/* 🔄 RESET VIEW */}
      <button
        onClick={() => {
          setScale(1);
          setPosition({ x: 0, y: 0 });
        }}
        style={styles.resetButton}
      >
        Reset vista
      </button>
    </div>
  );
}

/* 🎨 ESTILOS */
const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    overflow: "hidden",
    background: "#f3f4f6",
    position: "relative",
  },
  mapWrapper: {
    position: "relative",
    transformOrigin: "center",
    transition: "transform 0.2s ease-out",
  },
  map: {
    width: "100%",
    height: "100%",
    display: "block",
    userSelect: "none",
    pointerEvents: "none",
  },
  point: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: "3px solid white",
    cursor: "pointer",
    transition: "all 0.25s ease",
    animation: "pulse 1.5s infinite",
  },
  resetButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: "8px 14px",
    borderRadius: 10,
    border: "none",
    background: "#111827",
    color: "white",
    fontSize: 13,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
    zIndex: 20,
  },
};
