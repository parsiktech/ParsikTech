import { NextRequest, NextResponse } from 'next/server'

// TODO: Wire up Resend email + Notion logging
// This is a placeholder — returns 200 so the form flow works end-to-end
export async function POST(req: NextRequest) {
  const body = await req.json()

  // Honeypot check
  if (body._hp) {
    // Silently succeed — fool the bot
    return NextResponse.json({ ok: true })
  }

  const { email, fullName, businessName, industry, website, toolsChecked, toolsOther, biggestFrustration, goal, competitors, adSpend, priorAgency, anythingElse } = body

  // Basic validation
  if (!email || !fullName || !businessName || !website || !biggestFrustration || !goal) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Field length limits
  const limits: Record<string, number> = {
    fullName: 120, businessName: 120, website: 250, toolsOther: 500,
    biggestFrustration: 2000, goal: 1500,
    competitors: 1000, priorAgency: 2000, anythingElse: 2000,
  }
  for (const [field, max] of Object.entries(limits)) {
    if (body[field] && body[field].length > max) {
      return NextResponse.json({ error: `${field} exceeds maximum length` }, { status: 400 })
    }
  }

  // TODO: Send via Resend
  // TODO: Log to Notion

  console.log('Intake submission received:', { email, fullName, businessName, industry, website, toolsChecked })

  return NextResponse.json({ ok: true })
}
