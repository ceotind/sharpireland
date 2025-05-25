import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const SharpImageSection = () => {
  const [imageSrc, setImageSrc] = useState('/sharp.webp'); // Default to dark mode image

  useEffect(() => {
    // Function to update image based on theme
    const updateImageBasedOnTheme = () => {
      if (document.documentElement.classList.contains('light')) {
        setImageSrc('/sharp_dark.webp');
      } else {
        setImageSrc('/sharp.webp');
      }
    };

    // Initial check
    updateImageBasedOnTheme();

    // Optional: Observe changes to the class attribute of documentElement
    // This is useful if the theme can be toggled dynamically without a page reload.
    const observer = new MutationObserver(updateImageBasedOnTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background-black)] z-[1]"></div>
      <Image
        alt="Sharp Image"
        loading="lazy"
        width={3456}
        height={1944}
        decoding="async"
        className="w-full h-auto"
        style={{ color: 'transparent' }}
        src={imageSrc}
        key={imageSrc} // Add key to force re-render if src changes, ensuring Next/Image picks up new src
      />
    </div>
  );
};

export default SharpImageSection;
