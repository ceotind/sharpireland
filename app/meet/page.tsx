'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneX, Microphone, MicrophoneSlash, Camera, CameraSlash } from '@phosphor-icons/react';
import SessionTimer from './components/SessionTimer';
import ContactModal from './components/ContactModal';
import { AgoraManager, createAgoraManager, IAgoraRTCRemoteUser } from './lib/agora';
import { MeetPageProps, AgoraTokenResponse } from './types';

// Agora configuration
const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';

export default function MeetPage({ initialChannelName, autoJoin = false }: MeetPageProps) {
  const [agoraManager, setAgoraManager] = useState<AgoraManager | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [channelName, setChannelName] = useState(initialChannelName || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [, setSessionEnded] = useState(false);
  const [error, setError] = useState<string>('');

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-join if specified
    if (autoJoin && initialChannelName && !isJoined && !isConnecting) {
      joinChannel();
    }

    return () => {
      // Cleanup on unmount
      if (agoraManager) {
        agoraManager.leaveChannel().catch(console.error);
      }
    };
  }, [agoraManager, autoJoin, initialChannelName, isJoined, isConnecting]);

  const joinChannel = async () => {
    if (!channelName.trim()) return;

    setIsConnecting(true);
    setError('');
    
    try {
      // Get token from API
      const response = await fetch('/api/agora/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelName }),
      });

      if (!response.ok) {
        throw new Error('Failed to get token');
      }

      const result: AgoraTokenResponse = await response.json();
      const { token } = result;

      // Create Agora manager
      const manager = createAgoraManager({
        appId: APP_ID,
        channel: channelName,
        token,
        uid: null
      });

      // Set up event handlers
      manager.on('user-published', (user, mediaType) => {
        if (mediaType === 'video' && user.videoTrack && remoteVideoRef.current) {
          user.videoTrack.play(remoteVideoRef.current);
        }
        
        setRemoteUsers(prevUsers => {
          const existingUser = prevUsers.find(u => u.uid === user.uid);
          if (existingUser) {
            return prevUsers.map(u => u.uid === user.uid ? user : u);
          }
          return [...prevUsers, user];
        });
      });

      manager.on('user-unpublished', (user) => {
        setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
      });

      manager.on('user-left', (user) => {
        setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
      });

      // Initialize and join
      await manager.initializeClient();
      await manager.joinChannel();
      
      // Create and publish local tracks
      await manager.createLocalTracks();
      await manager.publishLocalTracks();

      // Play local video
      if (localVideoRef.current) {
        manager.playLocalVideo(localVideoRef.current);
      }

      setAgoraManager(manager);
      setIsJoined(true);
      setIsVideoEnabled(manager.isVideoEnabled());
      setIsAudioEnabled(manager.isAudioEnabled());

    } catch (error) {
      console.error('Failed to join channel:', error);
      setError(error instanceof Error ? error.message : 'Failed to join the meeting. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const leaveChannel = async () => {
    if (!agoraManager) return;

    try {
      await agoraManager.leaveChannel();
      
      setAgoraManager(null);
      setIsJoined(false);
      setRemoteUsers([]);
      setSessionEnded(true);
      setShowContactModal(true);
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  };

  const toggleVideo = async () => {
    if (!agoraManager) return;

    try {
      const enabled = await agoraManager.toggleCamera();
      setIsVideoEnabled(enabled);
    } catch (error) {
      console.error('Failed to toggle video:', error);
    }
  };

  const toggleAudio = async () => {
    if (!agoraManager) return;

    try {
      const enabled = await agoraManager.toggleMicrophone();
      setIsAudioEnabled(enabled);
    } catch (error) {
      console.error('Failed to toggle audio:', error);
    }
  };

  const handleSessionTimeout = () => {
    leaveChannel();
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Join Video Call</h1>
            <p className="text-gray-600">Enter a channel name to start your meeting</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="channelName" className="block text-sm font-medium text-gray-700 mb-2">
                Channel Name
              </label>
              <input
                id="channelName"
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Enter channel name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                disabled={isConnecting}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && channelName.trim() && !isConnecting) {
                    joinChannel();
                  }
                }}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={joinChannel}
              disabled={!channelName.trim() || isConnecting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5" />
                  Join Call
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Session Timer */}
      <div className="absolute top-4 left-4 z-10">
        <SessionTimer onTimeout={handleSessionTimeout} />
      </div>

      {/* Video Container */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <div className="absolute inset-0">
          {remoteUsers.length > 0 ? (
            <div
              ref={remoteVideoRef}
              className="w-full h-full bg-gray-800 flex items-center justify-center"
            >
              {/* Remote video will be rendered here */}
            </div>
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-lg">Waiting for others to join...</p>
                <p className="text-gray-400 mt-2">Channel: {channelName}</p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
          <div
            ref={localVideoRef}
            className="w-full h-full"
          >
            {/* Local video will be rendered here */}
          </div>
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <CameraSlash className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${
              isAudioEnabled
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-red-100 hover:bg-red-200 text-red-600'
            }`}
          >
            {isAudioEnabled ? (
              <Microphone className="w-6 h-6" />
            ) : (
              <MicrophoneSlash className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoEnabled
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-red-100 hover:bg-red-200 text-red-600'
            }`}
          >
            {isVideoEnabled ? (
              <Camera className="w-6 h-6" />
            ) : (
              <CameraSlash className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={leaveChannel}
            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
          >
            <PhoneX className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
}