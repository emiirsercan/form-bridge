/**
 * CameraCapture Bileşeni
 * 
 * Kamera görüntüsünü gösteren ve fotoğraf çekmeyi sağlayan UI bileşeni.
 */

"use client";

import { useEffect, useState } from "react";
import { useCamera } from "./useCamera";

interface CameraCaptureProps {
    onCapture: (imageData: string) => void;
    onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
    const {
        isStreaming,
        capturedImage,
        error,
        startCamera,
        stopCamera,
        capturePhoto,
        videoRef,
    } = useCamera();

    // Video yüklendiğinde true olacak
    const [videoReady, setVideoReady] = useState(false);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);

    useEffect(() => {
        if (capturedImage) {
            onCapture(capturedImage);
        }
    }, [capturedImage, onCapture]);

    // Video metadata yüklendiğinde çağrılır
    const handleVideoReady = () => {
        setVideoReady(true);
    };

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
                <div className="w-10" />
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
                        {/* Video elementi */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            onLoadedMetadata={handleVideoReady}
                            onPlay={handleVideoReady}
                            className="w-full h-full object-cover"
                        />

                        {/* Yükleniyor göstergesi */}
                        {!videoReady && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                                <div className="text-center">
                                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-white">Kamera açılıyor...</p>
                                </div>
                            </div>
                        )}

                        {/* Kılavuz çerçevesi */}
                        <div className="absolute inset-8 border-2 border-white/50 rounded-lg pointer-events-none">
                            <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-lg" />
                        </div>
                    </>
                )}
            </div>

            {/* Alt bar - çekim butonu - HER ZAMAN GÖRÜNÜR */}
            <div className="p-8 bg-black/50 flex justify-center items-center">
                <button
                    onClick={capturePhoto}
                    disabled={!videoReady && !isStreaming}
                    className={`w-20 h-20 rounded-full bg-white border-4 border-gray-300 
                     flex items-center justify-center transition-all
                     ${(videoReady || isStreaming)
                            ? 'hover:scale-105 active:scale-95 opacity-100'
                            : 'opacity-50 cursor-not-allowed'}`}
                >
                    <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-400" />
                </button>
            </div>
        </div>
    );
}
