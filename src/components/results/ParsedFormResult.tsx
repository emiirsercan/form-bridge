/**
 * ParsedFormResult - Ayrıştırılmış Form Sonucu Bileşeni
 * 
 * OCR sonuçlarını düzenli bir tablo halinde gösterir.
 * Kullanıcı alanları düzenleyebilir.
 */

"use client";

import { useState } from "react";
import { ParsedFormData, formatFormDataForDisplay } from "@/lib/form-parser";

interface ParsedFormResultProps {
    parsedData: ParsedFormData;
    rawText: string;
    onEdit: (updatedData: ParsedFormData) => void;
    onExport: () => void;
    onRetry: () => void;
}

export function ParsedFormResult({
    parsedData,
    rawText,
    onEdit,
    onExport,
    onRetry,
}: ParsedFormResultProps) {
    const [showRawText, setShowRawText] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState(parsedData);

    // Form verilerini görüntüleme formatına çevir
    const displayFields = formatFormDataForDisplay(editedData);

    // Alan güncelleme
    const handleFieldChange = (fieldKey: string, value: string) => {
        setEditedData(prev => ({
            ...prev,
            [fieldKey]: value,
        }));
    };

    // Değişiklikleri kaydet
    const handleSave = () => {
        onEdit(editedData);
        setEditMode(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
                <button
                    onClick={onRetry}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-white">Tarama Sonuçları</h1>
                <div className="w-10" />
            </header>

            {/* Güven Skoru */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Algılama Doğruluğu</span>
                    <span className="text-white font-semibold">{editedData.guvenSkor}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${editedData.guvenSkor >= 70
                                ? "bg-green-500"
                                : editedData.guvenSkor >= 40
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                        style={{ width: `${editedData.guvenSkor}%` }}
                    />
                </div>
            </div>

            {/* Form Alanları */}
            <div className="bg-gray-800 rounded-xl overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <h2 className="font-semibold text-white">Form Bilgileri</h2>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="text-blue-400 text-sm hover:text-blue-300"
                    >
                        {editMode ? "İptal" : "Düzenle"}
                    </button>
                </div>

                <div className="divide-y divide-gray-700">
                    {displayFields.map((field, index) => (
                        <div key={index} className="flex items-center p-4">
                            <span className="text-gray-400 text-sm w-1/3">{field.label}</span>
                            {editMode ? (
                                <input
                                    type="text"
                                    value={field.value === "-" ? "" : field.value}
                                    onChange={(e) => {
                                        // Alan adını label'dan türet
                                        const fieldKey = field.label
                                            .toLowerCase()
                                            .replace(".", "")
                                            .replace(/ /g, "")
                                            .replace("t.c.kimlikno", "tcKimlik")
                                            .replace("doğumtarihi", "dogumTarihi")
                                            .replace("e-posta", "eposta")
                                            .replace("sigortatürü", "sigortaTuru")
                                            .replace("sigortaşirketi", "sigortaSirketi")
                                            .replace("başvurunedeni", "basvuruNedeni");
                                        handleFieldChange(fieldKey, e.target.value);
                                    }}
                                    className="flex-1 bg-gray-700 text-white px-3 py-1 rounded-lg text-sm 
                             border border-gray-600 focus:border-blue-500 focus:outline-none"
                                />
                            ) : (
                                <span className={`flex-1 text-sm ${field.value === "-" ? "text-gray-500" : "text-white"}`}>
                                    {field.value}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {editMode && (
                    <div className="p-4 border-t border-gray-700">
                        <button
                            onClick={handleSave}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Değişiklikleri Kaydet
                        </button>
                    </div>
                )}
            </div>

            {/* Ham Metin Toggle */}
            <button
                onClick={() => setShowRawText(!showRawText)}
                className="w-full mb-4 py-3 px-4 rounded-xl border border-gray-700 text-gray-300 
                   flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
                <span className="text-sm">Ham OCR Metni</span>
                <svg
                    className={`w-5 h-5 transition-transform ${showRawText ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {showRawText && (
                <div className="bg-gray-800 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
                    <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono">
                        {rawText || "Metin bulunamadı"}
                    </pre>
                </div>
            )}

            {/* Aksiyon Butonları */}
            <div className="flex gap-3">
                <button
                    onClick={() => {
                        // JSON olarak kopyala
                        const jsonData = JSON.stringify(editedData, null, 2);
                        navigator.clipboard.writeText(jsonData);
                        alert("Form verisi kopyalandı!");
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold
                     hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Kopyala
                </button>

                <button
                    onClick={onExport}
                    className="flex-1 py-3 px-4 rounded-xl bg-green-600 text-white font-semibold
                     hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Dışa Aktar
                </button>
            </div>

            <button
                onClick={onRetry}
                className="w-full mt-4 py-3 px-4 rounded-xl border border-gray-600 text-gray-300
                   hover:bg-gray-800 transition-colors"
            >
                Yeni Tarama Yap
            </button>
        </div>
    );
}
