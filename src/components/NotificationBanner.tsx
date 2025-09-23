import { useState, useEffect } from 'react';
import { X, Trophy, Target, Flame, 
  Calendar, 
  Apple, 
  Brain, 
  Moon, 
  Droplet, 
  TrendingUp, 
  Shield, 
  Users, 
  Activity, 
  Sunrise 
} from 'lucide-react';
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
        title: 'Факт о питании',
        message: 'Белковый завтрак помогает контролировать аппетит в течение всего дня.',
        icon: <Apple className="w-5 h-5" />,
        color: 'from-green-500 to-emerald-500'
      },
      {
        title: 'Психология',
        message: 'Визуализация успеха увеличивает шансы на достижение цели на 30%.',
        icon: <Brain className="w-5 h-5" />,
        color: 'from-purple-500 to-pink-500'
      },
      {
        title: 'Сон и восстановление',
        message: 'Качество сна напрямую влияет на эффективность тренировок и прогресс.',
        icon: <Moon className="w-5 h-5" />,
        color: 'from-blue-500 to-cyan-500'
      },
      {
        title: 'Гидротация',
        message: 'Даже легкое обезвоживание снижает физическую производительность на 10-20%.',
        icon: <Droplet className="w-5 h-5" />,
        color: 'from-cyan-500 to-blue-500'
      },
      {
        title: 'Прогресс',
        message: 'Маленькие, но постоянные улучшения приводят к значительным результатам.',
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'from-teal-500 to-green-500'
      },
      {
        title: 'Мотивация',
        message: 'Начинайте с самых простых задач - это создает импульс для больших свершений.',
        icon: <Target className="w-5 h-5" />,
        color: 'from-rose-500 to-orange-500'
      },
      {
        title: 'Вредные привычки',
        message: 'Замена одной вредной привычки на полезную меняет жизнь к лучшему.',
        icon: <Shield className="w-5 h-5" />,
        color: 'from-gray-500 to-slate-600'
      },
      {
        title: 'Социальная поддержка',
        message: 'Тренировки с партнером увеличивают adherence на 50%.',
        icon: <Users className="w-5 h-5" />,
        color: 'from-violet-500 to-purple-500'
      },
      {
        title: 'Техника выполнения',
        message: 'Правильная форма важнее большого веса - это предотвращает травмы.',
        icon: <Activity className="w-5 h-5" />,
        color: 'from-amber-500 to-yellow-500'
      },
      {
        title: 'Время тренировок',
        message: 'Утренние тренировки помогают установить режим и повысить продуктивность дня.',
        icon: <Sunrise className="w-5 h-5" />,
        color: 'from-yellow-500 to-orange-500'
      }
    ];

    if (Math.random() > 0.5) {
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