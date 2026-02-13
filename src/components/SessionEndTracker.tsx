import { useEffect } from 'react';
import { logSessionEnd } from '@/lib/sessionTracker';

export default function SessionEndTracker() {
  useEffect(() => {
    const handleUnload = () => {
      const sid = sessionStorage.getItem('session_id');
      if (sid) {
        // Use sendBeacon for reliability on page close
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/log-session`;
        navigator.sendBeacon(
          url,
          JSON.stringify({ action: 'end', session_id: sid })
        );
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return null;
}
