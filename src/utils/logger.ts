/**
 * Утилита для логирования в приложении
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = 'info';
  private isDevelopment: boolean = import.meta.env?.MODE === 'development';

  private constructor() {
    // В режиме разработки включаем детальное логирование
    if (this.isDevelopment) {
      this.logLevel = 'debug';
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Форматирует сообщение для лога
   */
  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  /**
   * Основной метод логирования
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (this.shouldLog(level)) {
      const formattedMessage = this.formatMessage(level, message, context);
      
      // Консольный вывод
      switch (level) {
        case 'debug':
          console.debug(formattedMessage, error || '');
          break;
        case 'info':
          console.info(formattedMessage, error || '');
          break;
        case 'warn':
          console.warn(formattedMessage, error || '');
          break;
        case 'error':
          console.error(formattedMessage, error || '');
          break;
      }

      // В режиме разработки также выводим в консоль как объект для лучшей читаемости
      if (this.isDevelopment) {
        const logEntry: LogEntry = {
          timestamp: new Date().toISOString(),
          level,
          message,
          context,
          error
        };
        console.groupCollapsed(`📝 ${level.toUpperCase()}: ${message}`);
        console.log('Log Entry:', logEntry);
        if (context) console.log('Context:', context);
        if (error) console.log('Error:', error);
        console.groupEnd();
      }
    }
  }

  /**
   * Проверяет, нужно ли логировать на текущем уровне
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  /**
   * Устанавливает уровень логирования
   */
  setLevel(level: LogLevel): void {
    this.logLevel = level;
    this.info(`Логирование установлено на уровень: ${level}`);
  }

  /**
   * Публичные методы для разных уровней логирования
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log('error', message, context, error);
  }

  /**
   * Логирует начало выполнения функции
   */
  startFunction(functionName: string, context?: Record<string, any>): void {
    this.debug(`🚀 Запуск функции: ${functionName}`, context);
  }

  /**
   * Логирует завершение выполнения функции
   */
  endFunction(functionName: string, duration?: number, context?: Record<string, any>): void {
    const durationStr = duration ? ` (${duration}ms)` : '';
    this.debug(`✅ Завершение функции: ${functionName}${durationStr}`, context);
  }

  /**
   * Логирует API запросы
   */
  logApiRequest(url: string, method: string, data?: any, headers?: Record<string, string>): void {
    this.debug(`🌐 API Запрос: ${method} ${url}`, { data, headers });
  }

  /**
   * Логирует API ответы
   */
  logApiResponse(url: string, method: string, status: number, response?: any, duration?: number): void {
    const durationStr = duration ? ` (${duration}ms)` : '';
    this.debug(`🌐 API Ответ: ${method} ${url} - ${status}${durationStr}`, { response });
  }

  /**
   * Логирует ошибки API
   */
  logApiError(url: string, method: string, error: Error, status?: number): void {
    this.error(`🌐 API Ошибка: ${method} ${url}`, error, { status });
  }

  /**
   * Логирует действия пользователя
   */
  logUserAction(action: string, context?: Record<string, any>): void {
    this.info(`👤 Действие пользователя: ${action}`, context);
  }

  /**
   * Логирует состояние приложения
   */
  logAppState(state: string, context?: Record<string, any>): void {
    this.debug(`📱 Состояние приложения: ${state}`, context);
  }

  /**
   * Логирует производительность
   */
  logPerformance(operation: string, duration: number, context?: Record<string, any>): void {
    this.debug(`⚡ Производительность: ${operation} заняла ${duration}ms`, context);
  }
}

// Экспортируем экземпляр логгера
export const logger = Logger.getInstance();

// Экспортируем класс для кастомизации
export default Logger;