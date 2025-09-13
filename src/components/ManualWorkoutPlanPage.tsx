import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Check, Save, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { exercises, Exercise, getUniqueExercises } from '../data/exercises';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';
import { ExerciseEditor } from './ExerciseEditor';

interface ManualWorkoutPlanPageProps {
  onNavigate: (page: string) => void;
  onStartWorkout: (workout: any) => void;
}

interface WorkoutDay {
  day: string;
  workoutName: string;
  exercises: {
    exercise: Exercise;
    sets: number;
    reps: string;
    duration: number;
    weight?: number;
    restTime?: number;
    uniqueId?: string;
  }[];
  totalDuration: number;
}

const daysOfWeek = [
  'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'
];

export function ManualWorkoutPlanPage({ onNavigate, onStartWorkout }: ManualWorkoutPlanPageProps) {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<{
    exercise: Exercise;
    sets: number;
    reps: string;
    duration: number;
    weight?: number;
    restTime?: number;
    uniqueId?: string;
  }[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>(getUniqueExercises());
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutDay | null>(null);

  useEffect(() => {
    loadExistingPlan();
  }, []);

  const loadExistingPlan = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/workout-plan`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.planData?.plan?.weekPlan) {
          const manualPlan = result.planData.plan.weekPlan.map((day: any) => ({
            ...day,
            exercises: day.exercises.map((ex: any) => {
              // Сначала ищем по ID, если есть, затем по имени
              let exercise = exercises.find(e => e.id === ex.exerciseId);
              if (!exercise) {
                exercise = exercises.find(e => e.name === ex.name);
              }
              if (!exercise) {
                // Если не нашли, берем первое упражнение как fallback
                exercise = exercises[0];
                console.warn(`Упражнение не найдено: ${ex.name}, используется fallback`);
              }
              return {
                ...ex,
                exercise,
                uniqueId: ex.uniqueId || `${exercise.id}-${Date.now()}-${Math.random()}`
              };
            })
          }));
          setWorkoutPlan(manualPlan);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки плана:', error);
    }
  };

  const filteredExercises = availableExercises.filter(exercise => {
    const categoryMatch = filterCategory === 'all' || exercise.category === filterCategory;
    const difficultyMatch = filterDifficulty === 'all' || exercise.difficulty === filterDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const categories = Array.from(new Set(exercises.map(ex => ex.category)));
  const difficulties = Array.from(new Set(exercises.map(ex => ex.difficulty)));

  const addExerciseToWorkout = (exercise: Exercise) => {
    const uniqueId = `${exercise.id}-${Date.now()}`;
    // Определяем, нужен ли вес для этого упражнения
    const hasWeight = exercise.hasWeight || 
      exercise.name.toLowerCase().includes('гантел') || 
      exercise.name.toLowerCase().includes('штанг') ||
      exercise.name.toLowerCase().includes('жим') ||
      exercise.name.toLowerCase().includes('тяга') ||
      exercise.name.toLowerCase().includes('французский');
    
    const newExercise = {
      exercise,
      sets: 3,
      reps: '10-12',
      duration: exercise.duration,
      weight: hasWeight ? 10 : undefined,
      restTime: exercise.rest || 60,
      uniqueId
    };
    setSelectedExercises(prev => [...prev, newExercise]);
  };

  const updateExercise = (index: number, field: string, value: any) => {
    setSelectedExercises(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeExerciseFromWorkout = (index: number) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotalDuration = () => {
    return selectedExercises.reduce((total, ex) => {
      const exerciseTime = ex.sets * ex.duration;
      const restTime = ex.sets * (ex.restTime || 60);
      return total + exerciseTime + restTime;
    }, 0);
  };

  const startNewWorkout = () => {
    setIsCreatingWorkout(true);
    setSelectedDay('');
    setWorkoutName('');
    setSelectedExercises([]);
    setEditingWorkout(null);
  };

  const editWorkoutDay = (workout: WorkoutDay) => {
    setEditingWorkout(workout);
    setIsCreatingWorkout(true);
    setSelectedDay(workout.day);
    setWorkoutName(workout.workoutName);
    setSelectedExercises(workout.exercises.map(ex => ({
      ...ex,
      uniqueId: ex.uniqueId || `${ex.exercise.id}-${Date.now()}`
    })));
  };

  const deleteWorkoutDay = (day: string) => {
    setWorkoutPlan(prev => prev.filter(w => w.day !== day));
    toast.success('Тренировка удалена');
  };

  const saveCurrentWorkout = async () => {
    if (!selectedDay || !workoutName || selectedExercises.length === 0) {
      toast.error('Заполните все поля');
      return;
    }

    setIsSaving(true);

    const newWorkout: WorkoutDay = {
      day: selectedDay,
      workoutName,
      exercises: selectedExercises.map(ex => ({
        exercise: ex.exercise,
        sets: ex.sets,
        reps: ex.reps,
        duration: ex.duration,
        weight: ex.weight,
        restTime: ex.restTime,
        uniqueId: ex.uniqueId
      })),
      totalDuration: Math.round(calculateTotalDuration() / 60)
    };

    const updatedPlan = editingWorkout 
      ? workoutPlan.map(w => w.day === editingWorkout.day ? newWorkout : w)
      : [...workoutPlan.filter(w => w.day !== selectedDay), newWorkout];

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Необходима авторизация');
        return;
      }

      const planData = {
        weekPlan: updatedPlan.map(workout => ({
          day: workout.day,
          workoutName: workout.workoutName,
          exercises: workout.exercises.map(ex => ({
            exerciseId: ex.exercise.id, // Сохраняем ID упражнения
            name: ex.exercise.name,
            sets: ex.sets,
            reps: ex.reps,
            duration: ex.duration,
            weight: ex.weight,
            restTime: ex.restTime,
            uniqueId: ex.uniqueId
          })),
          totalDuration: workout.totalDuration
        })),
        recommendations: 'Персональный план тренировок'
      };

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/manual-workout-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ plan: planData })
      });

      if (response.ok) {
        setWorkoutPlan(updatedPlan);
        setIsCreatingWorkout(false);
        setSelectedExercises([]);
        setEditingWorkout(null);
        toast.success(editingWorkout ? 'Тренировка обновлена' : 'Тренировка сохранена');
      } else {
        toast.error('Ошибка сохранения тренировки');
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      toast.error('Ошибка сохранения тренировки');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelWorkoutCreation = () => {
    setIsCreatingWorkout(false);
    setSelectedExercises([]);
    setEditingWorkout(null);
  };

  const handleStartWorkout = (workout: WorkoutDay) => {
    const workoutData = {
      id: Date.now(), // Генерируем временный ID
      name: workout.workoutName,
      duration: workout.totalDuration,
      difficulty: 'Средне',
      exercises: workout.exercises.length,
      description: `Персональная тренировка: ${workout.workoutName}`,
      category: 'Персональная',
      exercises_list: workout.exercises.map(ex => ({
        id: ex.exercise.id,
        name: ex.exercise.name,
        video: ex.exercise.video,
        duration: ex.duration,
        rest: ex.restTime || ex.exercise.rest,
        category: ex.exercise.category,
        difficulty: ex.exercise.difficulty,
        muscleGroups: ex.exercise.muscleGroups,
        hasWeight: ex.exercise.hasWeight,
        // Дополнительные поля для персональной тренировки
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight
      }))
    };
    console.log('Запускаем пользовательскую тренировку:', workoutData);
    onStartWorkout(workoutData);
  };

  const savePlan = async () => {
    if (workoutPlan.length === 0) {
      toast.error('Добавьте хотя бы одну тренировку');
      return;
    }

    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Необходима авторизация');
        return;
      }

      const planData = {
        weekPlan: workoutPlan.map(workout => ({
          day: workout.day,
          workoutName: workout.workoutName,
          exercises: workout.exercises.map(ex => ({
            exerciseId: ex.exercise.id, // Сохраняем ID упражнения
            name: ex.exercise.name,
            sets: ex.sets,
            reps: ex.reps,
            duration: ex.duration,
            weight: ex.weight,
            restTime: ex.restTime,
            uniqueId: ex.uniqueId
          })),
          totalDuration: workout.totalDuration
        })),
        recommendations: 'Персональный план тренировок'
      };

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/manual-workout-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ plan: planData })
      });

      if (response.ok) {
        toast.success('План тренировок сохранен');
        onNavigate('plan');
      } else {
        toast.error('Ошибка сохранения плана');
      }
    } catch (error) {
      console.error('Ошибка сохранения плана:', error);
      toast.error('Ошибка сохранения плана');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('plan')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-2xl font-bold">Создание плана тренировок</h1>
          </div>
          
          {!isCreatingWorkout && workoutPlan.length > 0 && (
            <Button
              onClick={savePlan}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Save className="w-4 h-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить план
                </>
              )}
            </Button>
          )}
        </div>

        {/* Существующие тренировки */}
        {workoutPlan.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Ваш план тренировок</h2>
            {workoutPlan.map((workout, index) => (
              <Card key={workout.day} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{workout.day}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editWorkoutDay(workout)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteWorkoutDay(workout.day)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{workout.workoutName}</p>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <div className="space-y-2 flex-1">
                    {workout.exercises.slice(0, 3).map((ex, exIndex) => (
                      <div key={`${workout.day}-${ex.exercise.id}-${exIndex}`} className="flex items-center justify-between text-sm">
                        <span className="truncate flex-1 mr-2">{ex.exercise.name}</span>
                        <span className="text-muted-foreground text-xs">
                          {ex.sets}×{ex.reps}
                          {ex.weight && ` • ${ex.weight}кг`}
                        </span>
                      </div>
                    ))}
                    {workout.exercises.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center py-1">
                        +{workout.exercises.length - 3} упражнений
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-xs text-muted-foreground">
                      {workout.totalDuration} мин • {workout.exercises.length} упражнений
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleStartWorkout(workout)}
                    >
                      Начать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Кнопка добавления новой тренировки */}
        {!isCreatingWorkout && (
          <Button
            onClick={startNewWorkout}
            className="w-full"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить тренировку
          </Button>
        )}

        {/* Создание тренировки */}
        {isCreatingWorkout && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingWorkout ? 'Редактирование тренировки' : 'Новая тренировка'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Выбор дня и названия */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>День недели</Label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите день" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Название тренировки</Label>
                  <Input
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    placeholder="Например: Силовая тренировка"
                  />
                </div>
              </div>

              {/* Выбранные упражнения */}
              {selectedExercises.length > 0 && (
                <div className="space-y-2">
                  <Label>Выбранные упражнения</Label>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {selectedExercises.map((ex, index) => (
                      <ExerciseEditor
                        key={ex.uniqueId || `${ex.exercise.id}-${index}`}
                        exercise={ex}
                        index={index}
                        onUpdate={updateExercise}
                        onRemove={removeExerciseFromWorkout}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Примерная длительность: {Math.round(calculateTotalDuration() / 60)} мин
                  </p>
                </div>
              )}

              {/* Фильтры упражнений */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Категория</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Сложность</Label>
                  <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      {difficulties.map(diff => (
                        <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Список упражнений */}
              <div className="space-y-2">
                <Label>Добавить упражнения</Label>
                <ScrollArea className="h-60 border rounded">
                  <div className="p-2 space-y-2">
                    {filteredExercises.map(exercise => (
                      <div
                        key={exercise.id}
                        className="flex items-center justify-between p-2 border rounded hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{exercise.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {exercise.category}
                            </Badge>
                            <span>{exercise.difficulty}</span>
                            <span>{exercise.duration}с</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addExerciseToWorkout(exercise)}
                          variant="outline"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Кнопки управления */}
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={cancelWorkoutCreation}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button
                  onClick={saveCurrentWorkout}
                  disabled={!selectedDay || !workoutName || selectedExercises.length === 0 || isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <Save className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : editingWorkout ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Обновить
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Сохранить
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}