import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, temperature = 0.7, max_tokens = 1000 } = await request.json();
    
    console.log('API Key:', process.env.DEEPSEEK_API_KEY ? 'Present' : 'Missing');
    
    const requestBody = {
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
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('API Error:', data.error);
      throw new Error(data.error?.message || 'Failed to generate content');
    }

    return NextResponse.json({
      text: data.choices[0].message.content
    });

  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate content' },
      { status: 500 }
    );
  }
} 