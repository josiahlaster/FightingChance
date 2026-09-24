/**
 * Email service — provider-agnostic.
 *
 * Supports three providers, selected via the EMAIL_PROVIDER env var:
 *   - "smtp"     : Nodemailer over SMTP (works with Gmail App Passwords)
 *   - "resend"   : Resend HTTPS API (no dependency; uses global fetch)
 *   - "sendgrid" : SendGrid HTTPS API (no dependency; uses global fetch)
 *
 * The rest of the app only calls sendReferralEmail(), so switching
 * providers never requires changes anywhere else.
 */

const nodemailer = require('nodemailer');

const REFERRAL_EMAIL =
  process.env.REFERRAL_EMAIL || 'fightingchancetransitional@gmail.com';
const SUBJECT = 'New Fighting Chance Referral Submission';

function getProvider() {
  return (process.env.EMAIL_PROVIDER || 'smtp').toLowerCase();
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Build the clean HTML email body. All user-supplied values are escaped
 * before being embedded, so the email is safe to render in any client.
 */
function buildReferralEmailHtml(data) {
  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'America/New_York',
  });

  const section = (title, rows) => `
    <h2 style="margin:28px 0 10px;font-size:15px;letter-spacing:1px;text-transform:uppercase;color:#c8102e;border-bottom:2px solid #c8102e;padding-bottom:6px;">${title}</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#222;">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="padding:6px 10px 6px 0;color:#555;white-space:nowrap;vertical-align:top;font-weight:bold;width:190px;">${label}</td>
          <td style="padding:6px 0;color:#111;white-space:pre-wrap;word-break:break-word;">${
            value ? escapeHtml(value) : '<span style="color:#999;">—</span>'
          }</td>
        </tr>`
        )
        .join('')}
    </table>`;

  return `
  <div style="background-color:#f4f4f5;padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e4e4e7;">
      <div style="background:#111111;padding:24px 28px;">
        <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:0.5px;">FIGHTING CHANCE</div>
        <div style="font-size:12px;color:#c8102e;letter-spacing:2px;font-weight:bold;text-transform:uppercase;margin-top:4px;">Transitional Restoration</div>
      </div>
      <div style="padding:28px;">
        <p style="margin:0 0 6px;font-size:18px;font-weight:800;color:#111;">New Referral Submission</p>
        <p style="margin:0;font-size:13px;color:#555;">Received: <strong>${escapeHtml(submittedAt)}</strong> (Eastern Time)</p>
        ${section('Referral Source', [
          ['Name', `${data.sourceFirstName} ${data.sourceLastName}`],
          ['Organization', data.sourceOrganization],
          ['Relationship to Individual', data.sourceRelationship],
          ['Phone', data.sourcePhone],
          ['Email', data.sourceEmail],
        ])}
        ${section('Person Referred', [
          ['Name', `${data.personFirstName} ${data.personLastName}`],
          ['Phone', data.personPhone],
          ['Email', data.personEmail],
          ['Preferred Contact Method', data.personContactPreference],
        ])}
        ${section('Referral Details', [
          ['Reason for Referral', data.reasonForReferral],
          [
            'Current Housing Situation',
            data.currentHousing === 'Other'
              ? `Other — ${data.currentHousingOther}`
              : data.currentHousing,
          ],
          ['Reentry / Support Needs', data.supportNeeds],
          ['Additional Information', data.additionalInformation],
        ])}
        ${section('Contact Preferences & Confirmations', [
          ['Respond to referral source by', data.contactPreference],
          [
            'Accuracy / authorization confirmed',
            data.confirmAccuracy ? 'Yes' : 'No',
          ],
          ['Privacy notice acknowledged', data.confirmPrivacy ? 'Yes' : 'No'],
        ])}
      </div>
      <div style="background:#f4f4f5;padding:16px 28px;border-top:1px solid #e4e4e7;">
        <p style="margin:0;font-size:12px;color:#777;text-align:center;">
          Submitted via fightingchancetransitional.org referral form
        </p>
      </div>
    </div>
  </div>`;
}

// Plain-text alternative for email clients that block HTML.
function buildReferralEmailText(data) {
  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'America/New_York',
  });
  const line = (label, value) =>
    `${label}: ${value ? value : '—'}`;
  return [
    'NEW FIGHTING CHANCE REFERRAL SUBMISSION',
    `Received: ${submittedAt} (Eastern Time)`,
    '',
    '--- REFERRAL SOURCE ---',
    line('Name', `${data.sourceFirstName} ${data.sourceLastName}`),
    line('Organization', data.sourceOrganization),
    line('Relationship', data.sourceRelationship),
    line('Phone', data.sourcePhone),
    line('Email', data.sourceEmail),
    '',
    '--- PERSON REFERRED ---',
    line('Name', `${data.personFirstName} ${data.personLastName}`),
    line('Phone', data.personPhone),
    line('Email', data.personEmail),
    line('Preferred contact method', data.personContactPreference),
    '',
    '--- REFERRAL DETAILS ---',
    line('Reason for referral', data.reasonForReferral),
    line(
      'Current housing situation',
      data.currentHousing === 'Other'
        ? `Other — ${data.currentHousingOther}`
        : data.currentHousing
    ),
    line('Reentry / support needs', data.supportNeeds),
    line('Additional information', data.additionalInformation),
    '',
    '--- CONTACT & CONFIRMATIONS ---',
    line('Respond to referral source by', data.contactPreference),
    line('Accuracy/authorization confirmed', data.confirmAccuracy ? 'Yes' : 'No'),
    line('Privacy notice acknowledged', data.confirmPrivacy ? 'Yes' : 'No'),
    '',
  ].join('\n');
}

function buildMailOptions(data) {
  return {
    from:
      process.env.SMTP_FROM ||
      process.env.RESEND_FROM ||
      process.env.SENDGRID_FROM ||
      'fightingchancetransitional@gmail.com',
    to: REFERRAL_EMAIL,
    replyTo: data.sourceEmail, // replying goes straight to the referral source
    subject: SUBJECT,
    text: buildReferralEmailText(data),
    html: buildReferralEmailHtml(data),
  };
}

// --- Provider transports ---

function sendViaSmtp(mailOptions) {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  return transport.sendMail(mailOptions);
}

async function sendViaResend(mailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured');
  // Resend does not allow a friendly name in "from" via some accounts;
  // strip "Name <addr>" down to the bare address for the API.
  const fromMatch = mailOptions.from.match(/<([^>]+)>/) || [
    null,
    mailOptions.from,
  ];
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromMatch[1],
      to: [mailOptions.to],
      reply_to: mailOptions.replyTo,
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.text,
    }),
  });
  if (!res.ok) {
    const bodyText = await res.text().catch(() => '');
    throw new Error(`Resend API error ${res.status}: ${bodyText.slice(0, 300)}`);
  }
  return res.json();
}

async function sendViaSendGrid(mailOptions) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) throw new Error('SENDGRID_API_KEY is not configured');
  const fromMatch = mailOptions.from.match(/<([^>]+)>/) || [
    null,
    mailOptions.from,
  ];
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: mailOptions.to }],
          ...(mailOptions.replyTo
            ? { reply_to: { email: mailOptions.replyTo } }
            : {}),
        },
      ],
      from: { email: fromMatch[1] },
      subject: mailOptions.subject,
      content: [
        { type: 'text/plain', value: mailOptions.text },
        { type: 'text/html', value: mailOptions.html },
      ],
    }),
  });
  if (!res.ok) {
    const bodyText = await res.text().catch(() => '');
    throw new Error(
      `SendGrid API error ${res.status}: ${bodyText.slice(0, 300)}`
    );
  }
  return null; // SendGrid returns 202 with empty body
}

async function sendReferralEmail(data) {
  const mailOptions = buildMailOptions(data);
  const provider = getProvider();
  switch (provider) {
    case 'resend':
      return sendViaResend(mailOptions);
    case 'sendgrid':
      return sendViaSendGrid(mailOptions);
    case 'smtp':
    default:
      return sendViaSmtp(mailOptions);
  }
}

module.exports = { sendReferralEmail, getProvider };
