import { NextRequest, NextResponse } from 'next/server';

const GROQ_KEY = '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';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
      }),
    });
    const data = await res.json();
    const result = data?.choices?.[0]?.message?.content;
    if (result) {
      return NextResponse.json({ result });
    }
    return NextResponse.json({ result: data?.error?.message || 'لا يوجد رد' });
  } catch (e) {
    console.error('Error:', e);
    return NextResponse.json({ result: 'خطأ في الاتصال' });
  }
}