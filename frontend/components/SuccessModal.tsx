"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";
import s from "./SuccessModal.module.css";

// ─── Confetti fireworks ───────────────────────────────────────────────────────

const COLORS = ["#5A5AFF", "#00D4FF", "#7B2FFF", "#818CF8", "#A5B4FC", "#ffffff"];

function fireFireworks() {
  // Center burst
  confetti({
    particleCount: 90,
    spread: 110,
    origin: { x: 0.5, y: 0.52 },
    colors: COLORS,
    startVelocity: 48,
    decay: 0.91,
    scalar: 1.1,
    disableForReducedMotion: true,
  });

  // Left burst
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 65,
      spread: 75,
      origin: { x: 0.1, y: 0.55 },
      colors: COLORS,
      startVelocity: 55,
      decay: 0.9,
      disableForReducedMotion: true,
    });
  }, 180);

  // Right burst
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 115,
      spread: 75,
      origin: { x: 0.9, y: 0.55 },
      colors: COLORS,
      startVelocity: 55,
      decay: 0.9,
      disableForReducedMotion: true,
    });
  }, 180);

  // Top cascade
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 130,
      origin: { x: 0.5, y: 0.3 },
      colors: COLORS,
      startVelocity: 30,
      decay: 0.93,
      gravity: 0.7,
      disableForReducedMotion: true,
    });
  }, 400);

  // Final side pops
  setTimeout(() => {
    confetti({ particleCount: 30, angle: 80, spread: 50, origin: { x: 0.25, y: 0.6 }, colors: COLORS, disableForReducedMotion: true });
    confetti({ particleCount: 30, angle: 100, spread: 50, origin: { x: 0.75, y: 0.6 }, colors: COLORS, disableForReducedMotion: true });
  }, 650);
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SuccessModalProps {
  open: boolean;
  email: string;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SuccessModal({ open, email, onClose }: SuccessModalProps) {
  const firedRef = useRef(false);

  // Fire confetti once when modal opens
  useEffect(() => {
    if (open && !firedRef.current) {
      firedRef.current = true;
      // Slight delay so modal finishes animating in first
      setTimeout(fireFireworks, 200);
    }
    if (!open) firedRef.current = false;
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className={s.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            className={s.modalWrap}
            role="dialog"
            aria-modal="true"
            aria-label="Submission confirmed"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className={s.modal}>
              {/* Gradient border glow */}
              <div className={s.borderGlow} aria-hidden="true"/>

              {/* Close */}
              <button className={s.closeBtn} onClick={onClose} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>

              {/* Checkmark */}
              <div className={s.checkWrap} aria-hidden="true">
                <div className={s.checkGlow}/>
                <svg className={s.checkSvg} viewBox="0 0 80 80">
                  <defs>
                    <linearGradient id="mcg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5A5AFF"/>
                      <stop offset="100%" stopColor="#00D4FF"/>
                    </linearGradient>
                  </defs>
                  <circle
                    cx="40" cy="40" r="36"
                    stroke="url(#mcg)" strokeWidth="1.5"
                    fill="rgba(90,90,255,0.08)"
                    className={s.checkRing}
                  />
                  <polyline
                    points="24,42 35,53 57,30"
                    stroke="#00D4FF" strokeWidth="3.5"
                    fill="none" strokeLinecap="round" strokeLinejoin="round"
                    className={s.checkMark}
                  />
                </svg>
              </div>

              {/* Copy */}
              <h2 className={s.title}>We&rsquo;ve got it.</h2>
              <p className={s.sub}>
                Your intake form is submitted. We&rsquo;ll be in touch within one business day to confirm we&rsquo;ve started.
              </p>

              {/* Details */}
              <div className={s.details}>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Submitted for</span>
                  <span className={s.detailVal}>{email}</span>
                </div>
                <div className={s.detailDivider}/>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Expect your report</span>
                  <span className={s.detailVal}>Day 6</span>
                </div>
                <div className={s.detailDivider}/>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Questions</span>
                  <span className={s.detailVal}>
                    <a href="mailto:support@parsiktechgroup.com" className={s.emailLink}>
                      support@parsiktechgroup.com
                    </a>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className={s.actions}>
                <Link
                  href="/"
                  className={s.homeBtn}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(90,90,255,0.7)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 24px rgba(90,90,255,0.4)")}
                >
                  Back to parsiktechgroup.com
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
