// For now, we'll provide a simple input for the API key
// In production, this should be stored securely in environment variables
let OPENAI_API_KEY = '';

// Function to set the API key (called from the UI)
export const setOpenAIKey = (key: string) => {
  OPENAI_API_KEY = key;
  localStorage.setItem('openai_api_key', key);
};

// Function to get the API key
export const getOpenAIKey = (): string => {
  if (OPENAI_API_KEY) return OPENAI_API_KEY;
  
  const stored = localStorage.getItem('openai_api_key');
  if (stored) {
    OPENAI_API_KEY = stored;
    return stored;
  }
  
  return '';
};

export const generatePoem = async (emotion: string): Promise<string> => {
  const apiKey = getOpenAIKey();
  
  if (!apiKey) {
    throw new Error('OpenAI API key is required. Please add your API key to generate poems.');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a poetic soul who transforms emotions into beautiful, heartfelt poetry. Write free verse poems that:
            - Are deeply emotional and authentic
            - Use vivid imagery and metaphors
            - Have a gentle, flowing rhythm
            - Are 8-12 lines long
            - Feel like a whispered secret or quiet confession
            - End with hope or acceptance
            - Use line breaks for emotional impact
            
            Write in a style that feels intimate and healing, like the poem is speaking directly to someone's heart.`
          },
          {
            role: 'user',
            content: `Write a beautiful, emotional poem about feeling "${emotion}". Make it personal, raw, and healing. Use vivid imagery and metaphors. Let it flow like water, with natural line breaks that enhance the emotional rhythm.`
          }
        ],
        temperature: 0.8,
        max_tokens: 300,
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.3
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (response.status === 400) {
        throw new Error('Bad request. Please try a different emotion or check your API key.');
      } else {
        throw new Error(`API Error: ${errorData.error?.message || 'Failed to generate poem'}`);
      }
    }

    const data = await response.json();
    const poem = data.choices?.[0]?.message?.content?.trim();
    
    if (!poem) {
      throw new Error('No poem was generated. Please try again.');
    }

    return poem;
    
  } catch (error) {
    console.error('Error generating poem:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    // Fallback for network or unknown errors
    return createFallbackPoem(emotion);
  }
};

const createFallbackPoem = (emotion: string): string => {
  const fallbackPoems = {
    'sad': `In the depths of sadness, I find myself
searching for light in the darkness,
each tear a small rebellion
against the weight of this moment.

and in this feeling,
I find myself
completely,
beautifully
human.`,
    
    'happy': `Joy bubbles up from somewhere deep,
effervescent and golden,
painting my world in colors
I forgot existed.

this is how we heal—
one breath,
one heartbeat,
one moment
at a time.`,
    
    'angry': `Rage burns bright in my chest,
a fire that demands to be seen,
to be heard, to be felt
in all its fierce intensity.

so I let it flow,
let it breathe,
let it be
the poem
it was always
meant to become.`,
    
    'lonely': `Loneliness wraps around me
like a familiar blanket,
heavy with the weight
of all the words unspoken.

and maybe that's enough.
maybe I'm enough.
maybe this feeling
is exactly
where I need to be.`,
    
    'default': `I hold this ${emotion} like a secret,
tender and raw,
letting it flow through me
like water through cupped hands.

and I realize—
I am not broken.
I am breaking
open.`
  };
  
  const emotionKey = Object.keys(fallbackPoems).find(key => 
    emotion.toLowerCase().includes(key)
  ) || 'default';
  
  return fallbackPoems[emotionKey as keyof typeof fallbackPoems];
};
