import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, SkipForward, Info, ArrowLeft, MoonStar, SquareMinus, SquarePlus, Square } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { VideoPlayer } from "./VideoPlayer";
import { toast } from "sonner";
import { api } from "../utils/api";
import { type Workout } from "../data/workouts";
import type { Exercise } from "../data/exercises";

interface ExtendedExercise extends Exercise {
  sets?: number;
  reps?: string;
  weight?: number;
}

interface TimerPageProps {
  onNavigate: (page: string) => void;
  workout?: Workout;
}

export function TimerPage({ onNavigate, workout }: TimerPageProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(workout?.exercises_list?.[0]?.duration || 30);
  const [isRunning, setIsRunning] = useState(false);
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(60);
  const [isRestRunning, setIsRestRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [completedSets, setCompletedSets] = useState(0);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);

  const defaultExercises: ExtendedExercise[] = [
    {
      id: "default_1",
      name: "Прыжки на месте",
      duration: 30,
      rest: 15,
      sets: 1,
      reps: '30с',
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
      sets: 1,
      reps: '30с',
      video: "default.mp4",
      category: "Сила",
      difficulty: "Легко",
      muscleGroups: ["Ноги"]
    },
  ];

  const exercises: ExtendedExercise[] = workout?.exercises_list?.map((ex: Exercise) => ({
    ...ex,
    sets: (ex as any)?.sets || 1,
  })) || defaultExercises;

  const currentExercise = exercises[currentExerciseIndex] || exercises[0];
  const totalExercises = exercises.length;
  const currentSets = (currentExercise as ExtendedExercise)?.sets || 1;
  const isLastSet = currentSetIndex >= currentSets - 1;
  const totalSets = exercises.reduce((acc, ex) => acc + (ex.sets || 1), 0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev: number) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Автоматическая остановка при истечении времени, но без перехода к следующему
      setIsRunning(false);
      toast.info('Подход завершен');
      playBeep();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Автоматический сброс таймера на duration текущего упражнения при смене упражнения (если не запущен)
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(currentExercise?.duration || 30);
    }
  }, [currentExerciseIndex, isRunning, currentExercise?.duration]);

  // Таймер для отдыха
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRestRunning && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft((prev: number) => prev - 1);
      }, 1000);
    } else if (restTimeLeft === 0 && isRestRunning) {
      setIsRestRunning(false);
      toast.info('Отдых завершен');
      setIsRestModalOpen(false);
      playBeep();
    }

    return () => clearInterval(interval);
  }, [isRestRunning, restTimeLeft]);

  const playBeep = () => {
    if (typeof window !== 'undefined') {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.7, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1.0);
    }
  };

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
      totalExercises: exercises.length,
      completedSets: completedSets,
      totalSets: totalSets
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
        completedSets: completedSets,
        totalSets: totalSets,
        duration: actualDuration,
        date: endTime.toISOString(),
        exercises: exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets || 1,
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

  const toggleRestTimer = () => {
    if (!isRestRunning) {
      setIsRestRunning(true);
    } else {
      setIsRestRunning(false);
    }
  };

  const resetRestTimer = () => {
    setIsRestRunning(false);
    setRestTimeLeft(60);
  };

  const adjustRestTime = (delta: number) => {
    setRestTimeLeft(prev => Math.max(0, prev + delta));
  };

  const completeRest = () => {
    setIsRestRunning(false);
    setIsRestModalOpen(false);
    setRestTimeLeft(60);
  };

  const openRestModal = () => {
    resetTimer();
    setRestTimeLeft(60);
    setIsRestRunning(true);
    setIsRestModalOpen(true);
  };


  const nextSet = () => {
    if (isLastSet) {
      // Переход к следующему упражнению
      setCompletedExercises(prev => prev + 1);
      setCompletedSets(prev => prev + 1);
      // setCurrentExerciseIndex(prev => prev + 1);
      // setCurrentSetIndex(0);
      if (currentExerciseIndex + 1 < totalExercises) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSetIndex(0);
        setTimeLeft(currentExercise?.duration || 30);
      } else {
        handleWorkoutComplete();
      }
    } else {
      // Следующий подход
      setCurrentSetIndex(prev => prev + 1);
      setCompletedSets(prev => prev + 1);
      setTimeLeft(currentExercise?.duration || 30);
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      const prevIndex = currentExerciseIndex - 1;
      const prevExercise = exercises[prevIndex];
      const prevSets = (prevExercise as ExtendedExercise)?.sets || 1;
      setCompletedExercises(prev => Math.max(0, prev - 1));
      setCompletedSets(prev => Math.max(0, prev - prevSets));
      setCurrentExerciseIndex(prev => prev - 1);
      setCurrentSetIndex(0);
      setTimeLeft(exercises[prevIndex]?.duration || 30);
    }
  };

  const skipCurrent = () => {
    setCompletedExercises(prev => prev + 1);
    setCompletedSets(prev => prev + (currentSets - currentSetIndex));
    const nextIndex = currentExerciseIndex + 1;
    // setCurrentExerciseIndex(nextIndex);
    // setCurrentSetIndex(0);
    if (nextIndex < totalExercises) {
      setCurrentExerciseIndex(nextIndex);
      setCurrentSetIndex(0);
      setTimeLeft(currentExercise?.duration || 30);
    // } else {
    //   handleWorkoutComplete();
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentExercise?.duration || 30);
  };

  const resetWorkout = () => {
    setIsRunning(false);
    setCurrentExerciseIndex(0);
    setCurrentSetIndex(0);
    setTimeLeft(exercises[0]?.duration || 30);
    setCompletedExercises(0);
    setCompletedSets(0);
    setWorkoutStartTime(null);
  };


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = currentSets > 0 ? (currentSetIndex / currentSets) * 100 : 0;

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
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('home')} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold">
          {workout?.name || "Тренировка"}
        </h1>
      </div>



      {/* Текущее упражнение */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl mb-2">
            {currentExercise?.name || "Упражнение"}
          </CardTitle>
          <div className="flex justify-center gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">
              {currentExercise?.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {currentExercise?.muscleGroups?.join(", ")}
            </Badge>
            {currentSets > 1 && (
              <Badge variant="default" className="text-xs">
                Подход {currentSetIndex + 1} из {currentSets}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Видео плеер */}
          {currentExercise?.video && (
            <div className="mb-4 scale-[1] mx-auto">
              <VideoPlayer
                key={`${currentExercise.video}-${currentSetIndex}`} // Ключ для перезапуска видео на новом подходе
                videoSrc={currentExercise.video}
                exerciseName={currentExercise.name}
                autoPlay={isRunning}
                loop={true}
                muted={true}
              />
            </div>
          )}
          

          {/* Информация о подходе */}
          {/* <div className="space-y-2 text-center">
            {currentExercise.reps && (
              <p className="text-lg font-semibold">{currentExercise.reps} повторений</p>
            )}
            {currentExercise.weight && (
              <p className="text-sm text-muted-foreground">Вес: {currentExercise.weight} кг</p>
            )}
          </div> */}
        </CardContent>
      </Card>

      {/* Модальное окно для отдыха */}
      <Dialog open={isRestModalOpen} onOpenChange={setIsRestModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Отдых</DialogTitle>
            <DialogDescription>Таймер отдыха</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4 justify-center">

              <Button onClick={() => adjustRestTime(-10)} variant="outline" size="lg" className="rounded-full w-12 h-12 shadow-lg">
                <SquareMinus className="h-12 w-12" />
              </Button>
              <span className="text-6xl font-bold text-primary justify-center flex items-center">{formatTime(restTimeLeft)}</span>
              <Button onClick={() => adjustRestTime(10)} variant="outline" size="lg" className="rounded-full w-12 h-12 shadow-lg">
                <SquarePlus className="h-12 w-12" />
              </Button>
            </div>
            <div className="flex justify-center mt-4">
              <Button
                onClick={completeRest}
                variant="default"
                size="lg"
                className="w-full max-w-[200px]"
              >
                Завершить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Прогресс */}
      
      {/* Отдельный блок таймера */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">
            Отведенное время для подхода
          </CardTitle>
          {/* <div className="flex justify-center gap-2 mb-4">
            <Button
              size="sm"
              variant="default"
              onClick={() => {
                setTimeLeft(currentExercise?.duration || 30);
              }}
            >
              Время подхода по плану ({currentExercise?.duration || 30}с)
            </Button>
          </div> */}
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-6xl font-bold text-primary h-20">{formatTime(timeLeft)}</span>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button onClick={toggleTimer} size="lg" className="rounded-full w-16 h-16 shadow-lg">
              {isRunning ? <Square className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            {/* <Button onClick={resetTimer} variant="outline" size="lg" className="rounded-full w-16 h-16 shadow-lg">
              <RotateCcw className="h-6 w-6" />
            </Button> */}
            <Button onClick={openRestModal} variant="outline" size="lg" className="rounded-full w-16 h-16 shadow-lg">
              <MoonStar className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Упражнение {currentExerciseIndex + 1}/{totalExercises}</span>
              {currentSets > 1 && <span>Выполнено: {currentSetIndex}/{currentSets} подходов</span>}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Навигация по упражнениям */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 justify-center">
              <Button
                onClick={previousExercise}
                variant="outline"
                size="sm"
                className="flex-1 min-w-[100px]"
                disabled={currentExerciseIndex === 0}
              >
                ← Предыдущее
              </Button>
              <Button
                onClick={skipCurrent}
                variant="outline"
                size="sm"
                className="flex-1 min-w-[100px]"
                disabled={currentExerciseIndex + 1 === totalExercises}
              >
                Следующее →
              </Button>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={nextSet}
                size="sm"
                className="w-full max-w-[200px]"
                disabled={currentExerciseIndex >= totalExercises && isLastSet}
              >
                {isLastSet ? 'Закончить упражнение' : 'Следующий подход'}
              </Button>
            </div>
            {completedExercises > 0 && (
              <div className="flex justify-center">
                <Button
                  onClick={resetWorkout}
                  variant="outline"
                  size="sm"
                  className="w-full max-w-[200px]"
                >
                  Сбросить тренировку
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      
      {/* Кнопки отмены и завершения */}
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => onNavigate('home')}
          variant="outline"
          size="lg"
          className="w-full h-12"
        >
          Отменить тренировку
        </Button>
        <Button
          onClick={handleWorkoutComplete}
          variant="default"
          size="lg"
          className="w-full h-12 font-semibold"
        >
          Завершить тренировку
        </Button>
      </div>
    </div>
  );

}