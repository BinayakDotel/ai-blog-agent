import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to your backend server
    const response = await fetch('https://ai-agent-server-production-cfdb.up.railway.app/generate-blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling backend API:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post', status: 'error' },
      { status: 500 }
    );
  }
} 