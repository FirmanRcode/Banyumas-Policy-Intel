import { DistrictData, BudgetAllocation } from "../types";
import { DATASET } from "../constants";

// Use environment variable and proxy URL
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = "/api/deepseek/chat/completions"; // Uses Vite proxy to OpenRouter

const MODEL_NAME = "nousresearch/hermes-3-llama-3.1-405b:free";

// Helper for direct API calls
const callDeepSeek = async (messages: { role: string, content: string }[], jsonMode: boolean = false): Promise<string> => {
  console.log("Calling DeepSeek API via Proxy...");
  if (!API_KEY) {
    console.error("API Key is missing! Check .env file.");
    throw new Error("API Key is missing.");
  }

  const payload: any = {
    model: MODEL_NAME,
    messages: messages,
    temperature: 0.7
  };

  // Remove strict JSON mode as it causes errors with some free models
  // if (jsonMode) {
  //    payload.response_format = { type: "json_object" };
  // }

  try {
    console.log("Sending payload:", JSON.stringify(payload, null, 2));
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'http://localhost:3001', // Updated port
        'X-Title': 'Banyumas Policy Intel'
      },
      body: JSON.stringify(payload)
    });

    console.log("Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("DeepSeek API Error Details:", errorData);
      throw new Error(errorData.error?.message || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("DeepSeek API Success:", data);

    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      console.warn("No content in DeepSeek response");
      return "";
    }

  } catch (error) {
    console.error("DeepSeek API Request Failed:", error);
    throw error;
  }
};

export const generateStrategicAnalysis = async (district: DistrictData): Promise<string> => {
  try {
    const prompt = `Anda adalah seorang konsultan kebijakan senior untuk pemerintah Kabupaten Banyumas. Lakukan analisis strategis untuk Kecamatan ${district.name} berdasarkan data berikut:
            - Angka Kemiskinan: ${district.povertyRate}%
            - Jumlah Fasilitas Kesehatan: ${district.healthFacilities}
            - Jumlah Sekolah: ${district.schools}
            - Jumlah UMKM: ${district.umkm}
            - Panjang Jalan Baik: ${district.roadQuality.toFixed(1)} km

            Berikan output dalam dua bagian:
            1.  **Analisis SWOT:** Identifikasi Kekuatan, Kelemahan, Peluang, dan Ancaman utama.
            2.  **Identifikasi Risiko & Mitigasi:** Sebutkan 2 risiko utama untuk pembangunan masa depan dan sarankan satu strategi mitigasi untuk masing-masing risiko.
            Gunakan format yang jelas dengan sub-judul tebal.`;

    return await callDeepSeek([{ role: "user", content: prompt }]);
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Terjadi kesalahan saat menghubungi layanan AI. Pastikan API Key valid.";
  }
};

export const getBudgetRecommendation = async (
  district: DistrictData,
  totalBudget: number,
  goal: string
): Promise<BudgetAllocation | null> => {
  try {
    const prompt = `
            Anda adalah seorang perencana kebijakan publik yang ahli dalam optimasi anggaran.
            Tugas Anda adalah memberikan rekomendasi alokasi anggaran untuk Kecamatan ${district.name} di Kabupaten Banyumas.

            Kondisi Saat Ini:
            - Angka Kemiskinan: ${district.povertyRate}%
            - Faskes: ${district.healthFacilities} unit
            - Sekolah: ${district.schools} unit
            - UMKM: ${district.umkm} unit
            - Jalan Baik: ${district.roadQuality.toFixed(1)} km

            Anggaran yang Tersedia: Rp ${totalBudget.toLocaleString('id-ID')}
            Tujuan Utama: "${goal}"

            Asumsi Biaya Intervensi:
            - 1 unit Faskes baru: Rp 1.500.000.000
            - 1 unit Sekolah baru: Rp 2.000.000.000
            - Stimulus untuk 1 unit UMKM baru: Rp 5.000.000
            - Perbaikan 1 km Jalan: Rp 300.000.000

            Instruksi:
            Alokasikan anggaran yang tersedia untuk menambah jumlah faskes, sekolah, UMKM, dan/atau perbaikan jalan. Anda tidak harus menggunakan semua anggaran.
            Prioritaskan alokasi berdasarkan tujuan yang dipilih untuk mendapatkan dampak penurunan kemiskinan yang paling efektif.
            Berikan output dalam format JSON yang valid.
            Output JSON harus berisi:
            1.  Sebuah objek 'alokasi' dengan empat kunci: 'faskes', 'sekolah', 'umkm', 'jalan_baik'. Nilainya adalah JUMLAH UNIT BARU (bukan total).
            2.  Sebuah string 'justifikasi' yang menjelaskan secara singkat alasan di balik strategi alokasi Anda.
            
            PENTING: Hanya berikan output JSON murni tanpa markdown.
            `;

    const jsonText = await callDeepSeek([{ role: "system", content: "You are a helpful assistant that outputs JSON." }, { role: "user", content: prompt }], true);

    // Clean up potential markdown code blocks if the model ignores json_object mode
    const cleanJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanJson || "{}") as BudgetAllocation;
  } catch (error) {
    console.error("Budget AI Error:", error);
    return null;
  }
};

export const generateForecastAnalysis = async (district: DistrictData, forecastData: { year: number, rate: number }[]): Promise<string> => {
  try {
    const historicalStr = district.historicalPoverty.map(d => `${d.year}: ${d.rate}%`).join(', ');
    const forecastStr = forecastData.map(d => `${d.year}: ${d.rate.toFixed(2)}%`).join(', ');

    const prompt = `Anda adalah seorang analis data senior. Data historis angka kemiskinan di Kecamatan ${district.name} adalah: ${historicalStr}.
            Berdasarkan tren ini, peramalan untuk 5 tahun ke depan adalah: ${forecastStr}.
            
            Berikan analisis singkat mengenai hasil peramalan ini. Jelaskan apa arti tren ini (membaik, memburuk, atau stagnan) dan apa implikasi utamanya jika tren ini terus berlanjut tanpa intervensi kebijakan yang signifikan.`;

    return await callDeepSeek([{ role: "user", content: prompt }]);
  } catch (error) {
    console.error("Forecast AI Error:", error);
    return "Gagal menghasilkan analisis peramalan.";
  }
}

export const generateClusterAnalysis = async (clusterId: number, profile: { faskes: number, sekolah: number, umkm: number, roadQuality: number }): Promise<string> => {
  try {
    const prompt = `Anda adalah seorang perencana wilayah ahli. Sebuah analisis klastering telah dilakukan pada kecamatan-kecamatan di Kabupaten Banyumas. Anda sedang menganalisis Klaster ${clusterId + 1}.
            Profil rata-rata klaster ini adalah:
            - Fasilitas Kesehatan: ${profile.faskes.toFixed(1)} unit
            - Sekolah: ${profile.sekolah.toFixed(1)} unit
            - UMKM: ${profile.umkm.toFixed(1)} unit
            - Jalan Baik: ${profile.roadQuality.toFixed(1)} km

            Berdasarkan profil rata-rata ini, berikan nama yang deskriptif untuk klaster ini (contoh: 'Pusat Urban & Jasa', 'Pedesaan Agraris', 'Wilayah Berkembang'). Kemudian, jelaskan secara singkat karakteristik utama, potensi, dan tantangan yang mungkin dihadapi oleh kecamatan-kecamatan dalam klaster ini.`;

    return await callDeepSeek([{ role: "user", content: prompt }]);
  } catch (error) {
    console.error("Cluster AI Error:", error);
    return "Gagal menghasilkan analisis klaster.";
  }
}

export const generateImpactAnalysis = async (district: DistrictData, changes: { name: string, change: number, impact: number }[]): Promise<string> => {
  try {
    const changesStr = changes.map(c => `${c.name} diubah sebesar ${c.change.toFixed(1)}%`).join(', ');
    const prompt = `Anda adalah seorang analis data. Berdasarkan simulasi untuk Kecamatan ${district.name}, perubahan berikut dilakukan: ${changesStr}. Urutkan dan jelaskan secara singkat variabel mana yang memberikan dampak paling signifikan terhadap penurunan angka kemiskinan dalam simulasi ini.`;

    return await callDeepSeek([{ role: "user", content: prompt }]);
  } catch (error) {
    console.error("Impact AI Error:", error);
    return "Gagal menghasilkan analisis dampak.";
  }
}

export const generatePolicyRecommendation = async (district: DistrictData, newInputs: { faskes: number, sekolah: number, umkm: number, roadQuality: number }, newPovertyRate: number): Promise<string> => {
  try {
    const prompt = `Anda adalah seorang perencana pembangunan ahli untuk Kabupaten Banyumas. Sebuah simulasi kebijakan dilakukan untuk Kecamatan ${district.name}. Kondisi Awal: Angka Kemiskinan ${district.povertyRate}%. Skenario Perubahan: Faskes menjadi ${newInputs.faskes}, Sekolah menjadi ${newInputs.sekolah}, UMKM menjadi ${newInputs.umkm}, Jalan Baik menjadi ${newInputs.roadQuality.toFixed(1)} km. Hasil Prediksi: Angka Kemiskinan turun menjadi ${newPovertyRate.toFixed(2)}%. Berdasarkan skenario perubahan dan hasil prediksi ini, berikan 3 rekomendasi program kebijakan yang **konkret, spesifik, dan dapat dijalankan** untuk mencapai target tersebut. Fokus pada sektor yang diubah. Gunakan format poin bernomor.`;

    return await callDeepSeek([{ role: "user", content: prompt }]);
  } catch (error) {
    console.error("Policy AI Error:", error);
    return "Gagal menghasilkan rekomendasi kebijakan.";
  }
}

export const generateProfileAnalysis = async (district: DistrictData): Promise<string> => {
  try {
    const prompt = `Anda adalah seorang analis kebijakan publik untuk pemerintah daerah Kabupaten Banyumas. Berikut adalah data untuk Kecamatan ${district.name}: - Angka Kemiskinan: ${district.povertyRate}% - Jumlah Fasilitas Kesehatan: ${district.healthFacilities} - Jumlah Sekolah: ${district.schools} - Jumlah UMKM: ${district.umkm} - Panjang Jalan Baik: ${district.roadQuality.toFixed(1)} km. Berdasarkan data ini, berikan analisis singkat (maksimal 100 kata) mengenai kekuatan dan kelemahan utama dari kecamatan ini dalam konteks pembangunan daerah. Gunakan format poin.`;

    return await callDeepSeek([{ role: "user", content: prompt }]);
  } catch (error) {
    console.error("Profile AI Error:", error);
    return "Gagal menghasilkan profil.";
  }
}

export const chatWithAI = async (history: { role: string, parts: { text: string }[] }[], message: string): Promise<string> => {
  try {
    let prompt = `Anda adalah Asisten Kebijakan AI untuk Kabupaten Banyumas. Jawab pertanyaan berikut berdasarkan data yang tersedia. Pertanyaan: "${message}"`;

    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('bandingkan')) {
      const foundKecs = DATASET.filter(d => lowerMsg.includes(d.name.toLowerCase()));
      if (foundKecs.length >= 2) {
        const data1 = foundKecs[0];
        const data2 = foundKecs[1];
        prompt = `Bandingkan Kecamatan ${data1.name} dan ${data2.name} berdasarkan data ini: Data 1: ${JSON.stringify(data1)}. Data 2: ${JSON.stringify(data2)}. Berikan perbandingan naratif yang singkat.`;
      }
    } else if (lowerMsg.includes('risiko') || lowerMsg.includes('swot')) {
      const foundKec = DATASET.find(d => lowerMsg.includes(d.name.toLowerCase()));
      if (foundKec) {
        prompt = `Lakukan analisis strategis (SWOT dan Risiko) untuk Kecamatan ${foundKec.name} dengan data: ${JSON.stringify(foundKec)}`;
      }
    }

    // Convert Gemini history format to OpenAI/OpenRouter format
    const messages = history.map(h => ({
      role: h.role === 'model' ? 'assistant' : 'user',
      content: h.parts[0].text
    }));

    messages.unshift({
      role: "system",
      content: "Anda adalah Asisten Intelijen Kebijakan Banyumas. Jawab singkat, padat, dan berdasarkan konteks pembangunan daerah."
    });

    messages.push({
      role: 'user',
      content: prompt
    });

    const payload = {
      model: MODEL_NAME,
      messages: messages,
      temperature: 0.7
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'http://localhost:3001',
        'X-Title': 'Banyumas Policy Intel'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      return "Maaf, saya tidak dapat menghasilkan jawaban saat ini.";
    }

  } catch (e) {
    console.error(e);
    return "Terjadi kesalahan pada layanan AI. Silakan coba lagi.";
  }
}