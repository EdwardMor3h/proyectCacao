import { MapContainer, TileLayer, WMSTileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function GeoMap() {
  return (
    <MapContainer
      center={[-12.05, -76.95]} // luego lo ajustamos
      zoom={16}
      style={{ height: "100vh", width: "100%" }}
    >
      {/* 🌍 MAPA BASE */}
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🛰️ TU ORTOFOTO DESDE GEOSERVER */}
      <WMSTileLayer
        url="http://localhost:8080/geoserver/cite/wms"
        layers="cite:vuelo_opt"
        format="image/png"
        transparent={true}
        version="1.1.0"
      />
    </MapContainer>
  );
}
