// utils/useScriptStatus.ts
import { useEffect, useState } from 'react';

/**
 * useScriptStatus checks whether a given script URL has loaded successfully.
 *
 * @param src The script source URL to monitor.
 * @returns 'loading' | 'ready' | 'error'
 */
export function useScriptStatus(src: string): 'loading' | 'ready' | 'error' {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!src) {
      setStatus('error');
      return;
    }

    // Check if script already exists
    let script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;

    if (!script) {
      // Create new script
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-status', 'loading');
      document.head.appendChild(script);
    } else {
      // Grab existing status if reusing
      setStatus(script.getAttribute('data-status') as 'loading' | 'ready' | 'error');
    }

    // Event listeners to update status
    const setAttributeFromEvent = (event: Event) => {
      const eventType = event.type === 'load' ? 'ready' : 'error';
      script.setAttribute('data-status', eventType);
      setStatus(eventType);
    };

    script.addEventListener('load', setAttributeFromEvent);
    script.addEventListener('error', setAttributeFromEvent);

    return () => {
      script.removeEventListener('load', setAttributeFromEvent);
      script.removeEventListener('error', setAttributeFromEvent);
    };
  }, [src]);

  return status;
}
