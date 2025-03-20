import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, temperature = 0.7, max_tokens = 1000 } = await request.json();

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "Kamu adalah seorang penulis blog profesional yang ahli dalam membuat konten yang menarik dan informatif."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature,
        max_tokens
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate content');
    }

    return NextResponse.json({
      text: data.choices[0].message.content
    });

  } catch (error) {
    console.error('Error in generate API:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 