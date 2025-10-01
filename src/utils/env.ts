/**
 * Утилита для безопасного доступа к переменным окружения
 */

interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_OPENROUTER_API_KEY: string;
}

const defaultConfig: EnvConfig = {
  VITE_SUPABASE_URL: 'https://jyqhcwqlpjrhibkyybjn.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cWhjd3FscGpyaGlia3l5YmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNTk0MzIsImV4cCI6MjA3MjYzNTQzMn0.aB5BEmbAQCnr-F_CS0Ji8krJeTL69mI9T34FicjHAfY',
  VITE_OPENROUTER_API_KEY: ''
};

/**
 * Безопасно получает переменную окружения
 */
export function getEnvVar<K extends keyof EnvConfig>(
  key: K,
  fallback?: string
): string {
  try {
    // Проверяем доступность import.meta.env
    const envValue = import.meta.env?.[key];
    if (envValue && typeof envValue === 'string') {
      return envValue;
    }
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
  }
  
  // Возвращаем fallback или значение по умолчанию
  return fallback || defaultConfig[key];
}

/**
 * Получает конфигурацию Supabase
 */
export function getSupabaseConfig() {
  const url = getEnvVar('VITE_SUPABASE_URL');
  const key = getEnvVar('VITE_SUPABASE_ANON_KEY');
  
  return {
    url,
    key,
    projectId: extractProjectId(url)
  };
}

/**
 * Извлекает project ID из Supabase URL
 */
function extractProjectId(url: string): string {
  try {
    return new URL(url).hostname.split('.')[0];
  } catch (error) {
    console.warn('Failed to extract project ID from URL:', url, error);
    return 'jyqhcwqlpjrhibkyybjn'; // fallback
  }
}

/**
 * Проверяет доступность переменных окружения
 */
export function checkEnvAvailability(): boolean {
  try {
    return typeof import.meta !== 'undefined' && import.meta.env !== undefined;
  } catch {
    return false;
  }
}

export const env = {
  get: getEnvVar,
  supabase: getSupabaseConfig,
  checkAvailability: checkEnvAvailability
};

/**
 * Получает конфигурацию OpenRouter
 */
export function getOpenRouterConfig() {
  return {
    apiKey: getEnvVar('VITE_OPENROUTER_API_KEY'),
    baseUrl: 'https://openrouter.ai/api/v1'
  };
}