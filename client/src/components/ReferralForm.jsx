import { useRef, useState } from 'react';
import { site } from '../data/site';
import {
  HOUSING_OPTIONS,
  CONTACT_METHODS,
  sanitizeInput,
  validateReferral,
} from '../utils/validation';
import { AlertIcon, CheckIcon } from './Icons';

/** @type {{ [key: string]: string | boolean }} */
const EMPTY = {
  sourceFirstName: '',
  sourceLastName: '',
  sourceOrganization: '',
  sourceRelationship: '',
  sourcePhone: '',
  sourceEmail: '',
  personFirstName: '',
  personLastName: '',
  personPhone: '',
  personEmail: '',
  personContactPreference: '',
  reasonForReferral: '',
  currentHousing: '',
  currentHousingOther: '',
  supportNeeds: '',
  additionalInformation: '',
  contactPreference: '',
  confirmAccuracy: false,
  confirmPrivacy: false,
  websiteHidden: '', // honeypot — humans never see or fill this
};

/** @type {{ [key: string]: string | boolean }} */
const EMPTY_ERRORS = {};

export default function ReferralForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverMessage, setServerMessage] = useState('');
  const startedAt = useRef(Date.now());
  const formRef = useRef(null);
  const errorSummaryRef = useRef(/** @type {HTMLDivElement|null} */ (null));

  const setField = /** @param {string} name @param {any} value */ (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setField(name, type === 'checkbox' ? checked : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return; // guard against duplicate submissions

    const cleaned = /** @type {{ [key: string]: any }} */ ({});
    Object.keys(values).forEach((key) => {
      cleaned[key] = typeof values[key] === 'string' ? sanitizeInput(values[key]) : values[key];
    });

    const { ok, errors: clientErrors } = validateReferral(cleaned);
    if (!ok) {
      setErrors(/** @type {any} */ (clientErrors));
      // Move focus to the error summary for screen reader users.
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    setStatus('submitting');
    setServerMessage('');

    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cleaned,
          websiteHidden: values.websiteHidden,
          elapsedMs: Date.now() - startedAt.current,
        }),
      });

      const payload = await res.json().catch(() => ({}));

      if (res.ok && payload.ok) {
        setStatus('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (res.status === 400 && payload.errors) {
        setErrors(payload.errors);
        setServerMessage(payload.message || 'Please correct the highlighted fields and try again.');
        setStatus('error');
        requestAnimationFrame(() => errorSummaryRef.current?.focus());
        return;
      }

      setServerMessage(
        payload.message ||
          'We were unable to submit your referral at this time. Please try again or contact us directly at 919-685-0569.'
      );
      setStatus('error');
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
    } catch (networkErr) {
      setServerMessage(
        'We were unable to submit your referral at this time. Please try again or contact us directly at 919-685-0569.'
      );
      setStatus('error');
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
    }
  };

  // ---- Success state ----
  if (status === 'success') {
    return (
      <div className="form-status form-status--success" role="status">
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
          <CheckIcon width={30} height={30} style={{ flex: 'none', color: '#2e7d32' }} />
          <div>
            <h2 style={{ color: '#1b5e20', fontSize: '1.8rem', marginBottom: '0.4rem' }}>Referral Submitted</h2>
            <p>
              Thank you. Your referral has been submitted to Fighting Chance Transitional
              Restoration for review.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const field = (name) => ({
    id: name,
    name,
    value: /** @type {string} */ (values[name]),
    onChange: handleChange,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  const errorText = (name) =>
    errors[name] ? (
      <p className="field-error" id={`${name}-error`}>
        {errors[name]}
      </p>
    ) : null;

  const errorEntries = Object.entries(errors);

  return (
    <div>
      {errorEntries.length > 0 ? (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className="form-status form-status--error"
          role="alert"
        >
          <strong>Please fix the following before submitting:</strong>
          <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem' }}>
            {errorEntries.map(([key, msg]) => (
              <li key={key}>{msg}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        {/* Honeypot field — hidden from humans, catnip for bots */}
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="websiteHidden">Website</label>
          <input
            type="text"
            id="websiteHidden"
            name="websiteHidden"
            tabIndex={-1}
            autoComplete="off"
            value={/** @type {string} */ (values.websiteHidden)}
            onChange={handleChange}
          />
        </div>

        {/* ================= REFERRAL SOURCE ================= */}
        <fieldset>
          <legend>Referral Source</legend>
          <p style={{ color: '#555', margin: '0 0 1rem', fontSize: '0.95rem' }}>
            Tell us who is submitting this referral.
          </p>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="sourceFirstName">
                First Name <span className="req" aria-hidden="true">*</span>
              </label>
              <input type="text" autoComplete="given-name" {...field('sourceFirstName')} required />
              {errorText('sourceFirstName')}
            </div>

            <div className="field">
              <label htmlFor="sourceLastName">
                Last Name <span className="req" aria-hidden="true">*</span>
              </label>
              <input type="text" autoComplete="family-name" {...field('sourceLastName')} required />
              {errorText('sourceLastName')}
            </div>

            <div className="field">
              <label htmlFor="sourceOrganization">Organization (optional)</label>
              <input type="text" autoComplete="organization" {...field('sourceOrganization')} />
            </div>

            <div className="field">
              <label htmlFor="sourceRelationship">
                Relationship to Individual <span className="req" aria-hidden="true">*</span>
              </label>
              <input type="text" {...field('sourceRelationship')} required />
              {errorText('sourceRelationship')}
            </div>

            <div className="field">
              <label htmlFor="sourcePhone">
                Phone <span className="req" aria-hidden="true">*</span>
              </label>
              <input type="tel" autoComplete="tel" {...field('sourcePhone')} required />
              {errorText('sourcePhone')}
            </div>

            <div className="field">
              <label htmlFor="sourceEmail">
                Email <span className="req" aria-hidden="true">*</span>
              </label>
              <input type="email" autoComplete="email" {...field('sourceEmail')} required />
              {errorText('sourceEmail')}
            </div>
          </div>
        </fieldset>

        {/* ================= PERSON REFERRED ================= */}
        <fieldset>
          <legend>Person Being Referred</legend>
          <p style={{ color: '#555', margin: '0 0 1rem', fontSize: '0.95rem' }}>
            If the individual does not have a phone or email yet, it is okay to leave those blank.
          </p>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="personFirstName">
                First Name <span className="req" aria-hidden="true">*</span>
              </label>
              <input type="text" {...field('personFirstName')} required />
              {errorText('personFirstName')}
            </div>

            <div className="field">
              <label htmlFor="personLastName">
                Last Name <span className="req" aria-hidden="true">*</span>
              </label>
              <input type="text" {...field('personLastName')} required />
              {errorText('personLastName')}
            </div>

            <div className="field">
              <label htmlFor="personPhone">Phone (optional)</label>
              <input type="tel" {...field('personPhone')} />
              {errorText('personPhone')}
            </div>

            <div className="field">
              <label htmlFor="personEmail">Email (optional)</label>
              <input type="email" {...field('personEmail')} />
              {errorText('personEmail')}
            </div>

            <div className="field span-2">
              <span className="field-label" id="personContactPreference-label" style={{ fontWeight: 600, fontSize: '0.92rem', color: '#2c2c2c' }}>
                Preferred Contact Method <span className="req" aria-hidden="true">*</span>
              </span>
              <div className="radio-row" role="radiogroup" aria-labelledby="personContactPreference-label">
                {CONTACT_METHODS.map((method) => (
                  <label key={method} className="radio-pill">
                    <input
                      type="radio"
                      name="personContactPreference"
                      value={method}
                      checked={values.personContactPreference === method}
                      onChange={handleChange}
                    />
                    {method}
                  </label>
                ))}
              </div>
              {errorText('personContactPreference')}
            </div>
          </div>
        </fieldset>

        {/* ================= REFERRAL INFORMATION ================= */}
        <fieldset>
          <legend>Referral Information</legend>
          <div className="form-grid">
            <div className="field span-2">
              <label htmlFor="reasonForReferral">
                Reason for Referral <span className="req" aria-hidden="true">*</span>
              </label>
              <textarea rows={4} maxLength={2000} {...field('reasonForReferral')} required />
              {errorText('reasonForReferral')}
            </div>

            <div className="field span-2">
              <label htmlFor="currentHousing">
                Current Housing Situation <span className="req" aria-hidden="true">*</span>
              </label>
              <select {...field('currentHousing')} required>
                <option value="">Select housing situation…</option>
                {HOUSING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errorText('currentHousing')}
            </div>

            {values.currentHousing === 'Other' ? (
              <div className="field span-2">
                <label htmlFor="currentHousingOther">
                  Describe the Housing Situation <span className="req" aria-hidden="true">*</span>
                </label>
                <input type="text" maxLength={300} {...field('currentHousingOther')} required />
                {errorText('currentHousingOther')}
              </div>
            ) : null}

            <div className="field span-2">
              <label htmlFor="supportNeeds">
                Reentry / Support Needs <span className="req" aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., ID documents, employment assistance, substance use support"
                maxLength={300}
                {...field('supportNeeds')}
                required
              />
              {errorText('supportNeeds')}
            </div>

            <div className="field span-2">
              <label htmlFor="additionalInformation">Additional Information (optional)</label>
              <textarea rows={4} maxLength={2000} {...field('additionalInformation')} />
            </div>
          </div>
        </fieldset>

        {/* ================= CONTACT PREFERENCES ================= */}
        <fieldset>
          <legend>Contact Preferences</legend>
          <p style={{ color: '#555', margin: '0 0 1rem', fontSize: '0.95rem' }}>
            How should we reach the referral source about this submission?
          </p>
          <div className="radio-row" role="radiogroup" aria-label="How should we respond">
            {CONTACT_METHODS.map((method) => (
              <label key={method} className="radio-pill">
                <input
                  type="radio"
                  name="contactPreference"
                  value={method}
                  checked={values.contactPreference === method}
                  onChange={handleChange}
                />
                {method}
              </label>
            ))}
          </div>
          {errorText('contactPreference')}
        </fieldset>

        {/* ================= CONSENTS ================= */}
        <fieldset>
          <legend>Confirmations</legend>
          <div style={{ display: 'grid', gap: '0.9rem' }}>
            <div className="consent">
              <input
                type="checkbox"
                id="confirmAccuracy"
                name="confirmAccuracy"
                checked={/** @type {boolean} */ (values.confirmAccuracy)}
                onChange={handleChange}
                aria-invalid={errors.confirmAccuracy ? true : undefined}
                aria-describedby={errors.confirmAccuracy ? 'confirmAccuracy-error' : undefined}
                required
              />
              <label htmlFor="confirmAccuracy">
                I confirm that the information provided is accurate to the best of my knowledge
                and that I am authorized to submit this referral. <span className="req" aria-hidden="true">*</span>
              </label>
            </div>
            {errorText('confirmAccuracy')}

            <div className="consent">
              <input
                type="checkbox"
                id="confirmPrivacy"
                name="confirmPrivacy"
                checked={/** @type {boolean} */ (values.confirmPrivacy)}
                onChange={handleChange}
                aria-invalid={errors.confirmPrivacy ? true : undefined}
                aria-describedby={errors.confirmPrivacy ? 'confirmPrivacy-error' : undefined}
                required
              />
              <label htmlFor="confirmPrivacy">
                I understand that this information will be sent securely to Fighting Chance
                Transitional Restoration staff for review, will be used only to evaluate this
                referral, and that submission does not guarantee placement.{' '}
                <span className="req" aria-hidden="true">*</span>
              </label>
            </div>
            {errorText('confirmPrivacy')}
          </div>
        </fieldset>

        <div className="btn-row" style={{ marginTop: '0.5rem', alignItems: 'center' }}>
          <button type="submit" className="btn btn--primary btn--lg" disabled={status === 'submitting'}>
            {status === 'submitting' ? (
              <>
                <span className="spinner" aria-hidden="true" /> Submitting…
              </>
            ) : (
              'Submit Referral'
            )}
          </button>
          <p style={{ fontSize: '0.88rem', color: '#666', margin: 0 }}>
            Questions first? Call us at{' '}
            <a href={site.phoneHref} style={{ fontWeight: 600 }}>
              {site.phone}
            </a>
            .
          </p>
        </div>

        {status === 'error' && serverMessage ? (
          <div className="form-status form-status--error" role="alert">
            <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
              <AlertIcon width={22} height={22} style={{ flex: 'none', marginTop: 2 }} />
              <span>{serverMessage}</span>
            </div>
          </div>
        ) : null}
      </form>
    </div>
  );
}
