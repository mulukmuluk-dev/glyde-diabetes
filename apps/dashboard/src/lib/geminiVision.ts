const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';


export interface FoodAnalysisResult {
  is_food: boolean;
  food_name: string;
  food_type: string;
  sugar_grams: number;
  glycemic_index: number;
  calories: number;
  carbs_grams: number;
  protein_grams: number;
  fat_grams: number;
  safety_level: 'Aman' | 'Waspada' | 'Bahaya';
  recommendation: string;
  portion_advice: string;
  spike_warning: string;
  ingredients: string[];
  nutritional_density?: string;
  fiber_grams?: number;
  raw_response?: any;
}

/**
 * Compress a base64 image to max 640px width via an offscreen canvas.
 * This dramatically reduces the payload sent to Gemini API.
 */
function compressImage(base64DataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX_DIM = 640;
      let w = img.width;
      let h = img.height;
      
      // Only resize if larger than MAX_DIM
      if (w > MAX_DIM || h > MAX_DIM) {
        if (w > h) {
          h = Math.round((h / w) * MAX_DIM);
          w = MAX_DIM;
        } else {
          w = Math.round((w / h) * MAX_DIM);
          h = MAX_DIM;
        }
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      
      // Output as JPEG with 0.7 quality (good balance of size vs clarity)
      const compressed = canvas.toDataURL('image/jpeg', 0.7);
      resolve(compressed);
    };
    img.onerror = () => {
      // If compression fails, return original
      resolve(base64DataUrl);
    };
    img.src = base64DataUrl;
  });
}

export async function analyzeFoodImageWithGemini(base64Image: string): Promise<FoodAnalysisResult> {
  // Step 1: Compress image to reduce payload size
  console.log(`[GLYDE] Gambar asli: ${Math.round(base64Image.length / 1024)}KB`);
  const compressed = await compressImage(base64Image);
  console.log(`[GLYDE] Gambar terkompresi: ${Math.round(compressed.length / 1024)}KB`);

  const cleanBase64 = compressed.includes(',') ? compressed.split(',')[1] : compressed;
  const mimeMatch = compressed.match(/^data:(image\/[a-zA-Z0-9.-]+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

  const systemPrompt = `Anda adalah Dokter Spesialis Gizi Klinis & Diabetesiolog Senior AI dari GLYDE Health System.

TUGAS UTAMA:
Lakukan analisis visual nutrisi dan estimasi kadar gula darah berdasarkan foto makanan, minuman, atau produk kemasan konsumsi yang diunggah pengguna.

PANDUAN IDENTIFIKASI VISUAL:
1. PERIKSA FOTO DENGAN TELITI: Cari makanan, minuman, produk makanan kemasan (seperti Stik Yogurt, Es Krim, Biskuit, Susu, Snack Kemasan, Minuman Botol/Karton, Roti, Cokelat), hidangan siap saji, buah, atau barang konsumsi apapun.
2. JIKA TERDAPAT MAKANAN/MINUMAN ATAU PRODUK KEMASAN KONSUMSI (meskipun dipegang tangan, ada wajah/atap di latar belakang, piring, atau meja), ANDA WAJIB MENGANALISIS PRODUK/MAKANAN TERSEBUT dan set "is_food": true.
3. Sebutkan nama spesifik produk/makanan dalam Bahasa Indonesia berdasarkan teks di kemasan atau bentuk fisiknya.
4. HANYA JIKA foto SAMA SEKALI TIDAK MENGANDUNG MAKANAN/MINUMAN (misal: tembok polos, sepatu, dokumen, mobil, laptop), set "is_food": false dan "food_name": "Bukan Makanan".
5. Hitung estimasi nutrisi secara realistis berdasarkan informasi produk kemasan atau porsi standar.

FORMAT RESPONSE WAJIB JSON MURNI:
{
  "is_food": boolean,
  "food_name": "Nama makanan/minuman/produk kemasan spesifik atau Bukan Makanan",
  "food_type": "Makanan Utama | Minuman | Camilan | Dessert | Bukan Makanan",
  "sugar_grams": number,
  "glycemic_index": number,
  "calories": number,
  "carbs_grams": number,
  "protein_grams": number,
  "fat_grams": number,
  "safety_level": "Aman | Waspada | Bahaya",
  "recommendation": "Saran gizi dan medis spesifik diabetes",
  "portion_advice": "Batas porsi konsumsi aman",
  "spike_warning": "Potensi lonjakan gula darah dan estimasi waktu",
  "ingredients": ["bahan1", "bahan2"],
  "nutritional_density": "Tinggi | Sedang | Rendah",
  "fiber_grams": number
}

ATURAN SAFETY LEVEL:
- Aman: Gula rendah (<10g), GI rendah (<55), tinggi serat/protein.
- Waspada: Gula sedang (10-25g), GI sedang (55-69).
- Bahaya: Gula tinggi (>25g) atau GI tinggi (>=70).`;

  // Fallback ke model-model yang terbukti aktif dan bebas limit (menghindari error 503/429)
  const MODELS_TO_TRY = [
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
    'gemini-flash-lite-latest'
  ];

  for (const model of MODELS_TO_TRY) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    
    const payload = {
      contents: [{
        parts: [
          { text: systemPrompt },
          { inlineData: { mimeType, data: cleanBase64 } }
        ]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
        responseMimeType: "application/json"
      }
    };

    // Retry up to 3 times for this model (handles 503 "server sibuk")
    for (let attempt = 1; attempt <= 3; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        console.log(`[GLYDE] Mengirim ke ${model} (percobaan ${attempt}/3)...`);
        const startTime = Date.now();

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify(payload)
        });

        clearTimeout(timeoutId);
        const elapsed = Date.now() - startTime;
        console.log(`[GLYDE] ${model}: HTTP ${response.status} dalam ${elapsed}ms`);

        if (response.status === 200) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            let cleanedJson = rawText.trim();
            if (cleanedJson.startsWith('```')) {
              cleanedJson = cleanedJson.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
            }
            const parsed = JSON.parse(cleanedJson);
            console.log(`[GLYDE] Berhasil menganalisis: ${parsed.food_name}`);
            return parsed;
          }
          // rawText kosong, coba retry
          console.warn(`[GLYDE] ${model}: respons kosong, retry...`);
          continue;
        }

        if (response.status === 503) {
          console.warn(`[GLYDE] ${model}: server sibuk (503), menunggu 2 detik...`);
          await new Promise(r => setTimeout(r, 2000));
          continue; // Retry model yang sama
        }

        // Error lain (400, 404, dll) → langsung pindah ke model berikutnya
        console.warn(`[GLYDE] ${model}: HTTP ${response.status}, pindah ke model berikutnya`);
        break;
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          console.warn(`[GLYDE] ${model}: timeout 30 detik, pindah ke model berikutnya`);
          break; // Timeout → skip to next model
        }
        console.warn(`[GLYDE] ${model}: error jaringan:`, err.message);
        break; // Network error → skip to next model
      }
    }
  }

  // Semua model gagal
  throw new Error('Semua server AI sedang sibuk. Tunggu 10-15 detik lalu coba foto ulang.');
}

