const COUNTRY_FLAGS: Record<string, string> = {
  Australia: "🇦🇺",
  China: "🇨🇳",
  Japan: "🇯🇵",
  Bahrain: "🇧🇭",
  "Saudi Arabia": "🇸🇦",
  USA: "🇺🇸",
  Italy: "🇮🇹",
  Monaco: "🇲🇨",
  Canada: "🇨🇦",
  Spain: "🇪🇸",
  Austria: "🇦🇹",
  "Great Britain": "🇬🇧",
};

const COUNTRY_ISO: Record<string, string> = {
  Australia: "au",
  China: "cn",
  Japan: "jp",
  Bahrain: "bh",
  "Saudi Arabia": "sa",
  USA: "us",
  Italy: "it",
  Monaco: "mc",
  Canada: "ca",
  Spain: "es",
  Austria: "at",
  "Great Britain": "gb",
};

/** Single accent used for calendar stripes and hero fallbacks. */
const COUNTRY_ACCENT: Record<string, string> = {
  Australia: "#012169",
  China: "#DE2910",
  Japan: "#BC002D",
  Bahrain: "#CE1126",
  "Saudi Arabia": "#006C35",
  USA: "#3C3B6E",
  Italy: "#009246",
  Monaco: "#CE1126",
  Canada: "#D80621",
  Spain: "#AA151B",
  Austria: "#ED2939",
  "Great Britain": "#012169",
};

export function countryFlag(country: string) {
  return COUNTRY_FLAGS[country] ?? "🏁";
}

export function countryAccentColor(country: string) {
  return COUNTRY_ACCENT[country] ?? "#64748B";
}

export function countryFlagImageUrl(country: string) {
  const code = COUNTRY_ISO[country];
  if (!code) return null;
  return `https://flagcdn.com/w160/${code}.png`;
}

export function countryIsoCode(country: string) {
  const iso = COUNTRY_ISO[country];
  return iso ? iso.toUpperCase() : null;
}
