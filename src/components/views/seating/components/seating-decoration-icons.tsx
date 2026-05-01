// Inline SVG content for decoration objects on the canvas.
// Shapes live in a 32×32 coordinate space — NO outer <svg> wrapper.
// Embed with: <g transform={`translate(${-w/2},${-h/2}) scale(${w/32},${h/32})`}>

import {
  Chair, Bench, SillaTerraza, Tumbona, CamaBalinesa, Hamaca, Pouf, Taburete,
  Sillon, Otomana, MesaOval, MesaCock, MesaNovios,
} from "./seating-decoration-icons/deco-furniture";
import {
  Toldo, Carpa, CarpaHex, Pergola, Tipi, Glorieta, Parasol,
  MesaBaja, Piscina,
  Palmera, Pino, Arbusto, Lago, Parrilla, MacetaGrande,
} from "./seating-decoration-icons/deco-outdoor";
import {
  Bar, CandyBar, GiftTable, CoatCheck, Bathroom, Entrance, Mostrador, Carrito, Nevera,
  MesaBuffet, FuenteChocolate, MesaVienesa, MesaQuesos, BarraMovil,
  Speaker, Screen, Outlet,
} from "./seating-decoration-icons/deco-service";
import {
  Arch, Runner, Flowers, Tree, Sofa, Candelabra, Carpet, Fuente, Brasero, Jardinera, Columna, Seto, Farola,
  DanceFloor, Stage, DjBooth, Photocall, Piano,
  Kuppah, Atril, MesaFirma, AltarCeremonia, VelasAltar,
  ArcoGlobos, UrnaRegalos, SeatingChart, ZonaKids, AreaLounge, Biombo,
  EspejoGrande, CabinaFoto, Proyector, Tarima, Generador, Inflable, Fogon,
} from "./seating-decoration-icons/deco-ceremony";

const ICON_MAP: Record<string, React.FC> = {
  chair: Chair, bench: Bench, silla_terraza: SillaTerraza,
  tumbona: Tumbona, cama_balinesa: CamaBalinesa, hamaca: Hamaca,
  pouf: Pouf, taburete: Taburete,
  toldo: Toldo, carpa: Carpa, carpa_hex: CarpaHex,
  pergola: Pergola, tipi: Tipi, glorieta: Glorieta, parasol: Parasol,
  bar: Bar, candybar: CandyBar, gifttable: GiftTable, coatcheck: CoatCheck,
  bathroom: Bathroom, entrance: Entrance, mostrador: Mostrador,
  carrito: Carrito, nevera: Nevera,
  mesa_baja: MesaBaja, piscina: Piscina,
  arch: Arch, runner: Runner, flowers: Flowers, tree: Tree,
  sofa: Sofa, candelabra: Candelabra, carpet: Carpet,
  fuente: Fuente, brasero: Brasero, jardinera: Jardinera,
  columna: Columna, seto: Seto, farola: Farola,
  dancefloor: DanceFloor, stage: Stage, djbooth: DjBooth,
  photocall: Photocall, piano: Piano,
  speaker: Speaker, screen: Screen, outlet: Outlet,
  kuppah: Kuppah, atril: Atril, mesa_firma: MesaFirma,
  altar_ceremonia: AltarCeremonia, velas_altar: VelasAltar,
  mesa_buffet: MesaBuffet, fuente_chocolate: FuenteChocolate,
  mesa_vienesa: MesaVienesa, mesa_quesos: MesaQuesos, barra_movil: BarraMovil,
  sillon: Sillon, otomana: Otomana, mesa_oval: MesaOval,
  mesa_cock: MesaCock, mesa_novios: MesaNovios,
  palmera: Palmera, pino: Pino, arbusto: Arbusto,
  lago: Lago, parrilla: Parrilla, maceta_grande: MacetaGrande,
  arco_globos: ArcoGlobos, urna_regalos: UrnaRegalos,
  seating_chart: SeatingChart, zona_kids: ZonaKids,
  area_lounge: AreaLounge, biombo: Biombo,
  espejo_grande: EspejoGrande, cabina_foto: CabinaFoto,
  proyector: Proyector, tarima: Tarima,
  generador: Generador, inflable: Inflable, fogon: Fogon,
};

export function hasDecoIcon(objectType?: string): boolean {
  return !!objectType && objectType in ICON_MAP;
}

/** SVG shapes in 32×32 space — embed inside a scaled <g>. */
export function DecoIconContent({ objectType }: { objectType: string }) {
  const Icon = ICON_MAP[objectType];
  return Icon ? <Icon /> : null;
}

/** Standalone SVG preview — use in panels and modals. */
export function DecoIconPreview({ objectType, size = 28 }: { objectType: string; size?: number }) {
  const Icon = ICON_MAP[objectType];
  if (!Icon) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: "block" }}>
      <Icon />
    </svg>
  );
}
