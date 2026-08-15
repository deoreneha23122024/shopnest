/**
 * toast.js – Lightweight toast notification utility
 *
 * Creates animated toast notifications without any external library.
 * Supports: success, error, info, warning
 */

let container = null;

const getContainer = () => {
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }
  return container;
};

const ICONS = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
};

const COLORS = {
  success: 'linear-gradient(135deg, #059669, #10b981)',
  error: 'linear-gradient(135deg, #dc2626, #ef4444)',
  info: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  warning: 'linear-gradient(135deg, #d97706, #f59e0b)',
};

const show = (message, type = 'info', duration = 3000) => {
  const c = getContainer();

  const toast = document.createElement('div');
  toast.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    border-radius: 12px;
    background: ${COLORS[type]};
    color: white;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    pointer-events: auto;
    cursor: pointer;
    max-width: 320px;
    transform: translateX(120%);
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
    opacity: 0;
    backdrop-filter: blur(8px);
  `;

  toast.innerHTML = `<span style="font-size:18px">${ICONS[type]}</span><span>${message}</span>`;
  c.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });
  });

  // Dismiss on click
  toast.addEventListener('click', () => dismiss(toast));

  // Auto dismiss
  const timer = setTimeout(() => dismiss(toast), duration);
  toast._timer = timer;

  return toast;
};

const dismiss = (toast) => {
  clearTimeout(toast._timer);
  toast.style.transform = 'translateX(120%)';
  toast.style.opacity = '0';
  setTimeout(() => toast.remove(), 350);
};

const toast = {
  success: (msg, duration) => show(msg, 'success', duration),
  error: (msg, duration) => show(msg, 'error', duration),
  info: (msg, duration) => show(msg, 'info', duration),
  warning: (msg, duration) => show(msg, 'warning', duration),
};

export default toast;
