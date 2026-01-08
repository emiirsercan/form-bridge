/**
 * CameraCapture Bileşeni
 * 
 * Kamera görüntüsünü gösteren ve fotoğraf çekmeyi sağlayan UI bileşeni.
 * 
 * LAYOUT: CSS Grid ile 3 bölüm:
 * - Üst bar: 60px sabit
 * - Orta (video): kalan alan
 * - Alt bar: 140px sabit
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

    const handleVideoReady = () => {
        setVideoReady(true);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'black',
                zIndex: 9999,
                display: 'grid',
                gridTemplateRows: '60px 1fr 140px',
            }}
        >
            {/* ===== ÜST BAR ===== */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 16px',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                }}
            >
                <button
                    onClick={() => {
                        stopCamera();
                        onCancel();
                    }}
                    style={{
                        color: 'white',
                        padding: '8px',
                        borderRadius: '50%',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <span style={{ color: 'white', fontSize: '14px' }}>Formu çerçeveye alın</span>
                <div style={{ width: '40px' }} />
            </div>

            {/* ===== VIDEO ALANI ===== */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                {error ? (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <div style={{ textAlign: 'center', padding: '32px' }}>
                            <div style={{ color: '#f87171', fontSize: '18px', marginBottom: '16px' }}>{error}</div>
                            <button
                                onClick={startCamera}
                                style={{
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                Tekrar Dene
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            onLoadedMetadata={handleVideoReady}
                            onPlay={handleVideoReady}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />

                        {!videoReady && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'black',
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            border: '4px solid #3b82f6',
                                            borderTopColor: 'transparent',
                                            borderRadius: '50%',
                                            margin: '0 auto 16px',
                                            animation: 'spin 1s linear infinite',
                                        }}
                                    />
                                    <p style={{ color: 'white' }}>Kamera açılıyor...</p>
                                </div>
                            </div>
                        )}

                        {/* Köşe işaretleri */}
                        <div style={{
                            position: 'absolute',
                            top: '16px',
                            left: '16px',
                            right: '16px',
                            bottom: '16px',
                            border: '2px solid rgba(255,255,255,0.5)',
                            borderRadius: '8px',
                            pointerEvents: 'none',
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderLeft: '4px solid white', borderTop: '4px solid white', borderTopLeftRadius: '8px' }} />
                            <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderRight: '4px solid white', borderTop: '4px solid white', borderTopRightRadius: '8px' }} />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderLeft: '4px solid white', borderBottom: '4px solid white', borderBottomLeftRadius: '8px' }} />
                            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderRight: '4px solid white', borderBottom: '4px solid white', borderBottomRightRadius: '8px' }} />
                        </div>
                    </>
                )}
            </div>

            {/* ===== ALT BAR - FOTOĞRAF ÇEK BUTONU ===== */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    paddingBottom: '20px',
                }}
            >
                <button
                    onClick={capturePhoto}
                    disabled={!videoReady && !isStreaming}
                    style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        border: '4px solid #d1d5db',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: (videoReady || isStreaming) ? 'pointer' : 'not-allowed',
                        opacity: (videoReady || isStreaming) ? 1 : 0.5,
                        transition: 'transform 0.2s',
                    }}
                >
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            border: '2px solid #9ca3af',
                        }}
                    />
                </button>
            </div>

            {/* Spin animation için global style */}
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
