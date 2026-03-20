"use client";

import { useState } from "react";
import Link from "next/link";
import s from "./page.module.css";
import SuccessModal from "@/components/SuccessModal";

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconLoader = () => (
  <svg className={s.spinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "verify" | "form";

interface FormData {
  fullName: string;
  businessName: string;
  industry: string;
  website: string;
  toolsChecked: string[];
  toolsOther: string;
  biggestFrustration: string;
  goal: string;
  competitors: string;
  adSpend: string;
  priorAgency: string;
  anythingElse: string;
  // Honeypot — never shown to humans
  _hp: string;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IntakePage() {
  const [step, setStep] = useState<Step>("verify");
  const [email, setEmail] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<FormData>({
    fullName: "",
    businessName: "",
    industry: "",
    website: "",
    toolsChecked: [],
    toolsOther: "",
    biggestFrustration: "",
    goal: "",
    competitors: "",
    adSpend: "",
    priorAgency: "",
    anythingElse: "",
    _hp: "",
  });
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  function handleCheckbox(value: string) {
    setForm(prev => ({
      ...prev,
      toolsChecked: prev.toolsChecked.includes(value)
        ? prev.toolsChecked.filter(v => v !== value)
        : [...prev.toolsChecked, value],
    }));
  }

  // ── Email verification ──────────────────────────────────────────────────────

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setVerifyError("");
    setVerifying(true);

    try {
      const res = await fetch("/api/audit/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (res.ok) {
        setStep("form");
      } else {
        setVerifyError("We couldn't find a purchase with that email. Double-check and try again, or contact support@parsiktechgroup.com.");
      }
    } catch {
      setVerifyError("Something went wrong. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  // ── Form submission ─────────────────────────────────────────────────────────

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Honeypot check — if filled, silently succeed (fool the bot)
    if (form._hp) {
      setShowModal(true);
      return;
    }

    setSubmitError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/audit/intake-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...form }),
      });

      if (res.ok) {
        setSubmittedAt(new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" }));
        setShowModal(true);
      } else {
        setSubmitError("Something went wrong submitting your form. Please try again or email us directly.");
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── NAV ── */}
      <nav className={s.nav}>
        <Link href="/" className={s.navLogo}>PTG<span>.</span></Link>
        <Link href="/" className={s.navBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to site
        </Link>
      </nav>

      <main className={s.main}>
        {/* Grid bg */}
        <svg className={s.grid} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <pattern id="ig" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#5A5AFF" strokeWidth="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ig)"/>
        </svg>
        <div className={`${s.blob} ${s.blob1}`} aria-hidden="true"/>
        <div className={`${s.blob} ${s.blob2}`} aria-hidden="true"/>

        {/* ── VERIFY STEP ── */}
        {step === "verify" && (
          <div className={s.card}>
            <div className={s.cardIcon}>
              <IconLock />
            </div>
            <h1 className={s.cardTitle}>Access Your Intake Form</h1>
            <p className={s.cardSub}>
              Enter the email address you used at checkout. We&rsquo;ll verify your purchase and unlock the form.
            </p>
            <form onSubmit={handleVerify} className={s.verifyForm} noValidate>
              <label htmlFor="verify-email" className={s.fieldLabel}>
                Checkout email
              </label>
              <div className={s.inputWrap}>
                <span className={s.inputIcon}><IconMail /></span>
                <input
                  id="verify-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={s.input}
                  required
                  autoComplete="email"
                  disabled={verifying}
                />
              </div>
              {verifyError && (
                <p className={s.errorMsg} role="alert">{verifyError}</p>
              )}
              <button
                type="submit"
                className={`btn-shimmer ${s.submitBtn}`}
                disabled={verifying || !email.trim()}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(90,90,255,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 24px rgba(90,90,255,0.4)")}
              >
                {verifying ? <><IconLoader /> Verifying…</> : <>Continue <IconArrow /></>}
              </button>
            </form>
            <p className={s.helpText}>
              Can&rsquo;t find your confirmation email?{" "}
              <a href="mailto:support@parsiktechgroup.com" className={s.helpLink}>
                Contact us
              </a>
            </p>
          </div>
        )}

        {/* ── FORM STEP ── */}
        {step === "form" && (
          <div className={s.formWrap}>
            <div className={s.formHeader}>
              <div className={s.badge}>
                <span className={s.badgeDot} aria-hidden="true"/>
                Verified · {email}
              </div>
              <h1 className={s.formTitle}>
                Your <span className="shimmer-text">Audit</span> Intake
              </h1>
              <p className={s.formSub}>
                This takes about 10 minutes. The more detail you give us, the sharper the audit.
                There are no wrong answers.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={s.form} noValidate>
              {/* Honeypot — hidden from humans, bots fill it */}
              <div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
                <label htmlFor="_hp">Leave this blank</label>
                <input
                  id="_hp"
                  name="_hp"
                  type="text"
                  value={form._hp}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Section 1 — Business basics */}
              <div className={s.section}>
                <p className={s.sectionLabel}>01 — The Basics</p>
                <div className={s.field}>
                  <label htmlFor="fullName" className={s.fieldLabel}>
                    Your name <span className={s.required}>*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="First and last name"
                    className={s.input}
                    maxLength={120}
                    required
                  />
                </div>
                <div className={s.fieldGrid}>
                  <div className={s.field}>
                    <label htmlFor="businessName" className={s.fieldLabel}>
                      Business name <span className={s.required}>*</span>
                    </label>
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      value={form.businessName}
                      onChange={handleChange}
                      placeholder="Acme Law Group"
                      className={s.input}
                      maxLength={120}
                      required
                    />
                  </div>
                  <div className={s.field}>
                    <label htmlFor="industry" className={s.fieldLabel}>
                      Industry / Business type
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      className={s.select}
                    >
                      <option value="">Select your industry</option>
                      <option value="law-firm">Law Firm</option>
                      <option value="medical-dental">Medical or Dental Practice</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="gym-fitness">Gym or Fitness Studio</option>
                      <option value="retail">Retail</option>
                      <option value="startup">Startup</option>
                      <option value="professional-services">Professional Services</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className={s.field}>
                  <label htmlFor="website" className={s.fieldLabel}>
                    Website URL <span className={s.required}>*</span>
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://yoursite.com"
                    className={s.input}
                    maxLength={250}
                    required
                  />
                </div>
              </div>

              {/* Section 2 — Tech Stack */}
              <div className={s.section}>
                <p className={s.sectionLabel}>02 — Your Tech Stack</p>
                <div className={s.field}>
                  <label className={s.fieldLabel}>
                    What tools and platforms are you currently using?{" "}
                    <span className={s.hint}>(Select all that apply)</span>
                  </label>
                  <div className={s.checkboxGrid}>
                    {["WordPress","Shopify","Webflow","HubSpot","Salesforce","Mailchimp","Google Ads","Meta Ads","QuickBooks","OpenTable","Mindbody","Other"].map(tool => (
                      <label key={tool} className={s.checkboxLabel}>
                        <input
                          type="checkbox"
                          className={s.checkbox}
                          checked={form.toolsChecked.includes(tool)}
                          onChange={() => handleCheckbox(tool)}
                        />
                        <span>{tool}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className={s.field}>
                  <label htmlFor="toolsOther" className={s.fieldLabel}>
                    Anything else? <span className={s.hint}>(Tools not listed above)</span>
                  </label>
                  <textarea
                    id="toolsOther"
                    name="toolsOther"
                    value={form.toolsOther}
                    onChange={handleChange}
                    placeholder="e.g. Calendly, Acuity, custom CRM…"
                    className={s.textarea}
                    rows={2}
                    maxLength={500}
                  />
                </div>
              </div>

              {/* Section 3 — Pain & Goals */}
              <div className={s.section}>
                <p className={s.sectionLabel}>03 — Pain & Goals</p>
                <div className={s.field}>
                  <label htmlFor="biggestFrustration" className={s.fieldLabel}>
                    What&rsquo;s your biggest frustration with your digital presence right now? <span className={s.required}>*</span>
                  </label>
                  <textarea
                    id="biggestFrustration"
                    name="biggestFrustration"
                    value={form.biggestFrustration}
                    onChange={handleChange}
                    placeholder="Be as specific as you can. What keeps you up at night about this?"
                    className={s.textarea}
                    rows={4}
                    maxLength={2000}
                    required
                  />
                </div>
                <div className={s.field}>
                  <label htmlFor="goal" className={s.fieldLabel}>
                    Where do you want to be in 90 days? <span className={s.required}>*</span>
                  </label>
                  <textarea
                    id="goal"
                    name="goal"
                    value={form.goal}
                    onChange={handleChange}
                    placeholder="More leads, a site you're proud of, a cleaner system — what does success look like?"
                    className={s.textarea}
                    rows={3}
                    maxLength={1500}
                    required
                  />
                </div>
              </div>

              {/* Section 4 — Competitors & Spend */}
              <div className={s.section}>
                <p className={s.sectionLabel}>04 — Context</p>
                <div className={s.field}>
                  <label htmlFor="competitors" className={s.fieldLabel}>
                    Who are 2–3 of your direct local competitors?{" "}
                    <span className={s.hint}>(Business names or websites — we&rsquo;ll run a side-by-side comparison)</span>
                  </label>
                  <textarea
                    id="competitors"
                    name="competitors"
                    value={form.competitors}
                    onChange={handleChange}
                    placeholder="e.g. Smith & Associates Law, acmelaw.com…"
                    className={s.textarea}
                    rows={3}
                    maxLength={1000}
                  />
                </div>
                <div className={s.field}>
                  <label htmlFor="adSpend" className={s.fieldLabel}>
                    Roughly how much are you spending on ads or marketing per month?{" "}
                    <span className={s.hint}>(Optional — helps us prioritize what to review)</span>
                  </label>
                  <select
                    id="adSpend"
                    name="adSpend"
                    value={form.adSpend}
                    onChange={handleChange}
                    className={s.select}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="nothing">Nothing right now</option>
                    <option value="under-500">Under $500/mo</option>
                    <option value="500-1500">$500–$1,500/mo</option>
                    <option value="1500-3000">$1,500–$3,000/mo</option>
                    <option value="3000-plus">$3,000+/mo</option>
                  </select>
                </div>
              </div>

              {/* Section 5 — Background */}
              <div className={s.section}>
                <p className={s.sectionLabel}>05 — Background</p>
                <div className={s.field}>
                  <label htmlFor="priorAgency" className={s.fieldLabel}>
                    Have you worked with agencies or consultants before? If so, what happened?{" "}
                    <span className={s.hint}>(Optional)</span>
                  </label>
                  <textarea
                    id="priorAgency"
                    name="priorAgency"
                    value={form.priorAgency}
                    onChange={handleChange}
                    placeholder="E.g. hired an SEO agency last year, didn't see results..."
                    className={s.textarea}
                    rows={3}
                    maxLength={2000}
                  />
                </div>
                <div className={s.field}>
                  <label htmlFor="anythingElse" className={s.fieldLabel}>
                    Is there anything else we should know before we start?{" "}
                    <span className={s.hint}>(Specific concerns, context that would help)</span>
                  </label>
                  <textarea
                    id="anythingElse"
                    name="anythingElse"
                    value={form.anythingElse}
                    onChange={handleChange}
                    placeholder="Anything at all — no detail is too small."
                    className={s.textarea}
                    rows={4}
                    maxLength={2000}
                  />
                </div>
              </div>

              {submitError && (
                <p className={s.errorMsg} role="alert">{submitError}</p>
              )}

              <div className={s.formFooter}>
                <p className={s.formNote}>
                  Fields marked <span className={s.required}>*</span> are required.
                  Your responses go directly to the PTG team — nowhere else.
                </p>
                <button
                  type="submit"
                  className={`btn-shimmer ${s.submitBtn}`}
                  disabled={submitting}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(90,90,255,0.7)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 24px rgba(90,90,255,0.4)")}
                >
                  {submitting ? <><IconLoader /> Submitting…</> : <>Submit Intake Form <IconArrow /></>}
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* ── INLINE CONFIRMATION (below form after submit) ── */}
      {showModal && submittedAt && (
        <div className={s.confirmBanner} role="status">
          <div className={s.confirmInner}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2.5" width="20" height="20" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <p>
              Form received. We&rsquo;ll begin your audit within 1 business day. You&rsquo;ll hear from us at{" "}
              <strong>{email}</strong> with next steps.{" "}
              <span className={s.confirmTime}>Submitted {submittedAt}</span>
            </p>
          </div>
        </div>
      )}

      <SuccessModal
        open={showModal}
        email={email}
        onClose={() => setShowModal(false)}
      />

      {/* ── FOOTER ── */}
      <footer className={s.footer}>
        <span>© 2026 Parsik Tech Group</span>
        <Link href="/" className={s.footerLink}>parsiktechgroup.com</Link>
      </footer>
    </>
  );
}
