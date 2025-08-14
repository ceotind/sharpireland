import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Received performance metric:', data);

    // In a real application, you would save this data to a database
    // or forward it to an analytics service.

    return NextResponse.json({ status: 'success', message: 'Metric received' }, { status: 200 });
  } catch (error) {
    console.error('Error processing performance metric:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to process metric' }, { status: 500 });
  }
}