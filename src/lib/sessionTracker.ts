import { supabase } from '@/integrations/supabase/client';

function getDeviceInfo() {
  const ua = navigator.userAgent;

  // Device
  let device = 'Desktop';
  if (/Mobi|Android/i.test(ua)) device = 'Mobile';
  else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';

  // OS
  let os = 'Unknown';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/CrOS/i.test(ua)) os = 'ChromeOS';

  // Browser
  let browser = 'Unknown';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/Chrome/i.test(ua)) browser = 'Chrome';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Safari/i.test(ua)) browser = 'Safari';
  else if (/Opera|OPR/i.test(ua)) browser = 'Opera';

  return { device, os, browser };
}

export async function logLogin(username: string): Promise<string | null> {
  try {
    const { device, os, browser } = getDeviceInfo();
    const { data, error } = await supabase.functions.invoke('log-session', {
      body: { action: 'login', username, device, os, browser },
    });
    if (error) {
      console.error('Session log error:', error);
      return null;
    }
    // Store stats secret if returned (only for arlan)
    if (data?.stats_secret) {
      sessionStorage.setItem('stats_secret', data.stats_secret);
    }
    return data?.session_id || null;
  } catch (e) {
    console.error('Session log error:', e);
    return null;
  }
}

export async function logSessionEnd(sessionId: string) {
  try {
    await supabase.functions.invoke('log-session', {
      body: { action: 'end', session_id: sessionId },
    });
  } catch (e) {
    console.error('Session end log error:', e);
  }
}
