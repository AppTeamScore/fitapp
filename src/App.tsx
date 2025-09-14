import { useState, useEffect } from 'react';
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './components/LoadingSpinner';
import React from 'react';

const HomePage = lazy(() => import('./components/HomePage'));
const WorkoutsPage = lazy(() => import('./components/WorkoutsPage'));
const TimerPage = lazy(() => import('./components/TimerPage'));
const CalendarPage = lazy(() => import('./components/CalendarPage'));
const ExercisesLibraryPage = lazy(() => import('./components/ExercisesLibraryPage'));
const AuthPage = lazy(() => import('./components/AuthPage'));
const OnboardingForm = lazy(() => import('./components/OnboardingForm'));
const WorkoutPlanPage = lazy(() => import('./components/WorkoutPlanPage'));
const ManualWorkoutPlanPage = lazy(() => import('./components/ManualWorkoutPlanPage'));
const StatsPage = lazy(() => import('./components/StatsPage'));
const AccountPage = lazy(() => import('./components/AccountPage'));
import { BottomNavigation } from './components/BottomNavigation';
import { Toaster } from './components/ui/sonner';
import ErrorBoundary from './components/ErrorBoundary';
// Removed duplicate import
import { supabase } from './utils/supabase/client';
import { projectId } from './utils/supabase/info';
import { Workout } from './data/workouts';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('loading');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [user, setUser] = useState<any>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        await checkOnboardingStatus(session.access_token);
      } else {
        setCurrentPage('auth');
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error);
      setCurrentPage('auth');
    }
  };

  const checkOnboardingStatus = async (accessToken: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const result = await response.json();
      
      if (response.ok && result.profile?.onboardingCompleted) {
        setCurrentPage('home');
      } else {
        setNeedsOnboarding(true);
        setCurrentPage('onboarding');
      }
    } catch (error) {
      console.error('Ошибка проверки онбординга:', error);
      // Если сервер недоступен, все равно позволяем войти в приложение
      setCurrentPage('home');
    }
  };

  const handleAuthSuccess = async (authUser: any) => {
    setUser(authUser);
    // Получаем актуальную сессию для токена
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      await checkOnboardingStatus(session.access_token);
    } else {
      setNeedsOnboarding(true);
      setCurrentPage('onboarding');
    }
  };

  const handleOnboardingComplete = () => {
    setNeedsOnboarding(false);
    setCurrentPage('home');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleStartWorkout = (workout: Workout) => {
    setCurrentWorkout(workout);
    setCurrentPage('timer');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setNeedsOnboarding(false);
    setCurrentPage('auth');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'loading':
        return <LoadingSpinner message="Загрузка приложения..." />;
      case 'auth':
        return (
          <Suspense fallback={<LoadingSpinner message="Загрузка..." />}>
            <AuthPage onAuthSuccess={handleAuthSuccess} />
          </Suspense>
        );
      case 'onboarding':
        return (
          <Suspense fallback={<LoadingSpinner message="Загрузка..." />}>
            <OnboardingForm user={user} onComplete={handleOnboardingComplete} />
          </Suspense>
        );
      case 'home':
        return (
          <Suspense fallback={<LoadingSpinner message="Загрузка..." />}>
            <HomePage onNavigate={handleNavigate} user={user} onLogout={handleLogout} />
          </Suspense>
        );
      case 'workouts':
        return (
          <Suspense fallback={<LoadingSpinner message="Загрузка..." />}>
            <WorkoutsPage onNavigate={handleNavigate} onStartWorkout={handleStartWorkout} />
          </Suspense>
        );
      case 'plan':
        return (
          <Suspense fallback={<LoadingSpinner message="Загрузка..." />}>
            <WorkoutPlanPage onNavigate={handleNavigate} onStartWorkout={handleStartWorkout} />
          </Suspense>
        );
      case 'manual-plan':
        return (
          <Suspense fallback={<LoadingSpinner message="Загрузка..." />}>
            <ManualWorkoutPlanPage onNavigate={handleNavigate} onStartWorkout={handleStartWorkout} />
          </Suspense>
        );
      case 'timer':
        return (
          <Suspense fallback={<LoadingSpinner message="Загрузка..." />}>
            <TimerPage onNavigate={handleNavigate} workout={currentWorkout || {}} />
          </Suspense>
        );
      case 'calendar':
        return (
          <Suspense fallback={<LoadingSpinner message="Загрузка..." />}>
            <CalendarPage onNavigate={handleNavigate} />
          </Suspense>
        );
      case 'exercises':
        return (
          <Suspense fallback={<LoadingSpinner message="Загрузка..." />}>
            <ExercisesLibraryPage onNavigate={handleNavigate} onStartWorkout={handleStartWorkout} />
          </Suspense>
        );
      case 'stats':
        return (
          <Suspense fallback={<LoadingSpinner message="Загрузка..." />}>
            <StatsPage onNavigate={handleNavigate} />
          </Suspense>
        );
      case 'account':
        return (
          <Suspense fallback={<LoadingSpinner message="Загрузка..." />}>
            <AccountPage onNavigate={handleNavigate} onLogout={handleLogout} user={user} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingSpinner message="Загрузка..." />}>
            <HomePage onNavigate={handleNavigate} user={user} onLogout={handleLogout} />
          </Suspense>
        );
    }
  };

  const showBottomNav = ['home', 'workouts', 'calendar', 'stats', 'account'].includes(currentPage);
  const showWithPadding = showBottomNav && currentPage !== 'timer';

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto bg-background min-h-screen relative">
          <div className={showWithPadding ? 'pb-20' : ''}>
            {renderCurrentPage()}
          </div>
          {showBottomNav && (
            <BottomNavigation currentPage={currentPage} onNavigate={handleNavigate} />
          )}
        </div>
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}