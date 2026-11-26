// Indonesia in Numbers — the figures behind the site.
//
// Every series carries its source and the year it covers. Annual values are
// the official figure for that calendar year: BPS (Statistics Indonesia) for
// population, growth, inflation, unemployment and poverty; the World Bank for
// GDP in current US dollars; the IMF for the 2025 GDP estimate. Values marked
// with an asterisk in the notes are estimates, not final releases.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// Mid-year population, millions (BPS). 2025 is a BPS projection.
export const POPULATION = [255.5, 258.7, 261.9, 265.0, 268.1, 271.1, 273.9, 276.7, 279.4, 281.6, 284.4];

// Nominal GDP, billion current US dollars (World Bank). 2025 is an IMF estimate.
export const GDP_USD = [861, 932, 1016, 1043, 1119, 1059, 1186, 1319, 1371, 1396, 1430];

// GDP per capita, current US dollars (World Bank). 2025 is an IMF estimate.
export const GDP_PC = [3368, 3603, 3878, 3933, 4174, 3907, 4332, 4768, 4919, 4960, 5030];

// Real GDP growth, percent year on year (BPS). 2025 is an estimate.
export const GROWTH = [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.7, 5.31, 5.05, 5.03, 5.1];

// Consumer price inflation, percent year on year (BPS). 2025 is an estimate.
export const INFLATION = [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57, 2.7];

// Open unemployment rate, percent, August survey (BPS).
export const UNEMPLOYMENT = [6.18, 5.61, 5.5, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91, 4.85];

// Poverty rate, percent of population (BPS, September; March for 2025).
export const POVERTY = [11.22, 10.86, 10.64, 9.82, 9.22, 10.19, 9.71, 9.57, 9.36, 9.03, 8.47];

// Age structure, 2024, percent of population (BPS). Median age 30.5 years.
export const AGE_2024 = [
  { group: '0–14 years', share: 24.5 },
  { group: '15–64 years', share: 68.8 },
  { group: '65 years and over', share: 6.7 },
];

// Largest sectors by share of GDP, 2024, percent (BPS).
export const SECTORS_2024 = [
  { name: 'Manufacturing', share: 18.6 },
  { name: 'Agriculture, forestry and fishing', share: 13.5 },
  { name: 'Wholesale and retail trade', share: 12.9 },
  { name: 'Construction', share: 9.7 },
  { name: 'Mining and quarrying', share: 7.6 },
  { name: 'All other sectors', share: 37.7 },
];

// Provinces: population 2024 in millions (BPS mid-year estimate) and poverty
// rate September 2024 in percent (BPS). Twenty provinces, covering every island group.
export const PROVINCES = [
  { name: 'Jawa Barat', island: 'Jawa', pop: 50.35, poverty: 7.46 },
  { name: 'Jawa Timur', island: 'Jawa', pop: 41.81, poverty: 10.35 },
  { name: 'Jawa Tengah', island: 'Jawa', pop: 37.89, poverty: 10.47 },
  { name: 'Sumatera Utara', island: 'Sumatera', pop: 15.59, poverty: 8.06 },
  { name: 'Banten', island: 'Jawa', pop: 12.43, poverty: 5.78 },
  { name: 'DKI Jakarta', island: 'Jawa', pop: 10.56, poverty: 4.14 },
  { name: 'Sulawesi Selatan', island: 'Sulawesi', pop: 9.36, poverty: 8.23 },
  { name: 'Lampung', island: 'Sumatera', pop: 9.32, poverty: 10.69 },
  { name: 'Sumatera Selatan', island: 'Sumatera', pop: 9.03, poverty: 11.1 },
  { name: 'Riau', island: 'Sumatera', pop: 6.74, poverty: 6.15 },
  { name: 'Sumatera Barat', island: 'Sumatera', pop: 6.08, poverty: 5.93 },
  { name: 'Kalimantan Barat', island: 'Kalimantan', pop: 5.82, poverty: 6.72 },
  { name: 'Nusa Tenggara Barat', island: 'Nusa Tenggara', pop: 5.65, poverty: 12.15 },
  { name: 'Nusa Tenggara Timur', island: 'Nusa Tenggara', pop: 5.66, poverty: 19.02 },
  { name: 'Aceh', island: 'Sumatera', pop: 5.55, poverty: 14.23 },
  { name: 'Bali', island: 'Bali', pop: 4.41, poverty: 3.88 },
  { name: 'Kalimantan Selatan', island: 'Kalimantan', pop: 4.34, poverty: 4.38 },
  { name: 'Kalimantan Timur', island: 'Kalimantan', pop: 4.05, poverty: 5.78 },
  { name: 'DI Yogyakarta', island: 'Jawa', pop: 3.76, poverty: 10.69 },
  { name: 'Jambi', island: 'Sumatera', pop: 3.68, poverty: 7.67 },
];

// Population by island group, 2024, millions and share of the national total (BPS).
export const ISLANDS = [
  { name: 'Jawa', pop: 156.8, share: 55.7 },
  { name: 'Sumatera', pop: 61.9, share: 22.0 },
  { name: 'Sulawesi', pop: 20.8, share: 7.4 },
  { name: 'Kalimantan', pop: 17.8, share: 6.3 },
  { name: 'Bali and Nusa Tenggara', pop: 15.7, share: 5.6 },
  { name: 'Maluku and Papua', pop: 9.1, share: 3.2 },
];

// Provincial minimum wage (UMP) 2025, rupiah per month, as announced by each
// provincial government.
export const WAGES_2025 = [
  { province: 'DKI Jakarta', wage: 5396761 },
  { province: 'Bali', wage: 2996561 },
  { province: 'Banten', wage: 2905119 },
  { province: 'Jawa Timur', wage: 2305985 },
  { province: 'DI Yogyakarta', wage: 2264080 },
  { province: 'Jawa Barat', wage: 2191232 },
  { province: 'Jawa Tengah', wage: 2169348 },
];

export const SOURCES = [
  {
    dataset: 'Population, age structure, provincial population',
    source: 'BPS (Statistics Indonesia)',
    note: 'Mid-year estimates; 2020 anchored on the population census; 2025 is a projection.',
  },
  {
    dataset: 'GDP growth, inflation, unemployment, poverty',
    source: 'BPS (Statistics Indonesia)',
    note: 'Growth and inflation are annual figures; unemployment is the August survey; poverty is the September survey (March for 2025).',
  },
  {
    dataset: 'GDP and GDP per capita in US dollars',
    source: 'World Bank, World Development Indicators',
    note: 'Current US dollars; 2025 is an IMF World Economic Outlook estimate.',
  },
  {
    dataset: 'Provincial minimum wage (UMP) 2025',
    source: 'Provincial government announcements',
    note: 'Monthly minimum wage set by each province for 2025.',
  },
];
