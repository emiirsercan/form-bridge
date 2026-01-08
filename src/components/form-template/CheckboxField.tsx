/**
 * CheckboxField Bileşeni
 * 
 * 📚 AÇIKLAMA:
 * OCR tarafından kolayca algılanacak standart checkbox'lar oluşturur.
 * Hastanın işaretleyeceği kutucuklar (örn: Cinsiyet, Sigorta Türü)
 * 
 * 🎯 OCR İÇİN NEDEN BU ŞEKİLDE?
 * - Sabit boyut: OCR kutu konumunu kolayca bulur
 * - Kalın çerçeve: Daha iyi algılama
 * - İşaretin içi dolu olmalı: Hafif çizikler yanlış okumaya yol açabilir
 */

interface CheckboxOption {
    id: string;      // Benzersiz kimlik
    label: string;   // Gösterilecek metin
}

interface CheckboxFieldProps {
    label: string;                    // Alan başlığı (örn: "Cinsiyet")
    options: CheckboxOption[];        // Seçenekler listesi
    layout?: "horizontal" | "vertical"; // Yatay mı dikey mi
}

export function CheckboxField({
    label,
    options,
    layout = "horizontal"
}: CheckboxFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-gray-700">{label}</span>

            {/* 
        layout'a göre flex yönünü belirliyoruz:
        - horizontal: flex-row (yan yana)
        - vertical: flex-col (alt alta)
        
        Template literal (``) içinde ${} ile JavaScript değeri kullanabilirsin
      */}
            <div className={`flex ${layout === "horizontal" ? "flex-row flex-wrap gap-4" : "flex-col gap-2"}`}>
                {options.map((option) => (
                    <label
                        key={option.id}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        {/* 
              Checkbox kutusu - baskı için optimize edilmiş
              border-2: kalın çerçeve
              w-5 h-5: 20x20px sabit boyut
            */}
                        <span className="w-5 h-5 border-2 border-black bg-white inline-block" />
                        <span className="text-sm">{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
