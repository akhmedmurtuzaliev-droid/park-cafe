# Park Cafe - Design System

Премиальная UX/UI система для ресторана доставки еды.

## Цвета

| Переменная         | Значение  | Назначение      |
| ------------------ | --------- | --------------- |
| `--bg-primary`     | `#0F1115` | Основной фон    |
| `--bg-surface`     | `#181B21` | Поверхности     |
| `--accent`         | `#F4A64A` | Акцентный цвет  |
| `--text-primary`   | `#FFFFFF` | Основной текст  |
| `--text-secondary` | `#A3A3A3` | Вторичный текст |

## Типографика

- **Primary**: Inter
- **Display**: Manrope
- **Fallback**: SF Pro Display

## Сетка отступов (8px)

```
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

## Адаптивность

| Брейкпоинт  | Колонки товаров      | Описание   |
| ----------- | -------------------- | ---------- |
| 320–767px   | 2                    | Mobile     |
| 768–1023px  | 3                    | Tablet     |
| 1024–1439px | 3 + sidebar          | Laptop     |
| 1440px+     | 4 + sidebar + cart   | Desktop    |
| 1920px+     | 5 + expanded sidebar | Ultra Wide |

## Компоненты

### Кнопки

- `btn-add` - Добавление в корзину
- `btn-checkout` - Оформление заказа
- `header-btn` - Кнопки хедера

### Карточки

- `product-card` - Карточка товара
- `category-card` - Карточка категории
- `cart-item` - Элемент корзины

### Навигация

- `header` - Верхняя навигация
- `bottom-nav` - Нижняя навигация (мобилки)
- `sidebar` - Боковая панель (десктоп)

## Запуск

```bash
# Используйте любой локальный сервер
npx serve .
# или
python -m http.server 8000
```

## Структура проекта

```
park-cafe-design/
├── index.html
├── css/
│   ├── variables.css
│   ├── reset.css
│   └── components.css
├── js/
│   ├── data.js
│   └── app.js
└── assets/
    └── images/
```
