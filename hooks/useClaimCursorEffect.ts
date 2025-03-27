import { useEffect } from 'react';

export default function useClaimCursorEffect() {
  useEffect(() => {
    const claim = document.getElementById('typed-claim');
    const cursor = document.getElementById('cursor');

    if (claim) {
      claim.addEventListener('animationend', () => {
        claim.classList.add('typed-done');
        if (cursor) cursor.style.opacity = '0';
      });
    }
  }, []);
}
