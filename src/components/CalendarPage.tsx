import { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface CalendarPageProps {
  onNavigate: (page: string) => void;
}

export function CalendarPage({ onNavigate }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutData, setWorkoutData] = useState<Record<string, {type: string, completed: boolean}>>({});
  
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
      case 'Йога': return 'bg-green-100 text-green-800';
      case 'Тренировка': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addWorkout = (day: number) => {
    const dateKey = getDateKey(day);
    const newWorkout = {
      date: dateKey,
      type: 'Тренировка',
      completed: false
    };
    
    // Добавляем в plannedWorkouts в localStorage
    const plannedWorkouts = JSON.parse(localStorage.getItem('plannedWorkouts') || '[]');
    plannedWorkouts.push(newWorkout);
    localStorage.setItem('plannedWorkouts', JSON.stringify(plannedWorkouts));
    
    // Обновляем локальное состояние
    setWorkoutData(prev => ({
      ...prev,
      [dateKey]: { type: 'Тренировка', completed: false }
    }));
  };

  const markCompleted = (day: number) => {
    const dateKey = getDateKey(day);
    const workout = workoutData[dateKey];
    
    if (workout && !workout.completed) {
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
                <div key={day} className="relative">
                  <div className={`
                    p-2 text-center text-sm rounded-lg min-h-[3rem] border cursor-pointer
                    ${isToday ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                  `}>
                    <div className="font-medium">{day}</div>
                    {workout ? (
                      <div className="mt-1 space-y-1">
                        <Badge 
                          className={`text-xs ${getWorkoutTypeColor(workout.type)}`}
                        >
                          {workout.type}
                        </Badge>
                        {workout.completed ? (
                          <CheckCircle2 className="h-3 w-3 text-green-600 mx-auto" />
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              markCompleted(day);
                            }}
                          >
                            ✓
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 mt-1 opacity-50 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          addWorkout(day);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Инструкции */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Как использовать</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Нажмите + чтобы запланировать тренировку
            </div>
            <div className="flex items-center">
              <span className="mr-2">✓</span>
              Нажмите ✓ чтобы отметить тренировку как завершенную
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
              Завершенные тренировки
            </div>
          </div>
        </CardContent>
      </Card>

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
              <div className="w-3 h-3 rounded bg-green-500 mr-2"></div>
              Йога
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