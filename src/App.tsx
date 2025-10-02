import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { WorkoutsPage } from './components/WorkoutsPage';
import { TimerPage } from './components/TimerPage';
import { CalendarPage } from './components/CalendarPage';
import { ExercisesLibraryPage } from './components/ExercisesLibraryPage';
import { AuthPage } from './components/AuthPage';
import { OnboardingForm } from './components/OnboardingForm';
import { WorkoutPlanPage } from './components/WorkoutPlanPage';
import { ManualWorkoutPlanPage } from './components/ManualWorkoutPlanPage';
import { StatsPage } from './components/StatsPage';
import { AccountPage } from './components/AccountPage';
import { BottomNavigation } from './components/BottomNavigation';
import { Toaster } from './components/ui/sonner';
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { supabase } from './utils/supabase/client';
import { projectId } from './utils/supabase/info';
import { Workout } from './data/workouts';
import { logger } from './utils/logger';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('loading');
  const [pageStack, setPageStack] = useState<string[]>(['home']);
  const [pendingPage, setPendingPage] = useState<string | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [user, setUser] = useState<any>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    logger.startFunction('App initialization');
    const savedPage = localStorage.getItem('currentPage') || undefined;
    checkAuth(savedPage);
    logger.endFunction('App initialization');
  }, []);

  useEffect(() => {
    if (currentPage !== 'loading') {
      window.scrollTo(0, 0);
    }
  }, [currentPage]);

  const checkAuth = async (savedPage?: string) => {
    logger.startFunction('checkAuth');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        logger.info('Пользователь авторизован', { userId: session.user.id });
        setUser(session.user);
        await checkOnboardingStatus(session.access_token, savedPage);
      } else {
        logger.info('Пользователь не авторизован, переход на страницу авторизации');
        setCurrentPage('auth');
        localStorage.removeItem('currentPage');
      }
    } catch (error) {
      logger.error('Ошибка проверки авторизации', error as Error);
      setCurrentPage('auth');
      localStorage.removeItem('currentPage');
    } finally {
      logger.endFunction('checkAuth');
    }
  };

  const checkOnboardingStatus = async (accessToken: string, savedPage?: string) => {
    logger.startFunction('checkOnboardingStatus', { accessToken: '***' });
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const result = await response.json();
      
      if (response.ok && result.profile?.onboardingCompleted) {
        logger.info('Онбординг завершен, переход на главную страницу');
        const targetPage = savedPage && ['workouts', 'plan', 'calendar', 'exercises', 'stats', 'account', 'timer'].includes(savedPage)
          ? savedPage
          : 'home';
        setCurrentPage(targetPage);
        localStorage.setItem('currentPage', targetPage);
        // Восстанавливаем стек если нужно, но для простоты сбрасываем на текущую
        setPageStack([targetPage]);
      } else {
        logger.info('Требуется онбординг', { hasProfile: !!result.profile });
        setNeedsOnboarding(true);
        setCurrentPage('onboarding');
        localStorage.removeItem('currentPage');
      }
    } catch (error) {
      logger.error('Ошибка проверки онбординга', error as Error);
      // Если сервер недоступен, все равно позволяем войти в приложение
      logger.warn('Сервер недоступен, разрешаем вход без онбординга');
      const targetPage = savedPage && ['workouts', 'plan', 'calendar', 'exercises', 'stats', 'account', 'timer'].includes(savedPage)
        ? savedPage
        : 'home';
      setCurrentPage(targetPage);
      localStorage.setItem('currentPage', targetPage);
      setPageStack([targetPage]);
    } finally {
      logger.endFunction('checkOnboardingStatus');
    }
  };

  const handleAuthSuccess = async (authUser: any) => {
    logger.startFunction('handleAuthSuccess', { userId: authUser.id });
    logger.logUserAction('Успешная авторизация', { userId: authUser.id });
    setUser(authUser);
    // Очищаем localStorage при успешной авторизации нового пользователя
    localStorage.removeItem('completedWorkouts');
    localStorage.removeItem('plannedWorkouts');
    // Получаем актуальную сессию для токена
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      await checkOnboardingStatus(session.access_token);
    } else {
      logger.warn('Не удалось получить токен сессии после авторизации');
      setNeedsOnboarding(true);
      setCurrentPage('onboarding');
    }
    logger.endFunction('handleAuthSuccess');
  };

  const handleOnboardingComplete = () => {
    logger.logUserAction('Завершение онбординга');
    logger.info('Онбординг завершен, переход на главную страницу');
    setNeedsOnboarding(false);
    setCurrentPage('home');
  };

  const handleNavigate = (page: string) => {
    logger.logUserAction('Навигация', { fromPage: currentPage, toPage: page });
    logger.logAppState(`Переход на страницу: ${page}`, { previousPage: currentPage });
    
    if (page === 'back') {
      // Навигация назад
      if (pageStack.length > 1) {
        const newStack = pageStack.slice(0, -1);
        const newPage = newStack[newStack.length - 1];
        setPageStack(newStack);
        setPendingPage(newPage);
        setTimeout(() => {
          setCurrentPage(newPage);
          localStorage.setItem('currentPage', newPage);
          setPendingPage(null);
        }, 300);
      } else {
        const homePage = 'home';
        setPendingPage(homePage);
        setTimeout(() => {
          setCurrentPage(homePage);
          localStorage.setItem('currentPage', homePage);
          setPendingPage(null);
        }, 300);
      }
    } else {
      // Обычная навигация
      setPageStack(prev => [...prev, page]);
      setPendingPage(page);
      setTimeout(() => {
        setCurrentPage(page);
        localStorage.setItem('currentPage', page);
        setPendingPage(null);
      }, 300);
    }
  };

  const handleStartWorkout = (workout: Workout) => {
    logger.logUserAction('Начало тренировки', { workoutId: workout.id, workoutName: workout.name });
    logger.info('Запуск тренировки', { workoutId: workout.id, workoutName: workout.name });
    setCurrentWorkout(workout);
    setCurrentPage('timer');
  };

  const handleLogout = async () => {
    logger.startFunction('handleLogout');
    logger.logUserAction('Выход из аккаунта');
    await supabase.auth.signOut();
    setUser(null);
    setNeedsOnboarding(false);
    // Очищаем localStorage при выходе из аккаунта
    localStorage.removeItem('completedWorkouts');
    localStorage.removeItem('plannedWorkouts');
    setCurrentPage('auth');
    logger.endFunction('handleLogout');
  };

  const renderCurrentPage = () => {
    // if (pendingPage) {
    //   return <LoadingSpinner message="Загрузка страницы..." />;
    // }

    switch (currentPage) {
      case 'loading':
        return <LoadingSpinner message="Загрузка приложения..." />;
      case 'auth':
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
      case 'onboarding':
        return <OnboardingForm user={user} onComplete={handleOnboardingComplete} />;
      case 'home':
        return <HomePage onNavigate={handleNavigate} user={user} onLogout={handleLogout} />;
      case 'workouts':
        return <WorkoutsPage onNavigate={handleNavigate} onStartWorkout={handleStartWorkout} />;
      case 'plan':
        return <WorkoutPlanPage onNavigate={handleNavigate} onStartWorkout={handleStartWorkout} />;
      case 'manual-plan':
        return <ManualWorkoutPlanPage onNavigate={handleNavigate} onStartWorkout={handleStartWorkout} />;
      case 'timer':
        return currentWorkout ? (
          <TimerPage onNavigate={handleNavigate} workout={currentWorkout} />
        ) : (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Тренировка не выбрана</h2>
              <p className="text-muted-foreground mb-4">
                Пожалуйста, выберите тренировку для начала.
              </p>
              <button
                onClick={() => handleNavigate('home')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Вернуться на главную
              </button>
            </div>
          </div>
        );
      case 'calendar':
        return <CalendarPage onNavigate={handleNavigate} />;
      case 'exercises':
        return <ExercisesLibraryPage onNavigate={handleNavigate} onStartWorkout={handleStartWorkout} />;
      case 'stats':
        return <StatsPage onNavigate={handleNavigate} />;
      case 'account':
        return <AccountPage onNavigate={handleNavigate} onLogout={handleLogout} user={user} />;
      default:
        return <HomePage onNavigate={handleNavigate} user={user} onLogout={handleLogout} />;
    }
  };

  const showBottomNav = ['home', 'workouts', 'calendar', 'stats', 'account'].includes(currentPage);
  const showWithPadding = showBottomNav && currentPage !== 'timer';

  // Сохранение стека в localStorage для восстановления
  useEffect(() => {
    if (currentPage !== 'loading' && currentPage !== 'auth' && currentPage !== 'onboarding') {
      localStorage.setItem('pageStack', JSON.stringify(pageStack));
    }
  }, [pageStack]);

  // Восстановление стека при инициализации (после авторизации)
  useEffect(() => {
    const savedStack = localStorage.getItem('pageStack');
    if (savedStack && user) {
      const parsedStack = JSON.parse(savedStack);
      if (parsedStack.length > 0 && parsedStack[parsedStack.length - 1] === currentPage) {
        setPageStack(parsedStack);
      }
    }
  }, [user, currentPage]);

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