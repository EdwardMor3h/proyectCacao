import { points } from "../data/points";

export default function SideMenu({
  onSelectVideo,
}: {
  onSelectVideo: (video: string, pointId: number) => void;
}) {
  return (
    <aside style={styles.menu}>
      <h3 style={styles.title}>Cacao Project</h3>

      {points.map((p) => (
        <button
          key={p.id}
          style={styles.button}
          onClick={() => onSelectVideo(p.video, p.id)}
        >
          {p.name}
        </button>
      ))}
    </aside>
  );
}

const styles = {
  menu: {
    width: 240,
    background: "#111827",
    color: "#fff",
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  button: {
    display: "block",
    width: "100%",
    marginBottom: 10,
    padding: "10px 12px",
    background: "#1f2937",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    textAlign: "left" as const,
  },
};
