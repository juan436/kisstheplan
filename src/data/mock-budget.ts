import type { ExpenseCategory } from "@/types";

export const mockBudget: ExpenseCategory[] = [
  {
    id: "cat1",
    name: "Finca y Espacios",
    items: [
      { id: "e1", categoryId: "cat1", concept: "Alquiler finca", estimated: 8000, real: 8500, paid: 4000 },
      { id: "e2", categoryId: "cat1", concept: "Ceremonia exterior", estimated: 1200, real: 1200, paid: 1200 },
      { id: "e3", categoryId: "cat1", concept: "Zona cocktail", estimated: 800, real: 750, paid: 750 },
    ],
  },
  {
    id: "cat2",
    name: "Catering",
    items: [
      { id: "e4", categoryId: "cat2", concept: "Menú adultos (x250)", estimated: 22500, real: 23000, paid: 11500 },
      { id: "e5", categoryId: "cat2", concept: "Menú infantil (x20)", estimated: 1200, real: 1100, paid: 0 },
      { id: "e6", categoryId: "cat2", concept: "Barra libre", estimated: 3500, real: 3500, paid: 1750 },
      { id: "e7", categoryId: "cat2", concept: "Cocktail bienvenida", estimated: 2800, real: 3000, paid: 1500 },
    ],
  },
  {
    id: "cat3",
    name: "Fotografía y Vídeo",
    items: [
      { id: "e8", categoryId: "cat3", concept: "Fotógrafo", estimated: 2500, real: 2500, paid: 1250 },
      { id: "e9", categoryId: "cat3", concept: "Videógrafo", estimated: 2000, real: 2200, paid: 1000 },
      { id: "e10", categoryId: "cat3", concept: "Photocall", estimated: 600, real: 550, paid: 550 },
    ],
  },
  {
    id: "cat4",
    name: "Decoración y Flores",
    items: [
      { id: "e11", categoryId: "cat4", concept: "Centros de mesa", estimated: 2000, real: 1800, paid: 900 },
      { id: "e12", categoryId: "cat4", concept: "Arco ceremonial", estimated: 1500, real: 1600, paid: 800 },
      { id: "e13", categoryId: "cat4", concept: "Ramos novia", estimated: 400, real: 450, paid: 450 },
      { id: "e14", categoryId: "cat4", concept: "Iluminación", estimated: 1200, real: 1200, paid: 600 },
    ],
  },
  {
    id: "cat5",
    name: "Música y Entretenimiento",
    items: [
      { id: "e15", categoryId: "cat5", concept: "DJ", estimated: 1500, real: 1500, paid: 750 },
      { id: "e16", categoryId: "cat5", concept: "Grupo en directo", estimated: 2500, real: 2800, paid: 1400 },
    ],
  },
  {
    id: "cat6",
    name: "Vestuario y Belleza",
    items: [
      { id: "e17", categoryId: "cat6", concept: "Vestido novia", estimated: 3000, real: 3200, paid: 3200 },
      { id: "e18", categoryId: "cat6", concept: "Traje novio", estimated: 800, real: 750, paid: 750 },
      { id: "e19", categoryId: "cat6", concept: "Peluquería y maquillaje", estimated: 500, real: 500, paid: 250 },
    ],
  },
];
