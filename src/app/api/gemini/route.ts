import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Use environment variable for the key, or a placeholder if not set
    // In a real scenario, this MUST be an environment variable.
    // For this specific task, I am using the user-provided logic but ensuring it runs server-side.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json({ error: 'Server configuration error: API Key missing' }, { status: 500 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData);
        throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      return NextResponse.json({
        text: data.candidates[0].content.parts[0].text
      });
    } else {
      throw new Error("No candidates returned from Gemini");
    }

  } catch (error) {
    console.error("Error in Gemini API route:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
