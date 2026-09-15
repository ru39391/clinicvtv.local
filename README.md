# Редизайн сайта стоматологической клиники

Статическая версия сайта стоматологической клиники: вёрстка и клиентская логика реализованы на Twig, SCSS и TypeScript, сборка выполняется через Vite. Динамические блоки (список сотрудников, прайслист, примеры работ, отзывы, галерея, отделения клиники) получают данные с бэкенда по REST API.

Проект представляет собой промежуточный этап перед внедрением в CMS MODX Revolution. Вёрстка всех блоков собрана в одном Twig-шаблоне `tpl.twig`, а дополнительные Twig-файлы используются только для клиентского рендеринга подгружаемых с API сущностей.

## Содержание

- [Требования](#требования)
- [Установка](#установка)
- [Переменные окружения](#переменные-окружения)
- [Скрипты](#скрипты)
- [Структура проекта](#структура-проекта)
- [Конфигурация Vite](#конфигурация-vite)
- [Точка входа](#точка-входа)
- [Модули](#модули)
- [Twig-шаблоны](#twig-шаблоны)
- [API](#api)
- [Деплой](#деплой)
- [Особенности реализации](#особенности-реализации)

## Требования

- Node.js v23.0.0
- npm 10.9.0
- Бэкенд с REST API, доступный по относительному пути `/api` (в dev-режиме проксируется через Vite).

## Установка

```bash
npm install
```

Создайте `.env` и `.env.production` по образцам из раздела «Переменные окружения».

Запуск dev-сервера:

```bash
npm run dev
```

Сборка:

```bash
npm run build
```

Предпросмотр собранной версии:

```bash
npm run preview
```

## Переменные окружения

`.env` (режим разработки):

```
VITE_APP_ENV=development
VITE_SITE_URL=http://localhost
VITE_API_URL=/api
VITE_TPL_PATH=/templates
VITE_ASSETS_PATH=../../src/assets
```

`.env.production` (продакшен):

```
VITE_APP_ENV=production
VITE_API_URL=/api
VITE_TPL_PATH=/templates
VITE_ASSETS_PATH=/assets/static/src/assets
```

| Переменная          | Описание                                                                                          |
|---------------------|---------------------------------------------------------------------------------------------------|
| `VITE_APP_ENV`      | Окружение (`development` / `production`). В `development` включает клиентский рендер `tpl.twig`.  |
| `VITE_SITE_URL`     | URL бэкенда CMS MODX, используется для проксирования `/api` в dev-режиме.                             |
| `VITE_API_URL`      | Базовый путь к API.                                                                               |
| `VITE_TPL_PATH`     | Путь к директории с Twig-шаблонами.                                                               |
| `VITE_ASSETS_PATH`  | Базовый путь к статике, подставляется в SCSS как переменная `$assets`.                            |

## Скрипты

- `npm run dev` — запуск Vite в режиме разработки.
- `npm run build` — проверка типов через `tsc` и продакшен-сборка через `vite build`.
- `npm run preview` — локальный предпросмотр собранной версии.

## Структура проекта

```
src/
├── assets/       # Статика и Twig-шаблоны (tpl.twig и шаблоны для клиентского рендеринга)
├── scripts/      # Логика приложения: точка входа app.js, модули и утилиты
│   ├── modules/  # Модули поведения (табы, слайдеры, модальные окна, формы и др.)
│   └── utils/    # Утилиты, API-клиент, константы и общие типы
├── styles/       # SCSS по слоям base, layout, components, точка входа main.scss
└── main.ts       # Точка входа сборки
```

## Конфигурация Vite

Файл `vite.config.js`:
- Загружает переменные окружения через `loadEnv`.
- В `css.preprocessorOptions.scss.additionalData` добавляет переменную `$assets` со значением из `VITE_ASSETS_PATH`, доступную во всех SCSS-файлах.
- В режиме `development` настраивает прокси для `/api` на `VITE_SITE_URL` с `changeOrigin: true` и `secure: false`.

## Точка входа

`src/main.ts`:
- Импортирует стили Swiper (`swiper/swiper-bundle.css`).
- Импортирует `./styles/main.scss`.
- Вызывает `init()` из `./scripts/app`.

## Модули

Общие:
- `accordion.ts` — аккордеон для FAQ и отзывов.
- `forms.ts` — управление формами обратной связи.
- `gallery.ts` — галерея изображений.
- `modal.ts` — модальные окна.
- `slides.ts` — слайдеры и карусели на Swiper.
- `toggler.ts` — простое переключение (мобильное меню).
- `toggler-extended.ts` — расширенное переключение (например, «До/После» в блоке работ).

Табы:
- `tabs.ts` — базовые табы.
- `tabs-renderer.ts` — табы с запросом на сервер и рендером возвращаемого контента, наследует `tabs.ts`.
- `example-tabs-renderer.ts` — табы для блока с примерами работ, наследует `tabs.ts`.
- `price-tabs-renderer.ts` — табы для прайслиста, наследует `tabs.ts`.
- `testimonial-tabs-renderer.ts` — табы для отзывов, наследует `tabs.ts`.

Разнообразие рендереров связано с различиями в отображении сущностей (карусель, сетка, список, аккордеон внутри панели).

## Twig-шаблоны

- `tpl.twig` — общая вёрстка всех блоков страницы. Расширение шаблона не планируется, так как далее он внедряется в CMS MODX.
- Остальные Twig-файлы используются для клиентского рендеринга контента, который приходит с API:
  - `team-grid-item.twig`, `team-grid-wrapper.twig` — сетка карточек сотрудников.
  - `team-carousel-item.twig`, `team-carousel-wrapper.twig` — карусель карточек сотрудников.
  - `team-item-feature.twig` — дополнительный признак карточки сотрудника.
  - `price-list-item.twig`, `price-list-wrapper.twig` — прайслист.
  - `examples-carousel-item.twig`, `examples-carousel-wrapper.twig` — примеры работ.
  - `testimonial-carousel-item.twig`, `testimonial-carousel-wrapper.twig` — отзывы.
  - `gallery-carousel-item.twig`, `gallery-carousel-wrapper.twig` — галерея.

Добавление новых Twig-шаблонов страниц не предусмотрено.

## API

Клиентская обёртка над REST API расположена в `src/scripts/utils/api/`.

- `api-client.ts` — базовый HTTP-клиент.
- `interceptors.ts` — `requestInterceptor` (заголовки, метод, тело) и `responseInterceptor` (разбор ответа).
- `types.ts` — типы ответа `TResponseData`.
- `index.ts` — экспортирует `apiHandler` с методами `fetch` и `create`.

Контракт ответа бэкенда:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "total_time": "0.1314 s",
    "query_time": "0.0047 s",
    "php_time": "0.1267 s",
    "queries": 13,
    "source": "cache",
    "memory": "10 240 KB"
  }
}
```

Используемые эндпоинты:
- `GET /api/team/{id}` и `GET /api/team?dept_id=...` — сотрудники.
- `GET /api/pricelist?all=1&dept_id=...&sortby=name&sortdir=ASC` — прайслист.
- `GET /api/examples?all=1&dept_id=...&sortby=name&sortdir=ASC` — примеры работ.
- `GET /api/testimonials?all=1&spec_ids=...` — отзывы.
- `GET /api/pictures` — изображения.
- `GET /api/dept` — отделения клиники.
- `POST /api/feedback` — форма обратной связи.
- `POST /api/testimonials` — публичное создание отзыва.

Публичные GET-эндпоинты не требуют авторизации. Операции создания, обновления и удаления (кроме публичных `POST /api/testimonials` и `POST /api/feedback`) требуют роль `Administrator` в CMS MODX.

## Деплой

Сборка выполняется командой `npm run build`, результат попадает в директорию `dist`. Дальнейшая раскладка зависит от значения `VITE_ASSETS_PATH`:

- В продакшене `VITE_ASSETS_PATH=/assets/static/src/assets` — статика и Twig-шаблоны размещаются в `/assets/static/src/assets` на сервере. Этот путь совпадает с тем, откуда CMS MODX и клиентский рендер ожидают шаблоны и ассеты.
- В dev-режиме `VITE_ASSETS_PATH=../../src/assets` — путь указывает на исходную директорию, что позволяет Vite и SCSS работать с исходниками без копирования.

Порядок деплоя:
1. Убедиться, что `.env.production` содержит актуальные значения `VITE_ASSETS_PATH` и `VITE_API_URL`.
2. Выполнить `npm install` на сборочном окружении.
3. Выполнить `npm run build`.
4. Скопировать содержимое `dist` на сервер.
5. Разместить статику и Twig-шаблоны по пути, указанному в `VITE_ASSETS_PATH`, чтобы MODX и клиентский рендер могли их найти.
6. Убедиться, что запросы к `/api` проксируются на бэкенд MODX средствами веб-сервера (в продакшене прокси Vite не используется).

CI/CD в проекте отсутствует, деплой выполняется вручную.

## Особенности реализации

- В dev-режиме (`VITE_APP_ENV=development`) страница рендерится на клиенте из `tpl.twig`, что позволяет работать без MODX.
- В продакшене рендер отключён: `initApp()` навешивает поведение на уже отрисованную сервером разметку.
- Все динамические сущности рендерятся из Twig-шаблонов на клиенте по данным API.
- В `testimonial-tabs-renderer.ts` оставлен комментарий `TODO: объединить два запроса в один` — сначала запрашивается список сотрудников, затем отзывы по `spec_ids`.
- Маска телефона реализована в `Utils.phoneMask()` без использования `inputmask`, хотя зависимость присутствует в `package.json`.
