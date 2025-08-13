'use client';

// Dynamic import types for Agora SDK
type AgoraRTC = typeof import('agora-rtc-sdk-ng').default;
type IAgoraRTCClient = import('agora-rtc-sdk-ng').IAgoraRTCClient;
type IMicrophoneAudioTrack = import('agora-rtc-sdk-ng').IMicrophoneAudioTrack;
type ICameraVideoTrack = import('agora-rtc-sdk-ng').ICameraVideoTrack;
type IAgoraRTCRemoteUser = import('agora-rtc-sdk-ng').IAgoraRTCRemoteUser;

let AgoraRTC: AgoraRTC | null = null;

export interface AgoraConfig {
  appId: string;
  channel: string;
  token?: string;
  uid?: string | number | null;
}

export interface LocalTracks {
  audioTrack: IMicrophoneAudioTrack | null;
  videoTrack: ICameraVideoTrack | null;
}

export interface AgoraEvents {
  'user-published': (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => void;
  'user-unpublished': (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => void;
  'user-left': (user: IAgoraRTCRemoteUser) => void;
  'connection-state-change': (curState: string, revState: string, reason?: string) => void;
}

export class AgoraManager {
  private client: IAgoraRTCClient | null = null;
  private localTracks: LocalTracks = {
    audioTrack: null,
    videoTrack: null
  };
  private remoteUsers: Map<string, IAgoraRTCRemoteUser> = new Map();
  private config: AgoraConfig;
  private eventHandlers: Partial<AgoraEvents> = {};

  constructor(config: AgoraConfig) {
    this.config = config;
  }

  // Check mobile browser compatibility
  private checkMobileCompatibility(): void {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Check for HTTPS on mobile
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        throw new Error('HTTPS is required for video calling on mobile devices. Please access the site via HTTPS.');
      }
      
      // Check for getUserMedia support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your mobile browser does not support video calling. Please update your browser or try a different one.');
      }
    }
  }

  // Initialize the Agora client
  async initializeClient(): Promise<void> {
    // Check mobile compatibility first
    this.checkMobileCompatibility();
    
    // Dynamic import of Agora SDK for client-side only
    if (!AgoraRTC) {
      const AgoraModule = await import('agora-rtc-sdk-ng');
      AgoraRTC = AgoraModule.default;
    }

    if (!AgoraRTC) {
      throw new Error('Failed to load Agora SDK');
    }

    // Create client with optimized settings
    this.client = AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'vp8'
    });
    
    // Set up event handlers
    this.client.on('user-published', this.handleUserPublished.bind(this));
    this.client.on('user-unpublished', this.handleUserUnpublished.bind(this));
    this.client.on('user-left', this.handleUserLeft.bind(this));
    this.client.on('connection-state-change', this.handleConnectionStateChange.bind(this));
  }

  // Set event handlers
  on<K extends keyof AgoraEvents>(event: K, handler: AgoraEvents[K]): void {
    this.eventHandlers[event] = handler;
  }

  // Join the channel
  async joinChannel(): Promise<void> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }

    await this.client.join(
      this.config.appId,
      this.config.channel,
      this.config.token || null,
      this.config.uid || null
    );
  }

  // Create local audio and video tracks
  async createLocalTracks(): Promise<LocalTracks> {
    if (!AgoraRTC) {
      throw new Error('Agora SDK not initialized');
    }

    try {
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported. Please use HTTPS or a supported browser.');
      }

      // Detect mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Mobile-optimized settings
        this.localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
          AEC: true, // Acoustic Echo Cancellation
          ANS: true, // Automatic Noise Suppression
          AGC: true  // Automatic Gain Control
        });
        
        this.localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack({
          optimizationMode: 'motion',
          encoderConfig: {
            width: 640,
            height: 480,
            frameRate: 15,
            bitrateMin: 200,
            bitrateMax: 1000
          }
        });
      } else {
        // Desktop settings
        this.localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
          AEC: true,
          ANS: true,
          AGC: true
        });
        
        this.localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack({
          optimizationMode: 'detail',
          encoderConfig: {
            width: 1280,
            height: 720,
            frameRate: 30,
            bitrateMin: 400,
            bitrateMax: 2000
          }
        });
      }

      return this.localTracks;
    } catch (error) {
      console.error('Failed to create local tracks:', error);
      
      // Enhanced error handling
      if (error instanceof Error) {
        if (error.message.includes('Permission denied') || error.message.includes('NotAllowedError')) {
          throw new Error('Camera/microphone access denied. Please grant permissions and try again.');
        } else if (error.message.includes('NotFoundError') || error.message.includes('DevicesNotFoundError')) {
          throw new Error('No camera or microphone found. Please check your device.');
        } else if (error.message.includes('NotSupportedError') || error.message.includes('not_supported')) {
          throw new Error('Your browser does not support video calling. Please use HTTPS or try a different browser.');
        }
      }
      
      throw error;
    }
  }

  // Publish local tracks
  async publishLocalTracks(): Promise<void> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }

    const tracks: (IMicrophoneAudioTrack | ICameraVideoTrack)[] = [];
    if (this.localTracks.audioTrack) tracks.push(this.localTracks.audioTrack);
    if (this.localTracks.videoTrack) tracks.push(this.localTracks.videoTrack);

    if (tracks.length > 0) {
      await this.client.publish(tracks);
    }
  }

  // Play local video in a DOM element
  playLocalVideo(element: HTMLElement): void {
    if (this.localTracks.videoTrack && element) {
      this.localTracks.videoTrack.play(element);
    }
  }

  // Handle remote user published
  private async handleUserPublished(user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video'): Promise<void> {
    if (!this.client) return;

    this.remoteUsers.set(user.uid.toString(), user);
    
    // Subscribe to the remote user
    await this.client.subscribe(user, mediaType);

    // Play the track
    if (mediaType === 'video' && user.videoTrack) {
      // The component will handle playing the video track
    }

    if (mediaType === 'audio' && user.audioTrack) {
      user.audioTrack.play();
    }

    // Call event handler if set
    if (this.eventHandlers['user-published']) {
      this.eventHandlers['user-published'](user, mediaType);
    }
  }

  // Handle remote user unpublished
  private handleUserUnpublished(user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video'): void {
    // Call event handler if set
    if (this.eventHandlers['user-unpublished']) {
      this.eventHandlers['user-unpublished'](user, mediaType);
    }
  }

  // Handle remote user left
  private handleUserLeft(user: IAgoraRTCRemoteUser): void {
    this.remoteUsers.delete(user.uid.toString());
    
    // Call event handler if set
    if (this.eventHandlers['user-left']) {
      this.eventHandlers['user-left'](user);
    }
  }

  // Handle connection state change
  private handleConnectionStateChange(curState: string, revState: string, reason?: string): void {
    console.log(`Connection state changed: ${revState} -> ${curState}`, reason);
    
    // Call event handler if set
    if (this.eventHandlers['connection-state-change']) {
      this.eventHandlers['connection-state-change'](curState, revState, reason);
    }
  }

  // Toggle microphone
  async toggleMicrophone(): Promise<boolean> {
    if (this.localTracks.audioTrack) {
      await this.localTracks.audioTrack.setEnabled(!this.localTracks.audioTrack.enabled);
      return this.localTracks.audioTrack.enabled;
    }
    return false;
  }

  // Toggle camera
  async toggleCamera(): Promise<boolean> {
    if (this.localTracks.videoTrack) {
      await this.localTracks.videoTrack.setEnabled(!this.localTracks.videoTrack.enabled);
      return this.localTracks.videoTrack.enabled;
    }
    return false;
  }

  // Leave channel and cleanup
  async leaveChannel(): Promise<void> {
    // Close local tracks
    if (this.localTracks.audioTrack) {
      this.localTracks.audioTrack.close();
      this.localTracks.audioTrack = null;
    }

    if (this.localTracks.videoTrack) {
      this.localTracks.videoTrack.close();
      this.localTracks.videoTrack = null;
    }

    // Clear remote users
    this.remoteUsers.clear();

    // Leave channel
    if (this.client) {
      await this.client.leave();
      this.client.removeAllListeners();
      this.client = null;
    }
  }

  // Get client instance
  getClient(): IAgoraRTCClient | null {
    return this.client;
  }

  // Get local tracks
  getLocalTracks(): LocalTracks {
    return this.localTracks;
  }

  // Get remote users
  getRemoteUsers(): Map<string, IAgoraRTCRemoteUser> {
    return this.remoteUsers;
  }

  // Get remote users as array
  getRemoteUsersArray(): IAgoraRTCRemoteUser[] {
    return Array.from(this.remoteUsers.values());
  }

  // Check if audio is enabled
  isAudioEnabled(): boolean {
    return this.localTracks.audioTrack?.enabled ?? false;
  }

  // Check if video is enabled
  isVideoEnabled(): boolean {
    return this.localTracks.videoTrack?.enabled ?? false;
  }
}

// Utility function to create AgoraManager instance
export function createAgoraManager(config: AgoraConfig): AgoraManager {
  return new AgoraManager(config);
}

// Export types for use in components
export type { IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack };