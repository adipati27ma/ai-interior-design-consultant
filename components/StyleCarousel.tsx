
import React from 'react';

interface StyleCarouselProps {
  styles: string[];
  onSelect: (style: string) => void;
  activeStyle: string | null;
  disabled?: boolean;
}

export const StyleCarousel: React.FC<StyleCarouselProps> = ({ styles, onSelect, activeStyle, disabled }) => {
  return (
    <div className="flex justify-center">
        <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-4 -mx-4 px-4">
            {styles.map(style => (
                <button
                    key={style}
                    onClick={() => onSelect(style)}
                    disabled={disabled}
                    className={`px-4 py-2 text-sm sm:text-base sm:px-6 sm:py-2.5 font-medium rounded-full shadow-sm whitespace-nowrap transition-all duration-200 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    ${activeStyle === style 
                        ? 'bg-indigo-600 text-white ring-2 ring-offset-2 ring-indigo-500' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    {style}
                </button>
            ))}
        </div>
    </div>
  );
};
   