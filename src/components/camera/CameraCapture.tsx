/**
 * CameraCapture Bileşeni
 * 
 * 📚 AÇIKLAMA:
 * Kamera görüntüsünü gösteren ve fotoğraf çekmeyi sağlayan UI bileşeni.
 * useCamera hook'unu kullanır.
 * 
 * 💡 COMPONENT COMPOSITION:
 * React'te büyük bileşenler küçük parçalara bölünür:
 * - Hook: Mantık (logic) kısmını yönetir
 * - Component: Görsel (UI) kısmını yönetir
 * 
 * Bu sayede:
 * - Kod daha okunabilir olur
 * - Test etmesi kolaydır
 * - Yeniden kullanılabilir
 */

"use client";

import { useEffect } from "react";
import { useCamera } from "./useCamera";

interface CameraCaptureProps {
    onCapture: (imageData: string) => void;  // Fotoğraf çekildiğinde çağrılacak
    onCancel: () => void;                     // İptal edildiğinde çağrılacak
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
    // Hook'tan tüm kamera işlevlerini al
    const {
        isStreaming,
        capturedImage,
        error,
        startCamera,
        stopCamera,
        capturePhoto,
        clearImage,
        videoRef,
    } = useCamera();

    // ===== useEffect HOOK =====
    // Component mount olduğunda (ekrana geldiğinde) kamerayı başlat
    // Dependency array'de [] olması sadece 1 kez çalışacağı anlamına gelir
    useEffect(() => {
        startCamera();

        // Cleanup fonksiyonu: Component unmount olduğunda (ekrandan gittiğinde) çalışır
        return () => {
            stopCamera();
        };
    }, [startCamera, stopCamera]);

    // Fotoğraf çekildiğinde parent component'a bildir
    useEffect(() => {
        if (capturedImage) {
            onCapture(capturedImage);
        }
    }, [capturedImage, onCapture]);

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Üst bar */}
            <div className="flex justify-between items-center p-4 bg-black/50">
                <button
                    onClick={() => {
                        stopCamera();
                        onCancel();
                    }}
                    className="text-white p-2 rounded-full hover:bg-white/10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <span className="text-white text-sm">Formu çerçeveye alın</span>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Kamera görüntüsü veya hata */}
            <div className="flex-1 relative flex items-center justify-center">
                {error ? (
                    <div className="text-center p-8">
                        <div className="text-red-400 text-lg mb-4">{error}</div>
                        <button
                            onClick={startCamera}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                        >
                            Tekrar Dene
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Video elementi - kamera akışını gösterir */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline  // iOS'ta tam ekran yerine yerinde oynaması için
                            muted        // Ses kapalı
                            className="w-full h-full object-cover"
                        />

                        {/* Kılavuz çerçevesi - formun yerleştirileceği alan */}
                        <div className="absolute inset-8 border-2 border-white/50 rounded-lg pointer-events-none">
                            {/* Köşe işaretleri */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-lg" />
                        </div>
                    </>
                )}
            </div>

            {/* Alt bar - çekim butonu */}
            <div className="p-8 bg-black/50 flex justify-center items-center">
                {isStreaming && (
                    <button
                        onClick={capturePhoto}
                        className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 
                       flex items-center justify-center
                       hover:scale-105 active:scale-95 transition-transform"
                    >
                        {/* İç daire - dekupaj butonu efekti */}
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-400" />
                    </button>
                )}
            </div>
        </div>
    );
}
