/**
 * useFileUpload Hook
 * 
 * 📚 AÇIKLAMA:
 * Dosya yükleme işlemlerini yöneten custom hook.
 * Kullanıcı galeriden fotoğraf seçtiğinde bu hook devreye girer.
 * 
 * 💡 FILE API:
 * Tarayıcılar, kullanıcının seçtiği dosyalara erişmek için File API sağlar.
 * <input type="file"> ile dosya seçildiğinde bir File objesi elde ederiz.
 * 
 * FileReader API ile bu dosyayı okuyabiliriz:
 * - readAsDataURL() → Base64 string olarak okur (resim göstermek için)
 * - readAsText() → Metin olarak okur
 * - readAsArrayBuffer() → Binary olarak okur
 */

"use client";

import { useState, useCallback } from "react";

interface UseFileUploadReturn {
    selectedImage: string | null;  // Seçilen resim (base64)
    fileName: string | null;       // Dosya adı
    fileSize: number | null;       // Dosya boyutu (bytes)
    error: string | null;          // Hata mesajı
    isLoading: boolean;            // Yükleniyor mu?

    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    clearFile: () => void;
}

// İzin verilen dosya türleri
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function useFileUpload(): UseFileUploadReturn {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        // event.target.files → Seçilen dosyaların listesi
        const file = event.target.files?.[0];

        if (!file) return;

        // Dosya türü kontrolü
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Geçersiz dosya türü. Lütfen JPEG, PNG veya WebP yükleyin.");
            return;
        }

        // Dosya boyutu kontrolü
        if (file.size > MAX_FILE_SIZE) {
            setError("Dosya çok büyük. Maksimum 10MB yükleyebilirsiniz.");
            return;
        }

        setError(null);
        setIsLoading(true);
        setFileName(file.name);
        setFileSize(file.size);

        // FileReader ile dosyayı oku
        const reader = new FileReader();

        // Okuma tamamlandığında çalışacak callback
        reader.onload = (e) => {
            // e.target?.result → Base64 encoded string
            const result = e.target?.result as string;
            setSelectedImage(result);
            setIsLoading(false);
        };

        // Hata durumunda
        reader.onerror = () => {
            setError("Dosya okunamadı. Lütfen tekrar deneyin.");
            setIsLoading(false);
        };

        // Okumayı başlat (Data URL olarak)
        reader.readAsDataURL(file);
    }, []);

    const clearFile = useCallback(() => {
        setSelectedImage(null);
        setFileName(null);
        setFileSize(null);
        setError(null);
    }, []);

    return {
        selectedImage,
        fileName,
        fileSize,
        error,
        isLoading,
        handleFileSelect,
        clearFile,
    };
}
