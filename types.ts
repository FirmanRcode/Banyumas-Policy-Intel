export interface DistrictData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  population: number;
  povertyRate: number; // percentage
  healthFacilities: number;
  schools: number;
  umkm: number;
  roadQuality: number; // percentage of good roads
  historicalPoverty: { year: number; rate: number }[];
}

export interface SimulationState {
  healthFacilities: number;
  schools: number;
  umkm: number;
  roadQuality: number;
}

export interface BudgetAllocation {
  faskes: number;
  sekolah: number;
  umkm: number;
  jalan_baik: number;
  totalCost: number;
  justification: string;
}

export enum TabView {
  SIMULATION = 'SIMULATION',
  DETAILS = 'DETAILS',
  FORECAST = 'FORECAST',
  COMPARISON = 'COMPARISON',
}
