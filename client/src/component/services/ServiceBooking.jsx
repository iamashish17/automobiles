import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../context/useAuth';
import BookingHero from '../../assets/home/repair.png';

const availableServices = [
  'Engine Repair',
  'Transmission Repair',
  'Brake Service',
  'Suspension Service',
  'Oil Change',
  'Battery Replacement',
  'Tire Services',
  'General Checkup',
  'AC Repair',
  'Electrical System Repair',
  'Body Work',
];

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
];

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toDateString();
}

function getTodayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const ServiceBooking = () => {
  const { isAuthenticated, isAuthLoading, token, user } = useAuth();
  const todayInputValue = getTodayInputValue();
  const [form, setForm] = useState({
    serviceName: availableServices[0],
    vehicleModel: '',
    date: '',
    time: timeSlots[0],
    notes: '',
  });
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [services, setServices] = useState(availableServices);
  const [submitting, setSubmitting] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let alive = true;

    const loadServices = async () => {
      try {
        const data = await apiRequest('/api/services');
        if (!alive || !Array.isArray(data) || data.length === 0) return;

        const serviceNames = data.map((service) => service.name).filter(Boolean);
        setServices(serviceNames);
        setForm((current) => ({
          ...current,
          serviceName: serviceNames.includes(current.serviceName) ? current.serviceName : serviceNames[0],
        }));
      } catch {
        // Static service names keep booking available if no service catalog exists yet.
      }
    };

    loadServices();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      setBookings([]);
      return;
    }

    let alive = true;

    const loadBookings = async () => {
      try {
        setLoadingBookings(true);
        const data = await apiRequest('/api/bookings/me', { token });
        if (!alive) return;
        setBookings(Array.isArray(data) ? data : []);
      } catch (requestError) {
        if (!alive) return;
        setError(requestError.message || 'Failed to load your bookings.');
      } finally {
        if (alive) {
          setLoadingBookings(false);
        }
      }
    };

    loadBookings();

    return () => {
      alive = false;
    };
  }, [isAuthLoading, isAuthenticated, token]);

  const updateField = (field) => (event) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isAuthLoading) {
      setError('Please wait while your login session finishes loading.');
      return;
    }

    if (!isAuthenticated) {
      setError('Please login to book a service.');
      return;
    }

    if (!form.serviceName || !form.vehicleModel.trim() || !form.date || !form.time) {
      setError('Service, vehicle model, date and time are required.');
      return;
    }

    if (form.date < todayInputValue) {
      setError('Please choose today or a future date.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      await apiRequest('/api/bookings', {
        method: 'POST',
        token,
        body: {
          serviceName: form.serviceName,
          vehicleModel: form.vehicleModel,
          date: form.date,
          time: form.time,
          notes: form.notes,
        },
      });

      const updated = await apiRequest('/api/bookings/me', { token });
      setBookings(Array.isArray(updated) ? updated : []);
      setSuccess('Your service request has been booked successfully.');
      setForm({
        serviceName: services[0] || availableServices[0],
        vehicleModel: '',
        date: '',
        time: timeSlots[0],
        notes: '',
      });
    } catch (requestError) {
      setError(requestError.message || 'Failed to book service.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="overflow-hidden rounded-none border border-gray-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.08)]">
        <div className="grid lg:grid-cols-[1fr_1.08fr]">
          <div className="relative min-h-[420px] border-b border-gray-200 lg:min-h-[420px] lg:border-b-0 lg:border-r">
            <img
              src={BookingHero}
              alt="Service booking"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.10),rgba(15,23,42,0.55))]" />

            <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <p className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-white backdrop-blur">
                  Book a Service
                </p>
                <div className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  Fast Confirmation
                </div>
              </div>

              <div className="max-w-md">
                <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  Schedule your service visit with confidence.
                </h2>
                <p className="mt-4 text-sm leading-6 text-slate-100/90">
                  Reserve repair, maintenance, or inspection in a clean, simple booking flow that matches the rest of the site.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-none border border-white/20 bg-white/15 p-4 text-white backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Step 1</p>
                  <p className="mt-2 text-sm font-medium">Choose service</p>
                </div>
                <div className="rounded-none border border-white/20 bg-white/15 p-4 text-white backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Step 2</p>
                  <p className="mt-2 text-sm font-medium">Pick time</p>
                </div>
                <div className="rounded-none border border-white/20 bg-white/15 p-4 text-white backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Step 3</p>
                  <p className="mt-2 text-sm font-medium">Confirm booking</p>
                </div>
              </div>

              {isAuthLoading ? (
                <div className="mt-4 rounded-none border border-white/20 bg-white/15 p-4 text-white backdrop-blur">
                  <p className="text-sm font-medium">Finishing login setup...</p>
                  <p className="mt-1 text-xs text-slate-100/90">
                    Your account is being linked to booking access.
                  </p>
                </div>
              ) : !isAuthenticated ? (
                <div className="mt-4 rounded-none border border-white/20 bg-white/15 p-4 text-white backdrop-blur">
                  <p className="text-sm font-medium">Login is required to book a service.</p>
                  <Link
                    to="/login"
                    className="mt-3 inline-flex rounded-none bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  >
                    Login Now
                  </Link>
                </div>
              ) : (
                <div className="mt-4 rounded-none border border-white/20 bg-white/15 p-4 text-white backdrop-blur">
                  <p className="text-sm">
                    Signed in as <span className="font-semibold">{user?.name || 'customer'}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-100/90">
                    Your booking is linked to this account.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-blue-600">Reserve Slot</p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-900">
                Pick your service details
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Choose the service, date, and time that works for you.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Service Type</label>
                <select
                  value={form.serviceName}
                  onChange={updateField('serviceName')}
                  className="w-full rounded-none border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Vehicle Model</label>
                <input
                  type="text"
                  value={form.vehicleModel}
                  onChange={updateField('vehicleModel')}
                  placeholder="e.g. Toyota Corolla"
                  className="w-full rounded-none border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Preferred Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={updateField('date')}
                    min={todayInputValue}
                    className="w-full rounded-none border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Preferred Time</label>
                  <select
                    value={form.time}
                    onChange={updateField('time')}
                    className="w-full rounded-none border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={updateField('notes')}
                  placeholder="Describe any issue or extra request..."
                  rows={4}
                  className="w-full rounded-none border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none"
                />
              </div>

              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              {success ? (
                <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting || isAuthLoading || !isAuthenticated}
                className="w-full rounded-none bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Booking...' : isAuthLoading ? 'Preparing account...' : 'Book Service'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <div className="mt-8 rounded-none border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Your Bookings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Review your upcoming and past service requests.
              </p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {bookings.length} total
            </span>
          </div>

          <div className="mt-6">
            {loadingBookings ? (
              <p className="text-sm text-gray-500">Loading your bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-sm text-gray-500">No bookings yet. Use the form above to book your first service.</p>
            ) : (
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <article
                    key={booking._id}
                    className="rounded-none border border-gray-200 bg-gray-50 p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
                          {booking.serviceName}
                        </p>
                        <h4 className="mt-1 text-lg font-semibold text-gray-900">
                          {booking.vehicleModel}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                          {formatDate(booking.date)} at {booking.time}
                        </p>
                      </div>

                      <span
                        className={`inline-flex self-start rounded-full border px-3 py-1 text-xs font-medium ${
                          statusStyles[booking.status] || 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {booking.notes ? (
                      <p className="mt-4 text-sm text-gray-600">
                        {booking.notes}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiceBooking;
