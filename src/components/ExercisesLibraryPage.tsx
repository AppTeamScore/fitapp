import { useState } from "react";
import { ArrowLeft, Search, Filter, Video, Clock, Target, Play, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible";
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
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("Все");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const categories = ["Все", "Кардио", "Сила", "HIIT", "Растяжка"];
  const difficulties = ["Все", "Легко", "Средне", "Сложно"];
  
  // Создаем список уникальных мышечных групп
  const allMuscleGroups = Array.from(
    new Set(exerciseData.flatMap(exercise => exercise.muscleGroups))
  );
  const muscleGroups = ["Все", ...allMuscleGroups];

  const filteredExercises = exerciseData.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Все" || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "Все" || exercise.difficulty === selectedDifficulty;
    const matchesMuscleGroup = selectedMuscleGroup === "Все" || exercise.muscleGroups.includes(selectedMuscleGroup);
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesMuscleGroup;
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
      <div className="flex items-center">
        <Button onClick={() => onNavigate('home')} variant="ghost" size="sm" className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold">Библиотека упражнений</h1>
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
      <div className="space-y-3">
        {/* Категория */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 border rounded-lg hover:bg-muted/50">
            <h3 className="font-medium">Категория</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedCategory}</span>
              {selectedCategory === "Все" ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="flex flex-wrap gap-2 p-2">
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
          </CollapsibleContent>
        </Collapsible>

        {/* Сложность */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 border rounded-lg hover:bg-muted/50">
            <h3 className="font-medium">Сложность</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedDifficulty}</span>
              {selectedDifficulty === "Все" ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="flex flex-wrap gap-2 p-2">
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
          </CollapsibleContent>
        </Collapsible>

        {/* Мышечная группа */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 border rounded-lg hover:bg-muted/50">
            <h3 className="font-medium">Мышечная группа</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedMuscleGroup}</span>
              {selectedMuscleGroup === "Все" ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="flex flex-wrap gap-2 p-2">
              {muscleGroups.map((muscleGroup) => (
                <Button
                  key={muscleGroup}
                  variant={selectedMuscleGroup === muscleGroup ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMuscleGroup(muscleGroup)}
                >
                  {muscleGroup}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{filteredExercises.length}</div>
            <div className="text-sm text-muted-foreground">Упражнений</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{muscleGroups.length}</div>
            <div className="text-sm text-muted-foreground">Мышечных групп</div>
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
          <Card
            key={exercise.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={(e) => {
              // Проверяем, что клик не был по кнопке
              if (!(e.target instanceof HTMLElement) ||
                  e.target.closest('button') ||
                  e.target.closest('Badge')) {
                return;
              }
              handlePreviewExercise(exercise);
            }}
          >
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
                        <Target className="h-4 w-4 mr-1" />
                        {exercise.muscleGroups.join(", ")}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewExercise(exercise);
                      }}
                      size="sm"
                      variant="outline"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {selectedExercise?.id === exercise.id ? "Скрыть" : "Просмотр"}
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayExercise(exercise);
                      }}
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
                      autoPlay={true}
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