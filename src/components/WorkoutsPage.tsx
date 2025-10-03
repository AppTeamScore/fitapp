import { ArrowLeft, Clock, Users, Zap, Play, Timer, Dumbbell, Target, Bot} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { workouts, type Workout } from "../data/workouts";

interface WorkoutsPageProps {
  onNavigate: (page: string) => void;
  onStartWorkout: (workout: Workout) => void;
}

export function WorkoutsPage({ onNavigate, onStartWorkout }: WorkoutsPageProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Легко': return 'bg-green-100 text-green-800';
      case 'Средне': return 'bg-yellow-100 text-yellow-800';
      case 'Сложно': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Кардио': return '🏃';
      case 'Сила': return '💪';
      case 'HIIT': return '⚡';
      case 'Пресс': return '🔥';
      case 'Растяжка': return '🧘';
      default: return '🏋️';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Кардио': return 'from-blue-500 to-blue-600';
      case 'Сила': return 'from-purple-500 to-purple-600';
      case 'HIIT': return 'from-red-500 to-red-600';
      case 'Пресс': return 'from-orange-500 to-orange-600';
      case 'Растяжка': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-4">
      {/* Заголовок */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border/50 z-10">
        <div className="p-4">
          <div className="flex items-center">
            <Button onClick={() => onNavigate('back')} variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-2xl font-bold">Готовые тренировки</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card
          className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0]"
          onClick={() => onNavigate('plan')}
        >
          {/* Цветная полоса сверху */}
          <div className="bg-primary h-2 rounded-full w-[90%] animate-pulse"></div>
          
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🦾</span>
                  <h3 className="font-bold text-lg leading-tight">Индивидуальный план тренировок</h3>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  Индивидуально проработанный план тренировок с помощью AI
                </p>
              </div>
            </div>
  

            {/* Бейджи */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-sm">
                  Создан с помощью AI
                </Badge>
              </div>
              
              <Button size="sm" className="gap-2" variant="default">
                <Bot className="w-4 h-4" />
                Посмотреть
              </Button>
            </div>
          </CardContent>
        </Card>

        {workouts.map((workout) => (
          <Card
            key={workout.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98]"
            onClick={() => onStartWorkout(workout)}
          >
            {/* Цветная полоса сверху */}
            <div className={`h-2 bg-gradient-to-r ${getCategoryColor(workout.category)}`}></div>
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getCategoryIcon(workout.category)}</span>
                    <h3 className="font-bold text-lg leading-tight">{workout.name}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {workout.description}
                  </p>
                </div>
              </div>

              {/* Статистика тренировки */}
              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{workout.duration} мин</span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="w-4 h-4" />
                  <span>{workout.exercises} упр.</span>
                </div>
              </div>

              {/* Бейджи */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {workout.category}
                  </Badge>
                  <Badge 
                    className={`text-xs ${getDifficultyColor(workout.difficulty)}`}
                    variant="outline"
                  >
                    {workout.difficulty}
                  </Badge>
                </div>
                
                <Button size="sm" className="gap-2">
                  <Play className="w-4 h-4" />
                  Начать
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}