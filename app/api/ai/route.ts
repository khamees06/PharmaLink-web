import { NextRequest, NextResponse } from 'next/server';

const GEMINI_KEY = 'AIzaSyAdri15krYFRiPI_wwuvS2VN6Sq6dM0kLs';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const res = await fetch(
     `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      }
    );
    const data = await res.json();
    console.log('Gemini response:', JSON.stringify(data).substring(0, 200));
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (result) {
      return NextResponse.json({ result });
    }
    return NextResponse.json({ result: data?.error?.message || 'لا يوجد رد من Gemini' });
  } catch (e) {
    console.error('Error:', e);
    return NextResponse.json({ result: 'خطأ في الاتصال' });
  }
}