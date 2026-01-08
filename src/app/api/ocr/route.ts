/**
 * OCR API Endpoint
 * 
 * Fotoğrafı alır → OCR yapar → Metni ayrıştırır → Form verisi döndürür
 */

import { NextRequest, NextResponse } from "next/server";
import { performOCR } from "@/lib/ocr-service";
import { parseFormText } from "@/lib/form-parser";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.image) {
            return NextResponse.json(
                { error: "Fotoğraf verisi bulunamadı" },
                { status: 400 }
            );
        }

        // 1. OCR ile metni al
        const ocrResult = await performOCR(body.image);

        if (!ocrResult.success) {
            return NextResponse.json({
                success: false,
                error: ocrResult.error,
                rawText: "",
                parsedData: null,
            });
        }

        // 2. Metni ayrıştır ve form verisi çıkar
        const parsedData = parseFormText(ocrResult.text);

        // 3. Hem ham metni hem ayrıştırılmış veriyi döndür
        return NextResponse.json({
            success: true,
            rawText: ocrResult.text,
            parsedData: parsedData,
        });

    } catch (error) {
        console.error("OCR API hatası:", error);
        return NextResponse.json(
            { error: "Sunucu hatası" },
            { status: 500 }
        );
    }
}
