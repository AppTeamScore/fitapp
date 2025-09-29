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

// Сохранение сгенерированного плана тренировок (LLM вызывается на клиенте)
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

    const { plan, goals, fitnessLevel, limitations, preferences } = await c.req.json()
    
    // Проверяем только наличие плана, остальное с fallback на клиенте
    if (!plan) {
      return c.json({ error: 'План тренировок не предоставлен' }, 400)
    }

    // Сохраняем план пользователя
    const planData = {
      userId: user.id,
      plan,
      createdAt: new Date().toISOString(),
      goals: goals || 'Улучшение общей физической формы',
      fitnessLevel: fitnessLevel || 'Начинающий',
      limitations: limitations || 'Нет ограничений',
      preferences: preferences || 'Разнообразные тренировки'
    }
    
    await kv.set(`workout_plan:${user.id}`, planData)
    
    return c.json({ plan, planData })
  } catch (error) {
    console.log(`Ошибка сохранения плана тренировок: ${error}`)
    return c.json({ error: 'Не удалось сохранить план тренировок' }, 500)
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

    // Получаем все ключи прогресса пользователя напрямую из базы данных
    const { data: keysData, error: keysError } = await supabase
      .from('kv_store_c6c9ad1a')
      .select('key')
      .like('key', `progress:${user.id}:%`)
    
    if (keysError) {
      console.log(`Ошибка получения ключей: ${keysError}`)
      return c.json({ error: 'Внутренняя ошибка сервера' }, 500)
    }

    // Удаляем все записи прогресса пользователя
    const deletePromises = []
    for (const record of keysData || []) {
      deletePromises.push(kv.del(record.key))
    }
    
    await Promise.all(deletePromises)
    
    return c.json({
      success: true,
      message: 'Статистика тренировок очищена',
      deletedRecords: keysData?.length || 0
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