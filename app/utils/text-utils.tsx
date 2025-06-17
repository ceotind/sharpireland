// Helper function for splitting text into spans for animations
// Similar to what ArtWorksIT uses for their text animations

import React from 'react';

export function splitText(text: string): React.JSX.Element {
  const words = text.split(' ');
  
  return (
    <>
      {words.map((word, index) => (
        <span 
          key={index} 
          className="inline-block"
        >
          {word.split('').map((char, charIndex) => (
            <span 
              key={`${index}-${charIndex}`} 
              className="inline-block char"
              style={{
                animationDelay: `${(index * 0.05) + (charIndex * 0.03)}s`
              }}
            >
              {char}
            </span>
          ))}
          {index !== words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </>
  );
}
