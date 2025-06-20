import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Sparkles, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePoem } from "@/lib/poemGenerator"; // This is the working local one

interface EmotionInputProps {
  onPoemGenerated: (emotion: string, poem: string) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export const EmotionInput: React.FC<EmotionInputProps> = ({
  onPoemGenerated,
  isGenerating,
  setIsGenerating
}) => {
  const [emotion, setEmotion] = useState('');
  const { toast } = useToast();

  const emotionSuggestions = [
    'melancholy', 'euphoric', 'anxious', 'nostalgic', 'tender',
    'rage', 'lost', 'hopeful', 'devastated', 'alive', 'numb',
    'yearning', 'grateful', 'haunted', 'electric'
  ];

  const handleGenerate = async () => {
    if (!emotion.trim()) {
      toast({
        title: "Share your feeling",
        description: "Tell me what's in your heart...",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const poem = await generatePoem(emotion); // 💘 From local file
      onPoemGenerated(emotion, poem);
      toast({
        title: "Poetry born",
        description: "Your feelings have become words.",
      });
    } catch (error) {
      console.error('Error generating poem:', error);
      const errorMessage = error instanceof Error ? error.message : 'The poetry muse is sleeping. Try again in a moment.';
      toast({
        title: "Something went wrong",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 bg-white/60 backdrop-blur-sm border-pink-200/50 shadow-lg">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-700 mb-2">
            How are you feeling?
          </h2>
          <p className="text-sm text-gray-500 italic">
            Let your emotions flow into words...
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            placeholder="Describe your mood, your heart, your moment...

Maybe you're 'drowning in nostalgia' or 'electric with possibility' or just 'tender and tired'..."
            className="min-h-32 resize-none border-pink-200 focus:border-pink-400 focus:ring-pink-300 bg-white/50 placeholder:text-gray-400 placeholder:italic"
            maxLength={200}
          />
          <div className="text-xs text-gray-400 text-right">
            {emotion.length}/200
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600 font-light">Or try one of these feelings:</p>
          <div className="flex flex-wrap gap-2">
            {emotionSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setEmotion(suggestion)}
                className="px-3 py-1 text-xs rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors border border-pink-200/50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !emotion.trim()}
          className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white border-0 shadow-lg disabled:opacity-50 py-6 text-lg font-light"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 animate-spin" />
              Crafting your poem...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-current" />
              Transform into Poetry
            </div>
          )}
        </Button>
      </div>
    </Card>
  );
};
