#!/bin/bash

# Скрипт для сборки Docker-образа с видео файлами

echo "Сборка Docker-образа..."

# Удаляем старый образ
docker rmi -f myfitapp:latest 2>/dev/null || true

# Собираем новый образ
docker build -t myfitapp:latest .

# Запускаем контейнер
docker run -d -p 8080:80 --name myfitapp myfitapp:latest

echo "Сборка завершена!"
echo "Приложение доступно по адресу: http://localhost:8080"