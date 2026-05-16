import { useEffect, useRef } from 'react';

interface CaptchaWidgetProps {
  onToken: (token: string) => void;
}

export function CaptchaWidget({ onToken }: CaptchaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;
  const siteKey = import.meta.env.VITE_CAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    const renderWidget = () => {
      if (!containerRef.current) return;
      if ((window as any).turnstile) {
        (window as any).turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => onTokenRef.current(token),
        });
      } else {
        setTimeout(renderWidget, 200);
      }
    };

    if (!document.querySelector('script[src*="turnstile"]')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    renderWidget();

    return () => {
      if ((window as any).turnstile && containerRef.current) {
        try { (window as any).turnstile.remove(containerRef.current); } catch {}
      }
    };
  }, [siteKey]);

  if (!siteKey) return null;
  return <div ref={containerRef} className="cf-turnstile flex justify-center" />;
}
