# Используем базовый образ Node.js
FROM node:18-alpine AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Копируем видео файлы из public/videos в build/videos
# Это гарантирует, что видео файлы будут доступны в продакшене
RUN if [ -d "public/videos" ]; then \
    mkdir -p build/videos && \
    cp -r public/videos/* build/videos/; \
    fi

# Собираем приложение
RUN npm run build

# Используем nginx для обслуживания статических файлов
FROM nginx:alpine

# Копируем собранные файлы приложения
COPY --from=base /app/build /usr/share/nginx/html

# Копируем nginx конфигурацию
COPY nginx.conf /etc/nginx/nginx.conf

# Expose порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]