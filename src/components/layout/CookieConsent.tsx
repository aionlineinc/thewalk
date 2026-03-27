'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookieConsent')) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-earth-100 p-4 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-foreground">
          We use cookies to ensure you get the best experience on our website. 
          By continuing to use this site, you consent to our use of cookies in accordance with GDPR.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setShow(false)}>Decline</Button>
          <Button onClick={() => {
            localStorage.setItem('cookieConsent', 'true');
            setShow(false);
          }}>Accept</Button>
        </div>
      </div>
    </div>
  );
}
