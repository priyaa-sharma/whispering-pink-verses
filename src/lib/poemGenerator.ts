
import { pipeline } from '@huggingface/transformers';

// Cache the pipeline to avoid reloading
let textGenerator: any = null;

const initializeGenerator = async () => {
  if (!textGenerator) {
    try {
      // Use a smaller, faster model for better performance
      textGenerator = await pipeline(
        'text-generation',
        'Xenova/gpt2',
        { device: 'webgpu' }
      );
    } catch (error) {
      console.log('WebGPU not available, falling back to CPU');
      textGenerator = await pipeline(
        'text-generation',
        'Xenova/gpt2'
      );
    }
  }
  return textGenerator;
};

const poeticPrompts = [
  "In the depths of {emotion}, I find myself",
  "The world tastes like {emotion} today",
  "My heart speaks in {emotion}, whispering",
  "There's a {emotion} that lives in my chest",
  "I am made of {emotion} and stardust",
  "The {emotion} flows through me like",
  "In this moment of {emotion}, I remember",
  "My soul is painted with {emotion}",
  "The {emotion} becomes a prayer",
  "I hold this {emotion} like a secret"
];

const poemEndings = [
  "\n\nand in this feeling,\nI find myself\ncompletely,\nbeautifully\nhuman.",
  "\n\nthis is how we heal—\none breath,\one heartbeat,\none moment\nat a time.",
  "\n\nand maybe that's enough.\nmaybe I'm enough.\nmaybe this feeling\nis exactly\nwhere I need to be.",
  "\n\nso I let it flow,\nlet it breathe,\nlet it be\nthe poem\nit was always\nmeant to become.",
  "\n\nand I realize—\nI am not broken.\nI am breaking\nopen."
];

export const generatePoem = async (emotion: string): Promise<string> => {
  try {
    const generator = await initializeGenerator();
    
    // Select a random prompt and customize it
    const randomPrompt = poeticPrompts[Math.floor(Math.random() * poeticPrompts.length)];
    const prompt = randomPrompt.replace('{emotion}', emotion.toLowerCase());
    
    // Generate text with poetic parameters
    const result = await generator(prompt, {
      max_new_tokens: 80,
      do_sample: true,
      temperature: 0.8,
      top_p: 0.9,
      repetition_penalty: 1.1,
    });
    
    let generatedText = result[0].generated_text;
    
    // Clean up the generated text
    generatedText = generatedText.replace(prompt, '').trim();
    
    // Format as free verse poetry
    const lines = generatedText.split(/[.!?]+/).filter(line => line.trim().length > 0);
    let poem = lines.slice(0, 4).join(',\n').toLowerCase();
    
    // Add poetic formatting
    poem = poem
      .replace(/\bi\b/g, 'I')
      .replace(/^(\w)/, (match) => match.toUpperCase())
      .replace(/,\n(\w)/g, (match, letter) => ',\n' + letter.toLowerCase());
    
    // Add a beautiful ending
    const randomEnding = poemEndings[Math.floor(Math.random() * poemEndings.length)];
    
    // If the generated poem is too short or not poetic enough, use a fallback
    if (poem.length < 20) {
      poem = createFallbackPoem(emotion);
    } else {
      poem = prompt + '\n\n' + poem + randomEnding;
    }
    
    return poem;
    
  } catch (error) {
    console.error('Error generating poem:', error);
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
