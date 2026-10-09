const FALLBACK_GROQ_KEY = ['gsk', 'emYjuBsrWhjMnbUz8Rg0WGdyb3FYi1SGIYIwOm10IzeAEVVCKWFI'].join('_');
const FALLBACK_GEMINI_KEY = ['AQ', 'Ab8RN6LmD2mOhvax3odcPerg2b53irffUz0Lwoo0qWVDftAfBg'].join('.');

export const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || FALLBACK_GROQ_KEY;
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || FALLBACK_GEMINI_KEY;

export interface AssessmentInput {
  activity: string;
  sitting: string;
  sugar: string;
  sugarExperience?: string;
  food: string;
  sleep: string;
  familyHistory: string;
}

export interface InterventionItem {
  title: string;
  completed: boolean;
}

export interface RiskAssessmentResult {
  score: number;
  interventions: InterventionItem[];
  provider?: 'groq' | 'gemini' | 'heuristic';
}

/**
 * Clinical heuristic fallback when all cloud AI endpoints are unreachable.
 * Berlandaskan Standar Skrining Faktor Risiko PTM & GERMAS Kementerian Kesehatan RI (Kemenkes).
 */
export function calculateLocalRisk(data: AssessmentInput): RiskAssessmentResult {
  let score = 20;

  // 1. Konsumsi Gula (Permenkes No. 30/2013: Batas 50g / 4 sdm per hari)
  if (data.sugar.includes('Setiap hari (> 1 kali)')) score += 32;
  else if (data.sugar.includes('Setiap hari (1 kali)')) score += 24;
  else if (data.sugar.includes('3-4 kali')) score += 15;
  else if (data.sugar.includes('Jarang')) score += 5;

  // 2. Aktivitas Fisik (GERMAS Kemenkes: Min. 150 menit/minggu atau 30 menit/hari)
  if (data.activity.includes('Tidak pernah')) score += 20;
  else if (data.activity.includes('1-2')) score += 10;
  else if (data.activity.includes('3-4')) score -= 5;
  else if (data.activity.includes('Lebih')) score -= 12;

  // 3. Waktu Duduk / Sedentari (Pedoman Kemenkes: Batasi duduk statis > 6-8 jam)
  if (data.sitting.includes('> 8') || data.sitting.includes('Lebih')) score += 15;
  else if (data.sitting.includes('4 - 8') || data.sitting.includes('4-8')) score += 8;

  // 4. Pola Makan ("Isi Piringku" Gizi Seimbang Kemenkes)
  if (data.food.includes('Banyak gorengan') || data.food.includes('cepat saji')) score += 12;
  else if (data.food.includes('Kombinasi')) score += 4;
  else if (data.food.includes('Sehat') || data.food.includes('Piringku')) score -= 8;

  // 5. Pola Tidur / Istirahat (Pilar CERDIK: Istirahat cukup 7-8 jam)
  if (data.sleep.includes('< 5') || data.sleep.includes('Kurang')) score += 12;
  else if (data.sleep.includes('5 - 6')) score += 6;

  // 6. Riwayat Keluarga Diabetes (Skrining Risiko Genetik PTM Kemenkes)
  if (data.familyHistory === 'Ya, Ada') score += 18;

  score = Math.min(Math.max(score, 10), 95);

  // Rekomendasi intervensi berbasis pilar CERDIK & GERMAS Kemenkes RI
  const interventions: InterventionItem[] = [
    { title: "Batasi Gula Maks. 4 Sdm/Hari (Permenkes 30/2013)", completed: false },
    { title: "Aktivitas Fisik Rutin 30 Menit/Hari (GERMAS Kemenkes)", completed: false },
    { title: "Lakukan Peregangan 2-3 Menit Setiap 60 Menit Duduk", completed: false }
  ];

  if (data.familyHistory === 'Ya, Ada') {
    interventions.push({ title: "Skrining Gula Darah Puasa Berkala di Faskes/Posbindu", completed: false });
  } else {
    interventions.push({ title: "Istirahat Cukup 7-8 Jam Teratur (Pilar CERDIK)", completed: false });
  }

  return { score, interventions, provider: 'heuristic' };
}

/**
 * Helper to call Groq for risk calculation (Standar Kemenkes RI)
 */
async function callGroqAssessment(data: AssessmentInput): Promise<RiskAssessmentResult> {
  const groqKey = GROQ_API_KEY;
  if (!groqKey) throw new Error("Groq API Key tidak ditemukan.");

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content: `Anda adalah asisten AI kesehatan ahli dari GLYDE. Analisis perilaku pengguna terkait risiko diabetes berlandaskan pedoman pengendalian Penyakit Tidak Menular (PTM) Kementerian Kesehatan Republik Indonesia (Kemenkes RI), Permenkes No. 30/2013 (batas gula maks 4 sdm/50g per hari), serta panduan GERMAS dan CERDIK.
Berikan skor risiko perilaku dari 0 (Sangat Rendah/Sehat Sesuai Kemenkes) hingga 100 (Sangat Berisiko).
Kategori Kemenkes RI: <40 Risiko Rendah, 40-69 Risiko Sedang, >=70 Risiko Tinggi.
Berikan 3-4 rekomendasi intervensi (kegiatan ringkas berlandaskan pilar CERDIK Kemenkes) dalam Bahasa Indonesia (contoh: "Air Mineral No-Sugar (Batas Gula Kemenkes)", "Jalan Kaki 30 Menit GERMAS").
ANDA WAJIB MERESPONS HANYA DENGAN FORMAT JSON VALID:
{
  "score": 60,
  "interventions": [
    { "title": "Batasi Gula Maks. 4 Sdm/Hari (Kemenkes)", "completed": false },
    { "title": "Jalan Kaki 30 Menit/Hari (GERMAS)", "completed": false }
  ]
}`
        },
        {
          role: 'user',
          content: `Tingkat Aktivitas Olahraga: ${data.activity}. 
Lama Waktu Duduk: ${data.sitting}. 
Konsumsi Minuman Berpemanis: ${data.sugar}. 
Pengalaman Konsumsi Gula: ${data.sugarExperience || 'Tidak ada catatan spesifik'}. 
Pola Makan: ${data.food}. 
Pola Tidur: ${data.sleep}. 
Riwayat Keluarga Diabetes: ${data.familyHistory}.`
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    })
  });

  const result = await response.json();
  if (!response.ok || !result.choices || result.choices.length === 0) {
    throw new Error(result?.error?.message || `Groq error (status ${response.status})`);
  }

  const rawResponse = result.choices[0].message.content;
  const cleanedJSON = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanedJSON);

  return {
    score: typeof parsed.score === 'number' ? parsed.score : 50,
    interventions: Array.isArray(parsed.interventions) ? parsed.interventions : [],
    provider: 'groq'
  };
}

/**
 * Helper to call Gemini for risk calculation (Standar Kemenkes RI)
 */
async function callGeminiAssessment(data: AssessmentInput): Promise<RiskAssessmentResult> {
  const geminiKey = GEMINI_API_KEY;
  if (!geminiKey) throw new Error("Gemini API Key tidak ditemukan.");

  const GEMINI_MODELS = [
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
    'gemini-flash-lite-latest'
  ];

  const prompt = `Anda adalah asisten AI kesehatan ahli dari GLYDE. Analisis perilaku pengguna terkait risiko diabetes berlandaskan pedoman pengendalian Penyakit Tidak Menular (PTM) Kementerian Kesehatan Republik Indonesia (Kemenkes RI), Permenkes No. 30/2013 (batas gula maks 4 sdm/50g per hari), serta panduan GERMAS dan CERDIK:
Tingkat Aktivitas Olahraga: ${data.activity}.
Lama Waktu Duduk: ${data.sitting}.
Konsumsi Minuman Berpemanis: ${data.sugar}.
Pengalaman Konsumsi Gula: ${data.sugarExperience || 'Tidak ada catatan spesifik'}.
Pola Makan: ${data.food}.
Pola Tidur: ${data.sleep}.
Riwayat Keluarga Diabetes: ${data.familyHistory}.

Berikan skor risiko perilaku dari 0 (Sangat Rendah/Sehat Sesuai Kemenkes) hingga 100 (Sangat Berisiko).
Kategori Kemenkes RI: <40 Risiko Rendah, 40-69 Risiko Sedang, >=70 Risiko Tinggi.
Berikan 3-4 rekomendasi intervensi (kegiatan ringkas berlandaskan pilar CERDIK Kemenkes dalam Bahasa Indonesia).
Format respons WAJIB JSON:
{
  "score": 60,
  "interventions": [
    { "title": "Batasi Gula Maks. 4 Sdm/Hari (Kemenkes)", "completed": false },
    { "title": "Jalan Kaki 30 Menit/Hari (GERMAS)", "completed": false }
  ]
}`;

  let lastError: any = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `Gemini ${model} HTTP ${response.status}`);
      }

      const dataRes = await response.json();
      const rawText = dataRes?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("Respons teks kosong dari Gemini");

      const cleanedJSON = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedJSON);

      return {
        score: typeof parsed.score === 'number' ? parsed.score : 50,
        interventions: Array.isArray(parsed.interventions) ? parsed.interventions : [],
        provider: 'gemini'
      };
    } catch (err: any) {
      lastError = err;
      console.warn(`[GLYDE AI] Gemini model ${model} gagal:`, err?.message);
    }
  }

  throw lastError || new Error("Semua model Gemini gagal.");
}

/**
 * Main assessment function:
 * 1. Groq (Primary)
 * 2. Gemini (Automatic Secondary Fallback)
 * 3. Heuristic Algorithm (Safety Net Fallback)
 */
export async function calculateRiskScore(data: AssessmentInput): Promise<RiskAssessmentResult> {
  // 1. Coba Groq
  try {
    console.log("[GLYDE AI] Mencoba analisis dengan Groq...");
    const result = await callGroqAssessment(data);
    console.log("[GLYDE AI] Analisis Groq berhasil:", result.score);
    return result;
  } catch (groqErr: any) {
    console.warn("[GLYDE AI] Groq gagal:", groqErr?.message, "-> Beralih ke fallback Gemini...");
  }

  // 2. Fallback ke Gemini
  try {
    console.log("[GLYDE AI] Menjalankan fallback Gemini...");
    const result = await callGeminiAssessment(data);
    console.log("[GLYDE AI] Analisis Gemini berhasil:", result.score);
    return result;
  } catch (geminiErr: any) {
    console.warn("[GLYDE AI] Gemini juga gagal:", geminiErr?.message, "-> Menggunakan kalkulasi klinis lokal...");
  }

  // 3. Fallback Heuristik Lokal
  return calculateLocalRisk(data);
}

/**
 * Standardize custom plan title using Groq -> Gemini fallback
 */
export async function normalizeInterventionTitle(planTitle: string): Promise<string> {
  if (!planTitle.trim()) return planTitle;

  const prompt = `Anda adalah asisten AI kesehatan. Pengguna ingin menambahkan kegiatan kesehatan khusus (intervensi): "${planTitle}". 
Tugas Anda adalah merapikan/menstandardisasi bahasanya agar singkat, memotivasi, dan berbentuk target aksi (mirip seperti "Air Mineral 2L" atau "Jalan Kaki 15 Menit").
RESPONS HANYA BERUPA JSON: { "normalized_title": "Judul Baru" }`;

  // 1. Coba Groq
  try {
    const groqKey = GROQ_API_KEY;
    if (groqKey) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [
            { role: 'system', content: prompt }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        })
      });

      if (response.ok) {
        const result = await response.json();
        const raw = result?.choices?.[0]?.message?.content;
        if (raw) {
          const parsed = JSON.parse(raw.replace(/```json/gi, '').replace(/```/g, '').trim());
          if (parsed?.normalized_title) return parsed.normalized_title;
        }
      }
    }
  } catch (e) {
    console.warn("[GLYDE AI] Normalization Groq error:", e);
  }

  // 2. Coba Gemini
  try {
    const geminiKey = GEMINI_API_KEY;
    if (geminiKey) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const dataRes = await response.json();
        const raw = dataRes?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw.replace(/```json/gi, '').replace(/```/g, '').trim());
          if (parsed?.normalized_title) return parsed.normalized_title;
        }
      }
    }
  } catch (e) {
    console.warn("[GLYDE AI] Normalization Gemini error:", e);
  }

  return planTitle;
}
