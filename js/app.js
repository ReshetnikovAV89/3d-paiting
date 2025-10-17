// app.js — плавный скролл, лайтбокс с группами, мини-i18n, стрелки
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

  /* lightbox (grouped by data-group) */
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector(".lightbox__img");
  const lbClose = lb.querySelector(".lightbox__close");
  let current = 0;
  let groupList = [];

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
    setTimeout(() => (lbImg.src = ""), 300);
  }

  document.querySelectorAll("[data-lightbox]").forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      openLB(a);
    });
  });

  lb.addEventListener("click", e => {
    if (e.target === lb || e.target === lbClose) closeLB();
  });

  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("lightbox--open")) return;
    if (e.key === "Escape") closeLB();
    if (e.key === "ArrowRight") {
      current = (current + 1) % groupList.length;
      lbImg.src = groupList[current].href;
    }
    if (e.key === "ArrowLeft") {
      current = (current - 1 + groupList.length) % groupList.length;
      lbImg.src = groupList[current].href;
    }
  });

  /* i18n */
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

  /* arrows scroll */
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
});
