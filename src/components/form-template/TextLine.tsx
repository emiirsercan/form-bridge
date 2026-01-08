/**
 * TextLine Bileşeni
 * 
 * 📚 AÇIKLAMA:
 * Serbest metin yazma alanı oluşturur.
 * Hasta kendi kelimeleriyle yazacağı alanlar için (şikayet, ilaçlar, vb.)
 * 
 * 🎯 OCR NOTU:
 * Serbest metin alanları en zor OCR yapılan bölümler.
 * Bu yüzden:
 * - Satır çizgileri koyuyoruz (yazı düzgün olsun)
 * - Yeterli alan bırakıyoruz (üst üste yazılmasın)
 */

interface TextLineProps {
    label: string;
    lines?: number;  // Kaç satır olsun (varsayılan: 1)
}

export function TextLine({ label, lines = 1 }: TextLineProps) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-700">{label}</span>

            {/* 
        Array(lines).fill(0).map() → Belirtilen sayıda eleman oluştur
        Her satır için alt çizgi oluşturuyoruz
      */}
            <div className="flex flex-col gap-3">
                {Array(lines).fill(0).map((_, index) => (
                    <div
                        key={index}
                        className="h-6 border-b border-black"
                    />
                ))}
            </div>
        </div>
    );
}
