export function query(selector, parent = document) {
  return parent.querySelector(selector);
}

export function queryAll(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

export function setHTML(selector, html, parent = document) {
  const target = query(selector, parent);
  if (!target) return;
  target.innerHTML = html;
}

export function bindSmoothAnchors(parent = document) {
  queryAll('a[href^="#"]', parent).forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
