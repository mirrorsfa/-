export function createToast(element) {
  let timer;

  return function showToast(message) {
    element.textContent = message;
    element.classList.add('show');
    window.clearTimeout(timer);
    timer = window.setTimeout(() => element.classList.remove('show'), 2200);
  };
}
