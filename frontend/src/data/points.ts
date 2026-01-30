export interface Point {
  id: number;
  name: string;
  x: number;
  y: number;
  video: string;

 // 🆕 info de parcela
  area: string;
  cultivo: string;
  estado: string;
  descripcion: string;
}


export const points: Point[]= [
  {
    id: 1,
    name: "Vuelo Cacao 1",
    x: 40,
    y: 30,
    video: "https://res.cloudinary.com/dzn7vyidf/video/upload/cacao01_-_Trim_-_Trim_fbwwcr.mp4",
    area: "2.3 ha",
    cultivo: "Cacao",
    estado: "Producción",
    descripcion:
      "Parcela con cacao fino de aroma, manejo sostenible y buen rendimiento.",
  },
  {
    id: 2,
    name: "Parcela Norte",
    x: 55,
    y: 45,
    video: "/videos/cacao01.mp4",
    area: "1.8 ha",
    cultivo: "Cacao",
    estado: "Evaluación",
    descripcion:
      "Área en evaluación agronómica, con potencial para certificación orgánica.",
  },
  {
    id: 3,
    name: "Zona Experimental",
    x: 65,
    y: 60,
    video: "/videos/cacao02.mp4",
    area: "1.5 ha",
    cultivo: "Cacao",
    estado: "Producción",
    descripcion:
      "Área en evaluación agronómica, con potencial para exportacion a nueva sede.",
  },
];
