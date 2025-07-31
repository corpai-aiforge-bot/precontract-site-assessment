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
        const onLoad = () => {
          if (src.includes('maps.googleapis.com') && (!window.google || !window.google.maps || !window.google.maps.places)) {
            existing.setAttribute('data-status', 'error');
            setStatus('error');
            console.error('Google Maps Places API not initialized. Check API key, Places API status, or billing account.');
            return;
          }
          existing.setAttribute('data-status', 'ready');
          setStatus('ready');
        };
        const onError = () => {
          existing.setAttribute('data-status', 'error');
          setStatus('error');
          console.error(`Failed to load script: ${src}. Possible causes: network error, invalid API key, or Places API not enabled.`);
        };
        existing.addEventListener('load', onLoad);
        existing.addEventListener('error', onError);
        return () => {
          existing.removeEventListener('load', onLoad);
          existing.removeEventListener('error', onError);
        };
      }
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-status', 'loading');

    const onLoad = () => {
      if (src.includes('maps.googleapis.com') && (!window.google || !window.google.maps || !window.google.maps.places)) {
        script.setAttribute('data-status', 'error');
        setStatus('error');
        console.error('Google Maps Places API not initialized. Check API key, Places API status, or billing account.');
        return;
      }
      script.setAttribute('data-status', 'ready');
      setStatus('ready');
    };

    const onError = () => {
      script.setAttribute('data-status', 'error');
      setStatus('error');
      console.error(`Failed to load script: ${src}. Possible causes: network error, invalid API key, or Places API not enabled.`);
    };

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
      document.body.removeChild(script);
    };
  }, [src]);

  return status;
}