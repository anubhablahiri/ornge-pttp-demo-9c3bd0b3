import { useEffect } from 'react';

export default function SessionEndTracker() {
  useEffect(() => {
    const handleUnload = () => {
      const sid = sessionStorage.getItem('session_id');
      if (sid) {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/log-session?apikey=${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`;
        const blob = new Blob(
          [JSON.stringify({ action: 'end', session_id: sid })],
          { type: 'application/json' }
        );
        navigator.sendBeacon(url, blob);
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return null;
}
