
import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, Heart } from 'lucide-react';

interface PoemDisplayProps {
  poem: string;
  emotion: string;
  isGenerating: boolean;
}

export const PoemDisplay: React.FC<PoemDisplayProps> = ({
  poem,
  emotion,
  isGenerating
}) => {
  if (isGenerating) {
    return (
      <Card className="p-8 bg-white/60 backdrop-blur-sm border-pink-200/50 shadow-lg min-h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-pink-400 mx-auto animate-spin" />
          <div className="space-y-2">
            <p className="text-gray-600 font-light">Weaving words from your heart...</p>
            <p className="text-sm text-pink-500 italic">This might take a moment</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!poem) {
    return (
      <Card className="p-8 bg-white/60 backdrop-blur-sm border-pink-200/50 shadow-lg min-h-96 flex items-center justify-center">
        <div className="text-center space-y-4 opacity-60">
          <Heart className="w-12 h-12 text-pink-300 mx-auto" />
          <div className="space-y-2">
            <p className="text-gray-500 font-light">Your poem will appear here</p>
            <p className="text-sm text-pink-400 italic">Like a whispered secret in the dark</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-white/60 backdrop-blur-sm border-pink-200/50 shadow-lg">
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full">
            <Heart className="w-4 h-4 text-pink-500 fill-current" />
            <span className="text-pink-700 font-medium capitalize text-sm">
              {emotion}
            </span>
          </div>
        </div>

        <div className="poem-container">
          <div 
            className="prose prose-pink max-w-none text-gray-700 leading-relaxed font-light text-lg whitespace-pre-line"
            style={{ 
              fontFamily: 'Georgia, "Times New Roman", serif',
              lineHeight: '1.8'
            }}
          >
            {poem}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <div className="flex gap-1">
            <Heart className="w-3 h-3 text-pink-300 fill-current" />
            <Heart className="w-3 h-3 text-pink-400 fill-current" />
            <Heart className="w-3 h-3 text-pink-300 fill-current" />
          </div>
        </div>
      </div>
    </Card>
  );
};
