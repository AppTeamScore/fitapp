import { useState, useEffect } from 'react';
import { X, Trophy, Target, Flame, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { projectId } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';

interface NotificationBannerProps {
  className?: string;
}

interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'milestone' | 'tip';
  title: string;
  message: string;
  icon: React.ReactNode;
  color: string;
  dismissible: boolean;
}

export function NotificationBanner({ className = '' }: NotificationBannerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [planData, setPlanData] = useState<any>(null);
  const [weeklyGoal, setWeeklyGoal] = useState(5);

  useEffect(() => {
    loadWorkoutPlan();
    generateNotifications();
  }, []);

  useEffect(() => {
    if (notifications.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
      }, 15000); // Меняем уведомление каждые 5 секунд

      return () => clearInterval(interval);
    }
  }, [notifications.length]);

  const generateNotifications = () => {
    const completedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyWorkouts = completedWorkouts.filter((workout: any) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= weekAgo && workoutDate <= today;
    }).length;

    const totalWorkouts = completedWorkouts.length;
    
    const newNotifications: Notification[] = [];

    // Достижения
    if (totalWorkouts === 1) {
      newNotifications.push({
        id: 'first-workout',
        type: 'achievement',
        title: 'Первая тренировка!',
        message: 'Поздравляем с началом пути к здоровью!',
        icon: <Trophy className="w-5 h-5" />,
        color: 'from-primary to-primary/80',
        dismissible: true
      });
    }

    if (weeklyWorkouts >= weeklyGoal) {
      newNotifications.push({
        id: 'weekly-goal',
        type: 'achievement',
        title: 'Цель недели достигнута!',
        message: 'Отличная работа! Продолжайте в том же духе.',
        icon: <Target className="w-5 h-5" />,
        color: 'from-primary to-primary/80',
        dismissible: true
      });
    }

    // Напоминания
    if (weeklyWorkouts < weeklyGoal) {
      const remaining = weeklyGoal - weeklyWorkouts;
      newNotifications.push({
        id: 'weekly-reminder',
        type: 'reminder',
        title: 'До цели недели осталось немного!',
        message: `Выполните еще ${remaining} тренировок для достижения цели.`,
        icon: <Target className="w-5 h-5" />,
        color: 'from-primary to-primary/80',
        dismissible: false
      });
    }

    // Мотивационные советы
    const tips = [
      {
        title: 'Совет дня',
        message: 'Регулярность важнее интенсивности. Лучше заниматься по 20 минут каждый день.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Знаете ли вы?',
        message: 'Планирование тренировок повышает вероятность их выполнения на 80%.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Факт дня',
        message: 'Утренние тренировки повышают метаболизм на 15% в течение всего дня.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Совет эксперта',
        message: 'Не забывайте о разминке! 5-10 минут разминки снижают риск травм на 60%.',
        icon: <Target className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Интересно знать',
        message: 'Вода - лучший друг спортсмена. Обезвоживание снижает производительность на 20%.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Мотивация',
        message: 'Каждая тренировка делает вас сильнее. Даже маленькие шаги ведут к большим результатам.',
        icon: <Trophy className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Факт дня',
        message: 'Сон критически важен для восстановления. 7-9 часов сна улучшают результаты на 30%.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Совет дня',
        message: 'Слушайте свою музыку! Тренировки под любимые треки на 15% эффективнее.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Знаете ли вы?',
        message: 'Силовые тренировки увеличивают костную массу и снижают риск остеопороза.',
        icon: <Target className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Интересно знать',
        message: 'Кардио тренировки улучшают работу сердца и снижают риск сердечно-сосудистых заболеваний.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Мотивация',
        message: 'Ваша цель - не идеал, а прогресс. Хвалите себя за каждый шаг вперед!',
        icon: <Trophy className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Факт дня',
        message: 'Упражнения с собственным весом так же эффективны, как и с отягощениями для новичков.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Совет эксперта',
        message: 'Дышите правильно! Правильное дыхание повышает выносливость на 25%.',
        icon: <Target className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Знаете ли вы?',
        message: 'Регулярные тренировки улучшают качество сна и помогают быстрее засыпать.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Интересно знать',
        message: 'Физическая активность снижает уровень стресса на 40% благодаря эндорфинам.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Мотивация',
        message: 'Тело может все, что разум ему позволяет. Думайте позитивно и действуйте!',
        icon: <Trophy className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Факт дня',
        message: 'Тренировки в паре повышают мотивацию на 70% и делают процесс веселее.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Совет дня',
        message: 'Не пропускайте восстановление! Отдельные дни отдыха важны для прогресса.',
        icon: <Target className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Знаете ли вы?',
        message: 'Силовые тренировки ускоряют метаболизм даже в состоянии покоя.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Интересно знать',
        message: 'Упражнения на баланс улучшают координацию и снижают риск падений.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Мотивация',
        message: 'Каждая тренировка - это инвестиция в ваше будущее. Вы стоите этих усилий!',
        icon: <Trophy className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      },
      {
        title: 'Факт дня',
        message: 'Регулярные тренировки улучшают память и концентрацию на 20%.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-primary to-primary/80'
      }
    ];

    if (Math.random() > 0.2) {
      const tip = tips[Math.floor(Math.random() * tips.length)];
      newNotifications.push({
        id: 'tip-' + Date.now(),
        type: 'tip',
        title: tip.title,
        message: tip.message,
        icon: tip.icon,
        color: tip.color,
        dismissible: true
      });
    }

    setNotifications(newNotifications);
  };

  const loadWorkoutPlan = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
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
        
        // Рассчитываем количество тренировочных дней в плане пользователя
        const trainingDaysInPlan = result.planData.plan?.weekPlan?.filter((day: any) =>
          day.exercises && day.exercises.length > 0
        ).length || 0;
        
        // Используем количество тренировочных дней в плане как цель недели, но не менее 3
        const goal = trainingDaysInPlan > 0 ? Math.max(3, trainingDaysInPlan) : 5;
        setWeeklyGoal(goal);
      }
    } catch (error) {
      console.error('Ошибка загрузки плана:', error);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => {
      const filtered = prev.filter(n => n.id !== id);
      if (currentIndex >= filtered.length) {
        setCurrentIndex(0);
      }
      return filtered;
    });
    
    // Сохраняем в localStorage, что уведомление было отклонено
    const dismissedNotifications = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
    dismissedNotifications.push(id);
    localStorage.setItem('dismissedNotifications', JSON.stringify(dismissedNotifications));
  };

  if (notifications.length === 0) return null;

  const currentNotification = notifications[currentIndex];
  if (!currentNotification) return null;

  return (
    <Card className={`overflow-hidden relative ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${currentNotification.color} opacity-10`}></div>
      <CardContent className="p-4 relative">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-full bg-gradient-to-r ${currentNotification.color} text-white`}>
              {currentNotification.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm">{currentNotification.title}</h4>
                <Badge 
                  variant="outline" 
                  className="text-xs px-2 py-0"
                >
                  {currentNotification.type === 'achievement' ? 'Достижение' :
                   currentNotification.type === 'reminder' ? 'Напоминание' :
                   currentNotification.type === 'milestone' ? 'Веха' : 'Совет'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentNotification.message}
              </p>
            </div>
          </div>
          
          {currentNotification.dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissNotification(currentNotification.id)}
              className="shrink-0 h-8 w-8 p-0 hover:bg-background/80"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Индикатор множественных уведомлений */}
        {notifications.length > 1 && (
          <div className="flex items-center justify-center gap-1 mt-3">
            {notifications.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-primary' 
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}