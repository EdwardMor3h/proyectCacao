import { QRCodeCanvas } from "qrcode.react";

export default function QRCodePanel({ pointId }: { pointId: number }) {
  const url = `${window.location.origin}/?point=${pointId}`;

  return (
    <div style={{ marginTop: 12, textAlign: "center" }}>
      <QRCodeCanvas value={url} size={160} />
      <p style={{ fontSize: 11, marginTop: 6 }}>
        Escanea para abrir esta parcela
      </p>
    </div>
  );
}
