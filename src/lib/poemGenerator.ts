
export const generatePoem = async (emotion: string): Promise<string> => {
  // Simulate a brief delay to make it feel like generation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return createFallbackPoem(emotion);
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

    'anxious': `My mind races like water
down a mountain stream,
thoughts tumbling over rocks
of what-if and maybe-not.

but here, in this breath,
I am still.
I am enough.
I am home.`,

    'euphoric': `I am electricity and starlight,
every cell singing
a song I've never heard
but somehow always knew.

this is what it means
to be alive,
to feel the universe
dancing in my veins.`,

    'nostalgic': `Memory is a gentle thief,
stealing me away
to golden afternoons
that smell like summer rain.

and I realize—
the past lives in me
not as loss,
but as treasure.`,

    'grateful': `Thank you, whispers my heart
to the morning light,
to the breath in my lungs,
to this moment of being.

gratitude flows like honey,
sweet and golden,
filling all the empty spaces
I didn't know existed.`,
    
    'default': `I hold this ${emotion} like a secret,
tender and raw,
letting it flow through me
like water through cupped hands.

and I realize—
I am not broken.
I am breaking
open.`
  };
  
  // Find matching emotion or use default
  const emotionKey = Object.keys(fallbackPoems).find(key => 
    emotion.toLowerCase().includes(key)
  ) || 'default';
  
  return fallbackPoems[emotionKey as keyof typeof fallbackPoems];
};
