/**
 * useCamera Hook
 * 
 * 📚 AÇIKLAMA:
 * Bu dosya bir "Custom Hook" içeriyor.
 * 
 * 💡 REACT HOOK NEDİR?
 * Hook = React'te state ve yan etkileri yönetmek için kullanılan fonksiyonlar
 * 
 * BUILT-IN HOOK'LAR:
 * - useState → Değişken tutmak için (component yeniden render edildiğinde değer korunur)
 * - useEffect → Yan etkiler için (API çağrısı, event listener, vb.)
 * - useRef → DOM elemanına referans veya değer tutmak (render tetiklemez)
 * - useCallback → Fonksiyonu memoize etmek (gereksiz yeniden oluşturmayı önler)
 * 
 * CUSTOM HOOK NEDİR?
 * Kendi yazdığımız, "use" ile başlayan fonksiyonlar.
 * İçinde diğer hook'ları kullanabilir.
 * Mantığı birden fazla component'ta paylaşmak için kullanılır.
 * 
 * Bu hook kamera işlemlerini yönetir:
 * - Kamera akışını başlatma/durdurma
 * - Fotoğraf çekme
 * - Hata yönetimi
 */

"use client";

import { useState, useRef, useCallback } from "react";

// TypeScript: Hook'un döndüreceği değerlerin tipini tanımlıyoruz
interface UseCameraReturn {
    // State değerleri
    isStreaming: boolean;          // Kamera açık mı?
    capturedImage: string | null;  // Çekilen fotoğraf (base64 string)
    error: string | null;          // Hata mesajı

    // Fonksiyonlar
    startCamera: () => Promise<void>;  // Kamerayı başlat
    stopCamera: () => void;             // Kamerayı durdur
    capturePhoto: () => void;           // Fotoğraf çek
    clearImage: () => void;             // Çekilen fotoğrafı temizle

    // Referanslar
    videoRef: React.RefObject<HTMLVideoElement | null>;  // Video elementi referansı
}

export function useCamera(): UseCameraReturn {
    // ===== STATE TANIMLARI =====
    // useState hook'u: [değer, değeriDeğiştirmeFonksiyonu]
    const [isStreaming, setIsStreaming] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // ===== REFERANSLAR =====
    // useRef: DOM elemanına veya değere referans tutar
    // Değişse bile component'ı yeniden render etmez
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // ===== KAMERA BAŞLATMA =====
    // useCallback: Fonksiyonu memoize eder
    // Dependency array boş [] olduğu için fonksiyon sadece 1 kez oluşturulur
    const startCamera = useCallback(async () => {
        try {
            setError(null);

            // navigator.mediaDevices.getUserMedia() 
            // Tarayıcıdan kamera izni ister ve kamera akışını döndürür
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment",  // Arka kamera (selfie değil)
                    width: { ideal: 1920 },     // Full HD genişlik
                    height: { ideal: 1080 },    // Full HD yükseklik
                },
            });

            // Video elementine akışı bağla
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsStreaming(true);
            }
        } catch (err) {
            // Hata yakalama
            if (err instanceof Error) {
                if (err.name === "NotAllowedError") {
                    setError("Kamera izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.");
                } else if (err.name === "NotFoundError") {
                    setError("Kamera bulunamadı. Lütfen cihazınızda kamera olduğundan emin olun.");
                } else {
                    setError(`Kamera hatası: ${err.message}`);
                }
            }
        }
    }, []);

    // ===== KAMERA DURDURMA =====
    const stopCamera = useCallback(() => {
        // Tüm kamera track'lerini durdur
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsStreaming(false);
    }, []);

    // ===== FOTOĞRAF ÇEKME =====
    const capturePhoto = useCallback(() => {
        if (!videoRef.current) return;

        // Canvas oluştur - görünmez bir çizim alanı
        const canvas = document.createElement("canvas");
        const video = videoRef.current;

        // Canvas boyutunu video boyutuna ayarla
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Video'nun o anki karesini canvas'a çiz
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(video, 0, 0);

            // Canvas'ı base64 string'e çevir (data URL)
            // Bu format ile <img src={base64String}> olarak kullanabiliriz
            const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
            setCapturedImage(imageDataUrl);

            // Fotoğraf çekildikten sonra kamerayı durdur
            stopCamera();
        }
    }, [stopCamera]);

    // ===== FOTOĞRAFI TEMİZLE =====
    const clearImage = useCallback(() => {
        setCapturedImage(null);
    }, []);

    // Hook'un döndürdüğü değerler
    return {
        isStreaming,
        capturedImage,
        error,
        startCamera,
        stopCamera,
        capturePhoto,
        clearImage,
        videoRef,
    };
}
