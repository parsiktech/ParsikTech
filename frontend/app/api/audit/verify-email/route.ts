import { NextRequest, NextResponse } from 'next/server'

// TODO: Wire up real Stripe check
// This is a placeholder — replace with actual Stripe customer lookup
export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Placeholder: accept any well-formed email so you can preview the form
  // Remove this and uncomment the Stripe check below when ready
  return NextResponse.json({ verified: true })

  // ── Real Stripe check (wire up when ready) ──────────────────────────────
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  // const customers = await stripe.customers.list({ email, limit: 1 })
  // if (!customers.data.length) {
  //   return NextResponse.json({ error: 'Not found' }, { status: 404 })
  // }
  // const charges = await stripe.charges.list({ customer: customers.data[0].id })
  // const paid = charges.data.some(c => c.amount === 75000 && c.paid)
  // if (!paid) return NextResponse.json({ error: 'No matching purchase' }, { status: 404 })
  // return NextResponse.json({ verified: true })
}
