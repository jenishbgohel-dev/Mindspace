/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewType, Task, Goal, EducationalResource } from './types';
import {
  INITIAL_TASKS,
  INITIAL_GOALS,
  INITIAL_STRATEGIC_OBJECTIVES,
  INITIAL_RESOURCES,
} from './data/initialData';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  subscribeToUserTasks,
  saveUserTask,
  deleteUserTask,
  subscribeToUserGoals,
  saveUserGoal,
} from './firebase/firestoreService';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './components/views/LoginView';
import { DashboardView } from './components/views/DashboardView';
import { TaskPlannerView } from './components/views/TaskPlannerView';
import { GoalTrackerView } from './components/views/GoalTrackerView';
import { MoodWellnessView } from './components/views/MoodWellnessView';
import { EducationalResourcesView } from './components/views/EducationalResourcesView';
import { AnalyticsView } from './components/views/AnalyticsView';

// Modals
import { AddTaskModal } from './components/modals/AddTaskModal';
import { AddGoalModal } from './components/modals/AddGoalModal';
import { UploadResourceModal } from './components/modals/UploadResourceModal';
import { FlashcardModal } from './components/modals/FlashcardModal';
import { QuizModal } from './components/modals/QuizModal';
import { ResourceReaderModal } from './components/modals/ResourceReaderModal';
import { WellnessResourceModal } from './components/modals/WellnessResourceModal';
import { AuthModal } from './components/modals/AuthModal';
import { LogoutConfirmModal } from './components/modals/LogoutConfirmModal';
import { AmbientSoundsCard } from './components/common/AmbientSoundsCard';
import { X } from 'lucide-react';

function MindSpaceApp() {
  const { currentUser, isAuthenticated, isAuthLoading, logout } = useAuth();
  const authStreak = currentUser?.streakCount ?? 5;

  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Persistent app data in localStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('mindspace_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('mindspace_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [resources, setResources] = useState<EducationalResource[]>(() => {
    const saved = localStorage.getItem('mindspace_resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  // Modals state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isUploadResourceOpen, setIsUploadResourceOpen] = useState(false);

  // Interactive learning modals
  const [activeFlashcardDeck, setActiveFlashcardDeck] = useState<string | null>(null);
  const [activeQuizTitle, setActiveQuizTitle] = useState<string | null>(null);
  const [readingResource, setReadingResource] = useState<EducationalResource | null>(null);
  const [activeWellnessModalId, setActiveWellnessModalId] = useState<string | null>(null);
  const [isAmbientDrawerOpen, setIsAmbientDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('mindspace_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('mindspace_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('mindspace_resources', JSON.stringify(resources));
  }, [resources]);

  // Firestore Real-Time Subscriptions for Authenticated User
  useEffect(() => {
    if (!currentUser?.id) return;
    const unsubTasks = subscribeToUserTasks(
      currentUser.id,
      (cloudTasks) => {
        if (cloudTasks && cloudTasks.length > 0) {
          setTasks(cloudTasks);
        } else if (tasks.length > 0) {
          // Initial migration of local template tasks to user's Firestore cloud storage
          tasks.forEach((t) => saveUserTask(currentUser.id, t));
        }
      },
      (err) => console.warn('Firestore tasks sync error:', err)
    );

    const unsubGoals = subscribeToUserGoals(
      currentUser.id,
      (cloudGoals) => {
        if (cloudGoals && cloudGoals.length > 0) {
          setGoals(cloudGoals);
        } else if (goals.length > 0) {
          // Initial migration of local template goals to user's Firestore cloud storage
          goals.forEach((g) => saveUserGoal(currentUser.id, g));
        }
      },
      (err) => console.warn('Firestore goals sync error:', err)
    );

    return () => {
      unsubTasks();
      unsubGoals();
    };
  }, [currentUser?.id]);

  // If user logs out, return to login page
  const handleLogout = () => {
    logout();
    setIsLogoutConfirmOpen(false);
  };

  // Task Handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, completed: !t.completed };
          if (currentUser?.id) {
            saveUserTask(currentUser.id, updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks((prev) => [task, ...prev]);
    if (currentUser?.id) {
      saveUserTask(currentUser.id, task);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (currentUser?.id) {
      deleteUserTask(currentUser.id, taskId);
    }
  };

  // Milestone Handlers
  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal;
        const updatedMilestones = goal.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const progressPercentage = Math.round(
          (completedCount / updatedMilestones.length) * 100
        );
        const updatedGoal = {
          ...goal,
          milestones: updatedMilestones,
          progressPercentage,
        };
        if (currentUser?.id) {
          saveUserGoal(currentUser.id, updatedGoal);
        }
        return updatedGoal;
      })
    );
  };

  const handleAddGoal = (newGoal: Goal) => {
    setGoals((prev) => [newGoal, ...prev]);
    if (currentUser?.id) {
      saveUserGoal(currentUser.id, newGoal);
    }
  };

  const handleUploadResource = (newRes: EducationalResource) => {
    setResources((prev) => [newRes, ...prev]);
  };

  // Click handler on Resource item
  const handleOpenResource = (resource: EducationalResource) => {
    if (resource.type === 'Deck') {
      setActiveFlashcardDeck(resource.title);
    } else if (resource.type === 'Quiz') {
      setActiveQuizTitle(resource.title);
    } else {
      setReadingResource(resource);
    }
  };

  // Handle auth initial resolution
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-600 tracking-wide uppercase">Connecting to MindSpace...</p>
      </div>
    );
  }

  // FIRST PAGE IS USER LOGIN PAGE:
  // If not authenticated, require user login
  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenAmbientControl={() => setIsAmbientDrawerOpen(true)}
        onOpenLogoutConfirm={() => setIsLogoutConfirmOpen(true)}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigate={setCurrentView}
          onOpenLogoutConfirm={() => setIsLogoutConfirmOpen(true)}
        />

        {/* View Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onOpenAddTask={() => setIsAddTaskOpen(true)}
              onNavigate={setCurrentView}
              streakCount={authStreak}
            />
          )}

          {currentView === 'planner' && (
            <TaskPlannerView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onOpenAddTask={() => setIsAddTaskOpen(true)}
            />
          )}

          {currentView === 'goals' && (
            <GoalTrackerView
              goals={goals}
              strategicObjectives={INITIAL_STRATEGIC_OBJECTIVES}
              onToggleMilestone={handleToggleMilestone}
              onOpenAddGoal={() => setIsAddGoalOpen(true)}
            />
          )}

          {currentView === 'wellness' && (
            <MoodWellnessView
              onOpenWellnessModal={(id) => setActiveWellnessModalId(id)}
            />
          )}

          {currentView === 'resources' && (
            <EducationalResourcesView
              resources={resources}
              onOpenResource={handleOpenResource}
              onOpenUpload={() => setIsUploadResourceOpen(true)}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView tasks={tasks} />
          )}
        </main>
      </div>

      {/* Ambient Sound drawer modal when clicked from sidebar */}
      {isAmbientDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden p-6 relative">
            <button
              onClick={() => setIsAmbientDrawerOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <AmbientSoundsCard />
          </div>
        </div>
      )}

      {/* App Modals */}
      <AuthModal />

      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirmedLogout={handleLogout}
      />

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTask}
      />

      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onAddGoal={handleAddGoal}
      />

      <UploadResourceModal
        isOpen={isUploadResourceOpen}
        onClose={() => setIsUploadResourceOpen(false)}
        onUpload={handleUploadResource}
      />

      <FlashcardModal
        isOpen={Boolean(activeFlashcardDeck)}
        onClose={() => setActiveFlashcardDeck(null)}
        title={activeFlashcardDeck || undefined}
      />

      <QuizModal
        isOpen={Boolean(activeQuizTitle)}
        onClose={() => setActiveQuizTitle(null)}
        title={activeQuizTitle || undefined}
      />

      <ResourceReaderModal
        isOpen={Boolean(readingResource)}
        onClose={() => setReadingResource(null)}
        resource={readingResource}
      />

      <WellnessResourceModal
        isOpen={Boolean(activeWellnessModalId)}
        onClose={() => setActiveWellnessModalId(null)}
        resourceId={activeWellnessModalId}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MindSpaceApp />
    </AuthProvider>
  );
}
