export interface Timezone {
  value: string;
  label: string;
}

export const TIMEZONES: Timezone[] = [
  // España y Europa Occidental
  { value: "Europe/Madrid", label: "Madrid / Barcelona (España)" },
  { value: "Atlantic/Canary", label: "Islas Canarias (España)" },
  { value: "Europe/Lisbon", label: "Lisboa (Portugal)" },
  { value: "Europe/London", label: "Londres (Reino Unido)" },
  { value: "Europe/Paris", label: "París (Francia)" },
  { value: "Europe/Berlin", label: "Berlín (Alemania)" },
  { value: "Europe/Rome", label: "Roma (Italia)" },
  { value: "Europe/Amsterdam", label: "Ámsterdam (Países Bajos)" },
  { value: "Europe/Brussels", label: "Bruselas (Bélgica)" },
  { value: "Europe/Vienna", label: "Viena (Austria)" },
  { value: "Europe/Zurich", label: "Zúrich (Suiza)" },
  { value: "Europe/Stockholm", label: "Estocolmo (Suecia)" },
  { value: "Europe/Oslo", label: "Oslo (Noruega)" },
  { value: "Europe/Copenhagen", label: "Copenhague (Dinamarca)" },
  { value: "Europe/Helsinki", label: "Helsinki (Finlandia)" },
  // Europa del Este
  { value: "Europe/Warsaw", label: "Varsovia (Polonia)" },
  { value: "Europe/Prague", label: "Praga (Rep. Checa)" },
  { value: "Europe/Budapest", label: "Budapest (Hungría)" },
  { value: "Europe/Bucharest", label: "Bucarest (Rumanía)" },
  { value: "Europe/Athens", label: "Atenas (Grecia)" },
  { value: "Europe/Moscow", label: "Moscú (Rusia)" },
  // Oriente Medio
  { value: "Asia/Istanbul", label: "Estambul (Turquía)" },
  { value: "Asia/Jerusalem", label: "Jerusalén (Israel)" },
  { value: "Asia/Riyadh", label: "Riad (Arabia Saudí)" },
  { value: "Asia/Dubai", label: "Dubái (EAU)" },
  // África
  { value: "Africa/Casablanca", label: "Casablanca (Marruecos)" },
  { value: "Africa/Cairo", label: "El Cairo (Egipto)" },
  { value: "Africa/Lagos", label: "Lagos (Nigeria)" },
  { value: "Africa/Nairobi", label: "Nairobi (Kenia)" },
  { value: "Africa/Johannesburg", label: "Johannesburgo (Sudáfrica)" },
  // Asia
  { value: "Asia/Kolkata", label: "Mumbai / Delhi (India)" },
  { value: "Asia/Dhaka", label: "Daca (Bangladés)" },
  { value: "Asia/Bangkok", label: "Bangkok (Tailandia)" },
  { value: "Asia/Singapore", label: "Singapur" },
  { value: "Asia/Shanghai", label: "Shanghái / Pekín (China)" },
  { value: "Asia/Tokyo", label: "Tokio (Japón)" },
  { value: "Asia/Seoul", label: "Seúl (Corea del Sur)" },
  { value: "Asia/Manila", label: "Manila (Filipinas)" },
  { value: "Asia/Jakarta", label: "Yakarta (Indonesia)" },
  // Oceanía
  { value: "Australia/Sydney", label: "Sídney (Australia Este)" },
  { value: "Australia/Melbourne", label: "Melbourne (Australia)" },
  { value: "Australia/Perth", label: "Perth (Australia Oeste)" },
  { value: "Pacific/Auckland", label: "Auckland (Nueva Zelanda)" },
  // América del Norte
  { value: "America/New_York", label: "Nueva York (EE.UU. Este)" },
  { value: "America/Chicago", label: "Chicago (EE.UU. Centro)" },
  { value: "America/Denver", label: "Denver (EE.UU. Montaña)" },
  { value: "America/Los_Angeles", label: "Los Ángeles (EE.UU. Oeste)" },
  { value: "America/Toronto", label: "Toronto (Canadá)" },
  { value: "America/Vancouver", label: "Vancouver (Canadá)" },
  { value: "America/Anchorage", label: "Anchorage (Alaska)" },
  { value: "Pacific/Honolulu", label: "Honolulú (Hawái)" },
  // México y Centroamérica
  { value: "America/Mexico_City", label: "Ciudad de México" },
  { value: "America/Monterrey", label: "Monterrey (México)" },
  { value: "America/Cancun", label: "Cancún (México)" },
  { value: "America/Guatemala", label: "Guatemala" },
  { value: "America/Costa_Rica", label: "San José (Costa Rica)" },
  // Caribe
  { value: "America/Havana", label: "La Habana (Cuba)" },
  { value: "America/Santo_Domingo", label: "Santo Domingo (R. Dominicana)" },
  { value: "America/Puerto_Rico", label: "San Juan (Puerto Rico)" },
  // América del Sur
  { value: "America/Bogota", label: "Bogotá (Colombia)" },
  { value: "America/Guayaquil", label: "Quito / Guayaquil (Ecuador)" },
  { value: "America/Lima", label: "Lima (Perú)" },
  { value: "America/La_Paz", label: "La Paz (Bolivia)" },
  { value: "America/Caracas", label: "Caracas (Venezuela)" },
  { value: "America/Asuncion", label: "Asunción (Paraguay)" },
  { value: "America/Santiago", label: "Santiago (Chile)" },
  { value: "America/Montevideo", label: "Montevideo (Uruguay)" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires (Argentina)" },
  { value: "America/Sao_Paulo", label: "São Paulo (Brasil)" },
];
