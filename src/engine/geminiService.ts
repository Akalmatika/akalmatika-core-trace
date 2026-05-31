import { GoogleGenAI } from "@google/genai";
import { MISCONCONCEPTION_CATALOG } from "../blueprints";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private history: any[] = [];
  private systemInstruction: string = "";

  constructor() {
    const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || "";
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  public initChatContext(expression: string, studentAns: number, correctAns: number, bugCode: string | null) {
    let hook = "Ingatkan siswa untuk menggunakan alat peraga koin es dan api.";
    if (bugCode) {
      const bug = MISCONCONCEPTION_CATALOG.find(m => m.code === bugCode);
      if (bug) {
        hook = bug.remedialSocioCognitiveHook;
      }
    }

    this.systemInstruction = `Kamu adalah Kak Akalmatika, asisten matematika virtual.
Siswa sedang melihat soal operasi bilangan bulat: ${expression}. 
${studentAns !== undefined ? `Mereka sempat memberikan jawaban: ${studentAns} (seharusnya: ${correctAns}).` : ""}
${bugCode ? `Tipe miskonsepsi (jika ada): ${bugCode}.` : ""}

ATURAN MUTLAK:
1. Jawab "to the point" (langsung ke pokok permasalahan).
2. JANGAN memberitahu jawaban akhir (${correctAns}) JIKA siswa belum berhasil menjawabnya. Namun, JIKA siswa memberikan tebakan jawaban yang BENAR (${correctAns}) di dalam chat, kamu HARUS langsung membenarkannya (misal: "Betul sekali, jawabannya ${correctAns}!").
3. JIKA siswa menebak jawaban yang SALAH, bimbing dengan memberikan clue lanjutan.
4. STRUKTUR PEDAGOGI PENGURANGAN: Jika soal melibatkan pengurangan, jelaskan bahwa "Mengurangkan berarti menambahkan lawannya." Contoh: mengurangkan Es (positif) sama dengan menambahkan Api (negatif).
5. JANGAN gunakan kata "diambil", "dibuang", atau "dikurangi". 
6. Dorong penggunaan papan visualisasi elemen Es (biru/positif) dan Api (merah/negatif). Gunakan istilah "elemen", jangan "koin".
7. Sangat singkat dan padat (maksimal 1-2 kalimat).`;

    this.history = [];
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.ai) {
      return this.getFallbackMessage();
    }
    
    let retries = 3;
    let lastError: any = null;

    this.history.push({
      role: "user",
      parts: [{ text: message }]
    });

    while (retries > 0) {
      try {
        const response = await this.ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: this.history,
          config: {
            systemInstruction: this.systemInstruction,
            temperature: 0.7,
          }
        });

        if (response.text) {
          this.history.push({
            role: "model",
            parts: [{ text: response.text }]
          });
          return response.text;
        }
        return this.getFallbackMessage();
      } catch (err: any) {
        lastError = err;
        console.warn(`Gemini API Error (Retries left: ${retries - 1}):`, err);
        retries--;
        
        if (retries > 0) {
          // Wait for 1.5 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
    }

    // Remove the user message if it failed completely after retries
    this.history.pop();
    
    const errStr = lastError?.message || 'Unknown error';
    if (errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('429')) {
      return `[KUOTA HABIS] Kamu terlalu cepat bertanya, atau batas pemakaian gratis API-mu sudah habis. Tunggu sekitar 1 menit sebelum mencoba lagi ya!`;
    } else if (errStr.includes('503') || errStr.includes('UNAVAILABLE')) {
      return `[SERVER SIBUK] Server Google sedang kewalahan. Silakan tunggu beberapa saat lalu coba lagi.`;
    }
    
    return `[SYSTEM ERROR] API bermasalah. (Pesan: ${errStr.length > 60 ? errStr.substring(0, 60) + '...' : errStr})`;
  }

  private getFallbackMessage(): string {
    return "Maaf ya Detektif, Kak Akalmatika sedang ada gangguan sinyal. Coba perhatikan lagi tanda positif dan negatifnya di papan visualisasi, lalu hitung sisa elemennya ya!";
  }
}

export const geminiService = new GeminiService();
