'use client';

import { useState, useEffect } from 'react';
import { Clock, Warning } from '@phosphor-icons/react';
import { SessionTimerProps } from '../types';

interface ExtendedSessionTimerProps extends SessionTimerProps {
  warningThreshold?: number; // in minutes, default 5
}

export default function SessionTimer({ onTimeout, maxDuration = 30, warningThreshold = 5 }: ExtendedSessionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(maxDuration * 60); // Convert to seconds
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        
        // Show warning when threshold reached
        if (newTime <= (warningThreshold * 60) && !isWarning) {
          setIsWarning(true);
        }
        
        // Call timeout when time reaches 0
        if (newTime <= 0) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout, isWarning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    return ((maxDuration * 60 - timeLeft) / (maxDuration * 60)) * 100;
  };

  return (
    <div className={`
      bg-white rounded-lg shadow-lg p-3 border-2 transition-all duration-300
      ${isWarning ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}
    `}>
      <div className="flex items-center gap-2">
        {isWarning ? (
          <Warning className="w-5 h-5 text-orange-600" />
        ) : (
          <Clock className="w-5 h-5 text-gray-600" />
        )}
        
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${
            isWarning ? 'text-orange-800' : 'text-gray-800'
          }`}>
            {formatTime(timeLeft)}
          </span>
          
          {isWarning && (
            <span className="text-xs text-orange-600">
              Session ending soon
            </span>
          )}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
        <div 
          className={`h-1 rounded-full transition-all duration-1000 ${
            isWarning ? 'bg-orange-500' : 'bg-blue-500'
          }`}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>
      
      {isWarning && (
        <div className="mt-2 text-xs text-orange-700">
          Your session will end automatically when the timer reaches zero.
        </div>
      )}
    </div>
  );
}