/**
 * Form Şablonu Önizleme Sayfası
 * 
 * 📚 AÇIKLAMA:
 * Bu sayfa, form şablonunu tarayıcıda görüntülememizi sağlar.
 * /form-template URL'ine gidince bu sayfa açılır.
 * 
 * 💡 NEXT.JS ROUTING:
 * Next.js'te klasör yapısı = URL yapısı
 * src/app/form-template/page.tsx → localhost:3000/form-template
 * src/app/about/page.tsx → localhost:3000/about
 * 
 * ⚠️ CLIENT COMPONENT:
 * "use client" direktifi bu dosyayı Client Component yapar.
 * NEDEN? Çünkü onClick gibi event handler'lar kullanıyoruz.
 * 
 * NEXT.JS'TE İKİ TÜR COMPONENT VAR:
 * 1. Server Component (varsayılan) - Sunucuda çalışır, SEO için iyi
 * 2. Client Component - Tarayıcıda çalışır, interaktivite için gerekli
 * 
 * Event handler, state, useEffect gibi şeyler için Client Component şart!
 */
"use client";

import { PatientRegistrationForm } from "@/components/form-template";

export default function FormTemplatePage() {
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            {/* Üst bilgi çubuğu */}
            <div className="max-w-[210mm] mx-auto mb-4 px-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">
                    Form Şablonu Önizleme
                </h1>

                {/* 
          window.print() → Tarayıcının yazdırma diyaloğunu açar
          onClick event handler: Butona tıklandığında çalışır
        */}
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg 
                     transition-colors flex items-center gap-2 print:hidden"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Yazdır
                </button>
            </div>

            {/* Form önizleme - gölgeli kart efekti */}
            <div className="shadow-xl print:shadow-none">
                <PatientRegistrationForm />
            </div>

            {/* Alt bilgi - yazdırırken gizlenir */}
            <div className="max-w-[210mm] mx-auto mt-4 px-4 text-sm text-gray-500 print:hidden">
                <p>💡 İpucu: "Yazdır" butonuna basarak formu PDF olarak kaydedebilirsiniz.</p>
            </div>
        </div>
    );
}
