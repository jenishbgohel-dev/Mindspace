import { Task, Goal, StrategicObjective, EducationalResource, InspirationQuote, MoodLog } from '../types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Complete Neural Networks Chapter 4 Reading',
    category: 'Academics',
    dueDate: 'Oct 24',
    dueTime: '45 min',
    estimatedMinutes: 45,
    priority: 'Medium',
    completed: true,
    completedAt: '2026-10-24T10:15:00',
  },
  {
    id: 't-2',
    title: 'Draft Research Methodology Outline',
    category: 'Deep Work',
    dueDate: 'Today',
    dueTime: '5:00 PM',
    estimatedMinutes: 60,
    priority: 'High',
    completed: false,
  },
  {
    id: 't-3',
    title: '15-minute Mindfulness & Stretching Session',
    category: 'Wellness',
    dueDate: 'Today',
    dueTime: 'Anytime',
    estimatedMinutes: 15,
    priority: 'Low',
    completed: false,
  },
  {
    id: 't-4',
    title: 'Review Algorithm Flashcards',
    category: 'Revision',
    dueDate: 'Today',
    dueTime: '20 min',
    estimatedMinutes: 20,
    priority: 'Medium',
    completed: false,
  },
  {
    id: 't-5',
    title: 'Quantum Mechanics Problem Set #4',
    category: 'Assignment',
    dueDate: 'Due Today',
    dueTime: '11:59 PM',
    estimatedMinutes: 90,
    priority: 'High',
    completed: false,
  },
  {
    id: 't-6',
    title: 'Midterm Review: Organic Chemistry',
    category: 'Exam',
    dueDate: 'Oct 24',
    dueTime: '2:00 PM',
    estimatedMinutes: 120,
    priority: 'Medium',
    completed: false,
  },
  {
    id: 't-7',
    title: 'Read Chapters 7-9: Macroeconomics',
    category: 'Reading',
    dueDate: 'Due Today',
    dueTime: '5:00 PM',
    estimatedMinutes: 45,
    priority: 'Low',
    completed: false,
  },
  {
    id: 't-8',
    title: 'UX Research Case Study Draft',
    category: 'Assignment',
    dueDate: 'Oct 26',
    dueTime: '11:59 PM',
    estimatedMinutes: 110,
    priority: 'High',
    completed: false,
  },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'g-1',
    categoryTag: 'STEM • FALL SEMESTER',
    title: 'Organic Chemistry Mastery',
    description: 'Master reaction mechanisms, stereochemistry, and synthesis pathways with a target GPA of 3.8+.',
    progressPercentage: 65,
    milestones: [
      {
        id: 'm-1-1',
        title: 'Complete Chapters 1-4 review notes',
        status: 'done',
        completed: true,
      },
      {
        id: 'm-1-2',
        title: 'Score >90% on Mid-Term Mock Test',
        status: 'done',
        completed: true,
      },
      {
        id: 'm-1-3',
        title: 'Synthesize final research paper outline',
        status: 'due',
        dueDate: 'Due Oct 24',
        completed: false,
      },
      {
        id: 'm-1-4',
        title: 'Final comprehensive lab exam preparation',
        status: 'due',
        dueDate: 'Due Nov 15',
        completed: false,
      },
    ],
  },
  {
    id: 'g-2',
    categoryTag: 'COMPUTER SCIENCE • FALL SEMESTER',
    title: 'Data Structures & Algorithms',
    description: 'Implement core structures from scratch and clear 150 LeetCode interview-level problems.',
    progressPercentage: 80,
    milestones: [
      {
        id: 'm-2-1',
        title: 'Trees, Graphs, and BFS/DFS Traversal',
        status: 'done',
        completed: true,
      },
      {
        id: 'm-2-2',
        title: 'Dynamic Programming Patterns Module',
        status: 'done',
        completed: true,
      },
      {
        id: 'm-2-3',
        title: 'System Design Primer & Capstone Project',
        status: 'done',
        completed: true,
      },
      {
        id: 'm-2-4',
        title: 'Mock Technical Interview Series (3/5 completed)',
        status: 'ongoing',
        dueDate: 'Ongoing',
        completed: false,
      },
    ],
  },
];

export const INITIAL_STRATEGIC_OBJECTIVES: StrategicObjective[] = [
  {
    id: 'strat-1',
    title: 'Publish Undergraduate Thesis',
    category: 'Research',
    description: 'Submit peer-reviewed paper on Neural Network efficiency in chemical analysis.',
    progress: 40,
  },
  {
    id: 'strat-2',
    title: 'Secure Summer Tech Fellowship',
    category: 'Internship',
    description: 'Complete portfolio, system design prep, and behavioral interview loops.',
    progress: 85,
  },
  {
    id: 'strat-3',
    title: "Maintain Dean's List Honor",
    category: 'Academic',
    description: 'Sustain cumulative GPA > 3.9 through rigorous final examinations.',
    progress: 90,
  },
];

export const INSPIRATION_QUOTES: InspirationQuote[] = [
  {
    quote: 'Success is the sum of small efforts, repeated day in and day out, toward a grand and worthy horizon.',
    author: 'Robert Collier',
  },
  {
    quote: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Will Durant (on Aristotle)',
  },
  {
    quote: 'Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.',
    author: 'Marie Curie',
  },
  {
    quote: 'The impediment to action advances action. What stands in the way becomes the way.',
    author: 'Marcus Aurelius',
  },
  {
    quote: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
  },
  {
    quote: 'Somewhere, something incredible is waiting to be known.',
    author: 'Carl Sagan',
  },
];

export const INITIAL_RESOURCES: EducationalResource[] = [
  {
    id: 'res-1',
    title: 'Data Structures & Asymptotic Analysis',
    subject: 'Computer Science',
    type: 'PDF Guide',
    badgeMeta: 'PDF Guide • 14 pages',
    author: 'Dr. Alan M.',
    authorRole: 'Senior Faculty',
    description: 'Comprehensive review notes covering Big-O notation, amortized analysis, heaps, and tree balancing algorithms.',
    ctaText: 'Read Guide →',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'res-2',
    title: 'Cognitive Biases & Heuristics Deck',
    subject: 'Psychology',
    type: 'Deck',
    badgeMeta: '120 Cards • Active Recall',
    author: 'Sarah Jenkins',
    authorRole: 'Lead Teaching Assistant',
    description: 'Interactive flashcards designed to master behavioral economics and cognitive heuristics with spaced repetition.',
    ctaText: 'Practice Deck →',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'res-3',
    title: 'Advanced Linear Algebra Seminar Notes',
    subject: 'Mathematics',
    type: 'Live Doc',
    badgeMeta: 'Live Doc • 45 Contributors',
    author: 'Math Study Circle',
    authorRole: 'Peer Research Group',
    description: 'Crowdsourced lecture notes featuring step-by-step eigenvector decompositions, singular value decompositions, and vector spaces.',
    ctaText: 'View Notes →',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'res-4',
    title: 'Post-Modern Narratives in Digital Epochs',
    subject: 'Literature',
    type: 'Article',
    badgeMeta: 'Article • 8 min read',
    author: 'Prof. E. Vance',
    authorRole: 'Humanities Chair',
    description: 'An insightful exploration of how hyper-textuality and non-linear storytelling reframe literary critical discourse in digital culture.',
    ctaText: 'Read Article →',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'res-5',
    title: 'Introduction to Neural Network Architecture',
    subject: 'Computer Science',
    type: 'Video',
    badgeMeta: 'Video • 32 mins',
    author: 'TechEd Hub',
    authorRole: 'Research Lab',
    description: 'Visualizing forward and backward propagation with clean Python and NumPy implementations from first principles.',
    ctaText: 'Watch Video →',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'res-6',
    title: 'Neuroanatomy & Synaptic Transmission',
    subject: 'Psychology',
    type: 'Quiz',
    badgeMeta: 'Interactive Quiz • 50 Qs',
    author: 'NeuroClub',
    authorRole: 'Student Society',
    description: 'Test your understanding of neurotransmitters, receptor sites, and cellular action potentials with diagnostic explanations.',
    ctaText: 'Take Quiz →',
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_MOOD_LOG: MoodLog = {
  id: 'ml-today',
  date: 'Thursday, October 24',
  timeSlot: 'Afternoon Check-in',
  mood: 'good',
  moodEmoji: '🙂',
  energyLevel: 75,
  stressLevel: 30,
  reflection: 'Felt calm and locked in during morning lecture. Heading into Quantum problem set with a clear plan.',
};

export const PAST_WEEK_TREND = [
  { day: 'Mon', score: 68, label: 'Okay', color: '#86efac' },
  { day: 'Tue', score: 82, label: 'Good', color: '#22c55e' },
  { day: 'Wed', score: 70, label: 'Good', color: '#86efac' },
  { day: 'Thu', score: 90, label: 'Great', color: '#15803d', current: true },
  { day: 'Fri', score: 55, label: 'Low', color: '#fca5a5' },
  { day: 'Sat', score: 78, label: 'Good', color: '#86efac' },
  { day: 'Sun', score: 85, label: 'Good', color: '#16a34a' },
];

export const FLASHCARDS_SAMPLE = [
  {
    front: 'Confirmation Bias',
    back: 'The tendency to search for, interpret, favor, and recall information in a way that confirms prior personal beliefs or hypotheses.',
    context: 'Heuristics & Decision Theory',
  },
  {
    front: 'Availability Heuristic',
    back: 'A mental shortcut that relies on immediate examples that come to a given person\'s mind when evaluating a specific topic, concept, or decision.',
    context: 'Tversky & Kahneman (1973)',
  },
  {
    front: 'Anchoring Bias',
    back: 'Disproportionate reliance on the first piece of information encountered (the "anchor") when making decisions or estimations.',
    context: 'Cognitive Psychology',
  },
  {
    front: 'Sunk Cost Fallacy',
    back: 'The phenomenon whereby a person is reluctant to abandon a strategy or course of action because they have heavily invested resources in it.',
    context: 'Behavioral Economics',
  },
  {
    front: 'Dunning-Kruger Effect',
    back: 'A cognitive bias where people with low ability at a task overestimate their competence, while experts may underestimate their relative superiority.',
    context: 'Metacognition',
  },
];

export const QUIZ_SAMPLE = [
  {
    id: 1,
    question: 'Which neurotransmitter is primarily responsible for inhibitory signaling in the central nervous system?',
    options: ['Glutamate', 'GABA (Gamma-Aminobutyric Acid)', 'Dopamine', 'Acetylcholine'],
    correct: 1,
    explanation: 'GABA is the chief inhibitory neurotransmitter in the mammalian central nervous system, reducing neuronal excitability throughout the nervous system.',
  },
  {
    id: 2,
    question: 'During an action potential, rapid depolarization of the axon membrane is caused by:',
    options: ['Efflux of potassium (K+) ions', 'Influx of sodium (Na+) ions', 'Opening of calcium channels', 'Inactivation of chloride gates'],
    correct: 1,
    explanation: 'Voltage-gated sodium channels open rapidly upon reaching threshold voltage, allowing Na+ to rush into the cell down its electrochemical gradient.',
  },
  {
    id: 3,
    question: 'The spatial summation of postsynaptic potentials primarily occurs at which neural locus?',
    options: ['Dendritic spines', 'Axon hillock', 'Synaptic cleft', 'Myelin sheath node of Ranvier'],
    correct: 1,
    explanation: 'The axon hillock acts as the integration center where EPSPs and IPSPs summate to determine if the threshold for firing an action potential is reached.',
  },
];
