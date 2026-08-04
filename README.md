# Task Manager

Backend-сервис для управления командной работой: учётные записи, JWT-аутентификация, подтверждение e-mail и рабочие пространства с ролевым доступом. Проект построен на Node.js, Fastify и PostgreSQL; для доступа к данным используется Prisma.

> [!IMPORTANT]
> Проект находится в активной разработке. Аутентификация и рабочие пространства составляют основное рабочее ядро. Код проектов и участников проектов пока экспериментальный: соответствующие Prisma-модели отключены. Маршруты задач ещё не реализованы.

## Возможности

- регистрация и вход с хешированием паролей через bcrypt;
- access- и refresh-токены JWT, включая передачу refresh-токена в `httpOnly` cookie;
- подтверждение e-mail через Resend;
- создание, просмотр, изменение, архивирование и восстановление рабочих пространств;
- ролевые политики доступа для участников рабочих пространств;
- пагинация списков с контролем допустимого размера страницы;
- валидация входных данных и единый формат HTTP-ошибок;
- структурированные логи запросов, ошибок и запросов к БД с correlation ID;
- разделение HTTP-слоя, сервисов, репозиториев и доменных сущностей через DI-контейнер.

## Технологии

| Область | Инструменты |
| --- | --- |
| Runtime и HTTP | Node.js, Fastify 5, ES modules |
| База данных | PostgreSQL, Prisma 7, `pg` |
| Безопасность | JWT, bcrypt, `httpOnly` cookies |
| Валидация | Yup |
| Почта | Resend |
| Представления | Pug |
| Тестирование | Jest, Axios, Faker |
| Логирование | Pino, AsyncLocalStorage |

## Требования

- Node.js 25.x — версия, используемая в текущем CI;
- npm с поддержкой `package-lock.json` версии 3;
- PostgreSQL;
- API-ключ [Resend](https://resend.com/) для отправки писем подтверждения.

## Быстрый старт

### 1. Клонируйте репозиторий и установите зависимости

```bash
git clone https://github.com/kitnovikov/task-manager.git
cd task-manager
npm ci
```

### 2. Настройте окружение

Создайте файл `.env` в корне проекта:

```dotenv
# HTTP-сервер
HOST=127.0.0.1
PORT=3000

# PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_manager?schema=public

# JWT аутентификации
JWT_AUTH_ACCESS_TOKEN=replace-with-a-long-random-secret
JWT_AUTH_ACCESS_TOKEN_EXPIRATION=15m
JWT_AUTH_REFRESH_TOKEN=replace-with-another-long-random-secret
JWT_AUTH_REFRESH_TOKEN_EXPIRATION=30d

# Отправка почты
SMTP_RESEND_TOKEN=re_replace_with_your_api_key

# JWT подтверждения e-mail
JWT_EMAIL_CONFIRMATION_TOKEN=replace-with-a-third-long-random-secret
JWT_EMAIL_CONFIRMATION_TOKEN_EXPIRATION=1d
```

Все перечисленные переменные обязательны: приложение читает их при запуске. Не добавляйте `.env` и реальные секреты в Git.

### 3. Подготовьте базу данных

Создайте пустую базу, указанную в `DATABASE_URL`, затем примените миграции и сгенерируйте Prisma Client:

```bash
npx prisma migrate deploy
npm run generate
```

Модульная Prisma-схема находится в каталоге [`prisma/`](prisma/), а история изменений БД — в [`prisma/migrations/`](prisma/migrations/).

### 4. Запустите сервер

Для разработки с автоматическим перезапуском:

```bash
npm run start:dev
```

Обычный запуск:

```bash
npm start
```

При конфигурации выше API доступен по адресу `http://localhost:3000`.

## Первый запрос

Зарегистрируйте пользователя:

```bash
curl --request POST http://localhost:3000/api/auth/registration \
  --header 'Content-Type: application/json' \
  --data '{
    "firstName": "Ivan",
    "lastName": "Petrov",
    "email": "ivan@example.com",
    "password": "StrongPass1!"
  }'
```

Ответ содержит пользователя, `accessToken` и `refreshToken`. Refresh-токен также устанавливается в `httpOnly` cookie. Для защищённых маршрутов передавайте access-токен:

```bash
export ACCESS_TOKEN='<accessToken из ответа>'

curl --request GET 'http://localhost:3000/api/workspaces?page=1&limit=20' \
  --header "Authorization: Bearer ${ACCESS_TOKEN}"
```

Операции с рабочими пространствами требуют подтверждённого e-mail. После регистрации сервис отправляет токен на указанный адрес. Активируйте его следующим запросом:

```bash
curl --request POST http://localhost:3000/api/email-confirmation/activate \
  --header 'Content-Type: application/json' \
  --data '{"token":"<токен из письма>"}'
```

Теперь можно создать рабочее пространство:

```bash
curl --request POST http://localhost:3000/api/workspaces \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer ${ACCESS_TOKEN}" \
  --data '{
    "name": "Product Team",
    "slug": "PROD",
    "description": "Рабочее пространство продуктовой команды"
  }'
```

`slug` должен состоять из 3–5 латинских букв и хранится в верхнем регистре.

## Доступные команды

| Команда | Назначение |
| --- | --- |
| `npm start` | запустить приложение |
| `npm run start:dev` | запустить приложение через Nodemon |
| `npm run generate` | сгенерировать Prisma Client |
| `npm run test:api` | запустить API-тесты Jest |

## API

Ключевые реализованные маршруты:

| Метод и путь | Доступ | Назначение |
| --- | --- | --- |
| `POST /api/auth/registration` | публичный | регистрация пользователя |
| `POST /api/auth/login` | публичный | получение пары JWT |
| `POST /api/email-confirmation/activate` | публичный | подтверждение e-mail токеном |
| `POST /api/workspaces` | JWT + подтверждённый e-mail | создание рабочего пространства |
| `GET /api/workspaces` | JWT + подтверждённый e-mail | список доступных пространств |
| `GET /api/workspaces/:workspaceId` | JWT + подтверждённый e-mail | просмотр пространства |
| `PATCH /api/workspaces/:workspaceId` | JWT + подтверждённый e-mail | изменение пространства |
| `PATCH /api/workspaces/:workspaceId/archive` | JWT + подтверждённый e-mail | архивирование пространства |
| `PATCH /api/workspaces/:workspaceId/unarchive` | JWT + подтверждённый e-mail | восстановление пространства |

Для запросов списка доступны параметры `page` и `limit`; значения по умолчанию — `1` и `20`, максимальный `limit` — `100`.

Это не полная API-документация. Актуальные пути собраны в [`src/http/routes/routes.js`](src/http/routes/routes.js), а HTTP-методы и middleware — в [`src/http/routes/`](src/http/routes/).

## Структура проекта

```text
task-manager/
├── prisma/                 # схема, enum-типы и миграции PostgreSQL
├── src/
│   ├── config/             # загрузка конфигурации
│   ├── database/           # Prisma/pg adapter
│   ├── http/               # маршруты, контроллеры, middleware и ошибки
│   ├── logging/            # структурированное логирование запросов
│   ├── modules/
│   │   ├── auth/           # пользователи, JWT и подтверждение e-mail
│   │   ├── authorization/  # guards, policies и разрешения
│   │   ├── mail/           # интеграция с Resend
│   │   └── workspace/      # рабочие пространства и участники
│   ├── project/            # экспериментальный модуль проектов
│   ├── container.js        # регистрация зависимостей BottleJS
│   └── server.js           # точка входа Fastify
└── tests/api/              # API-клиент, fixtures, contracts и сценарии Jest
```

Запрос проходит через маршрут и middleware к контроллеру, затем к сервису и репозиторию. Зависимости собираются в [`src/container.js`](src/container.js); точка входа — [`src/server.js`](src/server.js).

## Тестирование

API-тесты обращаются к уже запущенному приложению. Создайте `.env.test`:

```dotenv
TEST_BASE_URL=http://127.0.0.1
TEST_PORT=3000
```

В одном терминале запустите сервер, в другом — тесты:

```bash
npm run test:api -- --runInBand
```

> [!NOTE]
> Набор API-тестов и CI workflow сейчас реорганизуются и на текущей ветке могут быть нестабильны. Перед pull request проверяйте также изменённый сценарий вручную.

## Разработка и участие

Проект сопровождает [Nikita Novikov (@kitnovikov)](https://github.com/kitnovikov). Список авторов изменений доступен на странице [Contributors](https://github.com/kitnovikov/task-manager/graphs/contributors).

Чтобы предложить изменение:

1. Создайте issue с описанием проблемы или предложения; крупные изменения предварительно согласуйте с сопровождающим.
2. Сделайте fork и создайте отдельную ветку от актуальной рабочей ветки.
3. Сохраняйте существующее разделение на контроллеры, сервисы, репозитории и DTO.
4. Добавьте или обновите тесты и не включайте в коммит секреты, `.env`, логи и сгенерированные артефакты.
5. Откройте небольшой, сфокусированный pull request с описанием поведения и способа проверки.

Отдельный `CONTRIBUTING.md` пока не добавлен; до его появления эти правила являются базовыми требованиями к вкладу.

## Помощь и документация

- вопросы, ошибки и предложения: [GitHub Issues](https://github.com/kitnovikov/task-manager/issues);
- изменения кода: [Pull Requests](https://github.com/kitnovikov/task-manager/pulls);
- зависимости и npm-команды: [`package.json`](package.json);
- модель данных: [`prisma/schema.prisma`](prisma/schema.prisma) и файлы в [`prisma/models/`](prisma/models/);
- маршруты приложения: [`src/http/routes/`](src/http/routes/).

Перед созданием issue проверьте существующие обращения и приложите версию Node.js, шаги воспроизведения, ожидаемый результат и обезличенный фрагмент логов.
