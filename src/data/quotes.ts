export interface DailyQuote {
  id: string;
  quote: string;
  author: string;
  authorTitle?: string;
  category: 'Focus' | 'Perseverance' | 'Curiosity' | 'Mindfulness' | 'Growth';
}

export const STATIC_QUOTES: DailyQuote[] = [
  {
    id: 'q-1',
    quote: 'Success is the sum of small efforts, repeated day in and day out, toward a grand and worthy horizon.',
    author: 'Robert Collier',
    authorTitle: 'Author & Self-Development Pioneer',
    category: 'Perseverance',
  },
  {
    id: 'q-2',
    quote: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Will Durant',
    authorTitle: 'Philosopher & Historian (on Aristotle)',
    category: 'Growth',
  },
  {
    id: 'q-3',
    quote: 'Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.',
    author: 'Marie Curie',
    authorTitle: 'Two-time Nobel Laureate in Physics & Chemistry',
    category: 'Curiosity',
  },
  {
    id: 'q-4',
    quote: 'The impediment to action advances action. What stands in the way becomes the way.',
    author: 'Marcus Aurelius',
    authorTitle: 'Stoic Philosopher & Roman Emperor',
    category: 'Perseverance',
  },
  {
    id: 'q-5',
    quote: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
    authorTitle: 'Philosopher & Educator',
    category: 'Perseverance',
  },
  {
    id: 'q-6',
    quote: 'Somewhere, something incredible is waiting to be known.',
    author: 'Carl Sagan',
    authorTitle: 'Astronomer & Science Communicator',
    category: 'Curiosity',
  },
  {
    id: 'q-7',
    quote: 'Deep work is the ability to focus without distraction on a cognitively demanding task. It is a superpower in our modern world.',
    author: 'Cal Newport',
    authorTitle: 'Computer Science Professor & Author',
    category: 'Focus',
  },
  {
    id: 'q-8',
    quote: 'Do not wait to strike till the iron is hot; but make it hot by striking.',
    author: 'William Butler Yeats',
    authorTitle: 'Poet & Dramatist',
    category: 'Growth',
  },
  {
    id: 'q-9',
    quote: 'An investment in knowledge always pays the best interest.',
    author: 'Benjamin Franklin',
    authorTitle: 'Polymath & Founding Father',
    category: 'Growth',
  },
  {
    id: 'q-10',
    quote: 'Peace comes from within. Cultivate stillness amidst demanding days.',
    author: 'Siddhartha Gautama',
    authorTitle: 'Ancient Philosopher & Spiritual Teacher',
    category: 'Mindfulness',
  },
  {
    id: 'q-11',
    quote: 'Live as if you were to die tomorrow. Learn as if you were to live forever.',
    author: 'Mahatma Gandhi',
    authorTitle: 'Civil Rights Leader & Thinker',
    category: 'Growth',
  },
  {
    id: 'q-12',
    quote: 'Simplicity is the prerequisite for reliability and clear thinking.',
    author: 'Edsger W. Dijkstra',
    authorTitle: 'Turing Award Laureate & Computer Scientist',
    category: 'Focus',
  },
  {
    id: 'q-13',
    quote: 'The mind is not a vessel that needs filling, but wood that needs igniting.',
    author: 'Plutarch',
    authorTitle: 'Greek Biographer & Essayist',
    category: 'Curiosity',
  },
  {
    id: 'q-14',
    quote: 'In the middle of difficulty lies hidden opportunity and growth.',
    author: 'Albert Einstein',
    authorTitle: 'Theoretical Physicist',
    category: 'Perseverance',
  },
  {
    id: 'q-15',
    quote: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    author: 'James Clear',
    authorTitle: 'Author of Atomic Habits',
    category: 'Focus',
  },
  {
    id: 'q-16',
    quote: 'Almost everything will work again if you unplug it for a few minutes, including you.',
    author: 'Anne Lamott',
    authorTitle: 'Novelist & Non-Fiction Author',
    category: 'Mindfulness',
  },
  {
    id: 'q-17',
    quote: 'The secret of getting ahead is getting started. Break complex challenges into small, manageable steps.',
    author: 'Mark Twain',
    authorTitle: 'Author & Satirist',
    category: 'Focus',
  },
  {
    id: 'q-18',
    quote: 'Nature does not hurry, yet everything is accomplished.',
    author: 'Lao Tzu',
    authorTitle: 'Philosopher & Founder of Taoism',
    category: 'Mindfulness',
  },
  {
    id: 'q-19',
    quote: 'The only limit to our realization of tomorrow will be our doubts of today.',
    author: 'Franklin D. Roosevelt',
    authorTitle: '32nd U.S. President',
    category: 'Perseverance',
  },
  {
    id: 'q-20',
    quote: 'Curiosity is the wick in the candle of learning.',
    author: 'William Arthur Ward',
    authorTitle: 'Educator & Inspirational Author',
    category: 'Curiosity',
  },
];

/**
 * Returns the index of today's quote based on day-of-year so that every day has a designated quote.
 */
export function getDayOfYearIndex(date: Date = new Date(), totalQuotes: number = STATIC_QUOTES.length): number {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return Math.abs(dayOfYear) % totalQuotes;
}

/**
 * Retrieves the daily quote for the current day from the static list.
 */
export function getDailyInspirationalQuote(date: Date = new Date()): DailyQuote {
  const index = getDayOfYearIndex(date, STATIC_QUOTES.length);
  return STATIC_QUOTES[index];
}
