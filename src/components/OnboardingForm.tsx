import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ArrowRight, ArrowLeft, Target, User, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface OnboardingFormProps {
  user: any;
  onComplete: (formData: any) => void;
}

interface FormData {
  // Персональные данные
  age: string;
  weight: string;
  height: string;
  gender: string;
  
  // Цели
  primaryGoal: string;
  specificGoals: string[];
  targetWeight: string;
  
  // Уровень подготовки
  fitnessLevel: string;
  workoutFrequency: string;
  workoutDuration: string;
  
  // Ограничения и предпочтения
  injuries: string;
  limitations: string;
  preferredWorkoutTypes: string[];
  equipment: string[];
  
  // Расписание
  availableDays: string[];
  preferredTime: string;
}

export function OnboardingForm({ user, onComplete }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    weight: '',
    height: '',
    gender: '',
    
    primaryGoal: '',
    specificGoals: [],
    targetWeight: '',
    
    fitnessLevel: '',
    workoutFrequency: '',
    workoutDuration: '',
    
    injuries: '',
    limitations: '',
    preferredWorkoutTypes: [],
    equipment: [],
    
    availableDays: [],
    preferredTime: ''
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleArrayFieldChange = (field: keyof FormData, value: string, checked: boolean) => {
    const currentArray = formData[field] as string[];
    if (checked) {
      setFormData({
        ...formData,
        [field]: [...currentArray, value]
      });
    } else {
      setFormData({
        ...formData,
        [field]: currentArray.filter(item => item !== value)
      });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Получаем токен пользователя
      const { data: { session } } = await import('../utils/supabase/client').then(m => m.supabase.auth.getSession());
      
      if (!session?.access_token) {
        toast.error('Ошибка авторизации');
        return;
      }

      // Отправляем данные на сервер для обновления профиля
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          ...formData,
          onboardingCompleted: true,
          completedAt: new Date().toISOString()
        })
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(`Ошибка сохранения данных: ${result.error}`);
        return;
      }

      toast.success('Профиль успешно настроен!');
      onComplete(formData);
      
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast.error('Сервер недоступен. Данные будут сохранены локально.');
        // В случае ошибки сети все равно продолжаем
        onComplete(formData);
      } else {
        toast.error('Произошла ошибка при сохранении данных');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.age && formData.gender && formData.fitnessLevel;
      case 2:
        return formData.primaryGoal;
      case 3:
        return formData.workoutFrequency && formData.workoutDuration;
      case 4:
        return formData.availableDays.length > 0;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="mx-auto h-12 w-12 text-primary mb-2" />
              <h2 className="text-xl font-semibold">Расскажите о себе</h2>
              <p className="text-muted-foreground">Эти данные помогут создать персональный план</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Возраст</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Вес (кг)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Рост (см)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Пол</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value: string) => setFormData({ ...formData, gender: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Мужской</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Женский</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fitnessLevel">Уровень подготовки</Label>
                <Select onValueChange={(value: string) => setFormData({ ...formData, fitnessLevel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите уровень" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="начинающий">Начинающий</SelectItem>
                    <SelectItem value="средний">Средний</SelectItem>
                    <SelectItem value="продвинутый">Продвинутый</SelectItem>
                    <SelectItem value="профессионал">Профессионал</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="mx-auto h-12 w-12 text-primary mb-2" />
              <h2 className="text-xl font-semibold">Ваши цели</h2>
              <p className="text-muted-foreground">Что хотите достичь?</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primaryGoal">Основная цель</Label>
                <Select onValueChange={(value: string) => setFormData({ ...formData, primaryGoal: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите основную цель" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="снижение-веса">Снижение веса</SelectItem>
                    <SelectItem value="набор-мышц">Набор мышечной массы</SelectItem>
                    <SelectItem value="увеличение-силы">Увеличение силы</SelectItem>
                    <SelectItem value="выносливость">Выносливость</SelectItem>
                    <SelectItem value="гибкость">Гибкость</SelectItem>
                    <SelectItem value="общая-форма">Общая физическая форма</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.primaryGoal === 'снижение-веса' && (
                <div className="space-y-2">
                  <Label htmlFor="targetWeight">Целевой вес (кг)</Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    placeholder="65"
                    value={formData.targetWeight}
                    onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                  />
                </div>
              )}
              
              <div className="space-y-3">
                <Label>Дополнительные цели (можно выбрать несколько)</Label>
                <div className="space-y-2">
                  {[
                    { value: 'stress-relief', label: 'Снятие стресса' },
                    { value: 'sleep-improvement', label: 'Улучшение сна' },
                    { value: 'energy-boost', label: 'Повышение энергии' },
                    { value: 'posture', label: 'Улучшение осанки' },
                    { value: 'injury-prevention', label: 'Профилактика травм' }
                  ].map((goal) => (
                    <div key={goal.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal.value}
                        checked={formData.specificGoals.includes(goal.value)}
                        onCheckedChange={(checked: boolean) =>
                          handleArrayFieldChange('specificGoals', goal.value, checked)
                        }
                      />
                      <Label htmlFor={goal.value}>{goal.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Clock className="mx-auto h-12 w-12 text-primary mb-2" />
              <h2 className="text-xl font-semibold">Режим тренировок</h2>
              <p className="text-muted-foreground">Как часто и сколько планируете заниматься?</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workoutFrequency">Частота тренировок в неделю</Label>
                <Select onValueChange={(value: string) => setFormData({ ...formData, workoutFrequency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите частоту" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-3">2-3 раза в неделю</SelectItem>
                    <SelectItem value="4-5">4-5 раз в неделю</SelectItem>
                    <SelectItem value="6-7">6-7 раз в неделю</SelectItem>
                    <SelectItem value="daily">Каждый день</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workoutDuration">Продолжительность тренировки</Label>
                <Select onValueChange={(value: string) => setFormData({ ...formData, workoutDuration: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите время" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15-30">15-30 минут</SelectItem>
                    <SelectItem value="30-45">30-45 минут</SelectItem>
                    <SelectItem value="45-60">45-60 минут</SelectItem>
                    <SelectItem value="60+">Более часа</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label>Предпочитаемые типы тренировок</Label>
                <div className="space-y-2">
                  {[
                    { value: 'strength', label: 'Силовые тренировки' },
                    { value: 'cardio', label: 'Кардио' },
                    { value: 'hiit', label: 'HIIT тренировки' },
                    { value: 'stretching', label: 'Растяжка' }
                  ].map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={formData.preferredWorkoutTypes.includes(type.value)}
                        onCheckedChange={(checked: boolean) =>
                          handleArrayFieldChange('preferredWorkoutTypes', type.value, checked)
                        }
                      />
                      <Label htmlFor={type.value}>{type.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <AlertTriangle className="mx-auto h-12 w-12 text-primary mb-2" />
              <h2 className="text-xl font-semibold">Ограничения и расписание</h2>
              <p className="text-muted-foreground">Последние детали для идеального плана</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="injuries">Травмы или проблемы со здоровьем</Label>
                <Textarea
                  id="injuries"
                  placeholder="Опишите травмы, боли или ограничения (если есть)"
                  value={formData.injuries}
                  onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="limitations">Другие ограничения</Label>
                <Textarea
                  id="limitations"
                  placeholder="Аллергии, непереносимость нагрузок и т.д."
                  value={formData.limitations}
                  onChange={(e) => setFormData({ ...formData, limitations: e.target.value })}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Доступные дни для тренировок</Label>
                <div className="space-y-2">
                  {[
                    { value: 'monday', label: 'Понедельник' },
                    { value: 'tuesday', label: 'Вторник' },
                    { value: 'wednesday', label: 'Среда' },
                    { value: 'thursday', label: 'Четверг' },
                    { value: 'friday', label: 'Пятница' },
                    { value: 'saturday', label: 'Суббота' },
                    { value: 'sunday', label: 'Воскресенье' }
                  ].map((day) => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.value}
                        checked={formData.availableDays.includes(day.value)}
                        onCheckedChange={(checked: boolean) =>
                          handleArrayFieldChange('availableDays', day.value, checked)
                        }
                      />
                      <Label htmlFor={day.value}>{day.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="equipment">Доступное оборудование</Label>
                <Select onValueChange={(value: string) => setFormData({ ...formData, equipment: value.split(',') })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите оборудование" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Домашнее</SelectItem>
                    <SelectItem value="gym">Тренажерный зал</SelectItem>
                    <SelectItem value="both">Оба</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferredTime">Предпочитаемое время тренировок</Label>
                <Select onValueChange={(value: string) => setFormData({ ...formData, preferredTime: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите время" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Утром (6:00-10:00)</SelectItem>
                    <SelectItem value="lunch">В обед (11:00-14:00)</SelectItem>
                    <SelectItem value="afternoon">После обеда (15:00-18:00)</SelectItem>
                    <SelectItem value="evening">Вечером (19:00-22:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">Настройка профиля</CardTitle>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 w-8 rounded-full ${
                    i + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Шаг {currentStep} из {totalSteps}
          </p>
        </CardHeader>
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            
            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit}
                disabled={!validateCurrentStep() || isLoading}
              >
                {isLoading ? 'Сохранение...' : 'Завершить настройку'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!validateCurrentStep()}
              >
                Далее
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}