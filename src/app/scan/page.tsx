/**
 * Scan Sayfası - Form Tarama
 * 
 * Akış:
 * 1. Başlangıç (idle) - Fotoğraf çek veya seç
 * 2. Kamera (camera) - Fotoğraf çekiliyor
 * 3. Önizleme (preview) - Çekilen fotoğraf gösteriliyor
 * 4. İşleniyor (processing) - OCR yapılıyor
 * 5. Sonuç (result) - Ayrıştırılmış form verileri gösteriliyor
 */

"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { CameraCapture, ImagePreview, useFileUpload } from "@/components/camera";
import { ParsedFormResult } from "@/components/results";
import { ParsedFormData, emptyFormData } from "@/lib/form-parser";

type ScanState = "idle" | "camera" | "preview" | "processing" | "result";

interface OCRResponse {
    success: boolean;
    rawText: string;
    parsedData: ParsedFormData | null;
    error?: string;
}

export default function ScanPage() {
    // State
    const [scanState, setScanState] = useState<ScanState>("idle");
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [ocrResponse, setOcrResponse] = useState<OCRResponse | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { selectedImage, handleFileSelect, clearFile, error: uploadError } = useFileUpload();

    // Kameradan fotoğraf çekildi
    const handleCameraCapture = (imageData: string) => {
        setCapturedImage(imageData);
        setScanState("preview");
    };

    // Dosya seçildi
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(e);
    };

    // Galeri seçimi - state güncelleme
    if (selectedImage && scanState === "idle") {
        setCapturedImage(selectedImage);
        setScanState("preview");
    }

    // Yeniden başla
    const handleRetake = () => {
        setCapturedImage(null);
        setOcrResponse(null);
        clearFile();
        setScanState("idle");
    };

    // OCR'a gönder
    const handleConfirm = async () => {
        if (!capturedImage) return;

        setScanState("processing");

        try {
            const response = await fetch("/api/ocr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: capturedImage }),
            });

            const result = await response.json();
            setOcrResponse(result);
            setScanState("result");

        } catch (error) {
            setOcrResponse({
                success: false,
                rawText: "",
                parsedData: null,
                error: "Bağlantı hatası. Lütfen tekrar deneyin.",
            });
            setScanState("result");
        }
    };

    // Form verisini güncelle
    const handleEditFormData = (updatedData: ParsedFormData) => {
        setOcrResponse(prev => prev ? { ...prev, parsedData: updatedData } : null);
    };

    // Export işlemi
    const handleExport = () => {
        if (!ocrResponse?.parsedData) return;

        // JSON dosyası olarak indir
        const jsonData = JSON.stringify(ocrResponse.parsedData, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `form-${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
    };

    // ===== RENDER =====

    // Kamera modu
    if (scanState === "camera") {
        return (
            <CameraCapture
                onCapture={handleCameraCapture}
                onCancel={() => setScanState("idle")}
            />
        );
    }

    // Önizleme modu
    if (scanState === "preview" && capturedImage) {
        return (
            <div className="min-h-screen bg-gray-900">
                <ImagePreview
                    imageData={capturedImage}
                    onConfirm={handleConfirm}
                    onRetake={handleRetake}
                />
            </div>
        );
    }

    // İşleniyor modu
    if (scanState === "processing") {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Form taranıyor...</p>
                    <p className="text-gray-400 text-sm mt-2">OCR ve form ayrıştırma yapılıyor</p>
                </div>
            </div>
        );
    }

    // Sonuç modu
    if (scanState === "result" && ocrResponse) {
        if (ocrResponse.success && ocrResponse.parsedData) {
            return (
                <ParsedFormResult
                    parsedData={ocrResponse.parsedData}
                    rawText={ocrResponse.rawText}
                    onEdit={handleEditFormData}
                    onExport={handleExport}
                    onRetry={handleRetake}
                />
            );
        } else {
            // Hata durumu
            return (
                <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-2">Hata Oluştu</h2>
                        <p className="text-gray-400 mb-6">{ocrResponse.error || "Bilinmeyen hata"}</p>
                        <button
                            onClick={handleRetake}
                            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                        >
                            Tekrar Dene
                        </button>
                    </div>
                </div>
            );
        }
    }

    // Başlangıç modu
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
            <header className="p-4 flex items-center gap-4">
                <Link href="/" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-xl font-bold text-white">Form Tara</h1>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="text-center mb-12">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                          flex items-center justify-center">
                        <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Hasta Formunu Tara</h2>
                    <p className="text-gray-400 max-w-xs">
                        Doldurulmuş hasta formunun fotoğrafını çekin veya galeriden seçin.
                    </p>
                </div>

                {uploadError && (
                    <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {uploadError}
                    </div>
                )}

                <div className="w-full max-w-xs space-y-4">
                    <button
                        onClick={() => setScanState("camera")}
                        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 
                       text-white font-semibold flex items-center justify-center gap-3
                       hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Fotoğraf Çek
                    </button>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-4 px-6 rounded-xl border border-gray-600 
                       text-gray-300 font-semibold flex items-center justify-center gap-3
                       hover:bg-white/5 transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Galeriden Seç
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            </main>

            <footer className="p-6 text-center">
                <p className="text-gray-500 text-sm">
                    💡 En iyi sonuç için formu düz bir yüzeyde, iyi aydınlatmada çekin.
                </p>
            </footer>
        </div>
    );
}
