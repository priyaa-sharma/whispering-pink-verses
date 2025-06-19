
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Key, Eye, EyeOff } from 'lucide-react';
import { getOpenAIKey, setOpenAIKey } from '@/lib/poemGenerator';

interface ApiKeyInputProps {
  onKeySet: () => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const existingKey = getOpenAIKey();
    setHasKey(!!existingKey);
    if (existingKey) {
      setApiKey(existingKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      setOpenAIKey(apiKey.trim());
      setHasKey(true);
      onKeySet();
    }
  };

  const handleRemoveKey = () => {
    setOpenAIKey('');
    setApiKey('');
    setHasKey(false);
    localStorage.removeItem('openai_api_key');
  };

  if (hasKey) {
    return (
      <Card className="p-4 bg-green-50 border-green-200 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">OpenAI API key configured</span>
          </div>
          <Button
            onClick={handleRemoveKey}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Remove
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-yellow-50 border-yellow-200 mb-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-yellow-600" />
          <h3 className="font-medium text-yellow-800">OpenAI API Key Required</h3>
        </div>
        
        <p className="text-sm text-yellow-700">
          To generate AI-powered poems, please enter your OpenAI API key. 
          Get one at <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com</a>
        </p>
        
        <div className="space-y-3">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 pr-10 text-sm border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          <Button
            onClick={handleSaveKey}
            disabled={!apiKey.trim()}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Save API Key
          </Button>
        </div>
        
        <p className="text-xs text-yellow-600">
          Your API key is stored locally in your browser and never sent to our servers.
        </p>
      </div>
    </Card>
  );
};
