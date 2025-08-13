import { NextRequest, NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-token';

interface TokenGenerationRequest {
  channelName: string;
  uid?: string | number;
  role?: 'publisher' | 'subscriber';
  expirationTime?: number;
}

interface AgoraTokenResponse {
  token: string;
  appId: string;
  channelName: string;
  uid: number | string;
  expirationTime: number;
}

interface ApiErrorResponse {
  error: string;
}

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

export async function POST(request: NextRequest): Promise<NextResponse<AgoraTokenResponse | ApiErrorResponse>> {
  try {
    if (!APP_ID || !APP_CERTIFICATE) {
      return NextResponse.json(
        { error: 'Agora credentials not configured' },
        { status: 500 }
      );
    }

    const body: TokenGenerationRequest = await request.json();
    const { channelName, uid = 0, role = 'publisher', expirationTime } = body;

    if (!channelName) {
      return NextResponse.json(
        { error: 'Channel name is required' },
        { status: 400 }
      );
    }

    // Token expires in 24 hours by default, or use provided expiration time
    const expirationTimeInSeconds = expirationTime || (Math.floor(Date.now() / 1000) + 86400);
    
    // Generate RTC token
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER,
      expirationTimeInSeconds,
      expirationTimeInSeconds
    );

    return NextResponse.json({
      token,
      appId: APP_ID,
      channelName,
      uid,
      expirationTime: expirationTimeInSeconds
    });

  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}