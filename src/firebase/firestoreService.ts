import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  getDocs,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { Task, Goal, LoginHistoryEvent, AdminCheckResult, User } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

export function subscribeToUserTasks(
  userId: string,
  onTasksUpdated: (tasks: Task[]) => void,
  onError?: (err: any) => void
) {
  const tasksColPath = `users/${userId}/tasks`;
  const tasksRef = collection(db, 'users', userId, 'tasks');

  const unsubscribe = onSnapshot(
    tasksRef,
    (snapshot) => {
      const items: Task[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || '',
          category: data.category || 'Academics',
          priority: data.priority || 'Medium',
          completed: Boolean(data.completed),
          dueDate: data.dueDate || '',
          dueTime: data.dueTime || '',
          estimatedMinutes: data.estimatedMinutes || 30,
          courseCode: data.courseCode || '',
          notes: data.notes || '',
        });
      });
      onTasksUpdated(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, tasksColPath);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

export async function saveUserTask(userId: string, task: Task): Promise<void> {
  const path = `users/${userId}/tasks/${task.id}`;
  try {
    const taskDocRef = doc(db, 'users', userId, 'tasks', task.id);
    await setDoc(
      taskDocRef,
      {
        id: task.id,
        userId,
        title: task.title,
        category: task.category,
        priority: task.priority,
        completed: task.completed,
        dueDate: task.dueDate || '',
        dueTime: task.dueTime || '',
        estimatedMinutes: task.estimatedMinutes || 30,
        courseCode: task.courseCode || '',
        notes: task.notes || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteUserTask(userId: string, taskId: string): Promise<void> {
  const path = `users/${userId}/tasks/${taskId}`;
  try {
    const taskDocRef = doc(db, 'users', userId, 'tasks', taskId);
    await deleteDoc(taskDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToUserGoals(
  userId: string,
  onGoalsUpdated: (goals: Goal[]) => void,
  onError?: (err: any) => void
) {
  const goalsColPath = `users/${userId}/goals`;
  const goalsRef = collection(db, 'users', userId, 'goals');

  const unsubscribe = onSnapshot(
    goalsRef,
    (snapshot) => {
      const items: Goal[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || '',
          category: data.category || 'Academics',
          targetDate: data.targetDate || '',
          progressPercentage: typeof data.progressPercentage === 'number' ? data.progressPercentage : 0,
          color: data.color || '#2E6B4D',
          milestones: Array.isArray(data.milestones) ? data.milestones : [],
        });
      });
      onGoalsUpdated(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, goalsColPath);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

export async function saveUserGoal(userId: string, goal: Goal): Promise<void> {
  const path = `users/${userId}/goals/${goal.id}`;
  try {
    const goalDocRef = doc(db, 'users', userId, 'goals', goal.id);
    await setDoc(
      goalDocRef,
      {
        id: goal.id,
        userId,
        title: goal.title,
        category: goal.category,
        targetDate: goal.targetDate || '',
        progressPercentage: goal.progressPercentage,
        color: goal.color || '#2E6B4D',
        milestones: goal.milestones || [],
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Requirement 3 & 4: Record a new login event in the "loginHistory" collection.
 * Saves authenticated user's UID, email, display name, provider ID, and server-generated timestamp.
 * Handles failed writes gracefully per Requirement 11.
 */
export async function recordLoginEvent(user: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  providerData?: Array<{ providerId: string }>;
}): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    const historyCol = collection(db, 'loginHistory');
    const providerId = user.providerData?.[0]?.providerId || 'google.com';
    const email = user.email || '';
    const displayName = user.displayName || email.split('@')[0] || 'Google User';

    const eventPayload = {
      userId: user.uid,
      email,
      displayName,
      providerId,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'MindSpace Web Client',
    };

    const docRef = await addDoc(historyCol, eventPayload);
    return { success: true, eventId: docRef.id };
  } catch (error: any) {
    console.error('Failed to record login history event in Firestore:', error);
    return {
      success: false,
      error: error?.message || 'Failed to write login event record',
    };
  }
}

/**
 * Requirement 7, 8 & 9: Server-side authorization verification.
 * Evaluates both:
 * 1. Firebase Admin SDK Custom Claims (request.auth.token.admin == true or role == 'admin')
 * 2. Firestore protected /admins/{uid} registry document.
 */
export async function checkUserAdminStatus(user: FirebaseUser | null): Promise<AdminCheckResult> {
  if (!user) {
    return {
      isAdmin: false,
      hasCustomClaim: false,
      hasFirestoreDoc: false,
      checkedAt: new Date().toISOString(),
    };
  }

  let hasCustomClaim = false;
  let hasFirestoreDoc = false;
  let errorMsg: string | undefined;

  try {
    // 1. Force refresh token result to inspect custom claims from server
    const tokenResult = await user.getIdTokenResult(true);
    if (tokenResult.claims.admin === true || tokenResult.claims.role === 'admin') {
      hasCustomClaim = true;
    }
  } catch (err: any) {
    console.warn('Could not inspect Firebase ID token claims:', err);
  }

  try {
    // 2. Check /admins/{uid} collection in Firestore
    const adminDocRef = doc(db, 'admins', user.uid);
    const snap = await getDoc(adminDocRef);
    if (snap.exists() && (snap.data().role === 'admin' || snap.data().isAdmin === true)) {
      hasFirestoreDoc = true;
    }
  } catch (err: any) {
    // Expected to fail with permission-denied if user is not authorized or collection empty
    if (!err?.message?.includes('permission-denied') && !err?.code?.includes('permission-denied')) {
      errorMsg = err?.message;
    }
  }

  const isAdmin = hasCustomClaim || hasFirestoreDoc;

  return {
    isAdmin,
    hasCustomClaim,
    hasFirestoreDoc,
    checkedAt: new Date().toISOString(),
    error: errorMsg,
  };
}

/**
 * Requirement 5 & 6: Subscribe to login history records with real-time updates.
 */
export function subscribeToLoginHistory(
  onUpdate: (events: LoginHistoryEvent[]) => void,
  onError: (error: any) => void
) {
  const historyCol = collection(db, 'loginHistory');
  const q = query(historyCol, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const records: LoginHistoryEvent[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        let formattedDate = data.createdAt;
        if (!formattedDate && data.timestamp?.toDate) {
          formattedDate = data.timestamp.toDate().toISOString();
        } else if (!formattedDate) {
          formattedDate = new Date().toISOString();
        }

        records.push({
          id: d.id,
          userId: data.userId || '',
          email: data.email || '',
          displayName: data.displayName || 'Google Scholar',
          providerId: data.providerId || 'google.com',
          timestamp: data.timestamp,
          createdAt: formattedDate,
          userAgent: data.userAgent || 'MindSpace Client',
        });
      });
      onUpdate(records);
    },
    (error) => {
      onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Requirement 5: Fetch total registered users count
 */
export async function fetchTotalRegisteredUsers(): Promise<number> {
  try {
    const usersCol = collection(db, 'users');
    const snap = await getDocs(usersCol);
    return snap.size;
  } catch (err) {
    console.warn('Unable to list users for count:', err);
    return 0;
  }
}

/**
 * Fetch registered users list for admin review
 */
export async function fetchRegisteredUsersList(): Promise<User[]> {
  try {
    const usersCol = collection(db, 'users');
    const snap = await getDocs(usersCol);
    const users: User[] = [];
    snap.forEach((d) => {
      const data = d.data();
      users.push({
        id: d.id,
        name: data.name || 'Scholar',
        email: data.email || '',
        major: data.major || 'Academic Studies',
        academicYear: data.academicYear || 'Fall 2026',
        avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(d.id)}`,
        streakCount: typeof data.streakCount === 'number' ? data.streakCount : 5,
        initials: (data.name || 'MS').slice(0, 2).toUpperCase(),
      });
    });
    return users;
  } catch (err) {
    console.warn('Could not retrieve registered users:', err);
    return [];
  }
}
