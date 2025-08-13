// Types for the video calling system

export interface VideoCallSession {
  id: string;
  channelName: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  participants: string[];
  status: 'active' | 'ended' | 'failed';
}

export interface VideoCallError {
  code: string;
  message: string;
  details?: string;
  timestamp: Date;
}

export interface MediaDeviceInfo {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'videoinput' | 'audiooutput';
}

export interface VideoCallSettings {
  video: {
    enabled: boolean;
    quality: 'low' | 'medium' | 'high';
    resolution: {
      width: number;
      height: number;
    };
    frameRate: number;
  };
  audio: {
    enabled: boolean;
    echoCancellation: boolean;
    noiseSuppression: boolean;
    autoGainControl: boolean;
  };
}

export interface ConnectionStats {
  bitrate: {
    send: number;
    receive: number;
  };
  packetLoss: {
    send: number;
    receive: number;
  };
  latency: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface SessionTimerProps {
  onTimeout: () => void;
  maxDuration?: number; // in minutes
  warningThreshold?: number; // in minutes
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  description: string;
  source?: string;
}

export interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData?: {
    channelName: string;
    duration: number;
    endTime: Date;
  };
}

export interface AgoraTokenResponse {
  token: string;
  appId: string;
  channelName: string;
  uid: number | string;
  expirationTime: number;
}

export interface VideoCallMetrics {
  sessionId: string;
  channelName: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  participantCount: number;
  maxParticipants: number;
  connectionQuality: ConnectionStats;
  errors: VideoCallError[];
}

// Event types for video calling
export type VideoCallEvent = 
  | { type: 'session-started'; data: { channelName: string; timestamp: Date } }
  | { type: 'session-ended'; data: { channelName: string; duration: number; timestamp: Date } }
  | { type: 'user-joined'; data: { uid: string; timestamp: Date } }
  | { type: 'user-left'; data: { uid: string; timestamp: Date } }
  | { type: 'media-published'; data: { uid: string; mediaType: 'audio' | 'video'; timestamp: Date } }
  | { type: 'media-unpublished'; data: { uid: string; mediaType: 'audio' | 'video'; timestamp: Date } }
  | { type: 'connection-state-changed'; data: { state: string; reason?: string; timestamp: Date } }
  | { type: 'error-occurred'; data: VideoCallError };

// Component prop types
export interface MeetPageProps {
  initialChannelName?: string;
  autoJoin?: boolean;
  maxDuration?: number;
}

export interface VideoControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onLeaveCall: () => void;
  disabled?: boolean;
}

export interface VideoDisplayProps {
  localVideoRef: React.RefObject<HTMLDivElement>;
  remoteVideoRef: React.RefObject<HTMLDivElement>;
  remoteUsers: unknown[]; // IAgoraRTCRemoteUser[] - using unknown to avoid any type
  isVideoEnabled: boolean;
  channelName: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TokenGenerationRequest {
  channelName: string;
  uid?: string | number;
  role?: 'publisher' | 'subscriber';
  expirationTime?: number;
}

export interface ContactSubmissionRequest {
  name: string;
  email: string;
  phone?: string;
  description: string;
  source?: string;
}

// Environment variable types
export interface EnvironmentConfig {
  NEXT_PUBLIC_AGORA_APP_ID: string;
  AGORA_APP_CERTIFICATE: string;
  NEXT_PUBLIC_API_BASE_URL?: string;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;