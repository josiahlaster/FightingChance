const rateLimit = require('express-rate-limit');

/**
 * General API limiter — generous, protects the whole API surface.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, message: 'Too many requests. Please try again later.' },
});

/**
 * Referral limiter — stricter, since each accepted referral sends an email.
 * 5 submissions per IP per hour.
 */
const referralLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    ok: false,
    message:
      'You have submitted several referrals recently. Please wait a while before submitting again, or call us at 919-685-0569.',
  },
});

module.exports = { generalLimiter, referralLimiter };
