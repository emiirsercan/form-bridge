/**
 * Form Parser - OCR Sonuçlarını Ayrıştırma
 * 
 * ============================================
 * BU DOSYA NE YAPIYOR?
 * ============================================
 * 
 * OCR'dan gelen ham metni alır ve anlamlı form alanlarına çevirir.
 * 
 * Örnek:
 * 
 * HAM METİN:
 * "Ad Ahmet Soyad Yılmaz T.C. Kimlik No 12345678901..."
 * 
 * ÇIKTI:
 * {
 *   ad: "Ahmet",
 *   soyad: "Yılmaz",
 *   tcKimlik: "12345678901"
 * }
 * 
 * ============================================
 * NASIL ÇALIŞIYOR?
 * ============================================
 * 
 * 1. Form etiketlerini tanımla: "Ad", "Soyad", "T.C. Kimlik No"
 * 2. Metinde bu etiketleri bul
 * 3. Etiketin yanındaki/altındaki değeri al
 * 
 */

// Ayrıştırılmış form verisi tipi
export interface ParsedFormData {
    // Kişisel Bilgiler
    ad: string;
    soyad: string;
    tcKimlik: string;
    dogumTarihi: string;
    cinsiyet: "Erkek" | "Kadın" | "";
    telefon: string;
    eposta: string;
    adres: string;

    // Sigorta Bilgileri
    sigortaTuru: "SGK" | "Özel Sigorta" | "Sigortasız" | "";
    sigortaSirketi: string;

    // Sağlık Geçmişi
    kronikHastaliklar: string[];
    digerHastaliklar: string;
    kullanilanIlaclar: string;
    alerjiler: string[];
    digerAlerjiler: string;

    // Başvuru
    basvuruNedeni: string;

    // Meta
    formTarihi: string;
    guvenSkor: number;  // 0-100 arası
}

// Boş form verisi
export const emptyFormData: ParsedFormData = {
    ad: "",
    soyad: "",
    tcKimlik: "",
    dogumTarihi: "",
    cinsiyet: "",
    telefon: "",
    eposta: "",
    adres: "",
    sigortaTuru: "",
    sigortaSirketi: "",
    kronikHastaliklar: [],
    digerHastaliklar: "",
    kullanilanIlaclar: "",
    alerjiler: [],
    digerAlerjiler: "",
    basvuruNedeni: "",
    formTarihi: "",
    guvenSkor: 0,
};

/**
 * OCR metnini ayrıştır
 * 
 * @param ocrText - OCR'dan gelen ham metin
 * @returns Ayrıştırılmış form verisi
 */
export function parseFormText(ocrText: string): ParsedFormData {
    // Başlangıç verisi
    const result: ParsedFormData = { ...emptyFormData };

    // Metni satırlara böl ve temizle
    const lines = ocrText.split("\n").map(line => line.trim()).filter(Boolean);
    const fullText = ocrText.toUpperCase();

    // ===== KİŞİSEL BİLGİLER =====

    // Ad - "AD" veya "Ad" kelimesinden sonra gelen değer
    result.ad = extractFieldValue(lines, ["AD", "Ad"]);

    // Soyad
    result.soyad = extractFieldValue(lines, ["SOYAD", "Soyad"]);

    // TC Kimlik - 11 haneli sayıyı bul
    result.tcKimlik = extractTCKimlik(ocrText);

    // Doğum Tarihi - GG/AA/YYYY formatını bul
    result.dogumTarihi = extractDate(ocrText);

    // Cinsiyet - Erkek veya Kadın checkbox'ı işaretli mi?
    result.cinsiyet = extractCinsiyet(fullText);

    // Telefon - 10-11 haneli numarayı bul
    result.telefon = extractPhoneNumber(ocrText);

    // E-posta - @ içeren değeri bul
    result.eposta = extractEmail(ocrText);

    // Adres
    result.adres = extractFieldValue(lines, ["ADRES", "Adres"]);

    // ===== SİGORTA BİLGİLERİ =====

    result.sigortaTuru = extractSigortaTuru(fullText);
    result.sigortaSirketi = extractFieldValue(lines, ["SİGORTA ŞİRKETİ", "Sigorta Şirketi", "KURUM ADI"]);

    // ===== SAĞLIK GEÇMİŞİ =====

    result.kronikHastaliklar = extractKronikHastaliklar(fullText);
    result.digerHastaliklar = extractFieldValue(lines, ["DİĞER HASTALIKLAR", "Diğer Hastalıklar"]);
    result.kullanilanIlaclar = extractFieldValue(lines, ["KULLANDIĞINIZ İLAÇLAR", "Kullandığınız İlaçlar", "İLAÇLAR"]);
    result.alerjiler = extractAlerjiler(fullText);
    result.digerAlerjiler = extractFieldValue(lines, ["DİĞER ALERJİLER", "Diğer Alerjiler"]);

    // ===== BAŞVURU NEDENİ =====

    result.basvuruNedeni = extractFieldValue(lines, ["ŞİKAYETİNİZ", "BAŞVURU NEDENİ", "Şikayetiniz"]);

    // ===== FORM TARİHİ =====

    result.formTarihi = extractDate(ocrText);

    // ===== GÜVEN SKORU =====
    // Ne kadar alan doldurulmuşsa skor o kadar yüksek
    result.guvenSkor = calculateConfidenceScore(result);

    return result;
}

// ============================================
// YARDIMCI FONKSİYONLAR
// ============================================

/**
 * Belirli bir etiketin değerini bul
 * Etiketin aynı satırında veya bir sonraki satırında arar
 */
function extractFieldValue(lines: string[], labels: string[]): string {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        for (const label of labels) {
            // Etiket bu satırda mı?
            if (line.toUpperCase().includes(label.toUpperCase())) {
                // Etiketin sağında bir değer var mı?
                const afterLabel = line.substring(line.toUpperCase().indexOf(label.toUpperCase()) + label.length).trim();

                // ":" karakterini temizle
                const cleaned = afterLabel.replace(/^[:\s]+/, "").trim();

                if (cleaned.length > 0 && !isLabelText(cleaned)) {
                    return cleaned;
                }

                // Değer bir sonraki satırda mı?
                if (i + 1 < lines.length) {
                    const nextLine = lines[i + 1].trim();
                    if (nextLine.length > 0 && !isLabelText(nextLine)) {
                        return nextLine;
                    }
                }
            }
        }
    }

    return "";
}

/**
 * Bir metin form etiketi mi kontrol et
 * Etiketleri değer olarak almamak için
 */
function isLabelText(text: string): boolean {
    const labels = [
        "AD", "SOYAD", "T.C.", "KİMLİK", "DOĞUM", "TARİH", "CİNSİYET",
        "TELEFON", "E-POSTA", "ADRES", "SİGORTA", "SAĞLIK", "HASTALIK",
        "İLAÇ", "ALERJİ", "ŞİKAYET", "ONAY", "İMZA", "FORM", "HASTA",
        "ERKEK", "KADIN", "SGK", "ÖZEL", "DİYABET", "HİPERTANSİYON"
    ];

    const upperText = text.toUpperCase();
    return labels.some(label => upperText === label || upperText.includes(label));
}

/**
 * TC Kimlik numarasını bul (11 haneli sayı)
 */
function extractTCKimlik(text: string): string {
    // 11 haneli sayı ara
    const match = text.match(/\b\d{11}\b/);
    return match ? match[0] : "";
}

/**
 * Tarih formatını bul (GG/AA/YYYY veya GG.AA.YYYY)
 */
function extractDate(text: string): string {
    // GG/AA/YYYY veya GG.AA.YYYY formatı
    const match = text.match(/\b(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{4})\b/);
    if (match) {
        return `${match[1].padStart(2, "0")}/${match[2].padStart(2, "0")}/${match[3]}`;
    }
    return "";
}

/**
 * Cinsiyeti belirle (Erkek/Kadın işaretine göre)
 */
function extractCinsiyet(text: string): "Erkek" | "Kadın" | "" {
    // İşaretli checkbox sembolleri: ☑, ✓, X, x, [X], [x]
    // Erkek veya Kadın kelimesinin önünde işaret var mı?

    // Basit yaklaşım: Erkek kelimesi varsa ve bir işaret yakınındaysa
    const hasErkek = text.includes("ERKEK");
    const hasKadin = text.includes("KADIN") || text.includes("KADIN");

    // İkisi de varsa, hangisinin önünde işaret var ona bak
    // Şimdilik basit tutuyoruz
    if (hasErkek && !hasKadin) return "Erkek";
    if (hasKadin && !hasErkek) return "Kadın";

    return "";
}

/**
 * Telefon numarasını bul
 */
function extractPhoneNumber(text: string): string {
    // Türk telefon formatları: 05XX XXX XX XX, 5XX XXX XX XX, +90 5XX...
    const patterns = [
        /(?:0|\+90\s*)?5\d{2}[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}/,
        /\b5\d{9}\b/,  // 5321234567
        /\b05\d{9}\b/, // 05321234567
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            // Sadece rakamları al
            return match[0].replace(/\D/g, "");
        }
    }

    return "";
}

/**
 * E-posta adresini bul
 */
function extractEmail(text: string): string {
    const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return match ? match[0].toLowerCase() : "";
}

/**
 * Sigorta türünü belirle
 */
function extractSigortaTuru(text: string): "SGK" | "Özel Sigorta" | "Sigortasız" | "" {
    if (text.includes("SGK")) return "SGK";
    if (text.includes("ÖZEL") && text.includes("SİGORTA")) return "Özel Sigorta";
    if (text.includes("SİGORTASIZ")) return "Sigortasız";
    return "";
}

/**
 * İşaretli kronik hastalıkları bul
 */
function extractKronikHastaliklar(text: string): string[] {
    const hastaliklar: string[] = [];

    const options = [
        { label: "DİYABET", value: "Diyabet" },
        { label: "HİPERTANSİYON", value: "Hipertansiyon" },
        { label: "KALP HASTALIĞI", value: "Kalp Hastalığı" },
        { label: "ASTIM", value: "Astım" },
        { label: "EPİLEPSİ", value: "Epilepsi" },
    ];

    // Şimdilik sadece metinde geçenleri ekle
    // Gerçek checkbox algılama daha karmaşık
    for (const option of options) {
        if (text.includes(option.label)) {
            // Bu hastalık metinde var, ama işaretli mi?
            // Basit yaklaşım: Form etiketleri olarak değil, ekstra geçiyorsa işaretli kabul et
            // Bu gerçek senaryoda geliştirilmeli
        }
    }

    return hastaliklar;
}

/**
 * İşaretli alerjileri bul
 */
function extractAlerjiler(text: string): string[] {
    const alerjiler: string[] = [];

    const options = [
        { label: "PENİSİLİN", value: "Penisilin" },
        { label: "ASPİRİN", value: "Aspirin" },
        { label: "LATEKS", value: "Lateks" },
        { label: "ANESTEZİ", value: "Anestezi" },
    ];

    // Basit yaklaşım
    for (const option of options) {
        if (text.includes(option.label)) {
            // Aynı checkbox algılama sorunu
        }
    }

    return alerjiler;
}

/**
 * Güven skoru hesapla
 * Ne kadar alan doldurulmuşsa skor o kadar yüksek
 */
function calculateConfidenceScore(data: ParsedFormData): number {
    let filledFields = 0;
    const totalFields = 10; // Önemli alanlar

    if (data.ad) filledFields++;
    if (data.soyad) filledFields++;
    if (data.tcKimlik) filledFields++;
    if (data.dogumTarihi) filledFields++;
    if (data.cinsiyet) filledFields++;
    if (data.telefon) filledFields++;
    if (data.eposta) filledFields++;
    if (data.sigortaTuru) filledFields++;
    if (data.adres) filledFields++;
    if (data.basvuruNedeni) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
}

/**
 * Form verisini kullanıcı dostu formata çevir
 */
export function formatFormDataForDisplay(data: ParsedFormData): { label: string; value: string }[] {
    return [
        { label: "Ad", value: data.ad || "-" },
        { label: "Soyad", value: data.soyad || "-" },
        { label: "T.C. Kimlik No", value: data.tcKimlik || "-" },
        { label: "Doğum Tarihi", value: data.dogumTarihi || "-" },
        { label: "Cinsiyet", value: data.cinsiyet || "-" },
        { label: "Telefon", value: data.telefon || "-" },
        { label: "E-posta", value: data.eposta || "-" },
        { label: "Adres", value: data.adres || "-" },
        { label: "Sigorta Türü", value: data.sigortaTuru || "-" },
        { label: "Sigorta Şirketi", value: data.sigortaSirketi || "-" },
        { label: "Kronik Hastalıklar", value: data.kronikHastaliklar.join(", ") || "-" },
        { label: "Diğer Hastalıklar", value: data.digerHastaliklar || "-" },
        { label: "Kullanılan İlaçlar", value: data.kullanilanIlaclar || "-" },
        { label: "Alerjiler", value: data.alerjiler.join(", ") || "-" },
        { label: "Diğer Alerjiler", value: data.digerAlerjiler || "-" },
        { label: "Başvuru Nedeni", value: data.basvuruNedeni || "-" },
    ];
}
