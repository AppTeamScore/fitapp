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

  const loadStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast.error('Необходима авторизация');
        onNavigate('auth');
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/workout-progress`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        processStatsData(result.progressRecords || []);
      } else {
        console.error('Ошибка загрузки статистики');
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
      console.error('Ошибка загрузки статистики:', error);
      toast.error('Ошибка загрузки статистики');
    } finally {
      setIsLoading(false);
    }
  };

  const processStatsData = (progressRecords: WorkoutProgress[]) => {
    if (!progressRecords || progressRecords.length === 0) {
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

    // Любимая категория (заглушка, так как у нас нет информации о категориях в прогрессе)
    const favoriteCategory = 'Силовые тренировки';

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
  };

  const clearAllStats = async () => {
    setIsClearing(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast.error('Необходима авторизация');
        onNavigate('auth');
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/workout-progress`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        toast.success('Статистика успешно очищена');
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
      } else {
        const result = await response.json();
        toast.error(`Ошибка очистки статистики: ${result.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка очистки статистики:', error);
      toast.error('Ошибка очистки статистики');
    } finally {
      setIsClearing(false);
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

    // Заглушка для категорий (в реальном приложении эти данные должны приходить с сервера)
    return [
      { name: 'Силовые', value: 45, color: '#030213' },
      { name: 'Кардио', value: 25, color: '#6b7280' },
      { name: 'Растяжка', value: 20, color: '#9ca3af' },
      { name: 'Йога', value: 10, color: '#d1d5db' }
    ];
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
              <div className="h-48">
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
              <div className="h-48">
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
          <div className="h-48">
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
              <Badge variant={stats?.thisMonthCount && stats.thisMonthCount >= 12 ? "secondary" : "outline"}>
                {stats?.thisMonthCount && stats.thisMonthCount >= 12 ? "✓" : "—"}
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