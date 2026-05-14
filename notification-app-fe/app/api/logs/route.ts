// app/api/logs/route.ts
import { NextRequest, NextResponse } from 'next/server';

const LOG_URL = 'http://4.224.186.213/evaluation-service/logs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get Authorization header from the incoming request
    const authHeader = request.headers.get('authorization') || 
                       request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const response = await fetch(LOG_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,       
      },
      body: JSON.stringify(body),
    });

    const data = await response.text(); 
    if (response.ok) {
      return NextResponse.json(JSON.parse(data), { status: response.status });
    } else {
      console.error(`Log API returned ${response.status}:`, data);
      return NextResponse.json({ error: data }, { status: response.status });
    }

  } catch (error: any) {
    console.error('Proxy logging error:', error.message);
    return NextResponse.json({ 
      error: 'Internal proxy error', 
      message: error.message 
    }, { status: 500 });
  }
}