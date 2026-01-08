/**
 * CharacterBox Bileşeni
 * 
 * 📚 AÇIKLAMA:
 * Bu bileşen, her karakter için ayrı bir kutu oluşturur.
 * Örnek: TC Kimlik no için 11 kutu, telefon için 10 kutu
 * 
 * 🎯 NEDEN KULLANIYORUZ?
 * - OCR, el yazısını daha kolay okur çünkü her karakter izole edilmiş
 * - Kullanıcı düzgün yazmaya zorlanır
 * - Doğruluk oranı %70'ten %95'e çıkabilir
 * 
 * 💡 REACT KAVRAMI: Props
 * Props = Properties (Özellikler)
 * Bir bileşene dışarıdan veri göndermenin yolu
 * Örnek: <CharacterBox count={11} /> → count prop'u 11 değerini alır
 */

// TypeScript: Interface ile bileşenin alacağı props'ları tanımlıyoruz
// Bu, tip güvenliği sağlar - yanlış tip verirsen hata verir
interface CharacterBoxProps {
    count: number;        // Kaç tane kutu olacak
    label?: string;       // Kutunun üstündeki etiket (opsiyonel - ? işareti)
    boxSize?: "small" | "medium" | "large";  // Kutu boyutu
    groupSize?: number;   // Kaçlı gruplar halinde ayır (telefon: 4-3-2-2)
}

// React bileşeni = JavaScript fonksiyonu
// Props'ları parametre olarak alır, JSX döndürür
export function CharacterBox({
    count,
    label,
    boxSize = "medium",  // Varsayılan değer: medium
    groupSize
}: CharacterBoxProps) {

    // boxSize'a göre Tailwind class'larını belirliyoruz
    const sizeClasses = {
        small: "w-5 h-6 text-xs",    // Küçük: 20x24px
        medium: "w-7 h-8 text-sm",   // Orta: 28x32px  
        large: "w-9 h-10 text-base", // Büyük: 36x40px
    };

    // Array(count) ile belirtilen sayıda eleman oluşturuyoruz
    // .fill(0) ile boş array'i dolduruyoruz (React render için gerekli)
    // .map() ile her eleman için bir kutu oluşturuyoruz
    const boxes = Array(count).fill(0).map((_, index) => {
        // Grup ayırma mantığı: groupSize varsa ve sıra geldiyse boşluk ekle
        const needsSpace = groupSize && index > 0 && index % groupSize === 0;

        return (
            // React'te liste render ederken her elemana unique "key" gerekli
            // Bu, React'in hangi elemanın değiştiğini anlamasını sağlar
            <span key={index} className={needsSpace ? "ml-2" : ""}>
                <span
                    className={`
            ${sizeClasses[boxSize]}
            inline-flex items-center justify-center
            border border-black bg-white
            font-mono
          `}
                >
                    {/* Boş kutu - kullanıcı buraya yazacak */}
                </span>
            </span>
        );
    });

    return (
        <div className="flex flex-col gap-1">
            {/* label varsa göster - && operatörü: sol taraf true ise sağ tarafı render et */}
            {label && (
                <span className="text-xs font-medium text-gray-700">{label}</span>
            )}
            <div className="flex flex-wrap gap-0.5">
                {boxes}
            </div>
        </div>
    );
}
