🔷 PARSIK TECH GROUP — SITE 2.0 BLUEPRINT
Design Philosophy
Current state: Clean, minimal dark mode. Works. Safe. Forgettable.
Target state: Cinematic, high-trust, premium agency feel. Think Linear.app meets Stripe meets a boutique PE firm's site — with motion and depth that signals we are the most serious team in the room.
🎨 GLOBAL DESIGN SYSTEM OVERHAUL
Color Palette
Replace the current flat near-black + single blue accent with a layered system:

Background Base: #04040A (true near-black with a faint blue undertone, not pure black)
Surface Layer 1: #0D0D1A (for cards and panels)
Surface Layer 2 (Glass): rgba(255,255,255,0.04) with backdrop-filter: blur(20px) — this is your glassmorphism base
Primary Accent: Keep the electric blue #5A5AFF but add a second accent: #00D4FF (cyan) for glow highlights
Gradient Accent: Use a 135deg linear gradient from #5A5AFF → #00D4FF on key CTAs and highlighted words
Text Primary: #F0F0FF (slightly cool white, not pure)
Text Secondary: #7A7A9A
Success Green: #00E676 (for the "Online" indicators — make them pulse)
Danger/Warm: #FF6B35 (for the "Limited Availability" badge)

Typography
Current issue: Only one weight/family is doing all the work. No typographic hierarchy drama.

Display (hero headings): Switch to Clash Display or Syne — something with variable weight axis. Use font-weight: 700-800.
Body: Stay on Inter or switch to DM Sans for cleaner readability at small sizes.
Mono elements (numbers, status badges, tech stack labels): Use JetBrains Mono — this immediately signals engineering credibility.
Apply fluid typography: clamp(3.5rem, 8vw, 7rem) on hero headlines — they should feel massive on desktop and scale down gracefully. The current hero headline is too small for the content's confidence.

Motion & Interaction System (Tell your Claude skill to implement these)

Entrance animations: Every section should fade + translate-Y upward on scroll using IntersectionObserver. Stagger children by 80ms delay.
Cursor: Add a custom cursor — a small glowing dot 12px with a 40px trailing ring that follows with a 0.1s spring lag. On hover over CTAs, the ring expands to 60px and fills with a rgba(90,90,255,0.15) tint.
Button hover states: All primary buttons should have a liquid shimmer on hover — a linear-gradient sweep from left to right using @keyframes shimmer at 600ms.
Number counters: The stats section numbers should animate up from 0 when they enter the viewport using a count-up easing function.


🖥️ SECTION-BY-SECTION CHANGES

1. NAVBAR — Drastic Upgrade Needed
Current: Flat black bar. Thin wordmark. Standard links.
2.0 Direction:

Make the navbar glassmorphic: background: rgba(4,4,10,0.7), backdrop-filter: blur(24px) saturate(180%), border-bottom: 1px solid rgba(255,255,255,0.06).
Add a subtle box-shadow: 0 1px 0 rgba(90,90,255,0.2) — a barely-visible electric-blue bottom border glow.
The ParsikTech wordmark: Increase font size slightly. Add a micro-animation on load where "Parsik" fades in from left and "Tech" fades in from right with a 150ms delay.
Add a live status dot next to the logo on desktop — a small ● in green with a CSS @keyframes pulse animation (scale 1 → 1.4 → 1, opacity 1 → 0.4 → 1, 2s loop). Label: "Systems Active" in 10px mono font.
CTA button "Client Login": Change to a gradient fill using the #5A5AFF → #00D4FF gradient, rounded to 9999px (pill), with a glow shadow: 0 0 20px rgba(90,90,255,0.4). On hover, the glow intensifies to 0 0 35px rgba(90,90,255,0.7).
On scroll, the navbar should compress slightly in height (72px → 56px) with a transition: height 0.3s ease.


2. HERO SECTION — Biggest Opportunity on the Page
Current: Left-aligned heading, subtext, two buttons, a status widget in a card. Dark background. No background treatment whatsoever — just flat black. This is the most wasted real estate.
2.0 Direction:
Background: Implement a liquid gradient mesh background. Your Claude skill can build this with layered radial-gradient blobs that slowly animate using CSS @keyframes or a <canvas> element:

Blob 1: #5A5AFF at 20% 30%, radial-gradient spread 500px, opacity 0.12, animates slowly (20s loop)
Blob 2: #00D4FF at 80% 60%, spread 400px, opacity 0.07, animates offset
Blob 3: #7B2FFF at 60% 20%, spread 350px, opacity 0.08
This creates a deep space nebula feel without being loud
Hero Headline — Rewrite:
Current: "Where systems meet execution."
Suggested 2.0: "We Build the Systems Your Business Runs On."
Or keep the current and just make "execution." use an animated gradient text — the background-clip: text technique cycling through #5A5AFF → #00D4FF → #7B2FFF.
Subheadline: Current text is fine but increase size to 1.35rem and make it #9090B0 — slightly more readable.
"SOFTWARE · STRATEGY · EXECUTION" pill label: Replace the simple text with a scrolling marquee ticker — use an infinite horizontal scroll of these three words separated by small diamond ◆ symbols. Makes it feel alive.
CTA Block:
"Our Services" button: Full gradient pill with glow (as above)
"Contact Us" button: Change to glass button — background: rgba(255,255,255,0.06), border: 1px solid rgba(255,255,255,0.12), backdrop-filter: blur(10px). On hover, border brightens to rgba(90,90,255,0.5) and background lightens slightly.
The status indicators below the buttons (Servers Online, etc.) — make these feel like a real terminal readout: monospace font, add a very subtle green scan-line animation, make the dots pulse.
Add a hero visual: Right side of hero is currently empty black space on the initial view. Add either:
A 3D tilt card component showing the dashboard UI (the one from the Operations Hub section) — positioned to the right, floating, with perspective CSS and mouse-parallax movement using JavaScript mousemove listener
OR a abstract grid/mesh wireframe that rotates slowly — pure CSS 3D transform


3. AT A GLANCE (Stats Section)
Current: Five dark cards with big numbers. Fine but generic.
2.0 Direction:

Change the card treatment to liquid glass cards: background: rgba(255,255,255,0.03), border: 1px solid rgba(255,255,255,0.08), box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.4), backdrop-filter: blur(12px).
On hover: cards should lift — transform: translateY(-8px) with a gentle blue glow shadow appearing below.
Numbers should be count-up animated on scroll enter.
Add a thin gradient border to each card using a ::before pseudo-element with a conic-gradient — it creates the "glowing edge" look that's very premium right now.
Rewrite the labels:

"Revenue Generated" → "Client Revenue Driven"
"Ad Spend Managed" → "Paid Media Deployed"
"Leads Captured" → "Pipeline Entries Automated"
"Costs Replaced" → "Operational Cost Eliminated"
"Efficiency Gained" → "Sustained Efficiency Uplift"
These are more specific and impressive-sounding without changing the numbers.


Add a sixth card: "Avg. Client Retention" → 94% (or whatever your actual number is). Social proof of longevity hits hard.


4. OPERATIONS HUB SECTION
Current: Left text, right slideshow of dashboard screenshots. Clean but static.
2.0 Direction:

The badge pill "INCLUDED WITH EVERY SERVICE" should be redesigned: gradient background, animated pulse dot, small icon (shield or lock). This is a massive value prop — it should look like one.
Dashboard mockup on the right: Give it a floating 3D treatment — slight perspective tilt (Y-axis 8deg, X-axis 3deg), hover mouse-parallax effect, a soft bottom shadow with blue glow, and a subtle border: 1px solid rgba(90,90,255,0.3) frame.
Add a thin animated scan line sweeping top to bottom on the dashboard image every 4 seconds — like a live system refresh indicator.
The checklist items (Real-time tracking, Billing, etc.): add micro-animations — each check icon should scale(0) → scale(1) with a spring animation as the user scrolls past.
Rewrite headline: "Operations Hub" → "Your Command Center." More evocative, more ownership language.


5. BUILT FOR SECTION (Audience Targeting)
Current: Four dark cards with number labels 01–04. Solid but the layout feels like a placeholder grid.
2.0 Direction:

Redesign as a horizontal tab/pill selector on desktop: clicking each audience type (Founder-Led, Multi-Location, etc.) transitions the right panel to show specific bullets and a relevant dashboard preview or mini visual. This makes the section interactive and memorable.
If that's too complex, upgrade the cards with gradient number labels instead of the plain colored ones — and add a hover state where the entire card brightens and reveals a short "Why Parsik?" one-liner specific to that segment.
Rewrite section headline: "Teams that need systems, not experiments." is actually very good — keep this one. It's sharp.
Add a background treatment to this section: a subtle noise texture (SVG feTurbulence filter at 3% opacity) over the dark background breaks up the monotony and adds depth.


6. WHAT YOU GET SECTION
Current: Six flat cards in a 2-column grid. Completely flat, no visual hierarchy.
2.0 Direction:

Convert to a bento grid layout: vary card sizes — the top two cards should be full-width or 60/40 split to create visual variety. This is the design pattern used by Linear, Vercel, and Resend.
Each card should have a subtle icon in the top-left corner (not emoji — use a thin-stroke icon from Lucide or Phosphor).
Add glassmorphic card treatment (same as stats section).
The "Clear timelines & ownership" card is currently highlighted in blue — make this the featured card in the bento by making it larger and adding a glowing border treatment.
Add a short animated diagram inside the "Dedicated client dashboard" card — a minimal line chart or a simple pulsing node graph. Even static SVG improves perceived value.


7. TECH STACK SECTION
Current: Three rows of flat pill labels (React, Next.js, etc.). Looks like a boring resume.
2.0 Direction:

Add actual logos for every technology — not just text. Use SVG icons (Simple Icons library). Place the logo left of the text inside each pill.
On hover, each pill should slightly glow with that technology's brand color (React = cyan, AWS = orange, etc.) — achieved with box-shadow on hover using hardcoded brand colors per tag.
Change the layout from rows to a flowing horizontal scroll marquee (infinite loop, left-to-right, pauses on hover) — this is the pattern used by Stripe and Vercel's landing pages and it looks far more dynamic.
Consider separating into three stacked marquee rows running at slightly different speeds — one for Engineering, one for Marketing, one for Infrastructure.


8. ENGAGEMENTS / HOW WE WORK TOGETHER
Current: Three cards — Ongoing Partnership, Project-Based Builds, Advisory & Optimization. The middle card has a "Most Popular" badge.
2.0 Direction:

Make the "Project-Based Builds" card a true hero — it should be noticeably taller than the others, use the gradient border treatment, have a box-shadow glow, and feature the "Most Popular" badge redesigned as a floating pill above the card with a pulsing gradient background.
All three cards: add glassmorphism treatment, icon in top-left, subtle hover lift.
Rewrite card descriptions to be more outcome-focused:

Ongoing Partnership: Add "Starting from $X/mo" if applicable — pricing anchors trust
Project-Based Builds: Add a line like "Most clients go live in 3–6 weeks"
Advisory: Add "Available for select existing systems"


Consider adding a 4th card (greyed out): "Custom Enterprise" with a "Let's Talk" CTA — creates exclusivity and upward aspiration.


9. CTA / "LET'S SEE IF THERE'S ALIGNMENT" SECTION
Current: Centered card on dark background. Decent but the card is flat and the copy is doing all the work.
2.0 Direction:

The card background: implement liquid glass at maximum intensity here — background: rgba(255,255,255,0.05), heavy blur backdrop-filter: blur(40px), border: 1px solid rgba(255,255,255,0.1), inner glow via box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 40px 80px rgba(90,90,255,0.15).
Add a slow-rotating conic gradient behind the card (not inside it) — a @keyframes rotate on a conic-gradient div, blurred at 60px, opacity 0.15. This creates the Aurora / Apple Vision Pro floating light ring effect.
"LIMITED AVAILABILITY" badge: Change from plain text to a warning-style badge with a #FF6B35 (warm orange) background, a pulsing dot, and the word "OPEN" in green that could swap to "CLOSED" — creates genuine urgency.
Rewrite CTA copy: "Let's see if there's alignment." is good but passive. Add a second line: "We take on new partners selectively. If the fit is right, we move fast." — this is the velvet rope effect.
CTA buttons: "Start a Conversation" should be the gradient pill. "View Services" should be ghost/glass style.


10. FOOTER
Current: Minimal 3-column footer. Fine but forgettable.
2.0 Direction:

Add a top border gradient line using a background: linear-gradient(90deg, transparent, #5A5AFF, #00D4FF, transparent) — 1px tall, full width. Elegant section divider.
Increase the footer logo/wordmark size slightly and add the tagline underneath: "Software · Systems · Execution"
Social icons: replace the basic GitHub/LinkedIn/Twitter icons with the same pill style as the tech stack — with hover glow per platform brand color.
Add a "Built with" line in the very bottom micro-text: "Built with Next.js, deployed on Vercel." — signals technical authority to technical buyers.
The copyright line: add a small uptime indicator: ● All systems operational in green — even in the footer, this reinforces reliability.


📋 COPY CHANGES SUMMARY
SectionCurrentSuggested 2.0Hero H1"Where systems meet execution.""We Build the Systems Your Business Runs On."Hero Sub"Software, infrastructure, and growth solutions..."Shorten to: "Production-grade software, infrastructure, and growth — built to perform."Operations Hub H2"Operations Hub""Your Command Center."Stats label"Revenue Generated""Client Revenue Driven"CTA section sub"We partner with a limited number..."Add: "If the fit is right, we move fast."Footer tagline"Building software that works for modern businesses.""Software that works. Systems that scale."

🛠️ WHAT TO TELL YOUR CLAUDE UIUX PRO / MAX SKILL
When you open a new chat with that skill, paste in this prompt to get started:

"Build me a Next.js + Tailwind homepage for Parsik Tech Group following this blueprint. Use: glassmorphism card treatments with backdrop-filter, animated gradient mesh background on the hero using layered radial-gradient blobs with @keyframes, a custom cursor with spring-lag trailing ring, count-up number animations on scroll using IntersectionObserver, infinite marquee tech stack rows, bento grid for the 'What You Get' section, liquid glass CTA card with rotating conic gradient aurora effect, and a glassmorphic sticky navbar that compresses on scroll. Typography: Clash Display for headers, DM Sans for body, JetBrains Mono for stats/labels."


⚡ PRIORITY ORDER (if you tackle in phases)

Hero section — highest ROI, most visible, first impression
Navbar — seen on every scroll
Stats (At a Glance) — social proof, needs to hit harder
CTA section — bottom-of-funnel, highest conversion value
Tech Stack — quick win with logos + marquee
Everything else — iterative
The current site has a solid foundation and the copy is already strong. Site 2.0 isn't about starting over — it's about giving everything a cinematic upgrade that matches the confidence of the copy. The goal is that a potential client lands and within 3 seconds thinks: "These people are serious."