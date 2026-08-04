import { useState } from 'react';
import { Send } from 'lucide-react';
import { apiRequest } from '../../lib/api';

const initialFormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const Message = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError('');
    }
    if (success) {
      setSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Name, email and message are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      await apiRequest('/api/contact', {
        method: 'POST',
        body: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
      });

      setFormData(initialFormState);
      setSuccess('Message sent successfully!');
    } catch (requestError) {
      setError(requestError.message || 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mb-12 sm:px-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Send Us a Message</h2>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter the subject"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="Write your message..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white resize-none"
            required
          />
        </div>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60 sm:w-auto"
        >
          <Send size={16} />
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default Message;
