export interface Point {
  id: number;
  name: string;
  x: number; // UTM ESTE
  y: number; // UTM NORTE
  video: string;
  area: string;
  cultivo: string;
  estado: string;
  descripcion: string;
}



export const points: Point[]= [
    {
    id: 1,
    name: "Vuelo Cacao 1",
    x: 771450,
    y: 9376150,
    video: "https://res.cloudinary.com/dzn7vyidf/video/upload/cacao01_-_Trim_-_Trim_fbwwcr.mp4",
    area: "2.3 ha",
    cultivo: "Cacao",
    estado: "Producción",
    descripcion: "Parcela con cacao fino de aroma...",
  },
  {
    id: 2,
    name: "Parcela Norte",
    x: 771520,
    y: 9376220,
    video: "https://res.cloudinary.com/dpoxd7mxx/video/upload/Vídeo_sin_título_Hecho_con_Clipchamp_nu6iqb.mp4",
    area: "1.8 ha",
    cultivo: "Cacao",
    estado: "Evaluación",
    descripcion: "Área en evaluación agronómica...",
  },
  {
    id: 3,
    name: "Zona Experimental",
    x: 771620,
    y: 9376300,
    video: "/videos/cacao02.mp4",
    area: "1.5 ha",
    cultivo: "Cacao",
    estado: "Producción",
    descripcion:
      "Área en evaluación agronómica, con potencial para exportacion a nueva sede.",
  },
];
