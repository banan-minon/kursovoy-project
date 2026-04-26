# Clothing Store - Курсовой проект

Информационная система магазина одежды (Fullstack: Vue.js + Node.js + PostgreSQL).

## Стек технологий
- **Frontend**: Vue 3 (Composition API), Pinia (State Management), Vue Router.
- **Backend**: Node.js, Express, PostgreSQL (node-postgres).
- **Auth**: JWT (JSON Web Token).

## Инструкция по развертыванию

### База данных
1. Создайте БД в PostgreSQL.
2. Выполните SQL-скрипты из папки `/database` для создания таблиц.

### Backend
1. Перейдите в `cd backend`.
2. Установите зависимости: `npm install`.
3. Создайте файл `.env` и укажите данные БД и `JWT_SECRET`.
4. Запустите сервер: `node server.js`.

### Frontend
1. Перейдите в `cd frontend`.
2. Установите зависимости: `npm install`.
3. Запустите проект: `npm run serve`.

## Архитектура
Проект построен по клиент-серверной архитектуре. 
- Бэкенд реализует REST API и следует паттерну MVC (Model-View-Controller).
- Фронтенд построен на компонентном подходе Vue.