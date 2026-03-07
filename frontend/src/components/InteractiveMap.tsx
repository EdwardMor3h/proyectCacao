import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import TileWMS from "ol/source/TileWMS";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import Feature from "ol/Feature";
import PointGeom from "ol/geom/Point";
import PolygonGeom from "ol/geom/Polygon";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import "ol/ol.css";

import { points, type Point } from "../data/points";

interface Props {
  onSelect: (point: Point) => void;
  activePointId: number | null;
}

const rasterExtent: [number, number, number, number] = [
  771362.2592,
  9376031.5151,
  771717.4419,
  9376311.2042,
];

export default function InteractiveMap({ onSelect }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const drawRef = useRef<Draw | null>(null);

  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const token = localStorage.getItem("token");

    // ================================
    // SOURCE PARCELAS
    // ================================
    const parcelasSource = new VectorSource();

    const loadParcelas = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/parcelas");
        const data = await res.json();

        parcelasSource.clear();

        data.forEach((p: any) => {
          const geo = JSON.parse(p.geometry);

          const feature = new Feature({
            geometry: new PolygonGeom(geo.coordinates),
            parcelaData: p,
          });

          parcelasSource.addFeature(feature);
        });
      } catch (err) {
        console.error("Error cargando parcelas", err);
      }
    };

    // ================================
    // CAPA PARCELAS
    // ================================
    const parcelasLayer = new VectorLayer({
      source: parcelasSource,
      style: new Style({
        fill: new Fill({ color: "rgba(34,197,94,0.25)" }),
        stroke: new Stroke({ color: "#16a34a", width: 2 }),
      }),
    });

    // ================================
    // CAPA PUNTOS
    // ================================
    const pointLayer = new VectorLayer({
      source: new VectorSource({
        features: points.map(
          (p) =>
            new Feature({
              geometry: new PointGeom([p.x, p.y]),
              pointData: p,
            })
        ),
      }),
      style: new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({ color: "#ef4444" }),
          stroke: new Stroke({ color: "#fff", width: 2 }),
        }),
      }),
    });

    // ================================
    // MAPA (⭐ CORREGIDO)
    // ================================
    const map = new Map({
      target: mapRef.current,
      layers: [
        // Fondo satelital
        new TileLayer({
          source: new XYZ({
            url:
              "https://server.arcgisonline.com/ArcGIS/rest/services/" +
              "World_Imagery/MapServer/tile/{z}/{y}/{x}",
          }),
        }),

        // TU TIF (GeoServer)
        new TileLayer({
          source: new TileWMS({
            url: "http://localhost:8080/geoserver/cite/wms",
            params: {
              LAYERS: "cite:vuelo_opt",
              TILED: true,
              TRANSPARENT: true,
            },
            serverType: "geoserver",
          }),
        }),

        parcelasLayer,
        pointLayer,
      ],
      view: new View({
        projection: "EPSG:32717",
        center: [771520, 9376170], // ⭐ FIX pantalla blanca
        zoom: 18,
      }),
    });

    mapInstance.current = map;

    // ⭐ Ajustar automáticamente al raster
    map.getView().fit(rasterExtent, {
      padding: [50, 50, 50, 50],
      duration: 800,
    });

    loadParcelas();

    // ================================
    // EDITAR PARCELAS
    // ================================
    const select = new Select({
      condition: click,
      layers: [parcelasLayer],
    });

    const modify = new Modify({
      features: select.getFeatures(),
    });

    modify.on("modifyend", async (evt) => {
      if (!token) {
        alert("Debes iniciar sesión");
        return;
      }

      for (const feature of evt.features.getArray()) {
        const parcela = feature.get("parcelaData");
        if (!parcela?.id) continue;

        const geom = feature.getGeometry() as PolygonGeom;
        const coords = geom.getCoordinates()[0];

        await fetch(
          `http://localhost:3001/api/parcelas/${parcela.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ coordinates: coords }),
          }
        );
      }

      await loadParcelas();
    });

    map.addInteraction(select);
    map.addInteraction(modify);

    // ================================
    // CLICK EN PUNTOS
    // ================================
    map.on("singleclick", (evt) => {
      map.forEachFeatureAtPixel(evt.pixel, (raw) => {
        const feature = raw as Feature;
        const point = feature.get("pointData");
        if (point) onSelect(point);
      });
    });

    // ================================
    // HABILITAR DIBUJO
    // ================================
    (map as any).enableDraw = () => {
      if (!token) {
        alert("Debes iniciar sesión");
        return;
      }

      const draw = new Draw({
        source: parcelasSource,
        type: "Polygon",
      });

      draw.on("drawend", async (event) => {
        const geom = event.feature.getGeometry() as PolygonGeom;
        const coords = geom.getCoordinates()[0];

        await fetch("http://localhost:3001/api/parcelas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: "Nueva Parcela",
            cultivo: "Cacao",
            estado: "Producción",
            area: "1 ha",
            descripcion: "Creada desde mapa",
            coordinates: coords,
          }),
        });

        await loadParcelas();
      });

      map.addInteraction(draw);
      drawRef.current = draw;
    };

    return () => map.setTarget(undefined);
  }, [onSelect]);

  // ================================
  // BOTÓN AGREGAR
  // ================================
  const toggleDrawing = () => {
    if (!mapInstance.current) return;

    const map = mapInstance.current;

    if (drawing) {
      if (drawRef.current) {
        map.removeInteraction(drawRef.current);
        drawRef.current = null;
      }
      setDrawing(false);
      return;
    }

    (map as any).enableDraw();
    setDrawing(true);
  };

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      <button
        onClick={toggleDrawing}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 1000,
          padding: "10px 14px",
          borderRadius: 8,
          border: "none",
          background: drawing ? "#dc2626" : "#16a34a",
          color: "white",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {drawing ? "❌ Cancelar dibujo" : "➕ Agregar parcela"}
      </button>
    </div>
  );
}
