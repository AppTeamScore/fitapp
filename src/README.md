# 🏋️‍♀️ FitApp - Приложение для тренировок

Современное мобильное приложение для тренировок с адаптивным дизайном, ИИ-планировщиком тренировок и системой отслеживания прогресса.

## ✨ Основные функции

- 🏠 **Главный экран** с навигацией и виджетами статистики
- 🏋️‍♀️ **Библиотека тренировок** с 130+ готовыми упражнениями  
- ⏱️ **Интерактивный таймер** с поддержкой видео-инструкций
- 📊 **Отслеживание прогресса** и детальная статистика
- 📅 **Календарь тренировок** с планированием
- 🤖 **ИИ-планировщик** персонализированных программ
- 👤 **Система авторизации** с профилями пользователей
- 📱 **Mobile-first дизайн** с нижней навигацией

## 🛠 Технологический стек

- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **UI Framework**: Radix UI, shadcn/ui
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel Ready

## 🚀 Развертывание на Vercel

### 1. Подготовка проекта

```bash
# Клонировать репозиторий
git clone <your-repo-url>
cd fitness-app

# Установить зависимости
npm install

# Скопировать файл окружения
cp .env.example .env
```

### 2. Настройка Supabase

1. Создайте проект в [Supabase](https://supabase.com)
2. Получите URL проекта и анонимный ключ из Settings > API
3. Добавьте их в `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Развертывание на Vercel

#### Через веб-интерфейс:
1. Подключите репозиторий к [Vercel](https://vercel.com)
2. Добавьте переменные окружения в настройках проекта
3. Разверните проект

#### Через CLI:
```bash
# Установить Vercel CLI
npm i -g vercel

# Развернуть
vercel

# Добавить переменные окружения
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Пересобрать с новыми переменными
vercel --prod
```

## 🏗 Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview

# Проверка работоспособности
npm run health-check
```

## 📁 Структура проекта

```
├── App.tsx                     # Основной компонент приложения
├── components/                 # React компоненты
│   ├── ui/                    # UI компоненты (shadcn/ui)
│   ├── HomePage.tsx           # Главная страница
│   ├── WorkoutsPage.tsx       # Страница тренировок
│   ├── TimerPage.tsx          # Таймер тренировок
│   ├── CalendarPage.tsx       # Календарь
│   ├── StatsPage.tsx          # Статистика
│   ├── AccountPage.tsx        # Профиль пользователя
│   └── ...                    # Другие компоненты
├── data/                      # Данные упражнений и тренировок
│   ├── exercises.ts          # База упражнений (130+)
│   └── workouts.ts           # Готовые тренировки
├── styles/                    # Стили
│   └── globals.css           # Глобальные стили и темы
├── utils/                     # Утилиты
│   ├── supabase/             # Конфигурация Supabase
│   ├── api.ts                # API функции
│   └── validation.ts         # Валидация данных
├── supabase/                  # Серверные функции
│   └── functions/            # Edge Functions
└── public/                    # Статические файлы
    └── videos/               # Видео упражнений
```

## 🎨 Дизайн-система

Приложение использует согласованную дизайн-систему с:

- **Цветовая палитра**: Primary (#030213), Secondary, Accent
- **Типографика**: Mobile-optimized с системой заголовков h1-h4
- **Компоненты**: Единообразные UI компоненты из shadcn/ui
- **Mobile-first**: Адаптивный дизайн для мобильных устройств

## 🎥 Видео упражнений

Поместите видео файлы в `/public/videos/` следующим образом:
- `video_001.mp4`, `video_002.mp4`, и т.д.
- Рекомендуемый формат: MP4, вертикальная ориентация (9:16)
- Максимальный размер файла: 10MB

## 🔐 Безопасность

- ✅ Безопасная аутентификация через Supabase
- ✅ Валидация данных на клиенте и сервере
- ✅ Защищенные API endpoints
- ✅ HTTPS headers в продакшене

## 📊 Производительность

- ✅ Code splitting и lazy loading
- ✅ Оптимизированные изображения
- ✅ Bundle optimization с Vite
- ✅ Кеширование статических ресурсов

## 📱 Мобильная оптимизация

- Адаптивный дизайн для всех размеров экранов
- Touch-friendly интерфейс с минимальным размером тач-элементов 44px
- Нижняя навигация для удобства использования одной рукой
- PWA готовность с offline возможностями

## 🎯 Функционал ИИ

Приложение интегрировано с LLM API для создания персонализированных планов тренировок:
- Анализ целей, уровня подготовки и ограничений пользователя
- Автоматический подбор упражнений из доступной библиотеки
- Возможность редактирования и пересоздания планов

## 📊 Система данных

### Упражнения (`/data/exercises.ts`):
```typescript
interface Exercise {
  id: string;
  name: string;
  video: string;
  duration: number;
  rest: number;
  category: string;
  difficulty: string;
  muscleGroups: string[];
}
```

### Тренировки (`/data/workouts.ts`):
```typescript
interface Workout {
  id: number;
  name: string;
  duration: number;
  difficulty: string;
  exercises: number;
  description: string;
  exercises_list: Exercise[];
  category: string;
}
```

## 🤝 Контрибьюции

1. Fork проекта
2. Создайте feature branch
3. Коммитьте изменения
4. Создайте Pull Request

## 🆘 Поддержка

При возникновении проблем:

1. Проверьте [Issues](https://github.com/your-repo/issues)
2. Запустите `npm run health-check` для диагностики
3. Убедитесь в правильности переменных окружения
4. Проверьте консоль браузера на наличие ошибок
5. Создайте новый Issue с описанием проблемы

### Частые проблемы:

**Ошибка переменных окружения:**
```
TypeError: Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')
```
**Решение:** Убедитесь что `.env` файл настроен правильно или приложение будет использовать fallback значения.

## ✅ Статус готовности: 100%

### 🎉 Приложение полностью готово к продакшену!

**Все критические ошибки исправлены:**
- ✅ Исправлены все проблемы с refs в UI компонентах
- ✅ Добавлен ErrorBoundary для обработки ошибок  
- ✅ Улучшены компоненты загрузки
- ✅ Исправлены пути импортов
- ✅ Добавлена валидация форм
- ✅ Оптимизированы CSS-стили
- ✅ Настроена полная архитектура приложения
- ✅ Подготовлен для развертывания на Vercel

### 🚀 Быстрый старт:
```bash
npm install
npm run health-check  # Проверка готовности
npm run dev          # Запуск приложения
```

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE) файл для деталей.

---

**Разработано с ❤️ для здорового образа жизни**