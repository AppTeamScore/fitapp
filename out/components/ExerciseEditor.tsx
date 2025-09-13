import { X, Clock, Weight, Repeat, Zap } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Exercise } from '../data/exercises';

interface ExerciseEditorProps {
  exercise: {
    exercise: Exercise;
    sets: number;
    reps: string;
    duration: number;
    weight?: number;
    restTime?: number;
    uniqueId?: string;
  };
  index: number;
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
}

export function ExerciseEditor({ exercise: ex, index, onUpdate, onRemove }: ExerciseEditorProps) {
  // Определяем, является ли упражнение силовым с весом
  const isWeightExercise = ex.weight !== undefined || 
    ex.exercise.hasWeight || 
    ex.exercise.name.toLowerCase().includes('гантел') || 
    ex.exercise.name.toLowerCase().includes('штанг') ||
    ex.exercise.name.toLowerCase().includes('жим') ||
    ex.exercise.name.toLowerCase().includes('тяга') ||
    ex.exercise.name.toLowerCase().includes('французский');

  return (
    <div className="p-4 border rounded-lg space-y-4 bg-card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{ex.exercise.name}</h4>
          <p className="text-xs text-muted-foreground">
            {ex.exercise.category} • {ex.exercise.difficulty}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-destructive hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Основные параметры */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1">
            <Repeat className="w-3 h-3" />
            Подходы
          </Label>
          <Input
            type="number"
            value={ex.sets}
            onChange={(e) => onUpdate(index, 'sets', parseInt(e.target.value) || 1)}
            className="h-9"
            min="1"
            max="10"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Повторения</Label>
          <Input
            value={ex.reps}
            onChange={(e) => onUpdate(index, 'reps', e.target.value)}
            className="h-9"
            placeholder="10-12"
          />
        </div>
      </div>

      {/* Время и дополнительные параметры */}
      <div className={`grid gap-3 ${isWeightExercise ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Время (сек)
          </Label>
          <Input
            type="number"
            value={ex.duration}
            onChange={(e) => onUpdate(index, 'duration', parseInt(e.target.value) || 30)}
            className="h-9"
            min="5"
            max="300"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Отдых (сек)
          </Label>
          <Input
            type="number"
            value={ex.restTime || ex.exercise.rest}
            onChange={(e) => onUpdate(index, 'restTime', parseInt(e.target.value) || 0)}
            className="h-9"
            min="0"
            max="180"
          />
        </div>
        
        {isWeightExercise && (
          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-1">
              <Weight className="w-3 h-3" />
              Вес (кг)
            </Label>
            <Input
              type="number"
              value={ex.weight || 10}
              onChange={(e) => onUpdate(index, 'weight', parseFloat(e.target.value) || 0)}
              className="h-9"
              min="0"
              max="200"
              step="0.5"
              placeholder="10"
            />
          </div>
        )}
      </div>
      
      {/* Быстрые кнопки настройки */}
      <div className="flex gap-2 pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdate(index, 'duration', Math.max(5, ex.duration - 10))}
          className="text-xs h-7"
        >
          -10с
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdate(index, 'duration', ex.duration + 10)}
          className="text-xs h-7"
        >
          +10с
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdate(index, 'restTime', Math.max(0, (ex.restTime || ex.exercise.rest) - 5))}
          className="text-xs h-7"
        >
          Отдых -5с
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdate(index, 'restTime', (ex.restTime || ex.exercise.rest) + 5)}
          className="text-xs h-7"
        >
          Отдых +5с
        </Button>
      </div>
    </div>
  );
}