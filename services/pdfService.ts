import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DistrictData, SimulationState, BudgetAllocation } from '../types';

export const generateDistrictReport = (
    district: DistrictData,
    simulationState: SimulationState,
    aiAnalysis: string,
    budgetResult: BudgetAllocation | null
) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    let currentY = 20;

    // Helper to add text and update Y
    const addText = (text: string, size: number = 12, isBold: boolean = false, align: 'left' | 'center' = 'left') => {
        doc.setFontSize(size);
        doc.setFont("helvetica", isBold ? "bold" : "normal");

        if (align === 'center') {
            doc.text(text, pageWidth / 2, currentY, { align: 'center' });
        } else {
            const splitText = doc.splitTextToSize(text, pageWidth - (margin * 2));
            doc.text(splitText, margin, currentY);
            return splitText.length * (size * 0.5); // Approximate height
        }
        return size * 0.5;
    };

    // --- HEADER ---
    addText("LAPORAN INTELIJEN KEBIJAKAN BANYUMAS", 18, true, 'center');
    currentY += 10;
    addText(`Tanggal: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 10, false, 'center');
    currentY += 15;

    // --- SECTION 1: PROFIL WILAYAH ---
    addText(`Profil Kecamatan: ${district.name}`, 14, true);
    currentY += 8;

    const profileData = [
        ['Populasi', `${district.population.toLocaleString('id-ID')} Jiwa`],
        ['Tingkat Kemiskinan', `${district.povertyRate}%`],
        ['Fasilitas Kesehatan', `${district.healthFacilities} Unit`],
        ['Sekolah', `${district.schools} Unit`],
        ['UMKM', `${district.umkm} Unit`],
        ['Kualitas Jalan', `${district.roadQuality.toFixed(1)} km Baik`]
    ];

    autoTable(doc, {
        startY: currentY,
        head: [['Indikator', 'Nilai']],
        body: profileData,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: margin, right: margin }
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // --- SECTION 2: HASIL SIMULASI ---
    addText("Hasil Simulasi Kebijakan", 14, true);
    currentY += 8;

    const simulationData = [
        ['Indikator', 'Kondisi Awal', 'Simulasi'],
        ['Fasilitas Kesehatan', district.healthFacilities, simulationState.healthFacilities],
        ['Sekolah', district.schools, simulationState.schools],
        ['UMKM', district.umkm, simulationState.umkm],
        ['Kualitas Jalan (km)', district.roadQuality.toFixed(1), simulationState.roadQuality.toFixed(1)]
    ];

    autoTable(doc, {
        startY: currentY,
        head: [simulationData[0]],
        body: simulationData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [39, 174, 96] },
        margin: { left: margin, right: margin }
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // --- SECTION 3: ANALISIS STRATEGIS AI ---
    if (currentY > 250) { doc.addPage(); currentY = 20; }

    addText("Analisis Strategis AI", 14, true);
    currentY += 8;

    if (aiAnalysis) {
        // Clean HTML tags for PDF
        const cleanAnalysis = aiAnalysis.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
        const lines = doc.splitTextToSize(cleanAnalysis, pageWidth - (margin * 2));

        // Check if text fits, else add page
        if (currentY + (lines.length * 5) > 280) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(lines, margin, currentY);
        currentY += (lines.length * 5) + 10;
    } else {
        addText("(Belum ada analisis yang dihasilkan)", 11, false);
        currentY += 10;
    }

    // --- SECTION 4: REKOMENDASI ANGGARAN ---
    if (currentY > 240) { doc.addPage(); currentY = 20; }

    addText("Rekomendasi Anggaran AI", 14, true);
    currentY += 8;

    if (budgetResult) {
        const budgetData = [
            ['Pos Anggaran', 'Alokasi Unit Baru'],
            ['Fasilitas Kesehatan', `+${budgetResult.alokasi.faskes}`],
            ['Sekolah', `+${budgetResult.alokasi.sekolah}`],
            ['UMKM', `+${budgetResult.alokasi.umkm}`],
            ['Perbaikan Jalan', `+${budgetResult.alokasi.jalan_baik} km`]
        ];

        autoTable(doc, {
            startY: currentY,
            head: [budgetData[0]],
            body: budgetData.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [142, 68, 173] },
            margin: { left: margin, right: margin }
        });

        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 10;

        addText("Justifikasi:", 11, true);
        currentY += 5;

        const justifikasiLines = doc.splitTextToSize(budgetResult.justifikasi, pageWidth - (margin * 2));
        doc.setFont("helvetica", "italic");
        doc.text(justifikasiLines, margin, currentY);
    } else {
        addText("(Belum ada rekomendasi anggaran)", 11, false);
    }

    // --- FOOTER ---
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`Halaman ${i} dari ${pageCount} - Generated by Banyumas Policy Intel`, pageWidth / 2, 290, { align: 'center' });
    }

    doc.save(`Laporan_Kebijakan_${district.name.replace(/\s+/g, '_')}.pdf`);
};
