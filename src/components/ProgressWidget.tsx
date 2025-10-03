import { useState, useEffect } from 'react';
import { TrendingUp, Target, Clock, Calendar, Award, Dumbbell} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { eventBus } from '../utils/events';
import { logger } from '../utils/logger';

interface ProgressWidgetProps {
  className?: string;
}

interface QuickStats {
  weeklyWorkouts: number;
  weeklyGoal: number;
  totalMinutes: number;
  streak: number;
  monthlyProgress: number;
}

export function ProgressWidget({ className = '' }: ProgressWidgetProps) {
  const [stats, setStats] = useState<QuickStats>({
    weeklyWorkouts: 0,
    weeklyGoal: 5,
    totalMinutes: 0,
    streak: 0,
    monthlyProgress: 0
  });

  useEffect(() => {
    loadQuickStats();
    
    // Подписываемся на событие очистки статистики
    const unsubscribeStatsCleared = eventBus.on('stats:cleared', () => {
      logger.info('ProgressWidget: Получено уведомление об очистке статистики, обновляем данные');
      loadQuickStats();
    });
    
    return () => {
      unsubscribeStatsCleared();
    };
  }, []);

  const loadQuickStats = () => {
    // Получаем данные из localStorage
    const completedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Подсчет тренировок за неделю
    const weeklyWorkouts = completedWorkouts.filter((workout: any) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= weekAgo && workoutDate <= today;
    }).length;

    // Подсчет тренировок за месяц
    const monthlyWorkouts = completedWorkouts.filter((workout: any) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= monthAgo && workoutDate <= today;
    }).length;

    // Общее время (предполагаем 45 мин на тренировку)
    const totalMinutes = weeklyWorkouts * 45;

    // Подсчет стрика
    let streak = 0;
    const sortedWorkouts = completedWorkouts
      .map((w: any) => new Date(w.date))
      .sort((a: Date, b: Date) => b.getTime() - a.getTime());

    if (sortedWorkouts.length > 0) {
      const lastWorkout = sortedWorkouts[0];
      const diffDays = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak = 1;
        for (let i = 1; i < sortedWorkouts.length; i++) {
          const currentWorkout = sortedWorkouts[i];
          const prevWorkout = sortedWorkouts[i - 1];
          const daysDiff = Math.floor((prevWorkout.getTime() - currentWorkout.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    // Прогресс месяца (цель: 12 тренировок в месяц)
    const monthlyProgress = Math.min((monthlyWorkouts / 12) * 100, 100);

    setStats({
      weeklyWorkouts,
      weeklyGoal: 5,
      totalMinutes,
      streak,
      monthlyProgress
    });
  };

  const weeklyProgress = Math.min((stats.weeklyWorkouts / stats.weeklyGoal) * 100, 100);
  const isWeeklyGoalReached = stats.weeklyWorkouts >= stats.weeklyGoal;

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4 space-y-4">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Мой прогресс</h3>
          {isWeeklyGoalReached && (
            <Badge className="bg-green-100 text-green-800 gap-1">
              <Award className="w-3 h-3" />
              Цель достигнута!
            </Badge>
          )}
        </div>

        {/* Еженедельная цель */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span>Цель недели</span>
            </div>
            <span className="font-medium">{stats.weeklyWorkouts}/{stats.weeklyGoal}</span>
          </div>
          <Progress 
            value={weeklyProgress} 
            className={`h-2 ${isWeeklyGoalReached ? 'bg-green-100' : ''}`} 
          />
          <div className="text-xs text-muted-foreground text-right">
            {Math.round(weeklyProgress)}% выполнено
          </div>
        </div>

        {/* Мини статистика */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Dumbbell className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-lg font-bold text-blue-600">{stats.weeklyWorkouts}</div>
            <div className="text-xs text-muted-foreground">Тренировок в неделю</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-lg font-bold text-orange-600">{stats.streak}</div>
            <div className="text-xs text-muted-foreground">дней подряд</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-lg font-bold text-green-600">{Math.round(stats.monthlyProgress)}%</div>
            <div className="text-xs text-muted-foreground">месяц</div>
          </div>
        </div>

        {/* Мотивационное сообщение */}
        <div className="bg-primary/5 rounded-lg p-3 text-center">
          <p className="text-sm text-primary font-medium">
            {stats.weeklyWorkouts === 0 
              ? "Начни новую неделю с тренировки!" 
              : stats.weeklyWorkouts < stats.weeklyGoal
              ? `Осталось ${stats.weeklyGoal - stats.weeklyWorkouts} тренировок до цели`
              : "Отличная работа! Цель недели достигнута! 🎉"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}