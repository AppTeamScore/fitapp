import { useState, useEffect } from "react";
import { Calendar, Timer, TrendingUp, Dumbbell, BookOpen, Target, LogOut, User, BarChart3, Settings, Play, Flame, Trophy, Zap, BicepsFlexed} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ProgressWidget } from "./ProgressWidget";
import { NotificationBanner } from "./NotificationBanner";
import { eventBus } from "../utils/events";
import { logger } from "../utils/logger";
import { projectId } from "../utils/supabase/info";
import { supabase } from "../utils/supabase/client";

interface HomePageProps {
  onNavigate: (page: string) => void;
  user: any;
  onLogout: () => void;
}

export function HomePage({ onNavigate, user, onLogout }: HomePageProps) {
  const [stats, setStats] = useState([
    { title: "Тренировок в неделю", value: "0", icon: Dumbbell },
    { title: "Минут активности", value: "0", icon: Timer },
    { title: "Дней подряд", value: "0", icon: TrendingUp },
  ]);
  const [planData, setPlanData] = useState<any>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  useEffect(() => {
    loadUserStats();
    loadWorkoutPlan();
    
    // Подписываемся на событие очистки статистики
    const unsubscribeStatsCleared = eventBus.on('stats:cleared', () => {
      logger.info('Получено уведомление об очистке статистики, обновляем данные');
      loadUserStats();
    });
    
    return () => {
      unsubscribeStatsCleared();
    };
  }, []);

  const loadUserStats = () => {
    // Получаем данные из localStorage или устанавливаем значения по умолчанию
    const completedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Подсчет тренировок за последние 7 дней
    const weeklyWorkouts = completedWorkouts.filter((workout: any) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= weekAgo && workoutDate <= today;
    }).length;

    // Подсчет общего времени активности за неделю (предполагаем 45 мин на тренировку)
    const totalMinutes = weeklyWorkouts * 45;

    // Подсчет дней подряд
    let consecutiveDays = 0;
    const sortedWorkouts = completedWorkouts
      .map((w: any) => new Date(w.date))
      .sort((a: Date, b: Date) => b.getTime() - a.getTime());

    if (sortedWorkouts.length > 0) {
      const lastWorkout = sortedWorkouts[0];
      const diffDays = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) { // Если последняя тренировка была сегодня или вчера
        consecutiveDays = 1;
        
        // Считаем последовательные дни
        for (let i = 1; i < sortedWorkouts.length; i++) {
          const currentWorkout = sortedWorkouts[i];
          const prevWorkout = sortedWorkouts[i - 1];
          const daysDiff = Math.floor((prevWorkout.getTime() - currentWorkout.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 1) {
            consecutiveDays++;
          } else {
            break;
          }
        }
      }
    }

    setStats([
      { title: "Тренировок в неделю", value: weeklyWorkouts.toString(), icon: Dumbbell },
      { title: "Минут активности", value: totalMinutes.toString(), icon: Timer },
      { title: "Дней подряд", value: consecutiveDays.toString(), icon: TrendingUp },
    ]);
  };

  const loadWorkoutPlan = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setIsLoadingPlan(false);
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/workout-plan`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const result = await response.json();
      
      if (response.ok && result.planData) {
        setPlanData(result.planData);
      }
    } catch (error) {
      console.error('Ошибка загрузки плана:', error);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // Рассчитываем количество тренировочных дней в плане пользователя
  const getTrainingDaysInPlan = () => {
    if (!planData?.plan?.weekPlan) return 0;
    
    return planData.plan.weekPlan.filter((day: any) =>
      day.exercises && day.exercises.length > 0
    ).length;
  };

  // Используем количество тренировочных дней в плане как цель недели, но не менее 3
  const trainingDaysInPlan = getTrainingDaysInPlan();
  const weeklyGoal = trainingDaysInPlan > 0 ? Math.max(3, trainingDaysInPlan) : 5;
  const currentWeeklyWorkouts = parseInt(stats[0].value);
  const weeklyProgress = Math.min((currentWeeklyWorkouts / weeklyGoal) * 100, 100);

  const getTodayDate = () => {
    return new Date().toLocaleDateString('ru-RU', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Заголовок с градиентом */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Твой Фитнес AI</h1>
              <p className="text-primary-foreground/90">
                Привет, {user?.user_metadata?.name || 'Пользователь'}!
              </p>
              <p className="text-sm text-primary-foreground/70 mt-1">
                {getTodayDate()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onNavigate('account')} className="text-primary-foreground hover:bg-primary-foreground/10">
                <User className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-primary-foreground hover:bg-primary-foreground/10">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Еженедельная цель */}
          <NotificationBanner />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Уведомления */}

        {/* Виджет прогресса */}
        <ProgressWidget />

        {/* Статистика */}
        {/* <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  <div className={`p-2 rounded-full ${
                    index === 0 ? 'bg-blue-100 text-blue-600' :
                    index === 1 ? 'bg-green-100 text-green-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground leading-tight">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div> */}

        {/* Быстрый старт */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Быстрый старт</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => onNavigate('workouts')}
              className="h-20 flex-col gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
            >
              <Play className="h-6 w-6" />
              <span className="text-sm">Готовые тренировки</span>
            </Button>
            <Button 
              onClick={() => onNavigate('plan')}
              className="h-20 flex-col gap-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0"
            >
              <Target className="h-6 w-6" />
              <span className="text-sm">Индивидуальный план</span>
            </Button>
          </div>
        </div>

        {/* Навигация */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Разделы</h2>
          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={() => onNavigate('calendar')}
              className="h-14 text-left justify-start bg-card hover:bg-accent text-foreground"
              variant="outline"
            >
              <div className="flex items-center">
                <div className="p-2 mr-3 rounded-lg bg-emerald-100 text-emerald-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Календарь тренировок</p>
                  <p className="text-sm text-muted-foreground">Планируй и отслеживай</p>
                </div>
              </div>
            </Button>
            <Button 
              onClick={() => onNavigate('exercises')}
              className="h-14 text-left justify-start bg-card hover:bg-accent text-foreground"
              variant="outline"
            >
              <div className="flex items-center">
                <div className="p-2 mr-3 rounded-lg bg-amber-100 text-amber-600">
                  <BicepsFlexed className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Библиотека упражнений</p>
                  <p className="text-sm text-muted-foreground">140+ упражнений</p>
                </div>
              </div>
            </Button>
            <Button
              onClick={() => onNavigate('stats')}
              className="h-14 text-left justify-start bg-card hover:bg-accent text-foreground"
              variant="outline"
            >
              <div className="flex items-center">
                <div className="p-2 mr-3 rounded-lg bg-rose-100 text-rose-600">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Статистика и аналитика</p>
                  <p className="text-sm text-muted-foreground">Отслеживай прогресс</p>
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Отступ снизу для безопасной зоны */}
        <div className="h-4"></div>
      </div>
    </div>
  );
}