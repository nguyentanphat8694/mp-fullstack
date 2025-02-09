import { useLayoutEffect } from 'react';

export const useScrollLock = (lock = false) => {
  useLayoutEffect(() => {
    if (lock) {
      // Lưu scroll position hiện tại
      const scrollY = window.scrollY;
      document.documentElement.style.setProperty('--scroll-position', `${scrollY}px`);
      document.documentElement.classList.add('modal-open');
      // Fix position để tránh scroll khi có modal
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position
      const scrollY = document.documentElement.style.getPropertyValue('--scroll-position');
      document.documentElement.classList.remove('modal-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10));
    }

    return () => {
      document.documentElement.classList.remove('modal-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [lock]);
}; 