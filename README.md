# 3D Painting Gallery


# 3d-project — lightweight data flow

- Источник карточек: `data/projects.json` (массив).
- Для добавления/редактирования карточек без сервера используйте `admin/local.html` (открывается оффлайн).
- Файлы `admin/config.yml` и любая CMS не используются — GitHub Pages не даёт OAuth по умолчанию.
- Рекомендуемая структура картинок: `images/<slug>/cover.jpg`, `images/<slug>/step1.jpg`, ...

## Структура записи
```json
{
  "title": "Assassin 1/10",
  "date": "2025-10-17",
  "cover": "images/assassin/cover.jpg",
  "gallery": [
    { "image": "images/assassin/step1.jpg" }
  ],
  "scale": "1/10",
  "paints": ["Vallejo 70.899 Dark Prussian Blue", "Tamiya X-11 Chrome Silver"],
  "steps": [{ "text": "Грунт серым Vallejo." }],
  "tags": ["WIP", "helmet"],
  "published": true,
  "order": 10,
  "slug": "assassin"
}
```
