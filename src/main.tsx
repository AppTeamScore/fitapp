import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { logger } from "./utils/logger";

// Инициализация логирования при запуске приложения
logger.info('🚀 Приложение Твой Фитнес AI запускается...', {
  mode: import.meta.env?.MODE || 'development',
  timestamp: new Date().toISOString()
});

createRoot(document.getElementById("root")!).render(<App />);

// Логируем успешный рендеринг
logger.info('✅ Приложение FitApp успешно отрендерено');
  