document.addEventListener("DOMContentLoaded", () => {
  /* smooth scroll */
  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", e => {
      const el = document.querySelector(btn.dataset.scroll);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ===== Загрузка данных =====
     1) Берём стартовый data/projects.json (опционально)
     2) Плюс подцепляем ВСЕ файлы из папки data/projects/*.json (Decap CMS создаёт туда)
     Примечание: для локального файла-глоба нужна простая агрегация на клиенте: список имён
     мы не узнаем, поэтому используем 1 файл (projects.json) как основной.
     На проде проще: подключим плагин сборки/скрипт, который делает aggregated.json.
  */
  async function loadProjects() {
    try {
      const base = await fetch("./data/projects.json").then(r => r.json());
      // Если позже добавим aggregated.json — можно объединить вот так:
      // const extra = await fetch("./data/aggregated.json").then(r => r.json()).catch(()=>[]);
      // return [...base, ...extra];
      return base;
    } catch (e) {
      console.error("Не удалось загрузить projects.json", e);
      return [];
    }
  }

  /* ===== Рендер карточек ===== */
  const listEl = document.getElementById("cardsList");

  function renderProjects(items) {
    listEl.innerHTML = "";
    items.forEach(p => {
      const li = document.createElement("li");
      li.className = "card";

      // Обложка (кликабельная)
      const coverA = document.createElement("a");
      coverA.className = "card__media";
      coverA.href = p.cover;
      coverA.dataset.lightbox = "";
      coverA.dataset.group = p.group || p.title;

      const coverImg = document.createElement("img");
      coverImg.className = "card__img";
      coverImg.loading = "lazy";
      coverImg.alt = p.title;
      coverImg.src = p.cover;
      coverA.appendChild(coverImg);
      li.appendChild(coverA);

      // Доп.фото (скрытые ссылки для лайтбокса)
      (p.images || []).forEach(it => {
        const a = document.createElement("a");
        a.className = "card__media card__media--hidden";
        a.href = it.src;
        a.dataset.lightbox = "";
        a.dataset.group = p.group || p.title;
        li.appendChild(a);
      });

      // Тело
      const body = document.createElement("div");
      body.className = "card__body";

      const h3 = document.createElement("h3");
      h3.className = "card__title";
      h3.textContent = p.title;

      const tags = document.createElement("ul");
      tags.className = "card__tags";
      (p.tags || []).forEach(t => {
        const liTag = document.createElement("li");
        liTag.className = "card__tag";
        liTag.textContent = t;
        tags.appendChild(liTag);
      });

      body.appendChild(h3);
      body.appendChild(tags);
      li.appendChild(body);

      listEl.appendChild(li);
    });

    bindLightbox(); // навешиваем после рендера
  }

  /* ===== Лайтбокс ===== */
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector(".lightbox__img");
  const lbClose = lb.querySelector(".lightbox__close");
  let current = 0;
  let groupList = [];

  function bindLightbox() {
    document.querySelectorAll("[data-lightbox]").forEach(a => {
      a.addEventListener("click", e => {
        e.preventDefault();
        openLB(a);
      }, { once: false });
    });
  }

  function openLB(fromLink) {
    const group = fromLink.dataset.group || "__single__";
    groupList = Array.from(document.querySelectorAll(`[data-lightbox][data-group="${group}"]`));
    if (!fromLink.dataset.group) groupList = [fromLink];
    current = Math.max(0, groupList.indexOf(fromLink));
    lbImg.src = groupList[current].href;
    lb.classList.add("lightbox--open");
  }

  function closeLB() {
    lb.classList.remove("lightbox--open");
    setTimeout(() => (lbImg.src = ""), 250);
  }

  lb.addEventListener("click", e => {
    if (e.target === lb || e.target === lbClose) closeLB();
  });

  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("lightbox--open")) return;
    if (e.key === "Escape") return closeLB();
    if (e.key === "ArrowRight") {
      current = (current + 1) % groupList.length;
      lbImg.src = groupList[current].href;
    }
    if (e.key === "ArrowLeft") {
      current = (current - 1 + groupList.length) % groupList.length;
      lbImg.src = groupList[current].href;
    }
  });

  /* ===== I18N (как было) ===== */
  const dict = {
    ru:{title:"3D-работы, фигурки и диорамы",subtitle:"Ручная покраска. Витрина 2025.", "cta.view":"Смотреть работы","cta.contact":"Связаться", foot:"© 2025 Ручная покраска миниатюр. Иркутск → мир."},
    en:{title:"3D works, figures & dioramas",subtitle:"Hand-painted. Showcase 2025.", "cta.view":"View works","cta.contact":"Contact", foot:"© 2025 Hand-painted miniatures. Irkutsk → world."},
    zh:{title:"3D 作品 · 手办与场景",subtitle:"手工上色 · 2025 展示", "cta.view":"查看作品","cta.contact":"联系", foot:"© 2025 手绘微缩模型"}
  };
  const sel = document.getElementById("lang");
  function applyLang(l){
    const t = dict[l] || dict.ru;
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const k = el.dataset.i18n;
      if (t[k]) el.textContent = t[k];
    });
    document.documentElement.lang = l;
  }
  if (sel){
    sel.addEventListener("change", ()=>applyLang(sel.value));
    applyLang(sel.value || "ru");
  }

  /* ===== Стрелки прокрутки ===== */
  const list = document.querySelector(".cards__list");
  const left = document.querySelector(".cards__arrow--left");
  const right = document.querySelector(".cards__arrow--right");
  function scrollStep(dir){
    if (!list) return;
    const step = Math.max(280, Math.min(460, list.clientWidth * 0.8));
    list.scrollBy({ left: dir * step, behavior: "smooth" });
  }
  if (left && right) {
    left.addEventListener("click", () => scrollStep(-1));
    right.addEventListener("click", () => scrollStep(1));
  }

  /* старт */
  loadProjects().then(renderProjects);
});

  /* ===== Нормализация данных (старый + новый форматы) ===== */
  function fixPath(p) {
    if (!p) return "";
    // Заменяем обратные слэши на прямые
    let s = p.replace(/\\/g, "/");
    // Если нет расширения — предполагаем .jpg
    if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(s)) s += ".jpg";
    return s;
  }

  function normalizeItem(p) {
    // Если карточка помечена как скрытая — вернём null (отфильтруем)
    if (p.published === false) return null;

    // Новый формат (gallery[{image}], date, slug, order...)
    if (Array.isArray(p.gallery) || "date" in p || "slug" in p) {
      return {
        title: p.title,
        group: p.slug || p.group || p.title,
        cover: fixPath(p.cover || (p.gallery?.[0]?.image || "")),
        images: (p.gallery || []).map(it => ({ src: fixPath(it.image) })),
        tags: p.tags || [],
        order: typeof p.order === "number" ? p.order : 0,
        _date: p.date || ""
      };
    }

    // Старый формат (images[{src}], year, group...)
    return {
      title: p.title,
      group: p.group || p.title,
      cover: fixPath(p.cover || (p.images?.[0]?.src || "")),
      images: (p.images || []).map(it => ({ src: fixPath(it.src) })),
      tags: p.tags || [],
      order: 0,
      _date: ""
    };
  }
