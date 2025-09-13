import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', logger())
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// Регистрация нового пользователя
app.post('/make-server-c6c9ad1a/signup', async (c) => {
  try {
    const { email, password, userData } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ error: 'Email и пароль обязательны' }, 400)
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: userData,
      // Автоматическое подтверждение email, так как email-сервер не настроен
      email_confirm: true
    })

    if (error) {
      console.log(`Ошибка регистрации пользователя: ${error.message}`)
      return c.json({ error: error.message }, 400)
    }

    // Сохраняем профиль пользователя
    if (data.user && userData) {
      await kv.set(`profile:${data.user.id}`, {
        ...userData,
        userId: data.user.id,
        email: data.user.email,
        createdAt: new Date().toISOString()
      })
    }

    return c.json({ user: data.user })
  } catch (error) {
    console.log(`Ошибка сервера при регистрации: ${error}`)
    return c.json({ error: 'Внутренняя ошибка сервера' }, 500)
  }
})

// Получение профиля пользователя
app.get('/make-server-c6c9ad1a/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Токен авторизации отсутствует' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user?.id) {
      return c.json({ error: 'Неавторизован' }, 401)
    }

    const profile = await kv.get(`profile:${user.id}`)
    
    return c.json({ profile: profile || { userId: user.id, email: user.email } })
  } catch (error) {
    console.log(`Ошибка получения профиля: ${error}`)
    return c.json({ error: 'Внутренняя ошибка сервера' }, 500)
  }
})

// Обновление профиля пользователя
app.put('/make-server-c6c9ad1a/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Токен авторизации отсутствует' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user?.id) {
      return c.json({ error: 'Неавторизован' }, 401)
    }

    const profileData = await c.req.json()
    
    const updatedProfile = {
      ...profileData,
      userId: user.id,
      email: user.email,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`profile:${user.id}`, updatedProfile)
    
    return c.json({ profile: updatedProfile })
  } catch (error) {
    console.log(`Ошибка обновления профиля: ${error}`)
    return c.json({ error: 'Внутренняя ошибка сервера' }, 500)
  }
})

// Генерация персонализированного плана тренировок
app.post('/make-server-c6c9ad1a/generate-workout-plan', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Токен авторизации отсутствует' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user?.id) {
      return c.json({ error: 'Неавторизован' }, 401)
    }

    const { goals, fitnessLevel, limitations, preferences, availableExercises } = await c.req.json()
    
    if (!goals || !fitnessLevel || !availableExercises) {
      return c.json({ error: 'Необходимые данные отсутствуют' }, 400)
    }

    // Формируем промпт для LLM
    const prompt = `Создай персонализированный план тренировок на основе следующих данных:

Цели: ${goals}
Уровень подготовки: ${fitnessLevel}
Ограничения: ${limitations || 'Нет'}
Предпочтения: ${preferences || 'Нет специальных предпочтений'}

Доступные упражнения:
${availableExercises.map((exercise: any) => `- ${exercise.name} (${exercise.category}, ${exercise.difficulty})`).join('\n')}

Создай план тренировок на неделю, используя ТОЛЬКО упражнения из списка выше. Для каждой тренировки укажи:
1. День недели
2. Название тренировки
3. Список упражнений с количеством подходов и повторений
4. Продолжительность тренировки

Ответь в формате JSON:
{
  "weekPlan": [
    {
      "day": "Понедельник",
      "workoutName": "Название тренировки",
      "exercises": [
        {
          "name": "Название упражнения",
          "sets": 3,
          "reps": "10-12",
          "duration": 30
        }
      ],
      "totalDuration": 45
    }
  ],
  "recommendations": "Общие рекомендации"
}`

    // Отправляем запрос к LLM API
    const llmResponse = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'gpt-4',
        max_tokens: 2000
      })
    })

    if (!llmResponse.ok) {
      throw new Error(`LLM API ошибка: ${llmResponse.status}`)
    }

    const llmData = await llmResponse.json()
    let generatedPlan

    try {
      // Пытаемся извлечь JSON из ответа
      const content = llmData.choices?.[0]?.message?.content || llmData.content
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        generatedPlan = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('JSON не найден в ответе')
      }
    } catch (parseError) {
      console.log(`Ошибка парсинга ответа LLM: ${parseError}`)
      return c.json({ error: 'Ошибка обработки ответа от LLM' }, 500)
    }

    // Сохраняем план пользователя
    const planData = {
      userId: user.id,
      plan: generatedPlan,
      createdAt: new Date().toISOString(),
      goals,
      fitnessLevel,
      limitations,
      preferences
    }
    
    await kv.set(`workout_plan:${user.id}`, planData)
    
    return c.json({ plan: generatedPlan, planData })
  } catch (error) {
    console.log(`Ошибка генерации плана тренировок: ${error}`)
    return c.json({ error: 'Не удалось сгенерировать план тренировок' }, 500)
  }
})

// Получение плана тренировок пользователя
app.get('/make-server-c6c9ad1a/workout-plan', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Токен авторизации отсутствует' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user?.id) {
      return c.json({ error: 'Неавторизован' }, 401)
    }

    const planData = await kv.get(`workout_plan:${user.id}`)
    
    return c.json({ planData })
  } catch (error) {
    console.log(`Ошибка получения плана тренировок: ${error}`)
    return c.json({ error: 'Внутренняя ошибка сервера' }, 500)
  }
})

// Удаление плана тренировок пользователя
app.delete('/make-server-c6c9ad1a/workout-plan', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Токен авторизации отсутствует' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user?.id) {
      return c.json({ error: 'Неавторизован' }, 401)
    }

    await kv.del(`workout_plan:${user.id}`)
    
    return c.json({ success: true, message: 'План тренировок удален' })
  } catch (error) {
    console.log(`Ошибка удаления плана тренировок: ${error}`)
    return c.json({ error: 'Внутренняя ошибка сервера' }, 500)
  }
})

// Сохранение прогресса тренировки
app.post('/make-server-c6c9ad1a/workout-progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Токен авторизации отсутствует' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user?.id) {
      return c.json({ error: 'Неавторизован' }, 401)
    }

    const progressData = await c.req.json()
    
    const progressRecord = {
      userId: user.id,
      ...progressData,
      completedAt: new Date().toISOString()
    }
    
    // Сохраняем запись о прогрессе с уникальным ключом
    const progressKey = `progress:${user.id}:${Date.now()}`
    await kv.set(progressKey, progressRecord)
    
    return c.json({ success: true, progressRecord })
  } catch (error) {
    console.log(`Ошибка сохранения прогресса: ${error}`)
    return c.json({ error: 'Внутренняя ошибка сервера' }, 500)
  }
})

// Получение истории прогресса
app.get('/make-server-c6c9ad1a/workout-progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Токен авторизации отсутствует' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user?.id) {
      return c.json({ error: 'Неавторизован' }, 401)
    }

    const progressRecords = await kv.getByPrefix(`progress:${user.id}:`)
    
    return c.json({ progressRecords })
  } catch (error) {
    console.log(`Ошибка получения прогресса: ${error}`)
    return c.json({ error: 'Внутренняя ошибка сервера' }, 500)
  }
})

// Удаление всей статистики тренировок
app.delete('/make-server-c6c9ad1a/workout-progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Токен авторизации отсутствует' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user?.id) {
      return c.json({ error: 'Неавторизован' }, 401)
    }

    // Получаем все записи прогресса пользователя
    const progressRecords = await kv.getByPrefix(`progress:${user.id}:`)
    
    // Удаляем все записи прогресса
    const deletePromises = []
    for (const record of progressRecords) {
      // Извлекаем timestamp из completedAt для формирования ключа
      const timestamp = new Date(record.completedAt).getTime()
      const key = `progress:${user.id}:${timestamp}`
      deletePromises.push(kv.del(key))
    }
    
    await Promise.all(deletePromises)
    
    return c.json({ 
      success: true, 
      message: 'Статистика тренировок очищена',
      deletedRecords: progressRecords.length
    })
  } catch (error) {
    console.log(`Ошибка очистки статистики: ${error}`)
    return c.json({ error: 'Внутренняя ошибка сервера' }, 500)
  }
})

// Сохранение ручного плана тренировок
app.post('/make-server-c6c9ad1a/manual-workout-plan', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Токен авторизации отсутствует' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user?.id) {
      return c.json({ error: 'Неавторизован' }, 401)
    }

    const { plan } = await c.req.json()
    
    if (!plan) {
      return c.json({ error: 'План тренировок не предоставлен' }, 400)
    }

    // Сохраняем ручной план пользователя
    const planData = {
      userId: user.id,
      plan: plan,
      createdAt: new Date().toISOString(),
      isManual: true,
      type: 'manual'
    }
    
    await kv.set(`workout_plan:${user.id}`, planData)
    
    return c.json({ success: true, planData })
  } catch (error) {
    console.log(`Ошибка сохранения ручного плана тренировок: ${error}`)
    return c.json({ error: 'Не удалось сохранить план тренировок' }, 500)
  }
})

// Удаление аккаунта пользователя
app.delete('/make-server-c6c9ad1a/delete-account', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    
    if (!accessToken) {
      return c.json({ error: 'Токен авторизации отсутствует' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user?.id) {
      return c.json({ error: 'Неавторизован' }, 401)
    }

    // Удаляем все данные пользователя из KV store
    await kv.del(`profile:${user.id}`)
    await kv.del(`workout_plan:${user.id}`)
    
    // Удаляем все записи прогресса
    const progressRecords = await kv.getByPrefix(`progress:${user.id}:`)
    for (const record of progressRecords) {
      const key = `progress:${user.id}:${record.completedAt}`
      await kv.del(key)
    }
    
    return c.json({ success: true, message: 'Данные пользователя удалены' })
  } catch (error) {
    console.log(`Ошибка удаления аккаунта: ${error}`)
    return c.json({ error: 'Внутренняя ошибка сервера' }, 500)
  }
})

Deno.serve(app.fetch)