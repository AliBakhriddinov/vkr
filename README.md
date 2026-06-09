# PixelWave Web

Веб-представительство IT-компании PixelWave с интегрированной системой управления клиентскими заявками.

## Цели и возможности

Цель проекта — объединить маркетинговую витрину digital-агентства и операционную обработку клиентских заявок в единой веб-платформе.

Реализованные возможности:

- **Публичная часть сайта:** главная, каталог услуг, страницы услуг, портфолио, блог, контакты, форма приёма заявки.
- **Личный кабинет клиента:** регистрация и аутентификация, отправка заявок, отслеживание статусов и истории обращений.
- **Административная панель:** обработка входящих заявок администратором, управление каталогом услуг, портфолио и публикациями блога, ролевой доступ.
- **Серверная часть:** API на основе серверных маршрутов Next.js, работа с PostgreSQL через Prisma ORM, валидация входных данных.
- **Интернационализация и оформление:** двуязычный интерфейс (русский / английский), светлая и тёмная темы.

## Стек технологий

| Слой | Технология |
|------|------------|
| Frontend / Fullstack | Next.js 16, React 19, TypeScript |
| Стили | Tailwind CSS 4 |
| База данных | PostgreSQL 16 |
| ORM | Prisma 7 |
| Аутентификация | NextAuth.js v5 (Auth.js) |
| Формы и валидация | React Hook Form + Zod |
| Контейнеризация | Docker, docker-compose |
| Деплой | Vercel + облачный PostgreSQL (Supabase / Neon) |

## Требования к окружению

- **Node.js** ≥ 20 (рекомендуется 24 LTS)
- **pnpm** ≥ 9 (активируется через `corepack enable`)
- **Docker Desktop** (с поддержкой WSL2 на Windows) — для запуска PostgreSQL локально
- **Git** ≥ 2.40

Проверка версий:
```bash
node --version
pnpm --version
docker --version
```

## Установка и запуск

### Вариант 1. Локально (рекомендуется для разработки)

```bash
# Установить зависимости
pnpm install

# Поднять PostgreSQL в контейнере
docker compose up -d db

# Скопировать пример переменных окружения
cp .env.example .env

# Применить схему БД и загрузить демо-данные
pnpm db:migrate
pnpm db:seed

# Запустить dev-сервер
pnpm dev
```

Приложение будет доступно по адресу `http://localhost:3000`.

### Вариант 2. Полностью через docker-compose

```bash
docker compose --profile prod up --build
```

Команда поднимет два сервиса: `db` (PostgreSQL) и `app` (production-сборка Next.js на порту 3000).

## Структура проекта

```
.
├── src/
│   ├── app/              # маршруты Next.js (App Router)
│   ├── components/       # переиспользуемые компоненты
│   │   └── ui/           # компоненты shadcn/ui
│   ├── lib/              # утилиты, prisma client, auth helpers
│   ├── server/           # серверная логика (actions, services)
│   └── generated/        # автогенерируемый Prisma client (gitignored)
├── prisma/
│   └── schema.prisma     # схема базы данных
├── public/               # статика
├── tests/                # юнит-тесты (Vitest) и e2e-тесты (Playwright)
├── Dockerfile            # multi-stage сборка приложения
├── docker-compose.yml    # PostgreSQL + опциональный сервис app
├── package.json          # зависимости и pnpm-скрипты
├── prisma.config.ts      # конфигурация Prisma 7
└── ...                   # ESLint, Prettier, TypeScript конфигурации
```

## Доступные pnpm-скрипты

| Скрипт | Назначение |
|--------|------------|
| `pnpm dev` | Запуск dev-сервера Next.js (с Turbopack) |
| `pnpm build` | Production-сборка |
| `pnpm start` | Запуск production-сборки |
| `pnpm lint` | Проверка кода ESLint |
| `pnpm format` | Форматирование Prettier |
| `pnpm format:check` | Проверка форматирования без изменений |
| `pnpm typecheck` | Проверка типов TypeScript |
| `pnpm test` | Юнит-тесты (Vitest) |
| `pnpm test:watch` | Юнит-тесты в режиме наблюдения |
| `pnpm test:e2e` | End-to-end тесты (Playwright) |
| `pnpm db:push` | Синхронизация схемы Prisma с БД без миграций (dev) |
| `pnpm db:migrate` | Создание и применение миграции |
| `pnpm db:deploy` | Применение миграций в production |
| `pnpm db:generate` | Генерация Prisma client |
| `pnpm db:studio` | Web-UI для просмотра БД |
| `pnpm db:seed` | Загрузка тестовых данных |

## Тестирование

Проект покрыт двумя видами тестов:

- **Юнит-тесты (Vitest)** — валидация форм (Zod-схемы), логика смены статуса заявки, локализация контента. Базы данных не требуют.
- **E2E-тесты (Playwright)** — ключевые пользовательские сценарии: вход, отправка заявки, смена статуса в админ-панели, переключение языка, отзыв клиента.

```bash
# Юнит-тесты
pnpm test

# E2E (нужны поднятая БД и демо-данные; dev-сервер Playwright запускает сам)
docker compose up -d db
pnpm db:seed
pnpm test:e2e
```

## Переменные окружения

Файл `.env.example` содержит шаблон со всеми переменными. Для локальной разработки достаточно скопировать его в `.env` без изменений — параметры по умолчанию совпадают с настройками `docker-compose.yml`.

| Переменная | Назначение | Пример |
|------------|------------|--------|
| `DATABASE_URL` | Строка подключения к PostgreSQL | `postgresql://ali:ali@localhost:5432/ali?schema=public` |
| `AUTH_SECRET` | Секрет для подписи сессий Auth.js | случайная строка (см. `.env.example`) |
| `AUTH_TRUST_HOST` | Доверие host-заголовку (за прокси / на Vercel) | `true` |

## Деплой

Приложение разворачивается на **Vercel** с облачным **PostgreSQL** (Neon):

1. Импортировать репозиторий в Vercel — фреймворк Next.js определяется автоматически.
2. Подключить базу Neon через интеграцию Vercel Storage — она пропишет `DATABASE_URL`.
3. Добавить переменные `AUTH_SECRET` и `AUTH_TRUST_HOST=true`.
4. Применить миграции и загрузить данные, используя прямое (unpooled) подключение к БД:

```bash
DATABASE_URL="<direct-connection-url>" pnpm db:deploy
DATABASE_URL="<direct-connection-url>" pnpm db:seed
```

Скрипт `postinstall` генерирует Prisma client при установке зависимостей, поэтому сборка на Vercel проходит без дополнительных шагов.

## Лицензия

Проект распространяется под лицензией [MIT](./LICENSE).
