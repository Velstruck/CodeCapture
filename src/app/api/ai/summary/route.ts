import { NextResponse } from "next/server";
import { createClient } from "@insforge/sdk";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    
    const insforge = createClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
      anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
      isServerMode: true,
    });

    const completion: any = await insforge.ai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Act as a precise technical summarizer. Briefly summarize what this code snippet does.' },
        { role: 'user', content: code }
      ],
      temperature: 0.7
    });

    // Handle SDK returning { data, error } vs direct result
    const result = completion.data 
      ? completion.data.choices[0].message.content 
      : completion.choices[0].message.content;

    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
