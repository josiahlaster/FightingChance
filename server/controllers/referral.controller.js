const { validateReferral } = require('../services/validators/referral.validator');
const { sendReferralEmail } = require('../services/email.service');

/**
 * POST /api/referral
 *
 * Validates + sanitizes the payload server-side, then forwards the
 * referral to the configured email provider. Referral details are NOT
 * persisted anywhere and are NOT logged — the email is the system of
 * record. Only non-sensitive operational metadata is logged.
 */
async function submitReferral(req, res, next) {
  const { ok, data, errors } = validateReferral(req.body);

  if (!ok) {
    return res.status(400).json({
      ok: false,
      message: 'Please correct the highlighted fields and try again.',
      errors,
    });
  }

  try {
    await sendReferralEmail(data);

    // No PII in logs: just an event marker.
    console.info(
      `[referral] Submission delivered via ${process.env.EMAIL_PROVIDER || 'smtp'} at ${new Date().toISOString()}`
    );

    return res.status(200).json({
      ok: true,
      message: 'Referral submitted successfully.',
    });
  } catch (err) {
    // Log the failure reason server-side without any referral details.
    console.error(
      `[referral] Email delivery failed at ${new Date().toISOString()}: ${err.message}`
    );
    return next(err);
  }
}

module.exports = { submitReferral };
