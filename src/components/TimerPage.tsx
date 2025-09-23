import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, SkipForward, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { VideoPlayer } from "./VideoPlayer";
import { toast } from "sonner@2.0.3";
import { api } from "../utils/api";
import { type Workout } from "../data/workouts";

interface TimerPageProps {
  onNavigate: (page: string) => void;
  workout?: Workout;
}

export function TimerPage({ onNavigate, workout }: TimerPageProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(workout?.exercises_list?.[0]?.duration || 30);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);

  const exercises = workout?.exercises_list || [
    { 
      id: "default_1",
      name: "Прыжки на месте", 
      duration: 30, 
      rest: 15,
      video: "default.mp4",
      category: "Кардио",
      difficulty: "Легко",
      muscleGroups: ["Все тело"]
    },
    { 
      id: "default_2",
      name: "Приседания", 
      duration: 30, 
      rest: 15,
      video: "default.mp4",
      category: "Сила",
      difficulty: "Легко",
      muscleGroups: ["Ноги"]
    },
  ];

  const currentExercise = exercises[currentExerciseIndex] || exercises[0];
  const totalExercises = exercises.length;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isResting) {
        // Переход к отдыху
        setIsResting(true);
        setTimeLeft(currentExercise?.rest || 15);
      } else {
        // Переход к следующему упражнению
        setIsResting(false);
        setCompletedExercises(prev => prev + 1);
        
        if (currentExerciseIndex < totalExercises - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
          setTimeLeft(exercises[currentExerciseIndex + 1]?.duration || 30);
        } else {
          // Тренировка завершена
          setIsRunning(false);
          handleWorkoutComplete();
        }
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isResting, currentExerciseIndex, exercises, totalExercises, currentExercise?.rest, onNavigate]);

  const handleWorkoutComplete = async () => {
    const endTime = new Date();
    const actualDuration = workoutStartTime ? 
      Math.round((endTime.getTime() - workoutStartTime.getTime()) / 1000 / 60) : 
      workout?.duration || 0;

    // Сохраняем данные локально для статистики
    const completedWorkout = {
      date: endTime.toISOString(),
      type: workout?.category || 'Тренировка',
      name: workout?.name || 'Тренировка',
      duration: actualDuration,
      completedExercises: completedExercises,
      totalExercises: exercises.length
    };

    // Обновляем localStorage
    const existingWorkouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
    existingWorkouts.push(completedWorkout);
    localStorage.setItem('completedWorkouts', JSON.stringify(existingWorkouts));

    try {
      await api.saveWorkoutProgress({
        workoutName: workout?.name || 'Тренировка',
        completedExercises: completedExercises,
        totalExercises: exercises.length,
        duration: actualDuration,
        date: endTime.toISOString(),
        exercises: exercises.slice(0, completedExercises).map(ex => ({
          name: ex.name,
          completed: true
        }))
      });

      toast.success("Тренировка завершена! Прогресс сохранен.");
    } catch (error) {
      console.error('Ошибка сохранения прогресса:', error);
      toast.success('Тренировка завершена! Данные сохранены локально.');
    }

    onNavigate('home');
  };

  const toggleTimer = () => {
    if (!isRunning && !workoutStartTime) {
      setWorkoutStartTime(new Date());
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsResting(false);
    setCurrentExerciseIndex(0);
    setTimeLeft(exercises[0]?.duration || 30);
    setCompletedExercises(0);
    setWorkoutStartTime(null);
  };

  const skipExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setIsResting(false);
      setCurrentExerciseIndex(prev => prev + 1);
      setTimeLeft(exercises[currentExerciseIndex + 1]?.duration || 30);
      setCompletedExercises(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  // Проверяем, есть ли упражнения
  if (!exercises || exercises.length === 0) {
    return (
      <div className="p-4 space-y-6 min-h-screen flex items-center justify-center">
        <Card className="text-center p-6">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Нет упражнений</h2>
            <p className="text-muted-foreground mb-4">
              Тренировка не содержит упражнений для выполнения.
            </p>
            <Button onClick={() => onNavigate('home')}>
              Вернуться на главную
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {workout?.name || "Таймер тренировки"}
        </h1>
        <Button onClick={() => onNavigate('home')} variant="ghost">
          Завершить
        </Button>
      </div>

      {/* Прогресс */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Прогресс тренировки</span>
              <span>{completedExercises}/{totalExercises}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Текущее упражнение */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl mb-2">
            {isResting ? "Отдых" : currentExercise?.name || "Упражнение"}
          </CardTitle>
          {!isResting && currentExercise && (
            <div className="flex justify-center gap-2 mb-4">
              <Badge variant="secondary" className="text-xs">
                {currentExercise.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {currentExercise.muscleGroups?.join(", ")}
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Видео плеер */}
          {!isResting && currentExercise?.video && (
            <div className="mb-4">
              <VideoPlayer
                key={currentExercise.video} // Добавляем ключ для принудительного обновления
                videoSrc={currentExercise.video}
                exerciseName={currentExercise.name}
                autoPlay={isRunning}
                loop={true}
                muted={true}
              />
            </div>
          )}
          
          <div className="text-6xl font-bold text-primary">
            {formatTime(timeLeft)}
          </div>
          
          {!isResting && (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Упражнение {currentExerciseIndex + 1} из {totalExercises}
              </p>
              {currentExercise?.muscleGroups && (
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <Info className="h-4 w-4 mr-1" />
                  Работают: {currentExercise.muscleGroups.join(", ")}
                </div>
              )}
              {/* Отображаем дополнительную информацию для персональных тренировок */}
              {(currentExercise as any)?.weight && (
                <div className="text-sm text-muted-foreground">
                  Вес: {(currentExercise as any).weight} кг
                </div>
              )}
              {(currentExercise as any)?.sets && (currentExercise as any)?.reps && (
                <div className="text-sm text-muted-foreground">
                  {(currentExercise as any).sets} подходов × {(currentExercise as any).reps} повторений
                </div>
              )}
            </div>
          )}
          
          {isResting && (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Приготовьтесь к следующему упражнению
              </p>
              {currentExerciseIndex < totalExercises - 1 && exercises[currentExerciseIndex + 1] && (
                <p className="font-semibold">
                  Следующее: {exercises[currentExerciseIndex + 1].name}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Следующее упражнение */}
      {!isResting && currentExerciseIndex < totalExercises - 1 && exercises[currentExerciseIndex + 1] && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Следующее упражнение:</p>
              <p className="font-semibold">{exercises[currentExerciseIndex + 1].name}</p>
              <div className="flex justify-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {exercises[currentExerciseIndex + 1].category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {exercises[currentExerciseIndex + 1].duration}с
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Управление */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={toggleTimer}
          size="lg"
          className="rounded-full w-16 h-16"
        >
          {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        
        <Button
          onClick={resetTimer}
          variant="outline"
          size="lg"
          className="rounded-full w-16 h-16"
        >
          <RotateCcw className="h-6 w-6" />
        </Button>
        
        <Button
          onClick={skipExercise}
          variant="outline"
          size="lg"
          className="rounded-full w-16 h-16"
          disabled={currentExerciseIndex >= totalExercises - 1}
        >
          <SkipForward className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}