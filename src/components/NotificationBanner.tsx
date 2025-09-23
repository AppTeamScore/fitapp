import { useState, useEffect } from 'react';
import { X, Trophy, Target, Flame, Calendar, Heart, Dumbbell, Apple, Clock, Sun, Moon, Star, Shield, Leaf, Brain, Music } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

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

  useEffect(() => {
    generateNotifications();
  }, []);

  useEffect(() => {
    if (notifications.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
      }, 5000); // Меняем уведомление каждые 5 секунд

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
        color: 'from-yellow-500 to-orange-500',
        dismissible: true
      });
    }

    if (weeklyWorkouts >= 3) {
      newNotifications.push({
        id: 'weekly-goal',
        type: 'achievement',
        title: 'Цель недели достигнута!',
        message: 'Отличная работа! Продолжайте в том же духе.',
        icon: <Target className="w-5 h-5" />,
        color: 'from-green-500 to-emerald-500',
        dismissible: true
      });
    }

    // Напоминания
    if (weeklyWorkouts < 3) {
      const remaining = 3 - weeklyWorkouts;
      newNotifications.push({
        id: 'weekly-reminder',
        type: 'reminder',
        title: 'До цели недели осталось немного!',
        message: `Выполните еще ${remaining} тренировок для достижения цели.`,
        icon: <Target className="w-5 h-5" />,
        color: 'from-blue-500 to-purple-500',
        dismissible: false
      });
    }

    // Мотивационные советы
    const tips = [
      {
        title: 'Совет дня',
        message: 'Регулярность важнее интенсивности. Лучше заниматься по 20 минут каждый день.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-orange-500 to-red-500'
      },
      {
        title: 'Знаете ли вы?',
        message: 'Планирование тренировок повышает вероятность их выполнения на 80%.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-indigo-500 to-blue-500'
      },
      {
        title: 'Совет дня',
        message: 'Маленькие шаги ведут к большим изменениям. Каждый день делайте что-то, что приближает вас к вашей цели.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-orange-500 to-red-500'
      },
      {
        title: 'Знаете ли вы?',
        message: 'Спорт улучшает настроение и снижает уровень стресса. Регулярные тренировки могут снизить уровень кортизола на 20%.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-indigo-500 to-blue-500'
      },
      {
        title: 'Совет дня',
        message: 'Не сравнивайте себя с другими. Каждый человек имеет свой собственный темп и путь.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-orange-500 to-red-500'
      },
      {
        title: 'Знаете ли вы?',
        message: 'Спорт улучшает качество сна. Регулярные тренировки могут помочь вам заснуть быстрее и спать глубже.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-indigo-500 to-blue-500'
      },
      {
        title: 'Совет дня',
        message: 'Вода - это жизнь. Пейте достаточно воды каждый день, чтобы поддерживать свою энергию.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-orange-500 to-red-500'
      },
      {
        title: 'Знаете ли вы?',
        message: 'Спорт улучшает иммунитет. Регулярные тренировки могут снизить риск заражения на 30%.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-indigo-500 to-blue-500'
      },
      {
        title: 'Совет дня',
        message: 'Не забывайте о растяжке. Она помогает предотвратить травмы и улучшает гибкость.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-orange-500 to-red-500'
      },
      {
        title: 'Знаете ли вы?',
        message: 'Спорт улучшает концентрацию. Регулярные тренировки могут повысить уровень тестостерона на 15%.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-indigo-500 to-blue-500'
      },
      {
        title: 'Совет дня',
        message: 'Не пропускайте тренировки. Даже одна тренировка в неделю может сделать разницу.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-orange-500 to-red-500'
      },
      {
        title: 'Знаете ли вы?',
        message: 'Спорт улучшает память. Регулярные тренировки могут повысить уровень окситоцина на 20%.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-indigo-500 to-blue-500'
      },
      {
        title: 'Совет дня',
        message: 'Не забывайте о питании. Правильное питание помогает достичь лучших результатов.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-orange-500 to-red-500'
      },
      {
        title: 'Знаете ли вы?',
        message: 'Спорт улучшает самооценку. Регулярные тренировки могут повысить уровень эндорфинов на 30%.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-indigo-500 to-blue-500'
      },
      {
        title: 'Совет дня',
        message: 'Не забывайте о отдыхе. Отдых так же важен, как и тренировки.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-orange-500 to-red-500'
      },
      {
        title: 'Знаете ли вы?',
        message: 'Спорт улучшает здоровье сердца. Регулярные тренировки могут снизить риск сердечно-сосудистых заболеваний на 20%.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-indigo-500 to-blue-500'
      },
      {
        title: 'Совет дня',
        message: 'Не забывайте о мотивации. Мотивация - это ключ к успеху.',
        icon: <Flame className="w-5 h-5" />,
        color: 'from-orange-500 to-red-500'
      },
      {
        title: 'Знаете ли вы?',
        message: 'Спорт улучшает здоровье костей. Регулярные тренировки могут повысить плотность костей на 10%.',
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-indigo-500 to-blue-500'
      }
    ];

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

    setNotifications(newNotifications);
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