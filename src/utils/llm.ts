import { log } from 'console';
import { exercises } from '../data/exercises';
import { getOpenRouterConfig } from './env';
import { logger } from './logger';

const config = getOpenRouterConfig();

interface WorkoutPlan {
  weekPlan: Array<{
    day: string;
    workoutName: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      duration: number;
    }>;
    totalDuration: number;
  }>;
  recommendations: string;
}

export async function generateWorkoutPlan(userProfile: any): Promise<WorkoutPlan> {
  // Ограничиваем список упражнений для промпта (первые 20, чтобы не превысить лимит токенов)
  const limitedExercises = exercises.slice(0, 160);
  const availableExercisesList = limitedExercises.map(ex => `- Имя: ${ex.name}, Категория: ${ex.category}, Целевые мышцы: (${ex.muscleGroups}), Сложность: ${ex.difficulty}, Базовое время одного подхода: ${ex.duration}`).join('\n');
  const getEquipmentText = (equipment: string[]) => {
    if (!equipment || equipment.length === 0) return 'Не указано';
    if (equipment.includes('both')) return 'Домашние тренировки, Тренажерный зал';
    
    return equipment
      .map((e: string) => 
        e === 'home' ? 'Домашние тренировки' :
        e === 'gym' ? 'Тренажерный зал' : e
      )
      .join(', ');
  };
  
  console.log(availableExercisesList); // Отладка статуса
  const prompt = `Создай мне продуманный и персонализированный план тренировок на основе следующих моих данных и пожелайний.

Мои персональные данные:
Возраст: ${userProfile.age || 'Не указан'}
Вес: ${userProfile.weight || 'Не указан'} кг
Рост: ${userProfile.height || 'Не указан'} см
Пол: ${userProfile.gender || 'Не указан'}

Мои цели:
Основная цель: ${userProfile.primaryGoal || userProfile.fitnessGoals || 'Улучшение общей физической формы'}
Дополнительные цели: ${userProfile.specificGoals ? userProfile.specificGoals.join(', ') : 'Не указано'}
Целевой вес: ${userProfile.targetWeight || 'Не указано'} кг

Уровень подготовки: ${userProfile.fitnessLevel || 'Начинающий'}
Частота тренировок: ${userProfile.workoutFrequency || 'Не указано'}
Продолжительность тренировки: ${userProfile.workoutDuration || 'Время не указано'} минут

Мои ограничения и проблемы:
Травмы: ${userProfile.injuries || 'Нет'}
Другие ограничения: ${userProfile.limitations || 'Нет'}

Мои предпочтения:
Типы тренировок: ${userProfile.preferredWorkoutTypes ? userProfile.preferredWorkoutTypes.join(', ') : 'все возможные'}
Доступное оборудование: ${getEquipmentText(userProfile.equipment)}
Доступные дни: ${userProfile.availableDays ? userProfile.availableDays.join(', ') : 'На всю неделю'}
Предпочитаемое время: ${userProfile.preferredTime || 'Не указано'}

Используй для формирования моего плана только эти доступные упражнения (строго только эти упражнения):
${availableExercisesList}

Создай план тренировок на эти дни: ${userProfile.availableDays ? userProfile.availableDays.join(', ') : 'на неделю'}, используя ТОЛЬКО упражнения из списка выше. Учитывай все предоставленные данные для персонализации. Распределяй тренировки по доступным дням, учитывай предпочтительное время, уровень подготовки, ограничения и цели. Для каждой тренировки укажи:
1. День недели (на русском: Понедельник, Вторник и т.д., только доступные дни, учти частоту тренировок).
2. Название тренировки.
3. Список упражнений с количеством подходов и повторений и длительностью одного подхода (учитывай уровень и цели).
4. Общая продолжительность тренировки в минутах (подгоняй под желаемое время тренировки).

Правки:
Выбранная частота тренировок является главным показателем, для количества тренировок в неделю.
Отдых не является днем тренировки или недели, его не указывай, а просто пропусти этот день! Если дней мало, сделай более интенсивные тренировки.

Вывод данных в JSON формат (обязательно следуй точно):
{
  "weekPlan": [
    {
      "day": "Понедельник",
      "workoutName": "Название тренировки",
      "exercises": [
        {
          "name": "Название упражнения",
          "sets": 4,
          "reps": "10-12",
          "duration": 60
        }
      ],
      "totalDuration": 30
    }
  ],
  "recommendations": "Расширенные и глубокие рекомендации мне, учитывая все мои данные (возраст, вес, цели, ограничения и т.д.) и пожелания. Так же добавь рекомендаций лично от себя. 
  рекомендации должны основаны на моих данных, пожеланиях и созданом тобой плане."
}`;

  console.log(prompt); // Отладка статуса

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'FitApp',
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free", // Ебалан, модель не меняй
        messages: [
          {
            role: "system",
            content: "Ты профессиональный тренер по фитнесу. Твоя задача создать правильный и продуманный план тренировок."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        response_format: { "type": "json_object" },
      }),
    });

    console.log('API Response Status:', response.status); // Отладка статуса

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Full API response:', data); // Полный ответ для отладки
    
    const content = data.choices?.[0]?.message?.content || '';
    console.log('LLM Content:', content); // Контент сообщения
    
    if (!content) {
      throw new Error('Пустой ответ от LLM');
    }
    
    // Более гибкий поиск JSON
    let cleanedContent = content
      .replace(/```(?:json)?[\s\S]*?```/gs, '') // Удаляем весь блок ```json ... ```
      .replace(/^\s*[\r\n]/gm, '') // Удаляем пустые строки в начале
      .trim();
    
    console.log('Cleaned content for JSON:', cleanedContent); // Отладка очищенного контента
    
    let jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Если не нашли, пробуем более агрессивную очистку
      cleanedContent = content.replace(/[^a-zA-Z0-9{},\[\]:"'\s-]/g, '').trim();
      jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    }
    
    if (jsonMatch) {
      const jsonString = jsonMatch[0];
      try {
        return JSON.parse(jsonString) as WorkoutPlan;
      } catch (parseError) {
        console.error('Parse error:', parseError, 'JSON string:', jsonString);
        throw new Error('Невалидный JSON в ответе');
      }
    } else {
      console.error('No JSON found in content:', content);
      throw new Error('JSON не найден в ответе');
    }
  } catch (error) {
    console.error('Ошибка генерации плана:', error);
    throw error;
  }
}