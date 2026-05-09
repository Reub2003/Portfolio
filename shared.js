document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.work-nav');
  if (!nav) return;
  nav.addEventListener('mouseenter', () => nav.classList.add('open'));
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) nav.classList.remove('open');
  });
});
