export interface MotivationQuote {
  id: string;
  quote: string;
  author: string;
  context?: string; // e.g. "Theoretical Physicist", "Philosopher & Emperor"
  category: 'focus' | 'resilience' | 'wisdom' | 'discipline' | 'growth' | 'curiosity';
  tag: string;
}

export const MOTIVATION_QUOTES: MotivationQuote[] = [
  {
    id: 'quote-1',
    quote: 'It is not that I have fallen short; it is that I am not yet finished.',
    author: 'Marie Curie',
    context: 'Physicist & Chemist, Nobel Laureate',
    category: 'resilience',
    tag: 'Perseverance',
  },
  {
    id: 'quote-2',
    quote: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Will Durant (on Aristotle)',
    context: 'Philosopher & Historian',
    category: 'discipline',
    tag: 'Daily Habit',
  },
  {
    id: 'quote-3',
    quote: 'The impediment to action advances action. What stands in the way becomes the way.',
    author: 'Marcus Aurelius',
    context: 'Stoic Philosopher & Roman Emperor',
    category: 'resilience',
    tag: 'Obstacle as Fuel',
  },
  {
    id: 'quote-4',
    quote: 'You do not have to see the whole staircase, just take the first step with clarity.',
    author: 'Martin Luther King Jr.',
    context: 'Civil Rights Leader',
    category: 'focus',
    tag: 'Single Step Flow',
  },
  {
    id: 'quote-5',
    quote: 'Deep focus is not the absence of distractions; it is the presence of an engrossing purpose.',
    author: 'Cal Newport',
    context: 'Computer Science Professor & Author',
    category: 'focus',
    tag: 'Deep Work',
  },
  {
    id: 'quote-6',
    quote: 'Live as if you were to die tomorrow. Learn as if you were to live forever.',
    author: 'Mahatma Gandhi',
    context: 'Philosopher & Leader',
    category: 'growth',
    tag: 'Lifelong Curiosity',
  },
  {
    id: 'quote-7',
    quote: 'Intellectual growth should commence at birth and cease only at death.',
    author: 'Albert Einstein',
    context: 'Theoretical Physicist',
    category: 'curiosity',
    tag: 'Intellectual Growth',
  },
  {
    id: 'quote-8',
    quote: 'Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.',
    author: 'John C. Maxwell',
    context: 'Author & Leadership Scholar',
    category: 'discipline',
    tag: 'Consistent Gains',
  },
  {
    id: 'quote-9',
    quote: 'The mind is not a vessel to be filled, but a fire to be kindled.',
    author: 'Plutarch',
    context: 'Greek Historian & Essayist',
    category: 'curiosity',
    tag: 'Inner Spark',
  },
  {
    id: 'quote-10',
    quote: 'Rest is not idleness, and to lie sometimes on the grass under trees is by no means a waste of time.',
    author: 'John Lubbock',
    context: 'Polymath & Naturalist',
    category: 'wisdom',
    tag: 'Mindful Renewal',
  },
  {
    id: 'quote-11',
    quote: 'One must imagine Sisyphus happy, for the struggle itself toward the heights is enough to fill a heart.',
    author: 'Albert Camus',
    context: 'Philosopher & Nobel Laureate',
    category: 'growth',
    tag: 'Academic Momentum',
  },
  {
    id: 'quote-12',
    quote: 'Concentrate all your thoughts upon the work at hand. The sun’s rays do not burn until brought to a focus.',
    author: 'Alexander Graham Bell',
    context: 'Inventor & Scientist',
    category: 'focus',
    tag: 'Laser Focus',
  },
  {
    id: 'quote-13',
    quote: 'Courage does not always roar. Sometimes courage is the quiet voice at the end of the day saying, "I will try again tomorrow."',
    author: 'Mary Anne Radmacher',
    context: 'Author & Artist',
    category: 'resilience',
    tag: 'Quiet Resilience',
  },
  {
    id: 'quote-14',
    quote: 'Study without desire spoils the memory, and it retains nothing that it takes in.',
    author: 'Leonardo da Vinci',
    context: 'Polymath of the High Renaissance',
    category: 'curiosity',
    tag: 'Deliberate Practice',
  },
];
