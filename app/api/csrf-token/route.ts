import { NextResponse } from 'next/server';
import { generateCSRFToken } from '@/app/utils/csrf-server';

export async function GET() {
  try {
    const token = generateCSRFToken();
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json({ message: 'Failed to generate CSRF token' }, { status: 500 });
  }
}