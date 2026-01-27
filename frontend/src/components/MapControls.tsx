
interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onReset,
}: Props) {
  return (
    <div style={styles.container}>
      <button style={styles.btn} onClick={onZoomIn}>＋</button>
      <button style={styles.btn} onClick={onZoomOut}>－</button>
      <button style={styles.btn} onClick={onReset}>⟳</button>
    </div>
  );
}

const styles = {
  container: {
    position: "absolute" as const,
    right: 20,
    top: 20,
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
    zIndex: 40,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: "none",
    background: "#ffffff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    fontSize: 18,
    cursor: "pointer",
  },
};
