import { GoogleGenAI, Type } from "@google/genai";
import { DistrictData, SimulationState, BudgetAllocation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
const modelId = 'gemini-2.0-flash';

export const generateStrategicAnalysis = async (district: DistrictData): Promise<string> => {
  try {
    const prompt = `
      Anda adalah konsultan kebijakan publik senior. Analisis data Kecamatan ${district.name}:
      - Kemiskinan: ${district.povertyRate}%
      - Faskes: ${district.healthFacilities}
      - Sekolah: ${district.schools}
      - UMKM: ${district.umkm}
      - Jalan Baik: ${district.roadQuality}%
      
      Berikan Analisis SWOT (Kekuatan, Kelemahan, Peluang, Ancaman) dan 2 risiko strategis utama.
      Gunakan format Markdown yang rapi.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "Gagal menghasilkan analisis.";
  } catch (error) {
    console.error("Gemini API Error:", error);
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
      Anda adalah perencana anggaran daerah. Kecamatan: ${district.name}.
      Data Saat Ini: Kemiskinan ${district.povertyRate}%, Faskes ${district.healthFacilities}, Sekolah ${district.schools}, UMKM ${district.umkm}, Jalan ${district.roadQuality}%.
      Total Anggaran: Rp ${totalBudget.toLocaleString('id-ID')}.
      Tujuan: ${goal}.
      
      Biaya per unit:
      - Faskes: 1,5 Miliar
      - Sekolah: 2 Miliar
      - UMKM Stimulus: 5 Juta
      - Jalan (per 1% perbaikan): 300 Juta

      Berikan rekomendasi alokasi unit tambahan (integer untuk faskes/sekolah/umkm, float untuk jalan).
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            faskes: { type: Type.INTEGER },
            sekolah: { type: Type.INTEGER },
            umkm: { type: Type.INTEGER },
            jalan_baik: { type: Type.NUMBER },
            totalCost: { type: Type.NUMBER },
            justification: { type: Type.STRING },
          },
          required: ["faskes", "sekolah", "umkm", "jalan_baik", "totalCost", "justification"]
        }
      }
    });

    const json = JSON.parse(response.text || "{}");
    return json as BudgetAllocation;
  } catch (error) {
    console.error("Budget AI Error:", error);
    return null;
  }
};

export const chatWithAI = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
   // Simple chat wrapper
   try {
     const chat = ai.chats.create({
        model: modelId,
        history: history,
        config: {
            systemInstruction: "Anda adalah Asisten Intelijen Kebijakan Banyumas. Jawab singkat, padat, dan berdasarkan konteks pembangunan daerah."
        }
     });
     const result = await chat.sendMessageStream({ message });
     return result;
   } catch (e) {
     console.error(e);
     throw e;
   }
}