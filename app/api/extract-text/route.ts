// app/api/extract-text/route.ts
import { NextResponse } from 'next/server';
import { ocrSpace } from 'ocr-space-api-wrapper';

export async function POST(req: Request) {
  try {
    const { base64Image } = await req.json();

    const result = await ocrSpace(base64Image, {
      apiKey: process.env.OCR_SPACE_API_KEY || '', // Store securely in .env.local
      language: 'eng',
      OCREngine: '2',
    });

    return NextResponse.json({ text: result.ParsedResults[0]?.ParsedText || '' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'OCR failed' }, { status: 500 });
  }
}