import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const VALID_USERNAMES = [
  'arlan.nugara@ornge.ca',
  'matthew.blacklock@calian.com',
  'rola.darwish@calian.com',
  'zdojcinovic@ornge.ca',
  'arlan.nugara@calian.com',
  'arlan.nugara@alvarnet.ca',
]

const sanitize = (str: string | undefined, maxLen: number): string =>
  (str || 'Unknown').slice(0, maxLen).replace(/[<>"']/g, '')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { action, username, device, os, browser, session_id } = body

    if (!['login', 'end'].includes(action)) {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get IP from request headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('cf-connecting-ip')
      || req.headers.get('x-real-ip')
      || 'unknown'

    if (action === 'login') {
      const cleanUsername = sanitize(username, 100)

      if (!VALID_USERNAMES.includes(cleanUsername)) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Try to get location from IP
      let location = 'Unknown'
      try {
        if (ip !== 'unknown' && ip !== '127.0.0.1') {
          const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=city,regionName,country`)
          if (geoRes.ok) {
            const geo = await geoRes.json()
            if (geo.city) {
              location = `${geo.city}, ${geo.regionName}, ${geo.country}`
            }
          }
        }
      } catch {
        // ignore geo errors
      }

      const { data, error } = await supabase.from('session_logs').insert({
        username: cleanUsername,
        ip_address: ip,
        location,
        device: sanitize(device, 50),
        os: sanitize(os, 50),
        browser: sanitize(browser, 50),
      }).select('id').single()

      if (error) {
        console.error('Insert error:', error)
        throw new Error('insert_failed')
      }

      // If this is the stats user, return the stats secret too
      const responseData: Record<string, string> = { session_id: data.id }
      if (['arlan.nugara@calian.com', 'arlan.nugara@ornge.ca', 'arlan.nugara@alvarnet.ca'].includes(cleanUsername)) {
        const statsSecret = Deno.env.get('STATS_ACCESS_SECRET')
        if (statsSecret) responseData.stats_secret = statsSecret
      }

      return new Response(JSON.stringify(responseData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'end') {
      if (!session_id || typeof session_id !== 'string' || session_id.length > 50) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { data: session } = await supabase
        .from('session_logs')
        .select('login_time')
        .eq('id', session_id)
        .single()

      if (session) {
        const duration = Math.round((Date.now() - new Date(session.login_time).getTime()) / 1000)
        await supabase.from('session_logs').update({
          session_end_time: new Date().toISOString(),
          session_duration_seconds: duration,
        }).eq('id', session_id)
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Session logging error:', err)
    return new Response(JSON.stringify({ error: 'Request processing failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
