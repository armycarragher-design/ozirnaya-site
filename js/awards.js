/**
 * Страница «Награды и благодарности»: просмотр фото крупно (лайтбокс)
 */
document.addEventListener('DOMContentLoaded', () => {
  const box = document.getElementById('lightbox');
  if (!box) return;

  const img = box.querySelector('.lightbox-img');
  const caption = box.querySelector('.lightbox-caption');
  const triggers = [...document.querySelectorAll('[data-lightbox]')];
  let current = 0;

  const show = (i) => {
    current = (i + triggers.length) % triggers.length;
    const src = triggers[current].querySelector('img');
    img.src = src.src;
    img.alt = src.alt;
    caption.textContent = src.alt;
  };

  const open = (i) => {
    show(i);
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add('active'));
    document.body.style.overflow = 'hidden';
    box.querySelector('.lightbox-close').focus();
  };

  const close = () => {
    box.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { box.hidden = true; }, 200);
    triggers[current].focus();
  };

  triggers.forEach((t, i) => t.addEventListener('click', () => open(i)));
  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
  box.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
  box.addEventListener('click', (e) => {
    if (e.target === box || e.target.classList.contains('lightbox-figure')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
});
