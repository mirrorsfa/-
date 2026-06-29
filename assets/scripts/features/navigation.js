export function initNavigation(showToast) {
  const navigationItems = document.querySelectorAll('.main-nav .nav-item');

  navigationItems.forEach(item => {
    item.addEventListener('click', event => {
      navigationItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      const target = document.querySelector(item.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      event.preventDefault();
      showToast(`${item.dataset.page}页面将在动态版继续完善`);
    });
  });
}
