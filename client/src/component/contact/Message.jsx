import { useState } from 'react';
import { AlertCircle, CheckCircle2, LoaderCircle, Send } from 'lucide-react';
import { apiRequest } from '../../lib/api';

const initialFormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateForm = (values) => {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (!name) errors.name = 'Please enter your name.';
  else if (name.length < 2) errors.name = 'Name must be at least 2 characters.';
  else if (name.length > 60) errors.name = 'Name must be 60 characters or fewer.';

  if (!email) errors.email = 'Please enter your email address.';
  else if (!emailPattern.test(email)) errors.email = 'Enter a valid email address.';

  if (subject.length > 100) errors.subject = 'Subject must be 100 characters or fewer.';

  if (!message) errors.message = 'Please tell us how we can help.';
  else if (message.length < 10) errors.message = 'Please add a little more detail (at least 10 characters).';
  else if (message.length > 1000) errors.message = 'Message must be 1,000 characters or fewer.';

  return errors;
};

const Message = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = ({ target: { name, value } }) => {
    const nextForm = { ...formData, [name]: value };
    setFormData(nextForm);
    if (touched[name]) {
      setFieldErrors((current) => ({ ...current, [name]: validateForm(nextForm)[name] }));
    }
    setError('');
    setSuccess('');
  };

  const handleBlur = ({ target: { name } }) => {
    setTouched((current) => ({ ...current, [name]: true }));
    setFieldErrors((current) => ({ ...current, [name]: validateForm(formData)[name] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length) {
      setTouched({ name: true, email: true, subject: true, message: true });
      setFieldErrors(validationErrors);
      setError('Please check the highlighted fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      await apiRequest('/api/contact', {
        method: 'POST',
        body: Object.fromEntries(
          Object.entries(formData).map(([key, value]) => [key, value.trim()]),
        ),
      });

      setFormData(initialFormState);
      setTouched({});
      setFieldErrors({});
      setSuccess('Thanks! Your message has been sent successfully.');
    } catch (requestError) {
      setError(requestError.message || 'We could not send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) => `w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
    fieldErrors[field]
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
  }`;

  const fieldError = (field) => fieldErrors[field] ? (
    <p id={`${field}-error`} className="mt-1.5 text-xs text-red-600">{fieldErrors[field]}</p>
  ) : null;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <div className="mb-5 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">We’re here to help</p>
          <h2 className="mt-1.5 text-2xl font-bold text-slate-900">Send Us a Message</h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
            Have a question about a service or part? Share the details and our team will get back to you.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-slate-700">Name <span className="text-red-500">*</span></label>
              <input id="contact-name" type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} placeholder="Your full name" autoComplete="name" maxLength={60} className={inputClass('name')} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'name-error' : undefined} />
              {fieldError('name')}
            </div>

            <div>
              <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-slate-700">Email <span className="text-red-500">*</span></label>
              <input id="contact-email" type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="you@example.com" autoComplete="email" className={inputClass('email')} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'email-error' : undefined} />
              {fieldError('email')}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="contact-subject" className="mb-2 block text-sm font-medium text-slate-700">Subject <span className="font-normal text-slate-400">(optional)</span></label>
            <input id="contact-subject" type="text" name="subject" value={formData.subject} onChange={handleChange} onBlur={handleBlur} placeholder="What is this about?" maxLength={100} className={inputClass('subject')} aria-invalid={Boolean(fieldErrors.subject)} aria-describedby={fieldErrors.subject ? 'subject-error' : undefined} />
            {fieldError('subject')}
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="contact-message" className="text-sm font-medium text-slate-700">Message <span className="text-red-500">*</span></label>
              <span className={`text-xs ${formData.message.length > 1000 ? 'text-red-600' : 'text-slate-400'}`}>{formData.message.length}/1000</span>
            </div>
            <textarea id="contact-message" name="message" value={formData.message} onChange={handleChange} onBlur={handleBlur} rows={4} placeholder="Tell us how we can help..." maxLength={1000} className={`${inputClass('message')} resize-y`} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? 'message-error' : undefined} />
            {fieldError('message')}
          </div>

          <div aria-live="polite" className="mt-5">
            {error ? <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle className="mt-0.5 shrink-0" size={17} />{error}</p> : null}
            {success ? <p className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"><CheckCircle2 className="mt-0.5 shrink-0" size={17} />{success}</p> : null}
          </div>

          <button type="submit" disabled={submitting} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {submitting ? <LoaderCircle className="animate-spin" size={17} /> : <Send size={17} />}
            {submitting ? 'Sending message...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Message;
