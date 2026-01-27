import QRCodePanel from "./QRCodePanel";
import type { Point } from "../data/points";

export default function InfoPanel({ point }: { point: Point | null }) {
  if (!point) return null; // 👈 CLAVE: si no hay punto, no se muestra nada

  return (
    <div style={styles.panel}>
      <h3>{point.name}</h3>

      <p style={styles.text}>
        Parcela demostrativa dedicada al cultivo de cacao, utilizada para
        evaluación de rendimiento y prácticas agronómicas.
      </p>

      <p style={styles.text}>
        Coordenadas relativas dentro del predio y registro audiovisual asociado.
      </p>

      {/* 🟢 QR */}
      <QRCodePanel pointId={point.id} />
    </div>
  );
}

const styles = {
  panel: {
  background: "#ffffff",
  padding: 16,
  borderRadius: 12,
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  text: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 8,
  },
};
