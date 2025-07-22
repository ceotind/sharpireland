import React from 'react';
import Image from 'next/image';

const SharpImageSection = () => {
  const imageSrc = '/sharp.webp'; // Always use dark mode image

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
      />
    </div>
  );
};

export default SharpImageSection;
