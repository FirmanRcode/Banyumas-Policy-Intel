
import fs from 'fs';

const dataset = [
    { kecamatan: "Lumbir", tahun: 2021, kemiskinan: 15.5, faskes: 3, sekolah: 48, umkm: 2600, jalan_baik: 22.5, sekolah_sd: 40, sekolah_smp: 6, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Wangon", tahun: 2021, kemiskinan: 13.2, faskes: 17, sekolah: 70, umkm: 3500, jalan_baik: 18.9, sekolah_sd: 55, sekolah_smp: 10, sekolah_sma: 5, faskes_rs: 1, faskes_puskesmas: 2 },
    { kecamatan: "Jatilawang", tahun: 2021, kemiskinan: 11.8, faskes: 9, sekolah: 53, umkm: 3100, jalan_baik: 27.0, sekolah_sd: 44, sekolah_smp: 7, sekolah_sma: 2, faskes_rs: 1, faskes_puskesmas: 1 },
    { kecamatan: "Rawalo", tahun: 2021, kemiskinan: 15.1, faskes: 8, sekolah: 39, umkm: 2650, jalan_baik: 14.5, sekolah_sd: 34, sekolah_smp: 4, sekolah_sma: 1, faskes_rs: 0, faskes_puskesmas: 2 },
    { kecamatan: "Kebasen", tahun: 2021, kemiskinan: 13.5, faskes: 9, sekolah: 44, umkm: 3380, jalan_baik: 19.0, sekolah_sd: 37, sekolah_smp: 5, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 2 },
    { kecamatan: "Kemranjen", tahun: 2021, kemiskinan: 14.4, faskes: 10, sekolah: 57, umkm: 4200, jalan_baik: 27.1, sekolah_sd: 49, sekolah_smp: 6, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 2 },
    { kecamatan: "Sumpiuh", tahun: 2021, kemiskinan: 16.5, faskes: 11, sekolah: 42, umkm: 3750, jalan_baik: 36.0, sekolah_sd: 34, sekolah_smp: 5, sekolah_sma: 3, faskes_rs: 1, faskes_puskesmas: 2 },
    { kecamatan: "Tambak", tahun: 2021, kemiskinan: 16.1, faskes: 11, sekolah: 43, umkm: 3250, jalan_baik: 23.5, sekolah_sd: 37, sekolah_smp: 4, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Somagede", tahun: 2021, kemiskinan: 14.8, faskes: 6, sekolah: 32, umkm: 3300, jalan_baik: 18.2, sekolah_sd: 27, sekolah_smp: 4, sekolah_sma: 1, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Kalibagor", tahun: 2021, kemiskinan: 13.0, faskes: 10, sekolah: 36, umkm: 2400, jalan_baik: 26.8, sekolah_sd: 31, sekolah_smp: 4, sekolah_sma: 1, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Banyumas", tahun: 2021, kemiskinan: 12.4, faskes: 12, sekolah: 52, umkm: 1600, jalan_baik: 18.0, sekolah_sd: 39, sekolah_smp: 8, sekolah_sma: 5, faskes_rs: 1, faskes_puskesmas: 1 },
    { kecamatan: "Patikraja", tahun: 2021, kemiskinan: 13.8, faskes: 12, sekolah: 43, umkm: 4450, jalan_baik: 22.9, sekolah_sd: 37, sekolah_smp: 4, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Purwojati", tahun: 2021, kemiskinan: 14.1, faskes: 5, sekolah: 33, umkm: 780, jalan_baik: 28.5, sekolah_sd: 29, sekolah_smp: 3, sekolah_sma: 1, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Ajibarang", tahun: 2021, kemiskinan: 12.2, faskes: 14, sekolah: 52, umkm: 5500, jalan_baik: 26.0, sekolah_sd: 41, sekolah_smp: 7, sekolah_sma: 4, faskes_rs: 1, faskes_puskesmas: 2 },
    { kecamatan: "Gumelar", tahun: 2021, kemiskinan: 16.8, faskes: 5, sekolah: 47, umkm: 2550, jalan_baik: 30.1, sekolah_sd: 41, sekolah_smp: 5, sekolah_sma: 1, faskes_rs: 0, faskes_puskesmas: 2 },
    { kecamatan: "Pekuncen", tahun: 2021, kemiskinan: 13.0, faskes: 7, sekolah: 55, umkm: 4000, jalan_baik: 23.5, sekolah_sd: 47, sekolah_smp: 6, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 2 },
    { kecamatan: "Cilongok", tahun: 2021, kemiskinan: 13.4, faskes: 11, sekolah: 77, umkm: 6100, jalan_baik: 44.0, sekolah_sd: 64, sekolah_smp: 9, sekolah_sma: 4, faskes_rs: 0, faskes_puskesmas: 2 },
    { kecamatan: "Karanglewas", tahun: 2021, kemiskinan: 11.2, faskes: 8, sekolah: 41, umkm: 5200, jalan_baik: 29.8, sekolah_sd: 34, sekolah_smp: 5, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Kedungbanteng", tahun: 2021, kemiskinan: 11.5, faskes: 8, sekolah: 48, umkm: 2600, jalan_baik: 32.9, sekolah_sd: 41, sekolah_smp: 5, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Baturraden", tahun: 2021, kemiskinan: 10.1, faskes: 9, sekolah: 43, umkm: 3150, jalan_baik: 24.2, sekolah_sd: 35, sekolah_smp: 5, sekolah_sma: 3, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Sumbang", tahun: 2021, kemiskinan: 10.8, faskes: 11, sekolah: 63, umkm: 3550, jalan_baik: 30.5, sekolah_sd: 54, sekolah_smp: 6, sekolah_sma: 3, faskes_rs: 0, faskes_puskesmas: 2 },
    { kecamatan: "Kembaran", tahun: 2021, kemiskinan: 10.4, faskes: 13, sekolah: 54, umkm: 3700, jalan_baik: 17.2, sekolah_sd: 44, sekolah_smp: 7, sekolah_sma: 3, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Sokaraja", tahun: 2021, kemiskinan: 10.6, faskes: 16, sekolah: 65, umkm: 2980, jalan_baik: 35.0, sekolah_sd: 49, sekolah_smp: 10, sekolah_sma: 6, faskes_rs: 1, faskes_puskesmas: 2 },
    { kecamatan: "Purwokerto Selatan", tahun: 2021, kemiskinan: 8.8, faskes: 21, sekolah: 49, umkm: 1800, jalan_baik: 15.0, sekolah_sd: 29, sekolah_smp: 12, sekolah_sma: 8, faskes_rs: 2, faskes_puskesmas: 2 },
    { kecamatan: "Purwokerto Barat", tahun: 2021, kemiskinan: 9.2, faskes: 11, sekolah: 40, umkm: 2900, jalan_baik: 15.8, sekolah_sd: 27, sekolah_smp: 8, sekolah_sma: 5, faskes_rs: 1, faskes_puskesmas: 2 },
    { kecamatan: "Purwokerto Utara", tahun: 2021, kemiskinan: 8.5, faskes: 12, sekolah: 37, umkm: 2600, jalan_baik: 11.0, sekolah_sd: 24, sekolah_smp: 8, sekolah_sma: 5, faskes_rs: 1, faskes_puskesmas: 2 },
    { kecamatan: "Lumbir", tahun: 2022, kemiskinan: 15.1, faskes: 3, sekolah: 49, umkm: 2685, jalan_baik: 23.66, sekolah_sd: 41, sekolah_smp: 6, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Wangon", tahun: 2022, kemiskinan: 12.9, faskes: 18, sekolah: 71, umkm: 3553, jalan_baik: 19.56, sekolah_sd: 56, sekolah_smp: 10, sekolah_sma: 5, faskes_rs: 1, faskes_puskesmas: 2 },
    { kecamatan: "Jatilawang", tahun: 2022, kemiskinan: 11.5, faskes: 10, sekolah: 54, umkm: 3128, jalan_baik: 27.71, sekolah_sd: 45, sekolah_smp: 7, sekolah_sma: 2, faskes_rs: 1, faskes_puskesmas: 1 },
    { kecamatan: "Rawalo", tahun: 2022, kemiskinan: 14.8, faskes: 9, sekolah: 40, umkm: 2682, jalan_baik: 15.11, sekolah_sd: 35, sekolah_smp: 4, sekolah_sma: 1, faskes_rs: 0, faskes_puskesmas: 2 },
    { kecamatan: "Kebasen", tahun: 2022, kemiskinan: 13.2, faskes: 9, sekolah: 45, umkm: 3406, jalan_baik: 19.54, sekolah_sd: 38, sekolah_smp: 5, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 2 },
    { kecamatan: "Kemranjen", tahun: 2022, kemiskinan: 14.1, faskes: 11, sekolah: 58, umkm: 4259, jalan_baik: 27.75, sekolah_sd: 50, sekolah_smp: 6, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 2 },
    { kecamatan: "Sumpiuh", tahun: 2022, kemiskinan: 16.2, faskes: 12, sekolah: 43, umkm: 3776, jalan_baik: 36.97, sekolah_sd: 35, sekolah_smp: 5, sekolah_sma: 3, faskes_rs: 1, faskes_puskesmas: 2 },
    { kecamatan: "Tambak", tahun: 2022, kemiskinan: 15.9, faskes: 11, sekolah: 44, umkm: 3273, jalan_baik: 24.10, sekolah_sd: 38, sekolah_smp: 4, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Somagede", tahun: 2022, kemiskinan: 14.5, faskes: 6, sekolah: 33, umkm: 3359, jalan_baik: 18.87, sekolah_sd: 28, sekolah_smp: 4, sekolah_sma: 1, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Kalibagor", tahun: 2022, kemiskinan: 12.8, faskes: 11, sekolah: 37, umkm: 2421, jalan_baik: 27.32, sekolah_sd: 32, sekolah_smp: 4, sekolah_sma: 1, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Banyumas", tahun: 2022, kemiskinan: 12.1, faskes: 13, sekolah: 53, umkm: 1644, jalan_baik: 18.36, sekolah_sd: 40, sekolah_smp: 8, sekolah_sma: 5, faskes_rs: 1, faskes_puskesmas: 1 },
    { kecamatan: "Patikraja", tahun: 2022, kemiskinan: 13.5, faskes: 13, sekolah: 44, umkm: 4488, jalan_baik: 23.29, sekolah_sd: 38, sekolah_smp: 4, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Purwojati", tahun: 2022, kemiskinan: 13.8, faskes: 5, sekolah: 34, umkm: 792, jalan_baik: 29.01, sekolah_sd: 30, sekolah_smp: 3, sekolah_sma: 1, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Ajibarang", tahun: 2022, kemiskinan: 11.9, faskes: 15, sekolah: 53, umkm: 5521, jalan_baik: 26.64, sekolah_sd: 42, sekolah_smp: 7, sekolah_sma: 4, faskes_rs: 1, faskes_puskesmas: 2 },
    { kecamatan: "Gumelar", tahun: 2022, kemiskinan: 16.5, faskes: 5, sekolah: 48, umkm: 2572, jalan_baik: 30.86, sekolah_sd: 42, sekolah_smp: 5, sekolah_sma: 1, faskes_rs: 0, faskes_puskesmas: 2 },
    { kecamatan: "Pekuncen", tahun: 2022, kemiskinan: 12.7, faskes: 7, sekolah: 56, umkm: 4066, jalan_baik: 24.00, sekolah_sd: 48, sekolah_smp: 6, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 2 },
    { kecamatan: "Cilongok", tahun: 2022, kemiskinan: 13.1, faskes: 12, sekolah: 78, umkm: 6149, jalan_baik: 44.89, sekolah_sd: 65, sekolah_smp: 9, sekolah_sma: 4, faskes_rs: 0, faskes_puskesmas: 2 },
    { kecamatan: "Karanglewas", tahun: 2022, kemiskinan: 10.9, faskes: 9, sekolah: 42, umkm: 5232, jalan_baik: 30.25, sekolah_sd: 35, sekolah_smp: 5, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Kedungbanteng", tahun: 2022, kemiskinan: 11.2, faskes: 9, sekolah: 49, umkm: 2636, jalan_baik: 33.41, sekolah_sd: 42, sekolah_smp: 5, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Baturraden", tahun: 2022, kemiskinan: 9.8, faskes: 10, sekolah: 44, umkm: 3193, jalan_baik: 24.85, sekolah_sd: 36, sekolah_smp: 5, sekolah_sma: 3, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Sumbang", tahun: 2022, kemiskinan: 10.5, faskes: 12, sekolah: 64, umkm: 3599, jalan_baik: 30.96, sekolah_sd: 55, sekolah_smp: 6, sekolah_sma: 3, faskes_rs: 0, faskes_puskesmas: 2 },
    { kecamatan: "Kembaran", tahun: 2022, kemiskinan: 10.1, faskes: 14, sekolah: 55, umkm: 3713, jalan_baik: 17.84, sekolah_sd: 45, sekolah_smp: 7, sekolah_sma: 3, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Sokaraja", tahun: 2022, kemiskinan: 10.3, faskes: 17, sekolah: 66, umkm: 3008, jalan_baik: 35.67, sekolah_sd: 50, sekolah_smp: 10, sekolah_sma: 6, faskes_rs: 1, faskes_puskesmas: 2 },
    { kecamatan: "Purwokerto Selatan", tahun: 2022, kemiskinan: 8.5, faskes: 22, sekolah: 50, umkm: 1860, jalan_baik: 15.32, sekolah_sd: 30, sekolah_smp: 12, sekolah_sma: 8, faskes_rs: 2, faskes_puskesmas: 2 },
    { kecamatan: "Purwokerto Barat", tahun: 2022, kemiskinan: 8.9, faskes: 12, sekolah: 41, umkm: 2951, jalan_baik: 16.19, sekolah_sd: 28, sekolah_smp: 8, sekolah_sma: 5, faskes_rs: 1, faskes_puskesmas: 2 },
    { kecamatan: "Purwokerto Timur", tahun: 2022, kemiskinan: 7.9, faskes: 29, sekolah: 61, umkm: 2878, jalan_baik: 11.85, sekolah_sd: 35, sekolah_smp: 15, sekolah_sma: 11, faskes_rs: 4, faskes_puskesmas: 2 },
    { kecamatan: "Purwokerto Utara", tahun: 2022, kemiskinan: 8.2, faskes: 13, sekolah: 38, umkm: 2654, jalan_baik: 11.46, sekolah_sd: 25, sekolah_smp: 8, sekolah_sma: 5, faskes_rs: 1, faskes_puskesmas: 2 },
    { kecamatan: "Lumbir", tahun: 2023, kemiskinan: 14.9, faskes: 4, sekolah: 50, umkm: 2750, jalan_baik: 24.1, sekolah_sd: 42, sekolah_smp: 6, sekolah_sma: 2, faskes_rs: 0, faskes_puskesmas: 1 },
    { kecamatan: "Wangon", tahun: 2023, kemiskinan: 12.5, faskes: 19, sekolah: 72, umkm: 3600, jalan_baik: 20.2, sekolah_sd: 57, sekolah_smp: 10, sekolah_sma: 5, faskes_rs: 1, faskes_puskesmas: 2 },
    { kecamatan: "Purwokerto Timur", tahun: 2023, kemiskinan: 7.6, faskes: 30, sekolah: 62, umkm: 2950, jalan_baik: 12.0, sekolah_sd: 36, sekolah_smp: 15, sekolah_sma: 11, faskes_rs: 4, faskes_puskesmas: 2 },
];

const mapData = [
    { id: "Gumelar", x: 130, y: 155 },
    { id: "Pekuncen", x: 185, y: 115 },
    { id: "Cilongok", x: 225, y: 165 },
    { id: "Ajibarang", x: 165, y: 200 },
    { id: "Purwojati", x: 210, y: 235 },
    { id: "Lumbir", x: 80, y: 255 },
    { id: "Wangon", x: 170, y: 280 },
    { id: "Jatilawang", x: 225, y: 305 },
    { id: "Rawalo", x: 275, y: 330 },
    { id: "Kebasen", x: 325, y: 370 },
    { id: "Kemranjen", x: 375, y: 390 },
    { id: "Sumpiuh", x: 425, y: 435 },
    { id: "Tambak", x: 475, y: 460 },
    { id: "Somagede", x: 450, y: 375 },
    { id: "Kalibagor", x: 425, y: 325 },
    { id: "Banyumas", x: 380, y: 290 },
    { id: "Patikraja", x: 300, y: 290 },
    { id: "Kedungbanteng", x: 310, y: 180 },
    { id: "Baturraden", x: 370, y: 130 },
    { id: "Sumbang", x: 430, y: 145 },
    { id: "Kembaran", x: 460, y: 205 },
    { id: "Sokaraja", x: 460, y: 250 },
    { id: "Purwokerto Selatan", x: 355, y: 245 },
    { id: "Purwokerto Barat", x: 318, y: 255 },
    { id: "Purwokerto Timur", x: 405, y: 255 },
    { id: "Purwokerto Utara", x: 370, y: 195 },
    { id: "Karanglewas", x: 290, y: 215 },
];

const populationMap = {
    "Gumelar": 52000,
    "Lumbir": 48000,
    "Wangon": 82000,
    "Ajibarang": 98000,
    "Purwokerto Timur": 65000,
    "Purwokerto Barat": 58000,
    "Baturraden": 55000,
    "Sumpiuh": 58000,
    "Cilongok": 115000,
    "Kemranjen": 72000
};

// Coordinate mapping logic
// Lng = 109.02 + (x - 130) * 0.00115
// Lat = -7.36 + (y - 155) * (-0.00089)
function getCoordinates(x, y) {
    const lng = 109.02 + (x - 130) * 0.00115;
    const lat = -7.36 + (y - 155) * (-0.00089);
    return { lat, lng };
}

// Group by kecamatan
const grouped = {};
dataset.forEach(d => {
    if (!grouped[d.kecamatan]) {
        grouped[d.kecamatan] = [];
    }
    grouped[d.kecamatan].push(d);
});

const finalDataset = Object.keys(grouped).map(kecamatan => {
    const entries = grouped[kecamatan].sort((a, b) => a.tahun - b.tahun);
    const latest = entries[entries.length - 1];
    
    const mapInfo = mapData.find(m => m.id === kecamatan);
    let coords = { lat: -7.45, lng: 109.16 }; // Default center
    if (mapInfo) {
        coords = getCoordinates(mapInfo.x, mapInfo.y);
    }

    // Generate historical poverty
    const historicalPoverty = entries.map(e => ({
        year: e.tahun,
        rate: e.kemiskinan
    }));

    const population = populationMap[kecamatan] || 50000;

    return {
        id: kecamatan.toLowerCase().replace(/ /g, '_'),
        name: kecamatan,
        lat: Number(coords.lat.toFixed(4)),
        lng: Number(coords.lng.toFixed(4)),
        population: population, 
        povertyRate: latest.kemiskinan,
        healthFacilities: latest.faskes,
        schools: latest.sekolah,
        umkm: latest.umkm,
        roadQuality: latest.jalan_baik,
        historicalPoverty: historicalPoverty,
        sekolah_sd: latest.sekolah_sd,
        sekolah_smp: latest.sekolah_smp,
        sekolah_sma: latest.sekolah_sma,
        faskes_rs: latest.faskes_rs,
        faskes_puskesmas: latest.faskes_puskesmas
    };
});

fs.writeFileSync('temp_dataset.json', JSON.stringify(finalDataset, null, 2));
