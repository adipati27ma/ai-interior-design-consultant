
import React, { useState } from 'react';

interface ImageComparatorProps {
  original: string;
  generated: string;
}

export const ImageComparator: React.FC<ImageComparatorProps> = ({ original, generated }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(event.target.value));
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-lg overflow-hidden shadow-2xl group">
      <img src={original} alt="Original room" className="absolute inset-0 w-full h-full object-cover" />
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden" 
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={generated} alt="AI generated room" className="absolute inset-0 w-full h-full object-cover" />
      </div>
       <div 
        className="absolute top-0 bottom-0 bg-white w-1 cursor-ew-resize opacity-50 group-hover:opacity-100 transition-opacity" 
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="bg-white rounded-full h-10 w-10 absolute top-1/2 -translate-y-1/2 -ml-5 flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full cursor-ew-resize opacity-0"
        aria-label="Image comparison slider"
      />
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">ORIGINAL</div>
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded" style={{ opacity: sliderPosition > 50 ? 1 : 0 }}>GENERATED</div>
    </div>
  );
};
   