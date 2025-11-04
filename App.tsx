
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { StyleCarousel } from './components/StyleCarousel';
import { ImageComparator } from './components/ImageComparator';
import { ChatInterface } from './components/ChatInterface';
import { generateStyledImage, refineImage, getChatResponse } from './services/geminiService';
import { ChatMessage, Role } from './types';
import { DESIGN_STYLES } from './constants';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (base64Image: string) => {
    setOriginalImage(base64Image);
    setGeneratedImage(null);
    setActiveStyle(null);
    setChatHistory([]);
    setError(null);
  };

  const handleStyleSelect = useCallback(async (style: string) => {
    if (!originalImage) return;
    setActiveStyle(style);
    setIsLoadingImage(true);
    setError(null);
    setGeneratedImage(null);
    setChatHistory([]);

    try {
      const newImage = await generateStyledImage(originalImage, style);
      setGeneratedImage(newImage);
      setChatHistory([
        { role: Role.MODEL, content: `I've reimagined your room in a ${style} style! What do you think? You can ask me to make changes or suggest furniture.` }
      ]);
    } catch (err) {
      console.error(err);
      setError('Failed to generate image. Please try another style or image.');
    } finally {
      setIsLoadingImage(false);
    }
  }, [originalImage]);

  const handleSendMessage = async (message: string) => {
    if (!generatedImage) return;

    const newUserMessage: ChatMessage = { role: Role.USER, content: message };
    setChatHistory(prev => [...prev, newUserMessage]);
    setIsLoadingChat(true);
    setError(null);
    
    // Simple heuristic to decide if it's an image editing request
    const isEditRequest = /\b(add|change|make|remove|replace|put|turn)\b/i.test(message);

    try {
      if (isEditRequest) {
        const refinedImg = await refineImage(generatedImage, message);
        setGeneratedImage(refinedImg);
        const modelResponse: ChatMessage = { role: Role.MODEL, content: "Here's the updated design. What's next?" };
        setChatHistory(prev => [...prev, modelResponse]);
      } else {
        const chatResponse = await getChatResponse(chatHistory, message, activeStyle || 'the selected style');
        const modelResponse: ChatMessage = { role: Role.MODEL, content: chatResponse };
        setChatHistory(prev => [...prev, modelResponse]);
      }
    } catch (err) {
      console.error(err);
      const errorResponse: ChatMessage = { role: Role.MODEL, content: 'Sorry, I encountered an error. Please try again.' };
      setChatHistory(prev => [...prev, errorResponse]);
      setError('An error occurred with the AI. Please try again.');
    } finally {
      setIsLoadingChat(false);
    }
  };
  
  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setActiveStyle(null);
    setChatHistory([]);
    setError(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Interior Design Consultant</h1>
          {originalImage && (
             <button onClick={handleReset} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
              Start Over
            </button>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="flex flex-col gap-12">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">1. Choose a Style</h2>
              <div className="pt-2">
                <StyleCarousel styles={DESIGN_STYLES} onSelect={handleStyleSelect} activeStyle={activeStyle} disabled={isLoadingImage} />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center" role="alert">
                <strong className="font-bold">Oops!</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            )}
            
            {isLoadingImage && (
              <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-8 min-h-[50vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-lg text-gray-600">Generating your new room... This can take a moment.</p>
              </div>
            )}

            {generatedImage && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-center">2. Compare Your New Design</h2>
                  <ImageComparator original={originalImage} generated={generatedImage} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-center">3. Refine and Chat</h2>
                  <ChatInterface 
                    messages={chatHistory} 
                    onSendMessage={handleSendMessage} 
                    isLoading={isLoadingChat} 
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
