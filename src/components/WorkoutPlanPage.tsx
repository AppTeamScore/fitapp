import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ArrowLeft, RefreshCw, Edit3, Play, CheckCircle, Clock, Target, Users, Trash2, Edit } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';
import { exercises } from '../data/exercises';
import { generateWorkoutPlan } from '../utils/llm';

interface WorkoutPlanPageProps {
  onNavigate: (page: string) => void;
  onStartWorkout: (workout: any) => void;
}

interface WorkoutPlan {
  weekPlan: Array<{
    day: string;
    workoutName: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      duration: number;
      weight?: number;
      restTime?: number;
    }>;
    totalDuration: number;
  }>;
  recommendations: string;
}

interface PlanData {
  plan: WorkoutPlan;
  goals: string;
  fitnessLevel: string;
  limitations: string;
  createdAt: string;
}

export function WorkoutPlanPage({ onNavigate, onStartWorkout }: WorkoutPlanPageProps) {
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
  const [isRecommendationsExpanded, setIsRecommendationsExpanded] = useState(false);

  useEffect(() => {
    loadWorkoutPlan();
  }, []);

  const loadWorkoutPlan = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast.error('Необходима авторизация');
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
      toast.error('Ошибка загрузки плана тренировок');
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewPlan = async () => {
    setIsGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast.error('Необходима авторизация');
        return;
      }

      // Получаем профиль пользователя для генерации плана
      const profileResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/profile`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const profileResult = await profileResponse.json();
      
      if (!profileResponse.ok || !profileResult.profile) {
        toast.error('Не удалось получить профиль пользователя');
        return;
      }

      const profile = profileResult.profile;

      // Генерируем план на клиенте с помощью LLM, передавая все данные профиля
      const generatedPlan = await generateWorkoutPlan(profile);

      // Сохраняем план на сервере
      const saveResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/generate-workout-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          plan: generatedPlan,
          ...profile // Сохраняем все данные профиля для полноты
        })
      });

      const saveResult = await saveResponse.json();
      
      if (saveResponse.ok && saveResult.plan) {
        const newPlanData = {
          plan: generatedPlan,
          goals: profile.fitnessGoals || 'Улучшение общей физической формы',
          fitnessLevel: profile.fitnessLevel || 'Начинающий',
          limitations: profile.limitations || 'Нет ограничений',
          createdAt: new Date().toISOString()
        };
        setPlanData(newPlanData);
        toast.success('Новый план тренировок сгенерирован');
      } else {
        toast.error(`Ошибка сохранения плана: ${saveResult.error}`);
      }
    } catch (error) {
      console.error('Ошибка генерации плана:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast.error('Сервер недоступен. Попробуйте позже.');
      } else {
        toast.error('Произошла ошибка при генерации плана');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartWorkout = (dayWorkout: any) => {
    // Находим упражнения из нашей базы данных
    const workoutExercises = dayWorkout.exercises.map((planExercise: any) => {
      const foundExercise = exercises.find(ex =>
        ex.name.toLowerCase().includes(planExercise.name.toLowerCase()) ||
        planExercise.name.toLowerCase().includes(ex.name.toLowerCase())
      );

      return {
        ...foundExercise,
        sets: planExercise.sets,
        reps: planExercise.reps,
        duration: planExercise.duration,
        weight: planExercise.weight,
        restTime: planExercise.restTime,
        planName: planExercise.name
      };
    }).filter(Boolean);

    const workout = {
      name: dayWorkout.workoutName,
      duration: dayWorkout.totalDuration,
      exercises: workoutExercises,
      difficulty: 'medium',
      exercises_list: workoutExercises // Добавляем exercises_list для совместимости с TimerPage
    };

    onStartWorkout(workout);
  };

  const toggleExpanded = (dayIndex: number) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dayIndex)) {
        newSet.delete(dayIndex);
      } else {
        newSet.add(dayIndex);
      }
      return newSet;
    });
  };

  const deletePlan = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast.error('Необходима авторизация');
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/workout-plan`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        setPlanData(null);
        toast.success('План тренировок удален');
      } else {
        toast.error('Ошибка удаления плана');
      }
    } catch (error) {
      console.error('Ошибка удаления плана:', error);
      toast.error('Ошибка удаления плана');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="min-h-screen p-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('home')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-2xl font-bold">План тренировок</h1>
          </div>
          
          <Card className="text-center">
            <CardContent className="pt-6 pb-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">У вас еще нет плана тренировок</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Создайте персонализированный план тренировок, который подойдет именно вам
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={generateNewPlan} 
                    disabled={isGenerating}
                    size="lg"
                    className="min-w-[200px]"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Создание плана...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Автоматический план
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => onNavigate('manual-plan')} 
                    size="lg"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Создать вручную
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('home')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-2xl font-bold">Ваш план тренировок</h1>
          </div>
          
          <div className="flex gap-2 flex-wrap justify-center">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onNavigate('manual-plan')}
            >
              <Edit className="w-4 h-4 mr-2" />
              Редактировать
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={generateNewPlan}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Новый план
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить план тренировок?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Ваш текущий план тренировок будет удален навсегда.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={deletePlan}>
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Информация о плане */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Информация о плане
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Цели</p>
                <p className="text-sm">{planData.goals || 'Нет'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Уровень</p>
                <p className="text-sm">{planData.fitnessLevel || 'Нет'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Ограничения</p>
                <p className="text-sm">{planData.limitations || 'Нет'}</p>
              </div>
            </div>
            
            {planData.plan.recommendations && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Рекомендации:</p>
                {(() => {
                  const recText = planData.plan.recommendations || 'Из-за редактирования плана, все данные устарели.';
                  const maxLength = 200;
                  const isLong = recText.length > maxLength;
                  const displayText = isLong && !isRecommendationsExpanded ? recText.slice(0, maxLength) + '...' : recText;
                  
                  return (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground text-justify leading-relaxed hyphens-auto">{displayText}</p>
                      {isLong && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsRecommendationsExpanded(!isRecommendationsExpanded)}
                          className="w-full justify-center"
                        >
                          {isRecommendationsExpanded ? 'Скрыть' : 'Показать полностью'}
                        </Button>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Тренировки по дням */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold"></h2>
          {planData.plan.weekPlan.map((dayWorkout, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{dayWorkout.day}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {dayWorkout.totalDuration} мин
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{dayWorkout.workoutName}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col flex-1">
                <div className="space-y-2 mb-4 flex-1">
                  {dayWorkout.exercises.slice(0, expandedDays.has(index) ? dayWorkout.exercises.length : 3).map((exercise, exerciseIndex) => (
                    <div key={exerciseIndex} className="text-sm p-2 bg-muted/50 rounded">
                      <p className="font-medium truncate">{exercise.name}</p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>{exercise.sets} подхода × {exercise.reps}</p>
                        <div className="flex gap-2">
                          <span>{exercise.duration}с</span>
                          {exercise.weight && (
                            <span>• {exercise.weight}кг</span>
                          )}
                          {exercise.restTime && (
                            <span>• отдых {exercise.restTime}с</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {dayWorkout.exercises.length > 3 && (
                    <div className="text-center py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(index)}
                        className="w-full"
                      >
                        {expandedDays.has(index) ? 'Скрыть' : `Показать еще (+${dayWorkout.exercises.length - 3} упражнения)`}
                      </Button>
                    </div>
                  )}
                </div>
                
                <Button
                  className="w-full mt-auto"
                  onClick={() => handleStartWorkout(dayWorkout)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Начать тренировку
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {planData.plan.weekPlan.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-muted-foreground">
                План тренировок пуст. Попробуйте сгенерировать новый план.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}