export interface Parcela {
  id: number;
  nombre: string;
  coordinates: [number, number][];
}

export const parcelas: Parcela[] = [
  {
    id: 1,
    nombre: "Parcela Demo",
    coordinates: [
      [771400, 9376100],
      [771600, 9376100],
      [771600, 9376250],
      [771400, 9376250],
      [771400, 9376100], // cerrar polígono
    ],
  },
];
