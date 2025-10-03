import { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface CalendarPageProps {
  onNavigate: (page: string) => void;
}

export function CalendarPage({ onNavigate }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutData, setWorkoutData] = useState<Record<string, {type: string, completed: boolean}>>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  
  useEffect(() => {
    loadWorkoutData();
  }, []);

  const loadWorkoutData = () => {
    // Загружаем данные из localStorage
    const completedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
    const plannedWorkouts = JSON.parse(localStorage.getItem('plannedWorkouts') || '[]');
    
    const allWorkouts: Record<string, {type: string, completed: boolean}> = {};
    
    // Добавляем завершенные тренировки
    completedWorkouts.forEach((workout: any) => {
      const dateKey = workout.date.split('T')[0]; // Берем только дату без времени
      allWorkouts[dateKey] = {
        type: workout.type || 'Тренировка',
        completed: true
      };
    });
    
    // Добавляем запланированные тренировки
    plannedWorkouts.forEach((workout: any) => {
      const dateKey = workout.date.split('T')[0];
      if (!allWorkouts[dateKey]) { // Если нет завершенной тренировки на эту дату
        allWorkouts[dateKey] = {
          type: workout.type || 'Тренировка',
          completed: false
        };
      }
    });


    setWorkoutData(allWorkouts);
  };

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Понедельник = 0

    const days = [];
    
    // Пустые дни в начале месяца
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDateKey = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case 'Кардио': return 'bg-blue-100 text-blue-800';
      case 'Силовая': return 'bg-red-100 text-red-800';
      case 'HIIT': return 'bg-orange-100 text-orange-800';
      case 'Тренировка': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const workoutTypes = ['Кардио', 'Силовая', 'HIIT', 'Тренировка'];
  
  const openModal = (day: number) => {
    setSelectedDay(day);
    const dateKey = getDateKey(day);
    const workout = workoutData[dateKey];
    setSelectedType(workout ? workout.type : '');
    setShowModal(true);
  };
  
  const addWorkoutWithType = (day: number, type: string) => {
    const dateKey = getDateKey(day);
    const newWorkout = {
      date: dateKey,
      type,
      completed: false
    };
    
    // Проверяем, нет ли уже завершенной тренировки
    const completedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
    const hasCompleted = completedWorkouts.some((w: any) => w.date.split('T')[0] === dateKey);
    
    if (!hasCompleted) {
      const plannedWorkouts = JSON.parse(localStorage.getItem('plannedWorkouts') || '[]');
      // Удаляем существующую запланированную, если есть
      const filteredPlanned = plannedWorkouts.filter((w: any) => w.date.split('T')[0] !== dateKey);
      filteredPlanned.push(newWorkout);
      localStorage.setItem('plannedWorkouts', JSON.stringify(filteredPlanned));
      
      setWorkoutData(prev => ({
        ...prev,
        [dateKey]: { type, completed: false }
      }));
    }
  };
  
  const removeWorkout = (day: number) => {
    const dateKey = getDateKey(day);
    
    // Удаляем из plannedWorkouts
    let plannedWorkouts = JSON.parse(localStorage.getItem('plannedWorkouts') || '[]');
    plannedWorkouts = plannedWorkouts.filter((w: any) => w.date.split('T')[0] !== dateKey);
    localStorage.setItem('plannedWorkouts', JSON.stringify(plannedWorkouts));
    
    // Удаляем из completedWorkouts
    let completedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
    completedWorkouts = completedWorkouts.filter((w: any) => w.date.split('T')[0] !== dateKey);
    localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
    
    // Обновляем состояние
    setWorkoutData(prev => {
      const newData = { ...prev };
      delete newData[dateKey];
      return newData;
    });
  };

  const markCompleted = (day: number) => {
    const dateKey = getDateKey(day);
    const workout = workoutData[dateKey];
    
    if (workout && !workout.completed) {
      // Удаляем из plannedWorkouts
      let plannedWorkouts = JSON.parse(localStorage.getItem('plannedWorkouts') || '[]');
      plannedWorkouts = plannedWorkouts.filter((w: any) => w.date.split('T')[0] !== dateKey);
      localStorage.setItem('plannedWorkouts', JSON.stringify(plannedWorkouts));
      
      // Добавляем в completedWorkouts
      const completedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
      completedWorkouts.push({
        date: new Date(dateKey).toISOString(),
        type: workout.type,
        duration: 45 // Предполагаемая продолжительность
      });
      localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
      
      // Обновляем локальное состояние
      setWorkoutData(prev => ({
        ...prev,
        [dateKey]: { ...workout, completed: true }
      }));
    }
  };

  const days = getDaysInMonth(currentDate);
  const completedWorkouts = Object.values(workoutData).filter(w => w.completed).length;
  const totalWorkouts = Object.keys(workoutData).length;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center">
        <Button onClick={() => onNavigate('home')} variant="ghost" size="sm" className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold">Календарь</h1>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedWorkouts}</div>
            <div className="text-sm text-muted-foreground">Завершено</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalWorkouts - completedWorkouts}</div>
            <div className="text-sm text-muted-foreground">Запланировано</div>
          </CardContent>
        </Card>
      </div>

      {/* Календарь */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Дни недели */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Дни месяца */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="p-2" />;
              }
              
              const dateKey = getDateKey(day);
              const workout = workoutData[dateKey];
              const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
              
              return (
                <div key={index} className="relative">
                  <div
                    className={`
                      p-2 text-center text-sm rounded-lg min-h-[3rem] border cursor-pointer
                      ${isToday ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                    `}
                    onClick={() => openModal(day)}
                  >
                    <div className="font-medium">{day}</div>
                    {workout ? (
                      <div className="mt-1 space-y-1">
                        <Badge
                          className={`text-xs ${getWorkoutTypeColor(workout.type)}`}
                        >
                          {workout.type}
                        </Badge>
                        {workout.completed && (
                          <CheckCircle2 className="h-3 w-3 text-green-600 mx-auto" />
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Модальное окно */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDay ? `День ${selectedDay}` : 'Выбор тренировки'}
            </DialogTitle>
            <DialogDescription>
              Управление тренировкой на выбранный день.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedDay !== null && (
              <>
                {(() => {
                  const dateKey = getDateKey(selectedDay);
                  const workout = workoutData[dateKey];
                  if (!workout) {
                    return (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Выберите тип тренировки:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {workoutTypes.map((type) => (
                            <Button
                              key={type}
                              variant={selectedType === type ? "default" : "outline"}
                              onClick={() => setSelectedType(type)}
                              className="justify-start h-10"
                            >
                              {type}
                            </Button>
                          ))}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <Badge className={`text-xs ${getWorkoutTypeColor(workout.type)}`}>
                            {workout.type}
                          </Badge>
                          {workout.completed && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        </div>
                        {!workout.completed ? (
                          <Button
                            onClick={() => {
                              markCompleted(selectedDay);
                              setShowModal(false);
                            }}
                            className="w-full h-10"
                          >
                            Подтвердить выполнение
                          </Button>
                        ) : (
                          <div className="text-center py-2">
                            <p className="text-sm text-green-600 font-medium">Тренировка завершена</p>
                          </div>
                        )}
                        <Button
                          variant="destructive"
                          onClick={() => {
                            removeWorkout(selectedDay);
                            setShowModal(false);
                          }}
                          className="w-full h-10"
                        >
                          Удалить тренировку
                        </Button>
                      </div>
                    );
                  }
                })()}
                {!workoutData[getDateKey(selectedDay)] && (
                  <DialogFooter className="pt-4 border-t">
                    <Button
                      onClick={() => {
                        if (selectedType) {
                          addWorkoutWithType(selectedDay, selectedType);
                          setShowModal(false);
                        }
                      }}
                      disabled={!selectedType}
                      className="w-full"
                    >
                      Запланировать {selectedType}
                    </Button>
                  </DialogFooter>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Инструкции */}
      {/* <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Как использовать</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <span className="mr-2">📅</span>
              Нажмите на день чтобы управлять тренировкой
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
              Завершенные тренировки
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Типы тренировок</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-blue-500 mr-2"></div>
              Кардио
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-red-500 mr-2"></div>
              Силовая
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-orange-500 mr-2"></div>
              HIIT
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-purple-500 mr-2"></div>
              Тренировка
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}