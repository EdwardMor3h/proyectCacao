import { points } from "../data/points";

export default function SideMenu({
  onSelectVideo,
}: {
  onSelectVideo: (video: string) => void;
}) {
  return (
    <aside style={styles.menu}>
      <h3>Cacao Project</h3>

      {points.map((p) => (
        <button
          key={p.id}
          style={styles.button}
          onClick={() => onSelectVideo(p.video)}
        >
          {p.name}
        </button>
      ))}
    </aside>
  );
}

const styles = {
  menu: {
    width: 220,
    background: "#1f2937",
    color: "#fff",
    padding: 16,
  },
  button: {
    display: "block",
    width: "100%",
    margin: "8px 0",
    padding: "8px",
    background: "#374151",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
