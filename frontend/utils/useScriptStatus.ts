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
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;

    if (existing) {
      if (existing.getAttribute('data-status') === 'ready') {
        setStatus('ready');
      } else if (existing.getAttribute('data-status') === 'error') {
        setStatus('error');
      } else {
        setStatus('loading');
        existing.addEventListener('load', () => setStatus('ready'));
        existing.addEventListener('error', () => setStatus('error'));
      }
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-status', 'loading');

    script.onload = () => {
      script.setAttribute('data-status', 'ready');
      setStatus('ready');
    };

    script.onerror = () => {
      script.setAttribute('data-status', 'error');
      setStatus('error');
    };

    document.body.appendChild(script);
  }, [src]);

  return status;
}
