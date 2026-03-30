/**
 * Guide Data - City Database, University Rankings, and Helper Functions
 */

// =============================================================================
// CITY DATABASE
// =============================================================================

export interface CityData {
  id: string
  name: string
  country: string
  lat: number
  lng: number
  population: number
  bucket: 'small' | 'med' | 'large'
}

// Complete city database
export const CITY_DATABASE: CityData[] = [
  // Slovakia
  {
    id: 'bratislava',
    name: 'Bratislava',
    country: 'Slovakia',
    lat: 48.1486,
    lng: 17.1077,
    population: 500000,
    bucket: 'med',
  },
  {
    id: 'kosice',
    name: 'Košice',
    country: 'Slovakia',
    lat: 48.7164,
    lng: 21.2611,
    population: 240000,
    bucket: 'med',
  },
  {
    id: 'nitra',
    name: 'Nitra',
    country: 'Slovakia',
    lat: 48.3063,
    lng: 18.0865,
    population: 78000,
    bucket: 'small',
  },
  {
    id: 'zilina',
    name: 'Žilina',
    country: 'Slovakia',
    lat: 49.2238,
    lng: 18.7394,
    population: 81000,
    bucket: 'small',
  },
  {
    id: 'banska-bystrica',
    name: 'Banská Bystrica',
    country: 'Slovakia',
    lat: 48.7345,
    lng: 19.1525,
    population: 78000,
    bucket: 'small',
  },
  {
    id: 'presov',
    name: 'Prešov',
    country: 'Slovakia',
    lat: 48.9994,
    lng: 21.2391,
    population: 88000,
    bucket: 'small',
  },
  {
    id: 'trnava',
    name: 'Trnava',
    country: 'Slovakia',
    lat: 48.3774,
    lng: 17.5912,
    population: 66000,
    bucket: 'small',
  },

  // Czech Republic
  {
    id: 'prague',
    name: 'Prague',
    country: 'Czech Republic',
    lat: 50.0755,
    lng: 14.4378,
    population: 1300000,
    bucket: 'large',
  },
  {
    id: 'brno',
    name: 'Brno',
    country: 'Czech Republic',
    lat: 49.1951,
    lng: 16.6068,
    population: 380000,
    bucket: 'med',
  },
  {
    id: 'ostrava',
    name: 'Ostrava',
    country: 'Czech Republic',
    lat: 49.8209,
    lng: 18.2625,
    population: 280000,
    bucket: 'med',
  },
  {
    id: 'plzen',
    name: 'Plzeň',
    country: 'Czech Republic',
    lat: 49.7384,
    lng: 13.3736,
    population: 175000,
    bucket: 'med',
  },
  {
    id: 'olomouc',
    name: 'Olomouc',
    country: 'Czech Republic',
    lat: 49.5939,
    lng: 17.2508,
    population: 100000,
    bucket: 'med',
  },
  {
    id: 'zlin',
    name: 'Zlín',
    country: 'Czech Republic',
    lat: 49.2268,
    lng: 17.6709,
    population: 75000,
    bucket: 'small',
  },

  // Austria
  {
    id: 'vienna',
    name: 'Vienna',
    country: 'Austria',
    lat: 48.2082,
    lng: 16.3738,
    population: 1900000,
    bucket: 'large',
  },
  {
    id: 'graz',
    name: 'Graz',
    country: 'Austria',
    lat: 47.0707,
    lng: 15.4395,
    population: 290000,
    bucket: 'med',
  },
  {
    id: 'linz',
    name: 'Linz',
    country: 'Austria',
    lat: 48.3069,
    lng: 14.2858,
    population: 210000,
    bucket: 'med',
  },
  {
    id: 'innsbruck',
    name: 'Innsbruck',
    country: 'Austria',
    lat: 47.2692,
    lng: 11.4041,
    population: 130000,
    bucket: 'med',
  },
  {
    id: 'salzburg',
    name: 'Salzburg',
    country: 'Austria',
    lat: 47.8095,
    lng: 13.0550,
    population: 160000,
    bucket: 'med',
  },

  // Poland
  {
    id: 'warsaw',
    name: 'Warsaw',
    country: 'Poland',
    lat: 52.2297,
    lng: 21.0122,
    population: 1800000,
    bucket: 'large',
  },
  {
    id: 'krakow',
    name: 'Kraków',
    country: 'Poland',
    lat: 50.0647,
    lng: 19.9450,
    population: 770000,
    bucket: 'med',
  },
  {
    id: 'wroclaw',
    name: 'Wrocław',
    country: 'Poland',
    lat: 51.1079,
    lng: 17.0385,
    population: 640000,
    bucket: 'med',
  },
  {
    id: 'poznan',
    name: 'Poznań',
    country: 'Poland',
    lat: 52.4064,
    lng: 16.9252,
    population: 540000,
    bucket: 'med',
  },
  {
    id: 'gdansk',
    name: 'Gdańsk',
    country: 'Poland',
    lat: 54.3520,
    lng: 18.6466,
    population: 470000,
    bucket: 'med',
  },
  {
    id: 'lublin',
    name: 'Lublin',
    country: 'Poland',
    lat: 51.2465,
    lng: 22.5684,
    population: 340000,
    bucket: 'med',
  },
  {
    id: 'bialystok',
    name: 'Białystok',
    country: 'Poland',
    lat: 53.1333,
    lng: 23.1683,
    population: 300000,
    bucket: 'med',
  },

  // Hungary
  {
    id: 'budapest',
    name: 'Budapest',
    country: 'Hungary',
    lat: 47.4979,
    lng: 19.0402,
    population: 1700000,
    bucket: 'large',
  },
  {
    id: 'debrecen',
    name: 'Debrecen',
    country: 'Hungary',
    lat: 47.5316,
    lng: 21.6273,
    population: 200000,
    bucket: 'med',
  },
  {
    id: 'szeged',
    name: 'Szeged',
    country: 'Hungary',
    lat: 46.2500,
    lng: 20.1567,
    population: 160000,
    bucket: 'med',
  },
  {
    id: 'pecs',
    name: 'Pécs',
    country: 'Hungary',
    lat: 46.0707,
    lng: 18.2331,
    population: 140000,
    bucket: 'med',
  },
  {
    id: 'miskolc',
    name: 'Miskolc',
    country: 'Hungary',
    lat: 48.1035,
    lng: 20.7784,
    population: 150000,
    bucket: 'med',
  },
  {
    id: 'gyor',
    name: 'Győr',
    country: 'Hungary',
    lat: 47.6875,
    lng: 17.6504,
    population: 130000,
    bucket: 'med',
  },

  // Germany
  {
    id: 'munich',
    name: 'Munich',
    country: 'Germany',
    lat: 48.1351,
    lng: 11.5820,
    population: 1500000,
    bucket: 'large',
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    lat: 52.5200,
    lng: 13.4050,
    population: 3600000,
    bucket: 'large',
  },
  {
    id: 'hamburg',
    name: 'Hamburg',
    country: 'Germany',
    lat: 53.5511,
    lng: 9.9937,
    population: 1900000,
    bucket: 'large',
  },
  {
    id: 'frankfurt',
    name: 'Frankfurt',
    country: 'Germany',
    lat: 50.1109,
    lng: 8.6821,
    population: 750000,
    bucket: 'med',
  },
  {
    id: 'cologne',
    name: 'Cologne',
    country: 'Germany',
    lat: 50.9375,
    lng: 6.9603,
    population: 1100000,
    bucket: 'large',
  },
  {
    id: 'stuttgart',
    name: 'Stuttgart',
    country: 'Germany',
    lat: 48.7758,
    lng: 9.1829,
    population: 630000,
    bucket: 'med',
  },
  {
    id: 'karlsruhe',
    name: 'Karlsruhe',
    country: 'Germany',
    lat: 49.0069,
    lng: 8.4037,
    population: 320000,
    bucket: 'med',
  },
  {
    id: 'aachen',
    name: 'Aachen',
    country: 'Germany',
    lat: 50.7753,
    lng: 6.0839,
    population: 250000,
    bucket: 'med',
  },
  {
    id: 'heidelberg',
    name: 'Heidelberg',
    country: 'Germany',
    lat: 49.3988,
    lng: 8.6724,
    population: 160000,
    bucket: 'med',
  },

  // Netherlands
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    lat: 52.3676,
    lng: 4.9041,
    population: 870000,
    bucket: 'large',
  },
  {
    id: 'rotterdam',
    name: 'Rotterdam',
    country: 'Netherlands',
    lat: 51.9244,
    lng: 4.4777,
    population: 650000,
    bucket: 'med',
  },
  {
    id: 'utrecht',
    name: 'Utrecht',
    country: 'Netherlands',
    lat: 52.0907,
    lng: 5.1214,
    population: 360000,
    bucket: 'med',
  },
  {
    id: 'delft',
    name: 'Delft',
    country: 'Netherlands',
    lat: 52.0116,
    lng: 4.3571,
    population: 100000,
    bucket: 'med',
  },
  {
    id: 'eindhoven',
    name: 'Eindhoven',
    country: 'Netherlands',
    lat: 51.4416,
    lng: 5.4697,
    population: 230000,
    bucket: 'med',
  },
  {
    id: 'groningen',
    name: 'Groningen',
    country: 'Netherlands',
    lat: 53.2194,
    lng: 6.5665,
    population: 200000,
    bucket: 'med',
  },
  {
    id: 'enschede',
    name: 'Enschede',
    country: 'Netherlands',
    lat: 52.2215,
    lng: 6.8897,
    population: 160000,
    bucket: 'med',
  },
  {
    id: 'nijmegen',
    name: 'Nijmegen',
    country: 'Netherlands',
    lat: 51.8126,
    lng: 5.8372,
    population: 290000,
    bucket: 'med',
  },
]

// =============================================================================
// UNIVERSITY RANKINGS
// =============================================================================

export interface UniversityRanking {
  ranking: number | null // QS world ranking or null if unranked
  tier: 'top50' | 'top100' | 'top200' | 'top500' | 'unranked'
}

// University rankings database (QS World University Rankings 2026 approximation)
export const UNIVERSITY_RANKINGS: Record<string, UniversityRanking> = {
  // Germany - Top tier
  'tum': { ranking: 37, tier: 'top50' },
  'lmu': { ranking: 59, tier: 'top100' },
  'heidelberg': { ranking: 86, tier: 'top100' },
  'rwth': { ranking: 99, tier: 'top100' },
  'fub': { ranking: 118, tier: 'top200' },
  'hub': { ranking: 123, tier: 'top200' },
  'tu-berlin': { ranking: 148, tier: 'top200' },
  'kit': { ranking: 163, tier: 'top200' },

  // Netherlands - Top tier
  'uva': { ranking: 40, tier: 'top50' },
  'tudelft': { ranking: 47, tier: 'top50' },
  'leiden': { ranking: 70, tier: 'top100' },
  'rug': { ranking: 83, tier: 'top100' },
  'tue': { ranking: 109, tier: 'top200' },
  'utwente': { ranking: 200, tier: 'top200' },

  // Austria
  'univie': { ranking: 140, tier: 'top200' },
  'wu-wien': { ranking: 200, tier: 'top200' },
  'mu-wien': { ranking: 150, tier: 'top200' },
  'tuw': { ranking: 184, tier: 'top200' },
  'uibk': { ranking: 285, tier: 'top500' },
  'tu-graz': { ranking: 274, tier: 'top500' },
  'sbg': { ranking: 350, tier: 'unranked' },
  'jku': { ranking: 350, tier: 'unranked' },

  // Czech Republic
  'cuni': { ranking: 266, tier: 'top500' },
  'cvut': { ranking: 400, tier: 'top500' },
  'muni': { ranking: 500, tier: 'top500' },
  'vut-brno': { ranking: 700, tier: 'unranked' },

  // Poland
  'uw': { ranking: 262, tier: 'top500' },
  'uj': { ranking: 326, tier: 'top500' },
  'agh': { ranking: 336, tier: 'top500' },
  'pw': { ranking: 450, tier: 'unranked' },
  'ug': { ranking: 600, tier: 'unranked' },

  // Hungary
  'elte': { ranking: 580, tier: 'unranked' },
  'bme': { ranking: 650, tier: 'unranked' },
  'semmelweis': { ranking: 600, tier: 'unranked' },

  // Slovakia
  'stuba': { ranking: 800, tier: 'unranked' },
  'uniba': { ranking: 750, tier: 'unranked' },
  'ukf': { ranking: null, tier: 'unranked' },
  'tuke': { ranking: null, tier: 'unranked' },
  'upjs': { ranking: null, tier: 'unranked' },
  'tu-zvolen': { ranking: null, tier: 'unranked' },
  'uvm': { ranking: null, tier: 'unranked' },
  'akademia': { ranking: null, tier: 'unranked' },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get city data by city ID
 */
export function getCityData(cityId: string): CityData | null {
  return CITY_DATABASE.find((city) => city.id === cityId) || null
}

/**
 * Get city size bucket by city ID
 */
export function getCityBucket(cityId: string): 'small' | 'med' | 'large' | null {
  const city = getCityData(cityId)
  return city ? city.bucket : null
}

/**
 * Get university tier by university ID
 */
export function getUniversityTier(uniId: string): UniversityRanking['tier'] {
  const ranking = UNIVERSITY_RANKINGS[uniId]
  return ranking ? ranking.tier : 'unranked'
}

/**
 * Get university ranking score (0-100) based on tier
 * Converts tier to a normalized score for calculation purposes
 */
export function getUniversityRankingScore(uniId: string): number {
  const ranking = UNIVERSITY_RANKINGS[uniId]
  if (!ranking) return 0

  switch (ranking.tier) {
    case 'top50':
      return 100
    case 'top100':
      return 85
    case 'top200':
      return 70
    case 'top500':
      return 50
    case 'unranked':
      return 25
    default:
      return 0
  }
}