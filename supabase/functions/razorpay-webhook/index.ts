import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { hmac } from "https://deno.land/x/hmac@v1.0.3/mod.ts"

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const signature = req.headers.get('x-razorpay-signature')
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')

    if (!signature || !webhookSecret) {
      return new Response(JSON.stringify({ error: 'Missing security configuration context' }), { status: 400 })
    }

    const rawBody = await req.text()
    const expectedSignature = hmac("sha256", webhookSecret, rawBody, "utf8", "hex")

    if (signature !== expectedSignature) {
      return new Response(JSON.stringify({ error: 'Untrusted signature match failure' }), { status: 401 })
    }

    const eventData = JSON.parse(rawBody)
    
    if (eventData.event === 'order.paid') {
      const payload = eventData.payload.payment.entity
      const userId = payload.notes?.user_id

      if (userId) {
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
          { auth: { persistSession: false } }
        )

        // Mark user transaction or listing active in database
        await supabaseAdmin
          .from('profiles')
          .update({ premium_status: true, updated_at: new Date().toISOString() })
          .eq('id', userId)
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
