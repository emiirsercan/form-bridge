/**
 * ImagePreview Bileşeni
 * 
 * 📚 AÇIKLAMA:
 * Çekilen veya yüklenen fotoğrafı önizleme için gösterir.
 * Kullanıcı fotoğrafı onaylayabilir veya yeniden çekebilir.
 * 
 * 💡 CONDITIONAL RENDERING:
 * React'te koşullu render için 3 yöntem var:
 * 
 * 1. && operatörü: {condition && <Component />}
 * 2. Ternary: {condition ? <A /> : <B />}
 * 3. Early return: if (!data) return <Loading />
 */

"use client";

interface ImagePreviewProps {
    imageData: string;           // Base64 encoded image
    onConfirm: () => void;       // Onaylandığında
    onRetake: () => void;        // Yeniden çek/yükle
}

export function ImagePreview({ imageData, onConfirm, onRetake }: ImagePreviewProps) {
    return (
        <div className="flex flex-col h-full">
            {/* Görüntü alanı */}
            <div className="flex-1 relative bg-gray-900 flex items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageData}
                    alt="Çekilen form"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />

                {/* Görüntü kalitesi rozeti */}
                <div className="absolute top-4 right-4 bg-green-500/80 text-white px-3 py-1 rounded-full text-sm">
                    ✓ Görüntü yüklendi
                </div>
            </div>

            {/* Aksiyon butonları */}
            <div className="p-4 bg-gray-800 flex gap-4">
                <button
                    onClick={onRetake}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-600 text-gray-300
                     hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Yeniden Çek
                </button>

                <button
                    onClick={onConfirm}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 
                     text-white font-semibold hover:from-blue-700 hover:to-blue-800 
                     transition-all flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Formu Tara
                </button>
            </div>
        </div>
    );
}
