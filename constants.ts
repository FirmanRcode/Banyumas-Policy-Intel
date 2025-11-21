import { DistrictData } from './types';

// Banyumas Center Coordinates
export const MAP_CENTER: [number, number] = [-7.45, 109.16];
export const MAP_ZOOM = 11;

// Simplified Dataset based on the user's original provided CSV data + Approximate Geo Coordinates
export const DATASET: DistrictData[] = [
  {
    id: 'gumelar',
    name: 'Gumelar',
    lat: -7.36,
    lng: 109.02,
    population: 52000,
    povertyRate: 16.5,
    healthFacilities: 5,
    schools: 48,
    umkm: 2572,
    roadQuality: 30.8,
    historicalPoverty: [{year: 2019, rate: 17.2}, {year: 2020, rate: 17.5}, {year: 2021, rate: 16.8}, {year: 2022, rate: 16.5}, {year: 2023, rate: 16.1}]
  },
  {
    id: 'lumbir',
    name: 'Lumbir',
    lat: -7.48,
    lng: 108.98,
    population: 48000,
    povertyRate: 15.1,
    healthFacilities: 3,
    schools: 49,
    umkm: 2685,
    roadQuality: 23.6,
    historicalPoverty: [{year: 2019, rate: 16.0}, {year: 2020, rate: 16.2}, {year: 2021, rate: 15.5}, {year: 2022, rate: 15.1}, {year: 2023, rate: 14.9}]
  },
  {
    id: 'wangon',
    name: 'Wangon',
    lat: -7.52,
    lng: 109.05,
    population: 82000,
    povertyRate: 12.9,
    healthFacilities: 18,
    schools: 71,
    umkm: 3553,
    roadQuality: 19.5,
    historicalPoverty: [{year: 2019, rate: 13.5}, {year: 2020, rate: 13.8}, {year: 2021, rate: 13.2}, {year: 2022, rate: 12.9}, {year: 2023, rate: 12.5}]
  },
  {
    id: 'ajibarang',
    name: 'Ajibarang',
    lat: -7.41,
    lng: 109.07,
    population: 98000,
    povertyRate: 11.9,
    healthFacilities: 15,
    schools: 53,
    umkm: 5521,
    roadQuality: 26.6,
    historicalPoverty: [{year: 2019, rate: 12.5}, {year: 2020, rate: 12.8}, {year: 2021, rate: 12.2}, {year: 2022, rate: 11.9}, {year: 2023, rate: 11.5}]
  },
  {
    id: 'purwokerto_timur',
    name: 'Purwokerto Timur',
    lat: -7.42,
    lng: 109.24,
    population: 65000,
    povertyRate: 7.9,
    healthFacilities: 29,
    schools: 61,
    umkm: 2878,
    roadQuality: 11.8, // Higher traffic/damage
    historicalPoverty: [{year: 2019, rate: 8.5}, {year: 2020, rate: 8.9}, {year: 2021, rate: 8.2}, {year: 2022, rate: 7.9}, {year: 2023, rate: 7.6}]
  },
  {
    id: 'purwokerto_barat',
    name: 'Purwokerto Barat',
    lat: -7.42,
    lng: 109.21,
    population: 58000,
    povertyRate: 8.9,
    healthFacilities: 12,
    schools: 41,
    umkm: 2951,
    roadQuality: 16.2,
    historicalPoverty: [{year: 2019, rate: 9.5}, {year: 2020, rate: 9.8}, {year: 2021, rate: 9.2}, {year: 2022, rate: 8.9}, {year: 2023, rate: 8.5}]
  },
  {
    id: 'baturraden',
    name: 'Baturraden',
    lat: -7.32,
    lng: 109.23,
    population: 55000,
    povertyRate: 9.8,
    healthFacilities: 10,
    schools: 44,
    umkm: 3193,
    roadQuality: 24.8,
    historicalPoverty: [{year: 2019, rate: 10.5}, {year: 2020, rate: 10.8}, {year: 2021, rate: 10.1}, {year: 2022, rate: 9.8}, {year: 2023, rate: 9.4}]
  },
  {
    id: 'sumpiuh',
    name: 'Sumpiuh',
    lat: -7.61,
    lng: 109.36,
    population: 58000,
    povertyRate: 16.2,
    healthFacilities: 12,
    schools: 43,
    umkm: 3776,
    roadQuality: 36.9,
    historicalPoverty: [{year: 2019, rate: 17.0}, {year: 2020, rate: 17.2}, {year: 2021, rate: 16.5}, {year: 2022, rate: 16.2}, {year: 2023, rate: 15.8}]
  },
  {
    id: 'cilongok',
    name: 'Cilongok',
    lat: -7.39,
    lng: 109.14,
    population: 115000,
    povertyRate: 13.1,
    healthFacilities: 12,
    schools: 78,
    umkm: 6149,
    roadQuality: 44.8,
    historicalPoverty: [{year: 2019, rate: 13.8}, {year: 2020, rate: 14.1}, {year: 2021, rate: 13.4}, {year: 2022, rate: 13.1}, {year: 2023, rate: 12.8}]
  },
  {
    id: 'kemranjen',
    name: 'Kemranjen',
    lat: -7.58,
    lng: 109.31,
    population: 72000,
    povertyRate: 14.1,
    healthFacilities: 11,
    schools: 58,
    umkm: 4259,
    roadQuality: 27.7,
    historicalPoverty: [{year: 2019, rate: 14.8}, {year: 2020, rate: 15.0}, {year: 2021, rate: 14.4}, {year: 2022, rate: 14.1}, {year: 2023, rate: 13.7}]
  }
];

// Coefficient model for poverty prediction (Simplified Linear Regression weights)
export const MODEL_COEFFICIENTS = {
  intercept: 20.1,
  health: -0.25,
  schools: -0.08,
  umkm: -0.00048,
  road: -0.04
};
