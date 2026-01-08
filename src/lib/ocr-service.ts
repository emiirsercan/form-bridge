/**
 * OCR Servisi - Google Cloud Vision API ile iletişim
 * 
 * ============================================
 * BU DOSYA NE YAPIYOR?
 * ============================================
 * 
 * 1. Fotoğrafı alır (base64 formatında)
 * 2. Google Cloud Vision API'ye gönderir
 * 3. Google'dan gelen yazıları döndürür
 * 
 * ============================================
 * BASE64 NEDİR?
 * ============================================
 * 
 * Fotoğraf aslında bir dosyadır (binary data).
 * Ama internette veri gönderirken genellikle metin kullanırız.
 * Base64, dosyayı metne çeviren bir yöntemdir.
 * 
 * Örnek:
 * Fotoğraf → "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
 * 
 * Bu uzun metin aslında fotoğrafın kendisi!
 * 
 * ============================================
 * API NEDİR?
 * ============================================
 * 
 * API = Application Programming Interface
 * 
 * Düşün ki bir restoran var:
 * - Sen (uygulamamız) = Müşteri
 * - Garson = API
 * - Mutfak (Google) = Servis
 * 
 * Sen garsona sipariş verirsin, garson mutfağa iletir,
 * mutfak yemeği yapar, garson sana getirir.
 * 
 * API de aynı şekilde çalışır:
 * Biz istek göndeririz → Google işler → Bize cevap döner
 */

// OCR sonucu için TypeScript tipi
// Bu, Google'dan gelecek verinin yapısını tanımlar
export interface OCRResult {
    success: boolean;           // Başarılı mı?
    text: string;               // Tüm yazılar (birleşik)
    confidence: number;         // Güven skoru (0-1 arası)
    blocks: TextBlock[];        // Yazı blokları (paragraflar)
    error?: string;             // Hata varsa mesajı
}

// Bir yazı bloğu (paragraf veya satır)
export interface TextBlock {
    text: string;               // Blokun metni
    confidence: number;         // Bu bloğa güven skoru
    boundingBox?: {             // Yazının fotoğraftaki konumu
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

/**
 * Fotoğrafı OCR ile tara
 * 
 * @param imageBase64 - Fotoğrafın base64 hali
 * @returns OCR sonucu
 * 
 * ============================================
 * ASYNC/AWAIT NEDİR?
 * ============================================
 * 
 * Normalde JavaScript kodu satır satır çalışır.
 * Ama bazı işlemler zaman alır (API çağrısı gibi).
 * 
 * async/await, zamanın alan işlemleri bekletmemizi sağlar:
 * 
 * const sonuc = await googleaCagriYap();  // Bekle, sonucu al
 * console.log(sonuc);                      // Sonucu kullan
 * 
 * "await" kelimesi "bekle" demek.
 * "async" ise bu fonksiyonun bekleyebileceğini belirtir.
 */
export async function performOCR(imageBase64: string): Promise<OCRResult> {
    try {
        // API anahtarını al (.env.local dosyasından)
        const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

        if (!apiKey) {
            return {
                success: false,
                text: "",
                confidence: 0,
                blocks: [],
                error: "API anahtarı bulunamadı. .env.local dosyasını kontrol edin.",
            };
        }

        // Base64 verisinden header'ı ayır
        // "data:image/jpeg;base64,/9j/4AA..." → "/9j/4AA..."
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

        // Google Cloud Vision API'ye gönderilecek istek
        const requestBody = {
            requests: [
                {
                    image: {
                        content: base64Data,  // Fotoğraf verisi
                    },
                    features: [
                        {
                            type: "TEXT_DETECTION",  // Yazı algılama özelliği
                            maxResults: 50,
                        },
                    ],
                    imageContext: {
                        languageHints: ["tr"],  // Türkçe öncelikli
                    },
                },
            ],
        };

        // Google'a HTTP isteği gönder
        // fetch = internetten veri almak/göndermek için kullanılır
        const response = await fetch(
            `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
            {
                method: "POST",           // Veri gönderiyoruz (GET = alma, POST = gönderme)
                headers: {
                    "Content-Type": "application/json",  // JSON formatında gönderiyoruz
                },
                body: JSON.stringify(requestBody),     // Nesneyi metne çevir
            }
        );

        // Cevabı JSON olarak oku
        const data = await response.json();

        // Hata kontrolü
        if (!response.ok) {
            return {
                success: false,
                text: "",
                confidence: 0,
                blocks: [],
                error: data.error?.message || "Google API hatası",
            };
        }

        // Sonuçları işle
        const annotations = data.responses?.[0]?.textAnnotations;

        if (!annotations || annotations.length === 0) {
            return {
                success: true,
                text: "",
                confidence: 0,
                blocks: [],
                error: "Fotoğrafta yazı bulunamadı",
            };
        }

        // İlk annotation tüm metni içerir
        const fullText = annotations[0].description || "";

        // Diğer annotationlar her bir kelime/bloğu içerir
        const blocks: TextBlock[] = annotations.slice(1).map((annotation: {
            description?: string;
            boundingPoly?: {
                vertices?: Array<{ x?: number; y?: number }>;
            };
        }) => {
            const vertices = annotation.boundingPoly?.vertices || [];
            const x = vertices[0]?.x || 0;
            const y = vertices[0]?.y || 0;
            const width = (vertices[2]?.x || 0) - x;
            const height = (vertices[2]?.y || 0) - y;

            return {
                text: annotation.description || "",
                confidence: 0.9,  // Google bu API'de confidence vermiyor, varsayılan
                boundingBox: { x, y, width, height },
            };
        });

        return {
            success: true,
            text: fullText,
            confidence: 0.9,
            blocks,
        };

    } catch (error) {
        // Beklenmeyen hata
        return {
            success: false,
            text: "",
            confidence: 0,
            blocks: [],
            error: error instanceof Error ? error.message : "Bilinmeyen hata",
        };
    }
}
