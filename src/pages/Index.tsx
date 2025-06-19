
import React, { useState } from 'react';
import { EmotionInput } from '@/components/EmotionInput';
import { PoemDisplay } from '@/components/PoemDisplay';
import { PoemControls } from '@/components/PoemControls';
import { Heart, Sparkles } from 'lucide-react';

const Index = () => {
  const [currentEmotion, setCurrentEmotion] = useState('');
  const [currentPoem, setCurrentPoem] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedPoems, setSavedPoems] = useState<Array<{emotion: string, poem: string, timestamp: string}>>([]);

  const handlePoemGenerated = (emotion: string, poem: string) => {
    setCurrentEmotion(emotion);
    setCurrentPoem(poem);
  };

  const handleSavePoem = () => {
    if (currentPoem && currentEmotion) {
      const newPoem = {
        emotion: currentEmotion,
        poem: currentPoem,
        timestamp: new Date().toISOString()
      };
      setSavedPoems(prev => [newPoem, ...prev]);
      
      // Create and download text file
      const blob = new Blob([`Emotion: ${currentEmotion}\n\n${currentPoem}\n\n— Generated on ${new Date().toLocaleDateString()}`], 
        { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotion2poem_${currentEmotion.replace(/\s+/g, '_')}_${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {/* Floating hearts decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <Heart className="absolute top-20 left-10 text-pink-200 w-4 h-4 animate-pulse" />
        <Sparkles className="absolute top-32 right-20 text-rose-300 w-5 h-5 animate-pulse" />
        <Heart className="absolute bottom-32 left-20 text-pink-300 w-3 h-3 animate-pulse" />
        <Sparkles className="absolute bottom-20 right-32 text-rose-200 w-4 h-4 animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="text-pink-400 w-8 h-8 fill-current" />
            <h1 className="text-5xl font-light text-gray-800 tracking-wide">
              Emotion<span className="text-pink-500 font-medium">2</span>Poem
            </h1>
            <Heart className="text-pink-400 w-8 h-8 fill-current" />
          </div>
          <p className="text-lg text-gray-600 font-light italic max-w-2xl mx-auto leading-relaxed">
            Ever wished your feelings could write poems for you?
          </p>
          <p className="text-sm text-pink-500 mt-2 font-light">
            Type your mood, and let the code feel with you
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <EmotionInput 
              onPoemGenerated={handlePoemGenerated}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
            
            {currentPoem && (
              <PoemControls 
                poem={currentPoem}
                emotion={currentEmotion}
                onSave={handleSavePoem}
              />
            )}
          </div>

          {/* Right Column - Poem Display */}
          <div>
            <PoemDisplay 
              poem={currentPoem}
              emotion={currentEmotion}
              isGenerating={isGenerating}
            />
          </div>
        </div>

        {/* Saved Poems Archive */}
        {savedPoems.length > 0 && (
          <div className="mt-16 pt-8 border-t border-pink-200">
            <h3 className="text-2xl font-light text-gray-700 mb-6 text-center">
              Your Poetry Archive
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedPoems.slice(0, 6).map((poem, index) => (
                <div key={index} className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-pink-200/50">
                  <div className="text-sm text-pink-600 font-medium mb-2 capitalize">
                    {poem.emotion}
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {poem.poem.substring(0, 100)}...
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(poem.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-pink-200">
          <p className="text-sm text-gray-500 font-light">
            🔮 Powered by AI • 🎤 Web Speech API • 💌 Save as love letters
          </p>
          <p className="text-xs text-pink-400 mt-2 italic">
            Because sometimes you don't need advice. You just need a poem.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
