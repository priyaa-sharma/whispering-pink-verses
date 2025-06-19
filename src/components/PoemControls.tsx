
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Volume2, VolumeX, Save, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PoemControlsProps {
  poem: string;
  emotion: string;
  onSave: () => void;
}

export const PoemControls: React.FC<PoemControlsProps> = ({
  poem,
  emotion,
  onSave
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const speakPoem = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(poem);
      
      // Configure voice for gentle, soft reading
      utterance.rate = 0.7;
      utterance.pitch = 0.9;
      utterance.volume = 0.8;
      
      // Try to find a gentle female voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Karen') ||
        voice.gender === 'female'
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Voice unavailable",
          description: "Your poem couldn't find its voice today.",
          variant: "destructive"
        });
      };

      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Speech not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${emotion.toUpperCase()}\n\n${poem}`);
      toast({
        title: "Copied to heart",
        description: "Your poem is now in your clipboard."
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Couldn't copy your poem. Try selecting and copying manually.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-4 bg-white/40 backdrop-blur-sm border-pink-200/50">
      <div className="space-y-4">
        <p className="text-sm text-gray-600 text-center font-light italic">
          Let your poem whisper itself to you
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button
            onClick={speakPoem}
            variant="outline"
            size="sm"
            className={`border-pink-300 text-pink-700 hover:bg-pink-50 ${
              isSpeaking ? 'bg-pink-100' : ''
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                Listen
              </>
            )}
          </Button>

          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            className="border-pink-300 text-pink-700 hover:bg-pink-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Copy
          </Button>

          <Button
            onClick={onSave}
            variant="outline"
            size="sm"
            className="border-pink-300 text-pink-700 hover:bg-pink-50"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
        
        <p className="text-xs text-center text-gray-500 font-light">
          Save as a love letter to yourself
        </p>
      </div>
    </Card>
  );
};
