// Indonesia in Numbers — the figures behind the site.
// Every number below comes from a named public source; the year each
// figure refers to is stored beside it, and the Sources page lists
// the publishers in full. Figures are rounded for display; the raw
// values here are the ones the charts and tables draw from.

export const COUNTRY = {
  name: 'Indonesia',
  capital: 'Jakarta',
  currency: 'Indonesian rupiah (IDR)',
  language: 'Indonesian',
  islands: '17,000+',
  provinces: 38,
  landAreaKm2: 1904569,
  rankPopulation: 4,
};

// Headline indicators, latest available year each.
export const INDICATORS = [
  { key: 'population', label: 'Population', value: 285.7, unit: 'million', year: 2025, source: 'World Bank WDI', note: '4th most populous country in the world' },
  { key: 'gdp', label: 'GDP, nominal', value: 1445.6, unit: 'US$ billion', year: 2025, source: 'World Bank WDI', note: 'World’s 17th-largest economy' },
  { key: 'gdpCapita', label: 'GDP per person', value: 5060, unit: 'US$', year: 2025, source: 'World Bank WDI', note: 'Up from US$4,925 in 2024' },
  { key: 'growth', label: 'Real GDP growth', value: 5.1, unit: '% per year', year: 2025, source: 'IMF / World Bank', note: 'Growth has stayed near 5% since 2022' },
  { key: 'inflation', label: 'Consumer inflation', value: 1.9, unit: '% per year', year: 2025, source: 'World Bank WDI', note: 'Down from 2.3% in 2024' },
  { key: 'unemployment', label: 'Open unemployment', value: 4.8, unit: '% of labour force', year: 2025, source: 'BPS (Statistics Indonesia)', note: 'February 2025 labour-force survey' },
  { key: 'life', label: 'Life expectancy', value: 71.3, unit: 'years at birth', year: 2024, source: 'World Bank WDI', note: 'Women 73.4 years, men 69.2 years' },
  { key: 'poverty', label: 'Poverty rate', value: 8.5, unit: '% of population', year: 2025, source: 'BPS (Statistics Indonesia)', note: 'March 2025; about 24 million people' },
];

// Population, millions (World Bank WDI, SP.POP.TOTL).
export const POPULATION_SERIES = [
  { year: 2015, value: 258.2 }, { year: 2016, value: 261.0 },
  { year: 2017, value: 263.8 }, { year: 2018, value: 266.9 },
  { year: 2019, value: 270.2 }, { year: 2020, value: 274.0 },
  { year: 2021, value: 276.4 }, { year: 2022, value: 278.7 },
  { year: 2023, value: 281.2 }, { year: 2024, value: 283.5 },
  { year: 2025, value: 285.7 },
];

// Nominal GDP, US$ billion (World Bank WDI, NY.GDP.MKTP.CD).
export const GDP_SERIES = [
  { year: 2015, value: 860.9 }, { year: 2016, value: 931.9 },
  { year: 2017, value: 1015.6 }, { year: 2018, value: 1042.3 },
  { year: 2019, value: 1119.1 }, { year: 2020, value: 1059.6 },
  { year: 2021, value: 1186.1 }, { year: 2022, value: 1319.1 },
  { year: 2023, value: 1371.2 }, { year: 2024, value: 1396.3 },
  { year: 2025, value: 1445.6 },
];

// Real GDP growth, % per year (World Bank / IMF).
export const GROWTH_SERIES = [
  { year: 2015, value: 4.9 }, { year: 2016, value: 5.0 },
  { year: 2017, value: 5.1 }, { year: 2018, value: 5.2 },
  { year: 2019, value: 5.0 }, { year: 2020, value: -2.1 },
  { year: 2021, value: 3.7 }, { year: 2022, value: 5.3 },
  { year: 2023, value: 5.1 }, { year: 2024, value: 5.0 },
  { year: 2025, value: 5.1 },
];

// Consumer-price inflation, % per year (World Bank WDI, FP.CPI.TOTL.ZG).
export const INFLATION_SERIES = [
  { year: 2015, value: 6.4 }, { year: 2016, value: 3.5 },
  { year: 2017, value: 3.8 }, { year: 2018, value: 3.2 },
  { year: 2019, value: 2.8 }, { year: 2020, value: 2.0 },
  { year: 2021, value: 1.6 }, { year: 2022, value: 4.2 },
  { year: 2023, value: 3.7 }, { year: 2024, value: 2.3 },
  { year: 2025, value: 1.9 },
];

// What the economy is made of — broad split, 2024 (World Bank).
export const SECTOR_SPLIT = [
  { name: 'Services', share: 43.8, colour: '#0f766e' },
  { name: 'Industry', share: 39.3, colour: '#d97706' },
  { name: 'Agriculture, forestry & fishing', share: 12.6, colour: '#65a30d' },
  { name: 'Taxes less subsidies', share: 4.3, colour: '#94a3b8' },
];

// Five biggest industries by share of GDP, 2023 (BPS release, Feb 2024).
export const TOP_INDUSTRIES = [
  { name: 'Manufacturing', share: 18.7, growth: 4.6 },
  { name: 'Wholesale & retail trade', share: 12.9, growth: 4.9 },
  { name: 'Agriculture, forestry & fishing', share: 12.5, growth: 1.3 },
  { name: 'Mining & quarrying', share: 10.5, growth: 1.6 },
  { name: 'Construction', share: 9.9, growth: 4.9 },
];

// Where GDP is produced, 2024 (BPS).
export const ISLAND_GDP = [
  { name: 'Java', share: 57.0 },
  { name: 'Sumatra', share: 22.1 },
  { name: 'Kalimantan', share: 8.3 },
  { name: 'Sulawesi', share: 7.0 },
  { name: 'Bali & Nusa Tenggara', share: 2.9 },
  { name: 'Maluku & Papua', share: 2.7 },
];

// Largest provinces, mid-2024 population (BPS, via provincial estimates).
export const PROVINCES = [
  { name: 'West Java', island: 'Java', capital: 'Bandung', pop: 50.35, density: 1359, share: 17.8 },
  { name: 'East Java', island: 'Java', capital: 'Surabaya', pop: 41.81, density: 870, share: 14.8 },
  { name: 'Central Java', island: 'Java', capital: 'Semarang', pop: 37.89, density: 1104, share: 13.4 },
  { name: 'North Sumatra', island: 'Sumatra', capital: 'Medan', pop: 15.59, density: 215, share: 5.5 },
  { name: 'Banten', island: 'Java', capital: 'Serang', pop: 12.43, density: 1329, share: 4.4 },
  { name: 'Jakarta', island: 'Java', capital: 'Jakarta', pop: 10.68, density: 16165, share: 3.8 },
  { name: 'South Sulawesi', island: 'Sulawesi', capital: 'Makassar', pop: 9.54, density: 204, share: 3.4 },
  { name: 'Lampung', island: 'Sumatra', capital: 'Bandar Lampung', pop: 9.14, density: 265, share: 3.2 },
  { name: 'South Sumatra', island: 'Sumatra', capital: 'Palembang', pop: 8.84, density: 97, share: 3.1 },
  { name: 'Riau', island: 'Sumatra', capital: 'Pekanbaru', pop: 6.73, density: 75, share: 2.4 },
  { name: 'West Sumatra', island: 'Sumatra', capital: 'Padang', pop: 5.84, density: 139, share: 2.1 },
  { name: 'Aceh', island: 'Sumatra', capital: 'Banda Aceh', pop: 5.55, density: 98, share: 2.0 },
  { name: 'Bali', island: 'Bali & Nusa Tenggara', capital: 'Denpasar', pop: 4.34, density: 752, share: 1.5 },
  { name: 'East Kalimantan', island: 'Kalimantan', capital: 'Samarinda', pop: 3.90, density: 30, share: 1.4 },
  { name: 'Yogyakarta', island: 'Java', capital: 'Yogyakarta', pop: 3.76, density: 1186, share: 1.3 },
];

// Spending side of GDP, 2024 (BPS): household consumption dominates.
export const EXPENDITURE = [
  { name: 'Household consumption', share: 54.9 },
  { name: 'Investment (fixed capital)', share: 29.3 },
  { name: 'Exports of goods & services', share: 21.4 },
  { name: 'Government consumption', share: 6.3 },
  { name: 'Imports of goods & services', share: -19.8 },
];

export const SOURCES = [
  { short: 'World Bank WDI', full: 'World Bank, World Development Indicators — population (SP.POP.TOTL), GDP (NY.GDP.MKTP.CD), GDP per capita, CPI inflation, life expectancy. Latest values 2024–2025, retrieved November 2026.' },
  { short: 'BPS', full: 'BPS — Statistics Indonesia: economic growth releases (Q4 2023, Q1 2024), labour-force survey February 2025, poverty release March 2025, provincial population estimates mid-2024, regional GDP shares 2024.' },
  { short: 'IMF WEO', full: 'International Monetary Fund, World Economic Outlook — real GDP growth 2025 (5.1%) and GDP per capita in current US dollars.' },
  { short: 'Destatis country profile', full: 'Federal Statistical Office of Germany (Destatis), Statistical Country Profile: Indonesia, edition 05/2026 — cross-check of GDP, population and life expectancy against IMF and World Bank sources.' },
];
