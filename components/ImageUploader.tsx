
import React, { useState, useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (base64Image: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('File is too large. Please upload an image under 4MB.');
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.onerror = () => {
        setError('Failed to read file.');
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('border-indigo-600', 'bg-indigo-50');
    const file = event.dataTransfer.files?.[0];
     if (file) {
       handleFileChange({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  }, [onImageUpload]);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.add('border-indigo-600', 'bg-indigo-50');
  };
  
  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('border-indigo-600', 'bg-indigo-50');
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Redesign Your Space in Seconds</h2>
      <p className="mt-4 text-lg leading-8 text-gray-600">Upload a photo of your room to get started. We'll use AI to visualize it in different interior design styles.</p>
      
      <div 
        className="mt-10 flex justify-center"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
      >
        <label htmlFor="file-upload" className="relative cursor-pointer w-full max-w-lg p-8 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors duration-200 group">
          <div className="space-y-1 text-center">
             <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
             </svg>
            <div className="flex text-sm text-gray-600">
              <span className="relative font-semibold text-indigo-600 group-hover:text-indigo-500">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
              </span>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 4MB</p>
          </div>
        </label>
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
};
   