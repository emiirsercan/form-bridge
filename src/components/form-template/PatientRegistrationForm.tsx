/**
 * PatientRegistrationForm - Hasta Kayıt Formu
 * 
 * 📚 AÇIKLAMA:
 * Bu, hastanın dolduracağı fiziksel form şablonudur.
 * Print edilip kullanılacak, sonra fotoğrafı çekilip OCR yapılacak.
 * 
 * 🎯 TASARIM PRENSİPLERİ:
 * 1. A4 boyutu - Standart kağıt
 * 2. Yüksek kontrast - Siyah/beyaz
 * 3. OCR-dostu alanlar - Karakter kutuları, checkbox'lar
 * 4. QR kod - Form versiyonu ve klinik ID'si
 * 
 * 💡 Bu bileşen "client component" değil çünkü interaktif değil.
 * Sadece render edilip yazdırılacak.
 */

import { CharacterBox, CheckboxField, FormSection, TextLine } from "./index";

// Form konfigürasyonu - kolayca özelleştirilebilir
const formConfig = {
    clinicName: "FORM BRIDGE DİŞ KLİNİĞİ",
    formVersion: "v1.0",
    formTitle: "HASTA KAYIT FORMU",
};

export function PatientRegistrationForm() {
    return (
        // A4 kağıt boyutu: 210mm x 297mm
        // print:* class'ları yazdırma için özel stiller
        <div className="w-[210mm] min-h-[297mm] mx-auto bg-white text-black p-8 print:p-6">

            {/* ===== FORM HEADER ===== */}
            <header className="flex items-start justify-between border-b-2 border-black pb-4 mb-4">
                {/* Sol: Logo alanı */}
                <div className="w-16 h-16 border-2 border-black flex items-center justify-center text-xs text-gray-400">
                    LOGO
                </div>

                {/* Orta: Klinik ve form bilgisi */}
                <div className="text-center flex-1 px-4">
                    <h1 className="text-lg font-bold">{formConfig.clinicName}</h1>
                    <h2 className="text-base font-semibold mt-1">{formConfig.formTitle}</h2>
                </div>

                {/* Sağ: QR kod alanı */}
                <div className="w-16 h-16 border-2 border-black flex items-center justify-center text-xs text-gray-400">
                    QR
                </div>
            </header>

            {/* Form numarası ve tarih */}
            <div className="flex justify-between text-xs mb-4">
                <span>Form No: _______________</span>
                <span>{formConfig.formVersion}</span>
            </div>

            {/* ===== BÖLÜM 1: KİŞİSEL BİLGİLER ===== */}
            <FormSection title="Kişisel Bilgiler" number={1}>
                {/* Ad Soyad */}
                <div className="grid grid-cols-2 gap-4">
                    <CharacterBox count={15} label="Ad" boxSize="medium" />
                    <CharacterBox count={15} label="Soyad" boxSize="medium" />
                </div>

                {/* TC Kimlik - 11 haneli */}
                <CharacterBox count={11} label="T.C. Kimlik No" boxSize="large" />

                {/* Doğum Tarihi */}
                <div className="flex items-end gap-2">
                    <CharacterBox count={2} label="Doğum Tarihi" boxSize="medium" />
                    <span className="text-lg font-bold pb-1">/</span>
                    <CharacterBox count={2} boxSize="medium" />
                    <span className="text-lg font-bold pb-1">/</span>
                    <CharacterBox count={4} boxSize="medium" />
                    <span className="text-xs text-gray-500 pb-2 ml-2">(GG/AA/YYYY)</span>
                </div>

                {/* Cinsiyet */}
                <CheckboxField
                    label="Cinsiyet"
                    options={[
                        { id: "male", label: "Erkek" },
                        { id: "female", label: "Kadın" },
                    ]}
                />

                {/* Telefon - Gruplu */}
                <div className="flex items-end gap-2">
                    <span className="text-sm pb-1">0</span>
                    <CharacterBox count={3} label="Cep Telefonu" boxSize="medium" />
                    <CharacterBox count={3} boxSize="medium" />
                    <CharacterBox count={2} boxSize="medium" />
                    <CharacterBox count={2} boxSize="medium" />
                </div>

                {/* E-posta */}
                <TextLine label="E-posta Adresi" />

                {/* Adres */}
                <TextLine label="Adres" lines={2} />
            </FormSection>

            {/* ===== BÖLÜM 2: SİGORTA BİLGİLERİ ===== */}
            <FormSection title="Sigorta Bilgileri" number={2}>
                <CheckboxField
                    label="Sigorta Türü"
                    options={[
                        { id: "sgk", label: "SGK" },
                        { id: "private", label: "Özel Sigorta" },
                        { id: "none", label: "Sigortasız" },
                    ]}
                />
                <TextLine label="Sigorta Şirketi / Kurum Adı (varsa)" />
            </FormSection>

            {/* ===== BÖLÜM 3: SAĞLIK GEÇMİŞİ ===== */}
            <FormSection title="Sağlık Geçmişi" number={3}>
                <CheckboxField
                    label="Kronik Hastalıklar (varsa işaretleyin)"
                    options={[
                        { id: "diabetes", label: "Diyabet" },
                        { id: "hypertension", label: "Hipertansiyon" },
                        { id: "heart", label: "Kalp Hastalığı" },
                        { id: "asthma", label: "Astım" },
                        { id: "epilepsy", label: "Epilepsi" },
                    ]}
                    layout="horizontal"
                />

                <TextLine label="Diğer Hastalıklar" />

                <TextLine label="Düzenli Kullandığınız İlaçlar" lines={2} />

                <CheckboxField
                    label="Alerjileriniz"
                    options={[
                        { id: "penicillin", label: "Penisilin" },
                        { id: "aspirin", label: "Aspirin" },
                        { id: "latex", label: "Lateks" },
                        { id: "anesthesia", label: "Anestezi" },
                    ]}
                    layout="horizontal"
                />

                <TextLine label="Diğer Alerjiler" />
            </FormSection>

            {/* ===== BÖLÜM 4: BAŞVURU NEDENİ ===== */}
            <FormSection title="Başvuru Nedeni" number={4}>
                <TextLine label="Şikayetiniz / Başvuru Nedeniniz" lines={3} />
            </FormSection>

            {/* ===== BÖLÜM 5: YASAL BİLGİLENDİRME ===== */}
            <FormSection title="Onay" number={5}>
                <p className="text-xs text-gray-600 leading-relaxed">
                    Yukarıda verdiğim bilgilerin doğru olduğunu, yanlış veya eksik bilgi vermem
                    durumunda sorumluluğun bana ait olduğunu kabul ediyorum. Kişisel verilerimin
                    KVKK kapsamında işlenmesine onay veriyorum.
                </p>

                <div className="flex justify-between items-end mt-6 pt-4">
                    <div className="flex items-end gap-2">
                        <span className="text-sm">Tarih:</span>
                        <CharacterBox count={2} boxSize="small" />
                        <span>/</span>
                        <CharacterBox count={2} boxSize="small" />
                        <span>/</span>
                        <CharacterBox count={4} boxSize="small" />
                    </div>

                    <div className="text-center">
                        <div className="w-40 border-b border-black h-8" />
                        <span className="text-xs">Hasta İmzası</span>
                    </div>
                </div>
            </FormSection>

            {/* Alt bilgi */}
            <footer className="mt-8 pt-4 border-t text-xs text-gray-500 text-center">
                Form Bridge © 2024 - Bu form OCR ile dijitale dönüştürülecektir.
            </footer>
        </div>
    );
}
