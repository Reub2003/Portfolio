document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.work-nav');
  if (!nav) return;
  let closeTimer;
  nav.addEventListener('mouseenter', () => {
    clearTimeout(closeTimer);
    nav.classList.add('open');
  });
  nav.addEventListener('mouseleave', () => {
    closeTimer = setTimeout(() => nav.classList.remove('open'), 150);
  });
});
