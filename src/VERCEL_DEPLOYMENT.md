# 🚀 Развертывание FitApp на Vercel

## Подготовка к развертыванию

Ваш проект готов к развертыванию на Vercel! Все необходимые файлы конфигурации созданы.

## 📋 Контрольный список

### ✅ Файлы конфигурации созданы:
- `vercel.json` - конфигурация Vercel
- `.gitignore` - игнорируемые файлы
- `.env.example` - пример переменных окружения
- `vite.config.ts` - обновлен для Tailwind CSS v4
- `.github/workflows/deploy.yml` - CI/CD pipeline

### ✅ Оптимизация для продакшена:
- Bundle splitting для оптимальной загрузки
- Поддержка переменных окружения
- HTTPS security headers
- Minification и оптимизация

## 🔧 Инструкции по развертыванию

### Шаг 1: Создание репозитория GitHub

```bash
# Инициализировать git репозиторий
git init

# Добавить все файлы
git add .

# Первый коммит
git commit -m "feat: initial commit - FitApp ready for deployment"

# Добавить удаленный репозиторий
git remote add origin https://github.com/your-username/fitness-app.git

# Отправить код
git push -u origin main
```

### Шаг 2: Настройка Vercel

1. **Создайте аккаунт на [Vercel](https://vercel.com)**
2. **Подключите GitHub репозиторий:**
   - Нажмите "New Project"
   - Выберите ваш GitHub репозиторий
   - Нажмите "Import"

### Шаг 3: Настройка переменных окружения

В панели Vercel добавьте следующие переменные:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Как получить значения:**
1. Откройте ваш [Supabase проект](https://app.supabase.com)
2. Перейдите в Settings → API
3. Скопируйте "URL" и "anon public" ключ
4. Скопируйте "service_role" ключ (секретный!)

### Шаг 4: Развертывание

Vercel автоматически развернет ваше приложение после настройки переменных окружения.

## 🛠 Альтернативный способ через CLI

```bash
# Установить Vercel CLI
npm i -g vercel

# Войти в аккаунт
vercel login

# Развернуть проект
vercel

# Добавить переменные окружения
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Пересобрать с новыми переменными
vercel --prod
```

## 🔍 Проверка развертывания

После успешного развертывания:

1. **Откройте URL приложения** (предоставленный Vercel)
2. **Проверьте функции:**
   - Регистрация/авторизация
   - Загрузка упражнений
   - Создание планов тренировок
   - Работа таймера

## 🐛 Устранение проблем

### Проблема: Ошибки сборки
**Решение:** Проверьте логи сборки в Vercel Dashboard

### Проблема: Supabase не подключается
**Решение:** 
- Проверьте правильность переменных окружения
- Убедитесь что URL содержит `https://`
- Проверьте что ключи активны в Supabase

### Проблема: 404 на маршрутах
**Решение:** Vercel автоматически настроен для SPA через `vercel.json`

## 🔄 Автоматическое развертывание

После настройки GitHub Actions:
1. Каждый push в `main` ветку запускает автоматическое развертывание
2. Pull requests создают preview deployments
3. Статус развертывания отображается в GitHub

## 📊 Мониторинг

В Vercel Dashboard вы можете отслеживать:
- **Analytics** - статистика посещений
- **Performance** - скорость загрузки
- **Logs** - логи функций
- **Usage** - использование ресурсов

## 🎉 Готово!

Ваше приложение теперь доступно публично на Vercel с:
- ✅ Автоматическими HTTPS сертификатами
- ✅ Глобальной CDN
- ✅ Автоматическим масштабированием
- ✅ Мониторингом производительности

---

**Полезные ссылки:**
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Actions](https://docs.github.com/en/actions)