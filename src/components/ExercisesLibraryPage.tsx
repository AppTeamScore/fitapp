import { useState } from "react";
import { Search, Filter, Video, Clock, Target, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { exerciseData, exercisesByCategory, type Exercise } from "../data/exercises";
import { VideoPlayer } from "./VideoPlayer";

interface ExercisesLibraryPageProps {
  onNavigate: (page: string) => void;
  onStartWorkout?: (workout: any) => void;
}

export function ExercisesLibraryPage({ onNavigate, onStartWorkout }: ExercisesLibraryPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Все");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const categories = ["Все", "Кардио", "Сила", "Пресс", "HIIT", "Растяжка"];
  const difficulties = ["Все", "Легко", "Средне", "Сложно"];

  const filteredExercises = exerciseData.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Все" || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "Все" || exercise.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });



  const handlePlayExercise = (exercise: any) => {
    // Создаем мини-тренировку из одного упражнения
    const singleExerciseWorkout = {
      id: 999,
      name: `Упражнение: ${exercise.name}`,
      exercises_list: [exercise],
      duration: Math.ceil(exercise.duration / 60),
      difficulty: exercise.difficulty,
      exercises: 1,
      description: `Отдельное выполнение упражнения "${exercise.name}"`,
      category: exercise.category
    };
    
    // Переходим к таймеру с этим упражнением
    if (onStartWorkout) {
      onStartWorkout(singleExerciseWorkout);
    }
  };

  const handlePreviewExercise = (exercise: any) => {
    setSelectedExercise(selectedExercise?.id === exercise.id ? null : exercise);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Библиотека упражнений</h1>
        <Button onClick={() => onNavigate('home')} variant="ghost">
          Назад
        </Button>
      </div>

      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск упражнений..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Фильтры */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Категория</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Сложность</h3>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{filteredExercises.length}</div>
            <div className="text-sm text-muted-foreground">Найдено</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{exerciseData.length}</div>
            <div className="text-sm text-muted-foreground">Всего</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{Object.keys(exercisesByCategory).length}</div>
            <div className="text-sm text-muted-foreground">Категорий</div>
          </CardContent>
        </Card>
      </div>

      {/* Список упражнений */}
      <div className="space-y-3">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{exercise.name}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {exercise.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {exercise.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {exercise.duration}с
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        {exercise.muscleGroups.join(", ")}
                      </div>
                    </div>

                    
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <Button
                      onClick={() => handlePreviewExercise(exercise)}
                      size="sm"
                      variant="outline"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {selectedExercise?.id === exercise.id ? "Скрыть" : "Просмотр"}
                    </Button>
                    <Button
                      onClick={() => handlePlayExercise(exercise)}
                      size="sm"
                    >
                      Попробовать
                    </Button>
                  </div>
                </div>

                {/* Превью видео */}
                {selectedExercise?.id === exercise.id && (
                  <div className="mt-4">
                    <VideoPlayer
                      videoSrc={exercise.video}
                      exerciseName={exercise.name}
                      autoPlay={false}
                      loop={true}
                      muted={true}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Упражнения не найдены. Попробуйте изменить параметры поиска.
          </p>
        </div>
      )}
    </div>
  );
}