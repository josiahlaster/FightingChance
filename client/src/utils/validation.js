/**
 * Shared, dependency-free form validation + sanitization helpers.
 * Mirrors the server-side rules so users get instant feedback.
 */

export const HOUSING_OPTIONS = [
  'Incarcerated — release upcoming',
  'Homeless / unhoused',
  'Unstable housing (couch, shelter, motel)',
  'Recovery / treatment program',
  'Living with family or friends',
  'Other',
];

export const CONTACT_METHODS = ['Phone', 'Email', 'Either'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9+()\-.\s]{7,25}$/;

/** Strip control characters and trim — mirrors the server sanitizer. */
export function sanitizeInput(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/\r\n/g, '\n')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

export function isValidEmail(value) {
  return EMAIL_RE.test(value) && value.length <= 254;
}

export function isValidPhone(value) {
  return PHONE_RE.test(value);
}

/**
 * Validate the full referral payload.
 * Returns { ok, errors } where errors maps field name -> message.
 */
export function validateReferral(values) {
  const errors = {};
  const v = values || {};
  const str = (key) => sanitizeInput(v[key] || '');

  // Referral source
  if (!str('sourceFirstName')) errors.sourceFirstName = 'First name is required.';
  if (!str('sourceLastName')) errors.sourceLastName = 'Last name is required.';
  if (!str('sourceRelationship')) errors.sourceRelationship = 'Relationship to the individual is required.';

  if (!str('sourcePhone')) {
    errors.sourcePhone = 'Phone number is required.';
  } else if (!isValidPhone(str('sourcePhone'))) {
    errors.sourcePhone = 'Enter a valid phone number.';
  }

  if (!str('sourceEmail')) {
    errors.sourceEmail = 'Email address is required.';
  } else if (!isValidEmail(str('sourceEmail'))) {
    errors.sourceEmail = 'Enter a valid email address.';
  }

  // Person referred
  if (!str('personFirstName')) errors.personFirstName = 'First name is required.';
  if (!str('personLastName')) errors.personLastName = 'Last name is required.';

  const personPhone = str('personPhone');
  if (personPhone && !isValidPhone(personPhone)) {
    errors.personPhone = 'Enter a valid phone number or leave this blank.';
  }

  const personEmail = str('personEmail');
  if (personEmail && !isValidEmail(personEmail)) {
    errors.personEmail = 'Enter a valid email address or leave this blank.';
  }

  if (!CONTACT_METHODS.includes(v.personContactPreference)) {
    errors.personContactPreference = 'Select a preferred contact method.';
  }

  // Referral details
  if (!str('reasonForReferral')) errors.reasonForReferral = 'Reason for referral is required.';
  if (!HOUSING_OPTIONS.includes(v.currentHousing)) {
    errors.currentHousing = 'Select a current housing situation.';
  }
  if (v.currentHousing === 'Other' && !str('currentHousingOther')) {
    errors.currentHousingOther = 'Please describe the housing situation.';
  }
  if (!str('supportNeeds')) errors.supportNeeds = 'Reentry / support needs are required.';

  // Preferences + consent
  if (!CONTACT_METHODS.includes(v.contactPreference)) {
    errors.contactPreference = 'Select how we should respond.';
  }
  if (!v.confirmAccuracy) {
    errors.confirmAccuracy =
      'Please confirm the information is accurate and that you are authorized to submit this referral.';
  }
  if (!v.confirmPrivacy) {
    errors.confirmPrivacy = 'Please acknowledge the privacy notice.';
  }

  return { ok: Object.keys(errors).length === 0, errors };
}
