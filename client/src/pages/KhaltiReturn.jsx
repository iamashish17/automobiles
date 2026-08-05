import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../component/layout/Navbar';
import Footer from '../component/layout/Footer';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/useAuth';

export default function KhaltiReturn() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState({ loading: true, error: '', payment: null, order: null });
  const pidx = searchParams.get('pidx');

  useEffect(() => {
    let alive = true;

    const verifyPayment = async () => {
      if (!token || !pidx) {
        setState({ loading: false, error: pidx ? 'Please login to verify this payment.' : 'Missing Khalti payment id.', payment: null, order: null });
        return;
      }

      try {
        const data = await apiRequest('/api/parts-orders/khalti/verify', {
          method: 'POST',
          token,
          body: { pidx },
        });

        if (alive) {
          setState({ loading: false, error: '', payment: data.payment, order: data.order });
        }
      } catch (requestError) {
        if (alive) {
          setState({ loading: false, error: requestError.message || 'Unable to verify Khalti payment.', payment: null, order: null });
        }
      }
    };

    verifyPayment();

    return () => {
      alive = false;
    };
  }, [pidx, token]);

  const message = useMemo(() => {
    const status = state.payment?.status || searchParams.get('status');
    if (state.loading) return { title: 'Verifying payment', body: 'Please wait while we confirm your Khalti transaction.', tone: 'slate' };
    if (state.error) return { title: 'Payment verification failed', body: state.error, tone: 'red' };
    if (status === 'Completed') return { title: 'Payment completed', body: 'Your parts order has been confirmed.', tone: 'green' };
    if (['Expired', 'User canceled', 'Failed'].includes(status)) return { title: 'Payment not completed', body: 'The order was cancelled because Khalti did not confirm payment.', tone: 'red' };
    return { title: 'Payment on hold', body: `Khalti returned ${status || 'an unknown status'}. We will process this order only after payment is completed.`, tone: 'amber' };
  }, [searchParams, state.error, state.loading, state.payment?.status]);

  const toneClass = {
    slate: 'border-slate-200 bg-slate-50 text-slate-700',
    green: 'border-green-200 bg-green-50 text-green-700',
    red: 'border-red-200 bg-red-50 text-red-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
  }[message.tone];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-blue-600">Khalti Payment</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950">{message.title}</h1>
          <p className={`mt-5 rounded-xl border px-4 py-3 text-sm ${toneClass}`}>{message.body}</p>

          {state.order ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Order #{String(state.order._id).slice(-6)}</p>
                  <p className="mt-1 text-sm text-slate-500">Payment status: {state.order.paymentStatus}</p>
                </div>
                <p className="text-lg font-semibold text-slate-950">Rs. {state.order.total}</p>
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/dashboard" className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Dashboard
            </Link>
            <Link to="/parts" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
              Parts Catalog
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
