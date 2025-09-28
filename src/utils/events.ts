/**
 * Система событий для уведомления компонентов об изменении данных
 */

export type EventName = 
  | 'stats:updated'
  | 'stats:cleared'
  | 'workout:completed'
  | 'workout:started'
  | 'user:auth:changed'
  | 'app:initialized';

interface EventHandler {
  callback: (...args: any[]) => void;
  once?: boolean;
}

class EventBus {
  private listeners: Map<EventName, EventHandler[]> = new Map();

  /**
   * Подписка на событие
   */
  on(event: EventName, callback: (...args: any[]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    const handler = { callback };
    this.listeners.get(event)!.push(handler);

    // Возвращаем функцию для отписки
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(handler);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    };
  }

  /**
   * Одноразовая подписка на событие
   */
  once(event: EventName, callback: (...args: any[]) => void): () => void {
    const wrapper = (...args: any[]) => {
      callback(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  /**
   * Отписка от события
   */
  off(event: EventName, callback: (...args: any[]) => void): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.findIndex(h => h.callback === callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Эмитация события
   */
  emit(event: EventName, ...args: any[]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      // Создаем копию массива, чтобы избежать проблем при удалении элементов во время итерации
      const listenersCopy = [...eventListeners];
      
      listenersCopy.forEach(handler => {
        try {
          handler.callback(...args);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Проверка, есть ли слушатели для события
   */
  hasListeners(event: EventName): boolean {
    const eventListeners = this.listeners.get(event);
    return eventListeners ? eventListeners.length > 0 : false;
  }

  /**
   * Очистка всех слушателей
   */
  clear(): void {
    this.listeners.clear();
  }
}

// Создаем глобальный экземпляр
export const eventBus = new EventBus();

// Удобные функции для использования в компонентах
export const useEvents = () => {
  const subscribe = (event: EventName, callback: (...args: any[]) => void) => {
    return eventBus.on(event, callback);
  };

  const unsubscribe = (event: EventName, callback: (...args: any[]) => void) => {
    eventBus.off(event, callback);
  };

  const emit = (event: EventName, ...args: any[]) => {
    eventBus.emit(event, ...args);
  };

  return { subscribe, unsubscribe, emit };
};

// Хук для React компонентов
export const useEvent = (event: EventName, callback: (...args: any[]) => void) => {
  useEffect(() => {
    const unsubscribe = eventBus.on(event, callback);
    return unsubscribe;
  }, [event, callback]);
};

// Импортируем useEffect для хука
import { useEffect } from 'react';