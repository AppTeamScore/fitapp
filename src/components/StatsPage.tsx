import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Calendar, Target, Activity, Award, Clock, BarChart3, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';
import { logger } from '../utils/logger';
import { eventBus } from '../utils/events';

interface StatsPageProps {
  onNavigate: (page: string) => void;
}

interface WorkoutProgress {
  workoutName: string;
  duration: number;
  completedAt: string;
  exercises: any[];
  totalExercises: number;
  completedExercises: number;
}

interface StatsData {
  totalWorkouts: number;
  totalMinutes: number;
  averageDuration: number;
  thisWeekCount: number;
  thisMonthCount: number;
  streak: number;
  favoriteCategory: string;
  progressRecords: WorkoutProgress[];
}

const COLORS = ['#030213', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6'];

export function StatsPage({ onNavigate }: StatsPageProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadStats();
  }, []);

  // Добавляем обработчик события очистки статистики
  useEffect(() => {
    const handleStatsCleared = () => {
      logger.info('Получено уведомление об очистке статистики');
      setStats({
        totalWorkouts: 0,
        totalMinutes: 0,
        averageDuration: 0,
        thisWeekCount: 0,
        thisMonthCount: 0,
        streak: 0,
        favoriteCategory: 'Нет данных',
        progressRecords: []
      });
    };

    eventBus.on('stats:cleared', handleStatsCleared);
    
    return () => {
      eventBus.off('stats:cleared', handleStatsCleared);
    };
  }, []);


  const loadStats = async () => {
    logger.startFunction('loadStats');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        logger.warn('Попытка загрузки статистики без авторизации');
        toast.error('Необходима авторизация');
        onNavigate('auth');
        return;
      }

      logger.logApiRequest('workout-progress', 'GET', null, { Authorization: `Bearer ${session.access_token}` });
      const startTime = Date.now();

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/workout-progress`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse('workout-progress', 'GET', response.status, null, duration);

      if (response.ok) {
        const result = await response.json();
        logger.info('Статистика успешно загружена', { recordCount: result.progressRecords?.length || 0 });
        processStatsData(result.progressRecords || []);
      } else {
        const errorData = await response.json();
        logger.error('Ошибка загрузки статистики', new Error(errorData.error || 'Unknown error'), { status: response.status });
        toast.error('Ошибка загрузки статистики');
        setStats({
          totalWorkouts: 0,
          totalMinutes: 0,
          averageDuration: 0,
          thisWeekCount: 0,
          thisMonthCount: 0,
          streak: 0,
          favoriteCategory: 'Нет данных',
          progressRecords: []
        });
      }
    } catch (error) {
      logger.error('Ошибка загрузки статистики', error as Error);
      toast.error('Ошибка загрузки статистики');
    } finally {
      setIsLoading(false);
      logger.endFunction('loadStats');
    }
  };

  const processStatsData = (progressRecords: WorkoutProgress[]) => {
    logger.startFunction('processStatsData', { recordCount: progressRecords?.length || 0 });
    
    if (!progressRecords || progressRecords.length === 0) {
      logger.info('Нет данных о тренировках');
      setStats({
        totalWorkouts: 0,
        totalMinutes: 0,
        averageDuration: 0,
        thisWeekCount: 0,
        thisMonthCount: 0,
        streak: 0,
        favoriteCategory: 'Нет данных',
        progressRecords: []
      });
      logger.endFunction('processStatsData');
      return;
    }

    // Сортируем по дате
    const sortedRecords = progressRecords.sort((a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    // Общая статистика
    const totalWorkouts = sortedRecords.length;
    const totalMinutes = sortedRecords.reduce((sum, record) => sum + (record.duration || 0), 0);
    const averageDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;

    // Статистика за неделю и месяц
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeekCount = sortedRecords.filter(record =>
      new Date(record.completedAt) >= weekAgo
    ).length;

    const thisMonthCount = sortedRecords.filter(record =>
      new Date(record.completedAt) >= monthAgo
    ).length;

    // Подсчет стрика
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedRecords.length; i++) {
      const recordDate = new Date(sortedRecords[i].completedAt);
      recordDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }

    // Анализ категорий на основе реальных данных
    const categoryCount: Record<string, number> = {};
    sortedRecords.forEach(record => {
      // Извлекаем тип тренировки из названия или используем общий тип
      let category = 'Тренировка';
      if (record.workoutName.toLowerCase().includes('кардио')) {
        category = 'Кардио';
      } else if (record.workoutName.toLowerCase().includes('сил') || record.workoutName.toLowerCase().includes('сила')) {
        category = 'Силовые';
      } else if (record.workoutName.toLowerCase().includes('йога')) {
        category = 'Йога';
      } else if (record.workoutName.toLowerCase().includes('растяж') || record.workoutName.toLowerCase().includes('стретч')) {
        category = 'Растяжка';
      } else if (record.workoutName.toLowerCase().includes('hiit')) {
        category = 'HIIT';
      }
      
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // Определяем любимую категорию
    const favoriteCategory = Object.keys(categoryCount).length > 0
      ? Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0][0]
      : 'Нет данных';

    logger.info('Статистика обработана', {
      totalWorkouts,
      totalMinutes,
      averageDuration,
      thisWeekCount,
      thisMonthCount,
      streak,
      favoriteCategory,
      categories: Object.keys(categoryCount)
    });

    setStats({
      totalWorkouts,
      totalMinutes,
      averageDuration,
      thisWeekCount,
      thisMonthCount,
      streak,
      favoriteCategory,
      progressRecords: sortedRecords
    });
    
    logger.endFunction('processStatsData');
  };

  const clearAllStats = async () => {
    logger.startFunction('clearAllStats');
    setIsClearing(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        logger.warn('Попытка очистки статистики без авторизации');
        toast.error('Необходима авторизация');
        onNavigate('auth');
        return;
      }

      logger.logApiRequest('workout-progress', 'DELETE', null, { Authorization: `Bearer ${session.access_token}` });
      const startTime = Date.now();

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/workout-progress`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const duration = Date.now() - startTime;
      logger.logApiResponse('workout-progress', 'DELETE', response.status, null, duration);

      if (response.ok) {
        logger.info('Статистика успешно очищена');
        toast.success('Статистика успешно очищена');
        
        // Очищаем localStorage, так как другие компоненты используют его данные
        localStorage.removeItem('completedWorkouts');
        logger.info('Очищен localStorage completedWorkouts');
        
        // Обновляем локальные данные
        setStats({
          totalWorkouts: 0,
          totalMinutes: 0,
          averageDuration: 0,
          thisWeekCount: 0,
          thisMonthCount: 0,
          streak: 0,
          favoriteCategory: 'Нет данных',
          progressRecords: []
        });
        
        // Уведомляем другие компоненты об очистке статистики
        eventBus.emit('stats:cleared');
        logger.info('Отправлено уведомление stats:cleared');
      } else {
        const result = await response.json();
        logger.error('Ошибка очистки статистики', new Error(result.error || 'Unknown error'), { status: response.status });
        toast.error(`Ошибка очистки статистики: ${result.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      logger.error('Ошибка очистки статистики', error as Error);
      toast.error('Ошибка очистки статистики');
    } finally {
      setIsClearing(false);
      logger.endFunction('clearAllStats');
    }
  };

  const getChartData = () => {
    if (!stats?.progressRecords.length) return [];

    const now = new Date();
    const daysToShow = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
    const data = [];

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayWorkouts = stats.progressRecords.filter(record => {
        const recordDate = new Date(record.completedAt).toISOString().split('T')[0];
        return recordDate === dateStr;
      });

      data.push({
        date: selectedPeriod === 'week' 
          ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getDay()]
          : date.getDate().toString(),
        workouts: dayWorkouts.length,
        minutes: dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0)
      });
    }

    return data;
  };

  const getCategoryData = () => {
    if (!stats?.progressRecords.length) return [];

    // Анализируем реальные данные о тренировках
    const categoryCount: Record<string, number> = {};
    stats.progressRecords.forEach(record => {
      let category = 'Тренировка';
      if (record.workoutName.toLowerCase().includes('кардио')) {
        category = 'Кардио';
      } else if (record.workoutName.toLowerCase().includes('сил') || record.workoutName.toLowerCase().includes('сила')) {
        category = 'Силовые';
      } else if (record.workoutName.toLowerCase().includes('йога')) {
        category = 'Йога';
      } else if (record.workoutName.toLowerCase().includes('растяж') || record.workoutName.toLowerCase().includes('стретч')) {
        category = 'Растяжка';
      } else if (record.workoutName.toLowerCase().includes('hiit')) {
        category = 'HIIT';
      }
      
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // Конвертируем в проценты
    const total = Object.values(categoryCount).reduce((sum, count) => sum + count, 0);
    const categoryColors: Record<string, string> = {
      'Силовые': '#030213',
      'Кардио': '#6b7280',
      'Растяжка': '#9ca3af',
      'Йога': '#d1d5db',
      'HIIT': '#f59e0b',
      'Тренировка': '#6b7280'
    };

    return Object.entries(categoryCount)
      .map(([name, value]) => ({
        name,
        value: Math.round((value / total) * 100),
        color: categoryColors[name] || '#6b7280'
      }))
      .sort((a, b) => b.value - a.value);
  };

  const getWeeklyProgress = () => {
    const target = 3; // Цель: 3 тренировки в неделю
    const current = stats?.thisWeekCount || 0;
    return Math.min((current / target) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold">Статистика</h1>
        </div>
        <div className="flex items-center space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isClearing || !stats?.totalWorkouts}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Очистить статистику?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие безвозвратно удалит всю статистику тренировок. 
                  Вы уверены, что хотите продолжить?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={clearAllStats}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isClearing}
                >
                  {isClearing ? 'Очистка...' : 'Очистить'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <BarChart3 className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats?.totalWorkouts || 0}</div>
            <div className="text-sm text-muted-foreground">Всего тренировок</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{Math.round((stats?.totalMinutes || 0) / 60)}</div>
            <div className="text-sm text-muted-foreground">Часов тренировок</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats?.averageDuration || 0}</div>
            <div className="text-sm text-muted-foreground">Сред. длительность</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats?.streak || 0}</div>
            <div className="text-sm text-muted-foreground">Дней подряд</div>
          </CardContent>
        </Card>
      </div>

      {/* Прогресс недели */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Прогресс недели
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Тренировок: {stats?.thisWeekCount || 0} из 3</span>
              <span>{Math.round(getWeeklyProgress())}%</span>
            </div>
            <Progress value={getWeeklyProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Графики */}
      <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="week">Неделя</TabsTrigger>
          <TabsTrigger value="month">Месяц</TabsTrigger>
          <TabsTrigger value="year">Год</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPeriod} className="space-y-4">
          {/* График тренировок */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Активность
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center">
                {stats?.progressRecords && stats.progressRecords.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          value,
                          name === 'workouts' ? 'Тренировок' : 'Минут'
                        ]}
                      />
                      <Bar dataKey="workouts" fill="#030213" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Добавьте тренировки, чтобы увидеть график активности</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* График времени */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Время тренировок
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center">
                {stats?.progressRecords && stats.progressRecords.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [value, 'Минут']}
                      />
                      <Area
                        type="monotone"
                        dataKey="minutes"
                        stroke="#030213"
                        fill="#030213"
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Добавьте тренировки, чтобы увидеть график времени</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Категории тренировок */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5" />
            Распределение по типам
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            {stats?.progressRecords && stats.progressRecords.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getCategoryData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {getCategoryData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Доля']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Добавьте тренировки, чтобы увидеть распределение по типам</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {getCategoryData().map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">{item.name}</span>
                <span className="text-sm text-muted-foreground ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Достижения */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5" />
            Достижения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">Первая тренировка</div>
                <div className="text-sm text-muted-foreground">Начало пути к здоровью</div>
              </div>
              <Badge variant={stats?.totalWorkouts && stats.totalWorkouts > 0 ? "secondary" : "outline"}>
                {stats?.totalWorkouts && stats.totalWorkouts > 0 ? "✓" : "—"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">Неделя активности</div>
                <div className="text-sm text-muted-foreground">7 дней подряд</div>
              </div>
              <Badge variant={stats?.streak && stats.streak >= 7 ? "secondary" : "outline"}>
                {stats?.streak && stats.streak >= 7 ? "✓" : "—"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">Месяц тренировок</div>
                <div className="text-sm text-muted-foreground">30 дней активности</div>
              </div>
              <Badge variant={stats?.thisMonthCount && stats.thisMonthCount >= 30 ? "secondary" : "outline"}>
                {stats?.thisMonthCount && stats.thisMonthCount >= 30 ? "✓" : "—"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Недавние тренировки */}
      {stats?.progressRecords && stats.progressRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Последние тренировки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.progressRecords.slice(0, 5).map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <div>
                    <div className="font-medium">{record.workoutName}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(record.completedAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{record.duration || 0} мин</div>
                    <div className="text-sm text-muted-foreground">
                      {record.completedExercises || 0}/{record.totalExercises || 0} упр.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}