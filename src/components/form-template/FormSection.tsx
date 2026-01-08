/**
 * FormSection Bileşeni
 * 
 * 📚 AÇIKLAMA:
 * Formun bölümlerini gruplar (örn: "1. KİŞİSEL BİLGİLER")
 * Görsel düzen ve OCR için bölüm sınırları oluşturur.
 * 
 * 💡 REACT KAVRAMI: children
 * React'te bir bileşenin içine koyduğun her şey "children" olarak gelir.
 * 
 * Örnek:
 * <FormSection title="Kişisel Bilgiler">
 *   <p>Bu içerik children olarak gelir</p>
 * </FormSection>
 */

interface FormSectionProps {
    title: string;
    number?: number;                   // Bölüm numarası (1, 2, 3...)
    children: React.ReactNode;         // 👈 Bileşenin içine konulan her şey
}

export function FormSection({ title, number, children }: FormSectionProps) {
    return (
        <div className="border-t-2 border-black pt-3 mt-4 first:mt-0 first:border-t-0">
            {/* Bölüm başlığı */}
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3">
                {number && `${number}. `}{title}
            </h3>

            {/* Bölüm içeriği - children burada render edilir */}
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}
