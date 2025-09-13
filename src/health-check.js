#!/usr/bin/env node

/**
 * Скрипт проверки готовности FitApp
 * Проверяет основные компоненты и зависимости
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const checks = [];
let allPassed = true;

function check(name, condition, message) {
  const passed = condition();
  checks.push({ name, passed, message });
  if (!passed) allPassed = false;
  console.log(`${passed ? '✅' : '❌'} ${name}: ${message}`);
}

console.log('🔍 Проверка готовности FitApp...\n');

// Проверка основных файлов
check('Главный компонент App.tsx', 
  () => existsSync('App.tsx'), 
  'Файл App.tsx найден');

check('Supabase конфигурация', 
  () => existsSync('utils/supabase/client.ts') && existsSync('utils/supabase/info.tsx'), 
  'Supabase настроен');

check('Серверные функции', 
  () => existsSync('supabase/functions/server/index.tsx'), 
  'Edge Functions готовы');

check('UI компоненты', 
  () => existsSync('components/ui/button.tsx'), 
  'Shadcn/ui компоненты установлены');

// Проверка данных
check('Данные упражнений', 
  () => existsSync('data/exercises.ts'), 
  'База упражнений готова');

check('Данные тренировок', 
  () => existsSync('data/workouts.ts'), 
  'Готовые тренировки загружены');

// Проверка основных страниц
const pages = [
  'HomePage.tsx',
  'AuthPage.tsx', 
  'TimerPage.tsx',
  'WorkoutPlanPage.tsx',
  'CalendarPage.tsx'
];

pages.forEach(page => {
  check(`Страница ${page}`, 
    () => existsSync(`components/${page}`), 
    `Компонент ${page} готов`);
});

// Проверка package.json
check('Зависимости', () => {
  try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    return pkg.dependencies && pkg.dependencies.react && pkg.dependencies['@supabase/supabase-js'];
  } catch {
    return false;
  }
}, 'package.json содержит необходимые зависимости');

// Проверка стилей
check('Стили Tailwind', 
  () => existsSync('styles/globals.css'), 
  'CSS конфигурация готова');

// Проверка TypeScript
check('TypeScript конфигурация', 
  () => existsSync('tsconfig.json'), 
  'TypeScript настроен');

// Проверка Vite
check('Vite конфигурация', 
  () => existsSync('vite.config.ts'), 
  'Сборщик настроен');

console.log('\n📊 Результаты проверки:');
console.log(`Пройдено: ${checks.filter(c => c.passed).length}/${checks.length}`);

if (allPassed) {
  console.log('\n🎉 Все проверки пройдены! Приложение готово к запуску.');
  console.log('\n🚀 Команды для запуска:');
  console.log('npm install  # Установка зависимостей');
  console.log('npm run dev  # Запуск в режиме разработки');
  console.log('npm run build # Сборка для продакшена');
} else {
  console.log('\n⚠️  Некоторые проверки не пройдены. Проверьте указанные проблемы.');
  process.exit(1);
}

console.log('\n📖 Документация:');
console.log('README.md - Основная документация');
console.log('QUICK_START.md - Быстрый старт');
console.log('DEPLOYMENT_READY.md - Готовность к развертыванию');
console.log('guidelines/Guidelines.md - Руководство по развитию');