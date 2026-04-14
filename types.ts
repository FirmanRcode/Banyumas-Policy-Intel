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
  sekolah_sd?: number;
  sekolah_smp?: number;
  sekolah_sma?: number;
  faskes_rs?: number;
  faskes_puskesmas?: number;
}

export interface SimulationState {
  healthFacilities: number;
  schools: number;
  umkm: number;
  roadQuality: number;
}

export interface BudgetAllocation {
  alokasi: {
    faskes: number;
    sekolah: number;
    umkm: number;
    jalan_baik: number;
  };
  justifikasi: string;
}

export enum TabView {
  SIMULATION = 'SIMULATION',
  DETAILS = 'DETAILS',
  FORECAST = 'FORECAST',
  COMPARISON = 'COMPARISON',
}
