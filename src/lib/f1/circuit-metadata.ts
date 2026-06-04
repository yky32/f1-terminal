export type CircuitMetadata = {
  lengthKm: number;
  lengthDisplay: string;
  corners: number;
  circuitType: string;
  firstGrandPrix: number;
  direction: "Clockwise" | "Anti-clockwise";
  lapRecord: string;
  lapRecordDriver?: string;
  lapRecordYear?: number;
  history: string;
};

export const CIRCUIT_METADATA: Record<string, CircuitMetadata> = {
  "australian-gp": {
    lengthKm: 5.278,
    lengthDisplay: "5.278 km",
    corners: 14,
    circuitType: "Semi-permanent park circuit",
    firstGrandPrix: 1996,
    direction: "Clockwise",
    lapRecord: "1:19.813",
    history:
      "Albert Park winds through Melbourne's lakeside roads. It rewards traction out of slow chicanes and has become a season opener staple with long straights into heavy braking zones.",
  },
  "chinese-gp": {
    lengthKm: 5.451,
    lengthDisplay: "5.451 km",
    corners: 16,
    circuitType: "Permanent facility",
    firstGrandPrix: 2004,
    direction: "Clockwise",
    lapRecord: "1:32.238",
    history:
      "Shanghai International Circuit was the first Chinese F1 venue, designed with a unique spiral layout and a very long back straight that encourages slipstream battles into the tight hairpin.",
  },
  "japanese-gp": {
    lengthKm: 5.807,
    lengthDisplay: "5.807 km",
    corners: 18,
    circuitType: "Permanent road course",
    firstGrandPrix: 1987,
    direction: "Clockwise",
    lapRecord: "1:30.983",
    history:
      "Suzuka is one of F1's few figure-eight layouts. Its flowing Esses, Spoon Curve, and 130R make it a driver favourite and a true test of high-speed balance.",
  },
  "bahrain-gp": {
    lengthKm: 5.412,
    lengthDisplay: "5.412 km",
    corners: 15,
    circuitType: "Permanent desert circuit",
    firstGrandPrix: 2004,
    direction: "Clockwise",
    lapRecord: "1:31.447",
    history:
      "Built in the Sakhir desert, Bahrain mixes stop-start braking with traction zones and often runs under floodlights, stressing brakes and tyre thermal management.",
  },
  "saudi-arabian-gp": {
    lengthKm: 6.174,
    lengthDisplay: "6.174 km",
    corners: 27,
    circuitType: "Street circuit",
    firstGrandPrix: 2021,
    direction: "Anti-clockwise",
    lapRecord: "1:27.293",
    history:
      "Jeddah Corniche is one of the fastest street tracks on the calendar, with blind walls and high average speeds that punish small mistakes at night.",
  },
  "miami-gp": {
    lengthKm: 5.412,
    lengthDisplay: "5.412 km",
    corners: 19,
    circuitType: "Semi-permanent street circuit",
    firstGrandPrix: 2022,
    direction: "Anti-clockwise",
    lapRecord: "1:27.498",
    history:
      "The Miami International Autodrome loops around Hard Rock Stadium, combining tight stadium sections with a long harbour straight and heavy traction demands.",
  },
  "emilia-romagna-gp": {
    lengthKm: 4.909,
    lengthDisplay: "4.909 km",
    corners: 19,
    circuitType: "Permanent road course",
    firstGrandPrix: 1980,
    direction: "Anti-clockwise",
    lapRecord: "1:15.484",
    history:
      "Imola's Autodromo Enzo e Dino Ferrari is a narrow, old-school track where elevation changes and the Variante Alta demand precision over outright speed.",
  },
  "monaco-gp": {
    lengthKm: 3.337,
    lengthDisplay: "3.337 km",
    corners: 19,
    circuitType: "Street circuit",
    firstGrandPrix: 1950,
    direction: "Clockwise",
    lapRecord: "1:12.909",
    lapRecordDriver: "Max Verstappen",
    lapRecordYear: 2021,
    history:
      "Monaco is the slowest and most prestigious street race, threading through Monte Carlo with almost no run-off. Qualifying position and wall avoidance usually decide the weekend.",
  },
  "canadian-gp": {
    lengthKm: 4.361,
    lengthDisplay: "4.361 km",
    corners: 14,
    circuitType: "Semi-permanent park circuit",
    firstGrandPrix: 1967,
    direction: "Clockwise",
    lapRecord: "1:13.078",
    history:
      "Circuit Gilles Villeneuve on the Île Notre-Dame is a power track with long straights, heavy braking into the Wall of Champions, and frequent safety cars.",
  },
  "spanish-gp": {
    lengthKm: 4.657,
    lengthDisplay: "4.657 km",
    corners: 16,
    circuitType: "Permanent facility",
    firstGrandPrix: 1991,
    direction: "Clockwise",
    lapRecord: "1:16.330",
    history:
      "Barcelona-Catalunya is a reference circuit for car balance, with a mix of high-speed turns and traction zones that expose aerodynamic weaknesses early in the season.",
  },
  "austrian-gp": {
    lengthKm: 4.318,
    lengthDisplay: "4.318 km",
    corners: 10,
    circuitType: "Permanent hillside circuit",
    firstGrandPrix: 1964,
    direction: "Clockwise",
    lapRecord: "1:05.619",
    history:
      "The Red Bull Ring is short and sharp, climbing through the Styrian mountains with few corners but big elevation changes and aggressive DRS battles.",
  },
  "british-gp": {
    lengthKm: 5.891,
    lengthDisplay: "5.891 km",
    corners: 18,
    circuitType: "Permanent road course",
    firstGrandPrix: 1950,
    direction: "Clockwise",
    lapRecord: "1:27.097",
    history:
      "Silverstone began as an airfield circuit and remains a high-speed home of British motorsport, famous for Maggotts-Becketts-Chapel and changeable weather.",
  },
};

export function getCircuitMetadata(raceId: string) {
  return CIRCUIT_METADATA[raceId] ?? null;
}
