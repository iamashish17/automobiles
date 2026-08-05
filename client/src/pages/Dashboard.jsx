import { useEffect, useState } from 'react';
import Navbar from '../component/layout/Navbar';
import Footer from '../component/layout/Footer';
import { Link, Navigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/useAuth';

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function Dashboard() {
  const { user, token, logout, authMethod } = useAuth();
  const isAdmin = String(user?.role || '').toLowerCase() === 'admin';
  const [bookings, setBookings] = useState([]);
  const [partsOrders, setPartsOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadBookings = async () => {
      try {
        setLoading(true);
        setError('');
        const [bookingsResult, ordersResult] = await Promise.allSettled([
          apiRequest('/api/bookings/me', { token }),
          apiRequest('/api/parts-orders/me', { token }),
        ]);
        if (active) {
          setBookings(bookingsResult.status === 'fulfilled' && Array.isArray(bookingsResult.value) ? bookingsResult.value : []);
          setPartsOrders(ordersResult.status === 'fulfilled' && Array.isArray(ordersResult.value) ? ordersResult.value : []);
          const failed = [bookingsResult, ordersResult].find((result) => result.status === 'rejected');
          if (failed) setError(failed.reason?.message || 'Some dashboard data could not be loaded.');
        }
      } catch (requestError) {
        if (active) setError(requestError.message || 'Failed to load dashboard data.');
      } finally {
        if (active) setLoading(false);
      }
    };

    if (token) loadBookings();

    return () => {
      active = false;
    };
  }, [token]);

  if (isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Account</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            You are signed in and can track your service bookings here.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Name</p>
              <p className="mt-2 text-lg font-medium text-slate-950">{user?.name || 'Unknown user'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</p>
              <p className="mt-2 break-all text-lg font-medium text-slate-950">{user?.email || 'No email available'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Login Method</p>
              <p className="mt-2 text-lg font-medium capitalize text-slate-950">{authMethod || 'manual'}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={logout}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Logout
            </button>
            <Link
              to="/service-booking"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Book Service
            </Link>
            <Link
              to="/parts"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Browse Parts
            </Link>
            {isAdmin ? (
              <Link
                to="/admin-dashboard"
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Admin Dashboard
              </Link>
            ) : null}
          </div>
        </div>

        <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Your Bookings</h2>
              <p className="mt-1 text-sm text-slate-500">Latest service requests and status updates.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {bookings.length} total
            </span>
          </div>

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-slate-500">Loading bookings...</p>
            ) : error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            ) : bookings.length === 0 ? (
              <p className="text-sm text-slate-500">No bookings yet. Use the booking page to schedule your first service.</p>
            ) : (
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <article key={booking._id} className="rounded-none border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-blue-600">{booking.serviceName}</p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-950">{booking.vehicleModel}</h3>
                        <p className="mt-1 text-sm text-slate-600">{booking.date} at {booking.time}</p>
                        {booking.notes ? <p className="mt-3 text-sm text-slate-600">{booking.notes}</p> : null}
                      </div>
                      <span className={`inline-flex self-start rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[booking.status] || statusStyles.pending}`}>
                        {booking.status}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Parts Orders</h2>
              <p className="mt-1 text-sm text-slate-500">Parts you ordered from the catalog.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {partsOrders.length} total
            </span>
          </div>

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-slate-500">Loading orders...</p>
            ) : error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            ) : partsOrders.length === 0 ? (
              <p className="text-sm text-slate-500">No parts orders yet. Use the parts catalog to place an order.</p>
            ) : (
              <div className="grid gap-4">
                {partsOrders.map((order) => (
                  <article key={order._id} className="rounded-none border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-950">Rs. {order.total}</h3>
                        <p className="mt-1 text-sm text-slate-500">Payment: {order.paymentStatus || 'Initiated'}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {order.items.map((item) => `${item.name} x ${item.quantity}`).join(', ')}
                        </p>
                      </div>
                      <span className={`inline-flex self-start rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[order.status] || statusStyles.pending}`}>
                        {order.status}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
