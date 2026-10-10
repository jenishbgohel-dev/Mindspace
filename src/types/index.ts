export type ViewType = 'dashboard' | 'planner' | 'goals' | 'wellness' | 'resources' | 'analytics' | 'admin';

export interface LoginHistoryEvent {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  providerId: string;
  timestamp?: any;
  createdAt: string;
  userAgent?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalLogins: number;
  loginsToday: number;
  loginsThisWeek: number;
  uniqueUsersActive: number;
}

export interface AdminCheckResult {
  isAdmin: boolean;
  hasCustomClaim: boolean;
  hasFirestoreDoc: boolean;
  checkedAt: string;
  error?: string;
}

export interface Task {
  id: string;
  title: string;
  category: 'Academics' | 'Deep Work' | 'Wellness' | 'Revision' | 'Assignment' | 'Exam' | 'Reading';
  dueDate: string;
  dueTime?: string;
  estimatedMinutes?: number;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  completedAt?: string;
}

export interface Milestone {
  id: string;
  title: string;
  status: 'done' | 'due' | 'ongoing';
  dueDate?: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  categoryTag: string; // e.g. "STEM • FALL SEMESTER"
  title: string;
  description: string;
  progressPercentage: number;
  milestones: Milestone[];
  color?: string;
}

export interface StrategicObjective {
  id: string;
  title: string;
  category: 'Research' | 'Internship' | 'Academic' | 'Career';
  description: string;
  progress: number;
}

export interface MoodLog {
  id: string;
  date: string;
  timeSlot: string;
  mood: 'great' | 'good' | 'okay' | 'low';
  moodEmoji: string;
  energyLevel: number; // 0 - 100
  stressLevel: number; // 0 - 100
  reflection: string;
}

export interface EducationalResource {
  id: string;
  title: string;
  subject: 'Computer Science' | 'Psychology' | 'Mathematics' | 'Literature';
  type: 'PDF Guide' | 'Deck' | 'Live Doc' | 'Article' | 'Video' | 'Quiz';
  badgeMeta: string; // e.g. "14 pages", "120 Cards • Active Recall", "45 Contributors", "8 min read", "32 mins", "50 Qs"
  author: string;
  authorRole?: string;
  description: string;
  ctaText: string;
  imageUrl?: string;
  isBookmarked?: boolean;
}

export interface AmbientSoundTrack {
  id: 'rain' | 'forest' | 'coffee' | 'ocean';
  name: string;
  iconName: string;
  isPlaying: boolean;
  volume: number;
}

export interface InspirationQuote {
  quote: string;
  author: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  major: string;
  academicYear?: string;
  avatarUrl: string;
  streakCount: number;
  initials?: string;
}

