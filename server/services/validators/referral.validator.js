/**
 * Server-side validation + sanitization for referral submissions.
 *
 * Returns { ok, data, errors }:
 *  - ok:     whether the payload is valid
 *  - data:   cleaned payload safe to render into the email
 *  - errors: { fieldName: "message" } for invalid fields
 *
 * All string values are trimmed, length-capped, and stripped of
 * control characters before being used anywhere (input sanitization).
 */

const LIMITS = {
  shortText: { min: 1, max: 120 },
  mediumText: { min: 1, max: 300 },
  longText: { min: 1, max: 2000 },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9+()\-.\s]{7,25}$/;
const CONTACT_METHODS = ['Phone', 'Email', 'Either'];
const HOUSING_OPTIONS = [
  'Incarcerated — release upcoming',
  'Homeless / unhoused',
  'Unstable housing (couch, shelter, motel)',
  'Recovery / treatment program',
  'Living with family or friends',
  'Other',
];

// Strip control characters (except newline/tab which we normalize) and
// collapse excess whitespace. Prevents control-char injection into email HTML.
function sanitizeString(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/\r\n/g, '\n')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

function cleanField(value, { min = 0, max = LIMITS.shortText.max } = {}) {
  const cleaned = sanitizeString(value).slice(0, max);
  if (min > 0 && cleaned.length < min) return null;
  return cleaned;
}

function isValidEmail(value) {
  return EMAIL_RE.test(value) && value.length <= 254;
}

function isValidPhone(value) {
  return PHONE_RE.test(value);
}

function validateReferral(body) {
  const errors = {};
  const data = {};
  const b = body && typeof body === 'object' ? body : {};

  // --- Referral source ---
  data.sourceFirstName = cleanField(b.sourceFirstName, LIMITS.shortText);
  if (!data.sourceFirstName) errors.sourceFirstName = 'First name is required.';

  data.sourceLastName = cleanField(b.sourceLastName, LIMITS.shortText);
  if (!data.sourceLastName) errors.sourceLastName = 'Last name is required.';

  // Organization is optional.
  data.sourceOrganization = cleanField(b.sourceOrganization, { max: LIMITS.shortText.max }) || '';

  data.sourceRelationship = cleanField(b.sourceRelationship, LIMITS.shortText);
  if (!data.sourceRelationship) errors.sourceRelationship = 'Relationship to the individual is required.';

  data.sourcePhone = cleanField(b.sourcePhone, LIMITS.shortText);
  if (!data.sourcePhone) {
    errors.sourcePhone = 'Phone number is required.';
  } else if (!isValidPhone(data.sourcePhone)) {
    errors.sourcePhone = 'Enter a valid phone number.';
  }

  data.sourceEmail = (cleanField(b.sourceEmail, { max: LIMITS.shortText.max }) || '').toLowerCase();
  if (!data.sourceEmail) {
    errors.sourceEmail = 'Email address is required.';
  } else if (!isValidEmail(data.sourceEmail)) {
    errors.sourceEmail = 'Enter a valid email address.';
  }

  // --- Person being referred ---
  data.personFirstName = cleanField(b.personFirstName, LIMITS.shortText);
  if (!data.personFirstName) errors.personFirstName = 'First name is required.';

  data.personLastName = cleanField(b.personLastName, LIMITS.shortText);
  if (!data.personLastName) errors.personLastName = 'Last name is required.';

  // Person phone/email are optional (they may not have one yet).
  data.personPhone = cleanField(b.personPhone, LIMITS.shortText) || '';
  if (data.personPhone && !isValidPhone(data.personPhone)) {
    errors.personPhone = 'Enter a valid phone number or leave this blank.';
  }

  data.personEmail = (cleanField(b.personEmail, { max: LIMITS.shortText.max }) || '').toLowerCase();
  if (data.personEmail && !isValidEmail(data.personEmail)) {
    errors.personEmail = 'Enter a valid email address or leave this blank.';
  }

  data.personContactPreference = cleanField(b.personContactPreference, LIMITS.shortText);
  if (!CONTACT_METHODS.includes(data.personContactPreference)) {
    errors.personContactPreference = 'Select a preferred contact method.';
  }

  // --- Referral information ---
  data.reasonForReferral = cleanField(b.reasonForReferral, LIMITS.longText);
  if (!data.reasonForReferral) errors.reasonForReferral = 'Reason for referral is required.';

  data.currentHousing = cleanField(b.currentHousing, LIMITS.mediumText);
  if (!HOUSING_OPTIONS.includes(data.currentHousing)) {
    errors.currentHousing = 'Select a current housing situation.';
  }

  // Additional housing notes (shown only when "Other" is selected). Optional.
  data.currentHousingOther = cleanField(b.currentHousingOther, LIMITS.mediumText) || '';
  if (data.currentHousing === 'Other' && !data.currentHousingOther) {
    errors.currentHousingOther = 'Please describe the housing situation.';
  }

  data.supportNeeds = cleanField(b.supportNeeds, LIMITS.mediumText);
  if (!data.supportNeeds) errors.supportNeeds = 'Reentry / support needs are required.';

  // Optional.
  data.additionalInformation = cleanField(b.additionalInformation, { max: LIMITS.longText.max }) || '';

  // --- Contact preference + consent ---
  data.contactPreference = cleanField(b.contactPreference, LIMITS.shortText);
  if (!CONTACT_METHODS.includes(data.contactPreference)) {
    errors.contactPreference = 'Select how we should respond.';
  }

  const accuracy = b.confirmAccuracy === true || b.confirmAccuracy === 'true';
  if (!accuracy) {
    errors.confirmAccuracy = 'You must confirm the information is accurate and that you are authorized to submit this referral.';
  }
  data.confirmAccuracy = accuracy;

  const privacy = b.confirmPrivacy === true || b.confirmPrivacy === 'true';
  if (!privacy) {
    errors.confirmPrivacy = 'You must acknowledge the privacy notice.';
  }
  data.confirmPrivacy = privacy;

  // --- Honeypot: must be empty ---
  // bots.fill.websiteHidden = true; bots.fill.website = 'spam-link';
  data.websiteHidden = cleanField(b.websiteHidden, { max: 200 }) || '';
  if (data.websiteHidden !== '') {
    errors._spam = 'Submission rejected.';
  }

  // Elapsed time since form render (ms). Humans take at least a few seconds.
  const elapsed = Number(b.elapsedMs);
  data.elapsedMs = Number.isFinite(elapsed) ? Math.max(0, Math.min(elapsed, 1000 * 60 * 60 * 24)) : 0;
  if (data.elapsedMs < 3000) {
    errors._spam = 'Submission rejected.';
  }

  return {
    ok: Object.keys(errors).length === 0,
    data,
    errors,
  };
}

module.exports = { validateReferral, HOUSING_OPTIONS, CONTACT_METHODS };
