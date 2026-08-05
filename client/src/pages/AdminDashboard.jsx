import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck,
  Car,
  CheckCircle,
  ClipboardList,
  Mail,
  MessageSquareText,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Star,
  Users,
  Wrench,
  X,
  XCircle,
} from 'lucide-react';
import Navbar from '../component/layout/Navbar';
import Footer from '../component/layout/Footer';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/useAuth';

const tabs = [
  { id: 'overview', label: 'Overview', icon: ClipboardList },
  { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'parts', label: 'Parts', icon: Package },
  { id: 'part-orders', label: 'Part Orders', icon: ShoppingBag },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'messages', label: 'Messages', icon: Mail },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const bookingStatuses = ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'];
const partOrderStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
const serviceCategories = ['Repair', 'Maintenance', 'Additional'];
const PAGE_SIZE = 8;

const emptyService = { name: '', category: 'Repair', description: '', price: '', imageUrl: '', active: true };
const emptyPart = {
  name: '',
  category: '',
  vehicleModel: '',
  brand: '',
  price: '',
  stock: '',
  description: '',
  imageUrl: '',
  featured: false,
};

const buttonBase = 'inline-flex min-h-10 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50';
const inputBase = 'w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function statusTone(status) {
  const tones = {
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    confirmed: 'border-blue-200 bg-blue-50 text-blue-700',
    rejected: 'border-red-200 bg-red-50 text-red-700',
    completed: 'border-green-200 bg-green-50 text-green-700',
    cancelled: 'border-gray-200 bg-gray-100 text-gray-700',
    approved: 'border-green-200 bg-green-50 text-green-700',
    accepted: 'border-green-200 bg-green-50 text-green-700',
    read: 'border-green-200 bg-green-50 text-green-700',
    unread: 'border-amber-200 bg-amber-50 text-amber-700',
    admin: 'border-blue-200 bg-blue-50 text-blue-700',
    user: 'border-gray-200 bg-gray-50 text-gray-700',
  };

  return tones[status] || tones.user;
}

function Badge({ children, tone = 'user' }) {
  return (
    <span className={cx('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize', statusTone(tone))}>
      {children}
    </span>
  );
}

function Button({ children, variant = 'secondary', className = '', ...props }) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    dark: 'bg-gray-900 text-white hover:bg-gray-800',
    secondary: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
    danger: 'border border-red-200 bg-white text-red-700 hover:bg-red-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };

  return (
    <button type="button" className={cx(buttonBase, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

function getReviewStatus(review) {
  if (review.approved) return 'approved';
  return review.moderationStatus || 'pending';
}

function getReviewStatusLabel(status) {
  return status === 'approved' ? 'accepted' : status;
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-gray-500">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-gray-500">{hint}</span> : null}
    </label>
  );
}

function TextInput({ label, hint, leftIcon: Icon, ...props }) {
  return (
    <Field label={label} hint={hint}>
      <div className="relative">
        {Icon ? <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> : null}
        <input {...props} className={cx(inputBase, Icon ? 'pl-9' : '')} />
      </div>
    </Field>
  );
}

function SelectInput({ label, children, ...props }) {
  return (
    <Field label={label}>
      <select {...props} className={inputBase}>
        {children}
      </select>
    </Field>
  );
}

function TextArea({ label, ...props }) {
  return (
    <Field label={label}>
      <textarea {...props} className={cx(inputBase, 'min-h-24 resize-none')} />
    </Field>
  );
}

function StatCard({ label, value, helper, icon: Icon, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    gray: 'bg-gray-50 text-gray-700 border-gray-200',
    green: 'bg-green-50 text-green-700 border-green-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    red: 'bg-red-50 text-red-700 border-red-100',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        {Icon ? (
          <span className={cx('inline-flex rounded-xl border p-2.5', tones[tone] || tones.blue)}>
            <Icon size={18} />
          </span>
        ) : null}
      </div>
      {helper ? <p className="mt-3 text-sm text-gray-500">{helper}</p> : null}
    </div>
  );
}

function Section({ title, description, action, children }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center">
      <p className="font-medium text-gray-900">{title}</p>
      {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-24 animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
      ))}
    </div>
  );
}

function TableShell({ columns, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function paginate(items, page) {
  const totalPages = Math.max(Math.ceil(items.length / PAGE_SIZE), 1);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  return { items: items.slice(start, start + PAGE_SIZE), currentPage, totalPages };
}

function Pagination({ page, totalPages, onPageChange, totalItems }) {
  if (totalPages <= 1 && totalItems <= PAGE_SIZE) return null;

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="text-gray-500">{totalItems} records, page {page} of {totalPages}</span>
      <div className="flex gap-2">
        <Button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>Previous</Button>
        <Button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>Next</Button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { token, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [partOrderFilter, setPartOrderFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [pageByTab, setPageByTab] = useState({});
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [parts, setParts] = useState([]);
  const [partOrders, setPartOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [partForm, setPartForm] = useState(emptyPart);
  const [editingServiceId, setEditingServiceId] = useState('');
  const [editingPartId, setEditingPartId] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (bookingFilter !== 'all') params.set('status', bookingFilter);

      const orderParams = new URLSearchParams();
      if (query.trim()) orderParams.set('q', query.trim());
      if (partOrderFilter !== 'all') orderParams.set('status', partOrderFilter);

      const results = await Promise.allSettled([
        apiRequest(`/api/bookings${params.toString() ? `?${params}` : ''}`, { token }),
        apiRequest(`/api/parts-orders${orderParams.toString() ? `?${orderParams}` : ''}`, { token }),
        apiRequest('/api/reviews/admin', { token }),
        apiRequest('/api/contact', { token }),
        apiRequest('/api/services?includeInactive=true', { token }),
        apiRequest('/api/parts', { token }),
        apiRequest('/api/users', { token }),
      ]);

      const [bookingData, orderData, reviewData, messageData, serviceData, partData, userData] = results.map((result) =>
        result.status === 'fulfilled' ? result.value : []
      );

      setBookings(Array.isArray(bookingData) ? bookingData : []);
      setPartOrders(Array.isArray(orderData) ? orderData : []);
      setReviews(Array.isArray(reviewData) ? reviewData : []);
      setMessages(Array.isArray(messageData) ? messageData : []);
      setServices(Array.isArray(serviceData) ? serviceData : []);
      setParts(Array.isArray(partData) ? partData : []);
      setUsers(Array.isArray(userData) ? userData : []);

      const failedCount = results.filter((result) => result.status === 'rejected').length;
      if (failedCount > 0) {
        setError(`${failedCount} admin data request${failedCount === 1 ? '' : 's'} failed. Loaded the remaining data.`);
      }
    } catch (requestError) {
      setError(requestError.message || 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  }, [bookingFilter, partOrderFilter, query, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const counts = useMemo(() => ({
    pending: bookings.filter((booking) => booking.status === 'pending').length,
    confirmed: bookings.filter((booking) => booking.status === 'confirmed').length,
    rejected: bookings.filter((booking) => booking.status === 'rejected').length,
    completed: bookings.filter((booking) => booking.status === 'completed').length,
    cancelled: bookings.filter((booking) => booking.status === 'cancelled').length,
    unread: messages.filter((message) => message.status === 'unread').length,
    pendingReviews: reviews.filter((review) => getReviewStatus(review) === 'pending').length,
    revenue: services.reduce((sum, service) => sum + Number(service.price || 0), 0),
    partSales: partOrders.reduce((sum, order) => sum + Number(order.total || 0), 0),
  }), [bookings, messages, reviews, services, partOrders]);

  const stats = [
    { label: 'Total Users', value: users.length, helper: 'Registered customer and admin accounts', icon: Users, tone: 'gray' },
    { label: 'Total Bookings', value: bookings.length, helper: 'All service requests', icon: ClipboardList, tone: 'blue' },
    { label: 'Part Orders', value: partOrders.length, helper: 'Customer parts purchases', icon: ShoppingBag, tone: 'green' },
    { label: 'Pending', value: counts.pending, helper: 'Waiting for admin action', icon: CalendarCheck, tone: 'amber' },
    { label: 'Approved', value: counts.confirmed, helper: 'Confirmed appointments', icon: CheckCircle, tone: 'green' },
    { label: 'Rejected', value: counts.rejected, helper: 'Rejected requests', icon: XCircle, tone: 'red' },
    { label: 'Completed', value: counts.completed, helper: 'Finished services', icon: Wrench, tone: 'green' },
    { label: 'Cancelled', value: counts.cancelled, helper: 'Cancelled bookings', icon: XCircle, tone: 'gray' },
    { label: 'Service Value', value: `Rs. ${counts.revenue}`, helper: 'Sum of listed service prices', icon: Car, tone: 'blue' },
  ];

  const filteredUsers = useMemo(() => {
    const search = userQuery.trim().toLowerCase();
    if (!search) return users;
    return users.filter((account) =>
      [account.name, account.email, account.phone, account.role, account.authProvider]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search))
    );
  }, [userQuery, users]);

  const recentBookings = bookings.slice(0, 5);
  const recentActivity = [
    ...bookings.slice(0, 3).map((booking) => ({ id: `booking-${booking._id}`, label: `${booking.serviceName} for ${booking.vehicleModel}`, meta: `Booking ${booking.status}` })),
    ...messages.slice(0, 2).map((message) => ({ id: `message-${message._id}`, label: message.subject || message.message, meta: `Message from ${message.name}` })),
  ];

  const withAction = async (key, action, fallback, onSuccess) => {
    try {
      setActionLoading(key);
      setError('');
      setNotice('');
      const result = await action();
      if (onSuccess) onSuccess(result);
      await loadData();
      return result;
    } catch (requestError) {
      setError(requestError.message || fallback);
      return null;
    } finally {
      setActionLoading('');
    }
  };

  const updateReview = (updatedReview) => {
    if (!updatedReview?._id) return;
    setReviews((current) =>
      current.map((review) => (review._id === updatedReview._id ? updatedReview : review))
    );
  };

  const upsertPart = (savedPart) => {
    if (!savedPart?._id) return;
    setParts((current) => {
      const exists = current.some((part) => part._id === savedPart._id);
      return exists
        ? current.map((part) => (part._id === savedPart._id ? savedPart : part))
        : [savedPart, ...current];
    });
  };

  const getPage = (tab) => pageByTab[tab] || 1;
  const setPage = (tab, page) => setPageByTab((current) => ({ ...current, [tab]: page }));

  const submitService = async (event) => {
    event.preventDefault();
    await withAction('service-form', async () => {
      await apiRequest(editingServiceId ? `/api/services/${editingServiceId}` : '/api/services', {
        method: editingServiceId ? 'PUT' : 'POST',
        token,
        body: serviceForm,
      });
      setServiceForm(emptyService);
      setEditingServiceId('');
    }, 'Failed to save service.');
  };

  const submitPart = async (event) => {
    event.preventDefault();
    await withAction('part-form', async () => {
      const savedPart = await apiRequest(editingPartId ? `/api/parts/${editingPartId}` : '/api/parts', {
        method: editingPartId ? 'PUT' : 'POST',
        token,
        body: partForm,
      });
      upsertPart(savedPart);
      setNotice(editingPartId ? 'Part updated successfully.' : 'Part added successfully.');
      setPartForm(emptyPart);
      setEditingPartId('');
    }, 'Failed to save part.');
  };

  const editService = (service) => {
    setEditingServiceId(service._id);
    setServiceForm({
      name: service.name || '',
      category: service.category || 'Repair',
      description: service.description || '',
      price: service.price ?? '',
      imageUrl: service.imageUrl || '',
      active: service.active !== false,
    });
  };

  const editPart = (part) => {
    setEditingPartId(part._id);
    setPartForm({
      name: part.name || '',
      category: part.category || '',
      vehicleModel: part.vehicleModel || '',
      brand: part.brand || '',
      price: part.price ?? '',
      stock: part.stock ?? '',
      description: part.description || '',
      imageUrl: part.imageUrl || '',
      featured: Boolean(part.featured),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <div className="border-b border-gray-100 px-3 py-3">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-600">Admin Panel</p>
                <p className="mt-1 truncate text-sm font-medium text-gray-900">{user?.name || 'Administrator'}</p>
              </div>
              <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cx(
                        'flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition',
                        active ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <Icon size={17} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="sticky top-0 z-20 mb-6 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-sm backdrop-blur sm:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Admin Dashboard</h1>
                  <p className="mt-1 text-sm text-gray-500">Manage bookings, services, parts, users, reviews, and messages.</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  <Button className="w-full sm:w-auto" onClick={loadData} disabled={loading}>Refresh</Button>
                  <Button className="w-full sm:w-auto" variant="danger" onClick={logout}>Logout</Button>
                </div>
              </div>
            </div>

            {error ? (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {notice ? (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {notice}
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
            </div>

            <div className="mt-6">
              {loading ? (
                <LoadingState />
              ) : activeTab === 'overview' ? (
                <OverviewPanel recentBookings={recentBookings} recentActivity={recentActivity} counts={counts} />
              ) : activeTab === 'bookings' ? (
                <BookingsPanel
                  bookings={bookings}
                  query={query}
                  setQuery={setQuery}
                  bookingFilter={bookingFilter}
                  setBookingFilter={setBookingFilter}
                  loadData={loadData}
                  page={getPage('bookings')}
                  setPage={(page) => setPage('bookings', page)}
                  actionLoading={actionLoading}
                  withAction={withAction}
                  token={token}
                  setSelectedBooking={setSelectedBooking}
                />
              ) : activeTab === 'services' ? (
                <ServicesPanel
                  services={services}
                  form={serviceForm}
                  setForm={setServiceForm}
                  editingId={editingServiceId}
                  setEditingId={setEditingServiceId}
                  submitService={submitService}
                  editService={editService}
                  actionLoading={actionLoading}
                  withAction={withAction}
                  token={token}
                  page={getPage('services')}
                  setPage={(page) => setPage('services', page)}
                />
              ) : activeTab === 'parts' ? (
                <PartsPanel
                  parts={parts}
                  form={partForm}
                  setForm={setPartForm}
                  editingId={editingPartId}
                  setEditingId={setEditingPartId}
                  submitPart={submitPart}
                  editPart={editPart}
                  actionLoading={actionLoading}
                  withAction={withAction}
                  token={token}
                  page={getPage('parts')}
                  setPage={(page) => setPage('parts', page)}
                />
              ) : activeTab === 'part-orders' ? (
                <PartOrdersPanel
                  orders={partOrders}
                  query={query}
                  setQuery={setQuery}
                  orderFilter={partOrderFilter}
                  setOrderFilter={setPartOrderFilter}
                  loadData={loadData}
                  page={getPage('part-orders')}
                  setPage={(page) => setPage('part-orders', page)}
                  actionLoading={actionLoading}
                  withAction={withAction}
                  token={token}
                />
              ) : activeTab === 'users' ? (
                <UsersPanel
                  users={filteredUsers}
                  userQuery={userQuery}
                  setUserQuery={setUserQuery}
                  page={getPage('users')}
                  setPage={(page) => setPage('users', page)}
                  currentUserId={user?.id || user?._id}
                  actionLoading={actionLoading}
                  withAction={withAction}
                  token={token}
                />
              ) : activeTab === 'reviews' ? (
                <ReviewsPanel reviews={reviews} actionLoading={actionLoading} withAction={withAction} token={token} updateReview={updateReview} />
              ) : activeTab === 'messages' ? (
                <MessagesPanel messages={messages} actionLoading={actionLoading} withAction={withAction} token={token} />
              ) : (
                <SettingsPanel />
              )}
            </div>
          </section>
        </div>
      </main>

      {selectedBooking ? <BookingDialog booking={selectedBooking} onClose={() => setSelectedBooking(null)} /> : null}

      <Footer />
    </div>
  );
}

function OverviewPanel({ recentBookings, recentActivity, counts }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Section title="Latest bookings" description="Most recent service requests">
        {recentBookings.length === 0 ? (
          <EmptyState title="No recent bookings" description="New bookings will appear here." />
        ) : (
          <TableShell columns={['Service', 'Customer', 'Schedule', 'Status']}>
            {recentBookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{booking.serviceName}</td>
                <td className="px-4 py-3 text-gray-600">{booking.userId?.name || 'Unknown'}</td>
                <td className="px-4 py-3 text-gray-600">{booking.date} at {booking.time}</td>
                <td className="px-4 py-3"><Badge tone={booking.status}>{booking.status}</Badge></td>
              </tr>
            ))}
          </TableShell>
        )}
      </Section>

      <Section title="Recent activity" description="Quick operational snapshot">
        <div className="grid gap-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-900">Work queue</p>
            <p className="mt-1 text-sm text-gray-500">{counts.pending} pending bookings, {counts.unread} unread messages, {counts.pendingReviews} reviews waiting.</p>
          </div>
          {recentActivity.length === 0 ? (
            <EmptyState title="No activity yet" description="Activity appears when bookings and messages arrive." />
          ) : recentActivity.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-gray-400">{item.meta}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function BookingsPanel({ bookings, query, setQuery, bookingFilter, setBookingFilter, loadData, page, setPage, actionLoading, withAction, token, setSelectedBooking }) {
  const paginated = paginate(bookings, page);

  return (
    <Section
      title="Booking Management"
      description="Search, filter, review, and update service appointments."
      action={<Button variant="dark" onClick={loadData}>Apply Filters</Button>}
    >
      <div className="mb-5 grid gap-4 md:grid-cols-[1fr_220px]">
        <TextInput label="Search bookings" leftIcon={Search} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Service, customer, vehicle, notes" />
        <SelectInput label="Status" value={bookingFilter} onChange={(event) => setBookingFilter(event.target.value)}>
          <option value="all">All statuses</option>
          {bookingStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </SelectInput>
      </div>

      {bookings.length === 0 ? (
        <EmptyState title="No bookings found" description="Try clearing filters or wait for a customer booking." />
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {paginated.items.map((booking) => (
              <article key={booking._id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words text-sm font-semibold text-gray-900">{booking.serviceName}</h3>
                    <p className="mt-1 text-xs text-gray-500">{booking.vehicleModel}</p>
                  </div>
                  <Badge tone={booking.status}>{booking.status}</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-gray-600">
                  <p className="break-words">{booking.userId?.name || 'Unknown user'}</p>
                  <p className="break-all text-xs text-gray-500">{booking.userId?.email || 'No email'}</p>
                  <p className="text-xs">{booking.date} at {booking.time}</p>
                </div>
                <div className="mt-4 grid gap-2">
                  <select
                    aria-label="Update booking status"
                    value={booking.status}
                    disabled={actionLoading === `booking-${booking._id}`}
                    onChange={(event) => withAction(`booking-${booking._id}`, () => apiRequest(`/api/bookings/${booking._id}/status`, { method: 'PATCH', token, body: { status: event.target.value } }), 'Failed to update booking.')}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    {bookingStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="w-full" onClick={() => setSelectedBooking(booking)}>Details</Button>
                    <Button variant="danger" className="w-full" disabled={actionLoading === `booking-${booking._id}`} onClick={() => withAction(`booking-${booking._id}`, () => apiRequest(`/api/bookings/${booking._id}`, { method: 'DELETE', token }), 'Failed to delete booking.')}>
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden md:block">
            <TableShell columns={['Booking', 'Customer', 'Schedule', 'Status', 'Actions']}>
              {paginated.items.map((booking, index) => (
                <tr key={booking._id} className={cx('hover:bg-gray-50', index % 2 ? 'bg-gray-50/40' : 'bg-white')}>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{booking.serviceName}</p>
                    <p className="mt-1 text-sm text-gray-500">{booking.vehicleModel}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{booking.userId?.name || 'Unknown user'}</p>
                    <p className="mt-1 break-all text-sm text-gray-500">{booking.userId?.email || 'No email'}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-gray-600">{booking.date} at {booking.time}</td>
                  <td className="px-4 py-4"><Badge tone={booking.status}>{booking.status}</Badge></td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => setSelectedBooking(booking)}>Details</Button>
                      <select
                        aria-label="Update booking status"
                        value={booking.status}
                        disabled={actionLoading === `booking-${booking._id}`}
                        onChange={(event) => withAction(`booking-${booking._id}`, () => apiRequest(`/api/bookings/${booking._id}/status`, { method: 'PATCH', token, body: { status: event.target.value } }), 'Failed to update booking.')}
                        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      >
                        {bookingStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                      <Button variant="danger" disabled={actionLoading === `booking-${booking._id}`} onClick={() => withAction(`booking-${booking._id}`, () => apiRequest(`/api/bookings/${booking._id}`, { method: 'DELETE', token }), 'Failed to delete booking.')}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </TableShell>
          </div>
          <Pagination page={paginated.currentPage} totalPages={paginated.totalPages} totalItems={bookings.length} onPageChange={setPage} />
        </>
      )}
    </Section>
  );
}

function ServicesPanel({ services, form, setForm, editingId, setEditingId, submitService, editService, actionLoading, withAction, token, page, setPage }) {
  const paginated = paginate(services, page);
  const isSaving = actionLoading === 'service-form';

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <Section title={editingId ? 'Edit Service' : 'Add Service'} description="Manage service catalog details and pricing.">
        <form onSubmit={submitService} className="space-y-4">
          <TextInput label="Service name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <SelectInput label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            {serviceCategories.map((category) => <option key={category} value={category}>{category}</option>)}
          </SelectInput>
          <TextInput label="Price" type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
          <TextInput label="Image URL" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
          <TextArea label="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} />
            Active service
          </label>
          <div className="grid gap-2 sm:flex">
            <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={isSaving}>{isSaving ? 'Saving...' : editingId ? 'Update Service' : 'Add Service'}</Button>
            {editingId ? <Button type="button" className="w-full sm:w-auto" onClick={() => { setForm(emptyService); setEditingId(''); }}>Cancel</Button> : null}
          </div>
        </form>
      </Section>

      <Section title="Service List" description={`${services.length} services in catalog`}>
        {services.length === 0 ? (
          <EmptyState title="No services found" description="Add a service using the form." />
        ) : (
          <>
            <div className="grid gap-3 md:hidden">
              {paginated.items.map((service) => (
                <article key={service._id} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="admin">{service.category}</Badge>
                    <Badge tone={service.active ? 'completed' : 'cancelled'}>{service.active ? 'active' : 'inactive'}</Badge>
                  </div>
                  <h3 className="mt-3 break-words text-sm font-semibold text-gray-900">{service.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">{service.description || 'No description'}</p>
                  <p className="mt-3 rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-700">Rs. {service.price || 0}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button className="w-full" onClick={() => editService(service)}>Edit</Button>
                    <Button variant="danger" className="w-full" disabled={actionLoading === `service-${service._id}`} onClick={() => withAction(`service-${service._id}`, () => apiRequest(`/api/services/${service._id}`, { method: 'DELETE', token }), 'Failed to delete service.')}>Delete</Button>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden md:block">
              <TableShell columns={['Service', 'Category', 'Price', 'Status', 'Actions']}>
                {paginated.items.map((service, index) => (
                  <tr key={service._id} className={cx('hover:bg-gray-50', index % 2 ? 'bg-gray-50/40' : 'bg-white')}>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">{service.description || 'No description'}</p>
                    </td>
                    <td className="px-4 py-4"><Badge tone="admin">{service.category}</Badge></td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-700">Rs. {service.price || 0}</td>
                    <td className="px-4 py-4"><Badge tone={service.active ? 'completed' : 'cancelled'}>{service.active ? 'active' : 'inactive'}</Badge></td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Button onClick={() => editService(service)}>Edit</Button>
                        <Button variant="danger" disabled={actionLoading === `service-${service._id}`} onClick={() => withAction(`service-${service._id}`, () => apiRequest(`/api/services/${service._id}`, { method: 'DELETE', token }), 'Failed to delete service.')}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </TableShell>
            </div>
            <Pagination page={paginated.currentPage} totalPages={paginated.totalPages} totalItems={services.length} onPageChange={setPage} />
          </>
        )}
      </Section>
    </div>
  );
}

function PartsPanel({ parts, form, setForm, editingId, setEditingId, submitPart, editPart, actionLoading, withAction, token, page, setPage }) {
  const paginated = paginate(parts, page);
  const isSaving = actionLoading === 'part-form';

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <Section title={editingId ? 'Edit Part' : 'Add Part'} description="Maintain inventory items and stock levels.">
        <form onSubmit={submitPart} className="space-y-4">
          <TextInput label="Part name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <TextInput label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput label="Vehicle model" value={form.vehicleModel} onChange={(event) => setForm({ ...form, vehicleModel: event.target.value })} />
            <TextInput label="Brand" value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput label="Price" type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
            <TextInput label="Stock" type="number" min="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
          </div>
          <TextInput label="Image URL" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
          <TextArea label="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
            Featured part
          </label>
          <div className="grid gap-2 sm:flex">
            <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={isSaving}>{isSaving ? 'Saving...' : editingId ? 'Update Part' : 'Add Part'}</Button>
            {editingId ? <Button type="button" className="w-full sm:w-auto" onClick={() => { setForm(emptyPart); setEditingId(''); }}>Cancel</Button> : null}
          </div>
        </form>
      </Section>

      <Section title="Parts Inventory" description={`${parts.length} inventory records`}>
        {parts.length === 0 ? (
          <EmptyState title="No parts found" description="Add inventory using the form." />
        ) : (
          <>
            <div className="grid gap-3 md:hidden">
              {paginated.items.map((part) => (
                <article key={part._id} className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="flex gap-3">
                    {part.imageUrl ? (
                      <img src={part.imageUrl} alt={part.name} className="h-20 w-20 shrink-0 rounded-md object-cover" />
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-medium text-gray-400">
                        No image
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="admin">{part.category}</Badge>
                        {part.featured ? <Badge tone="completed">featured</Badge> : <Badge tone="cancelled">standard</Badge>}
                      </div>
                      <h3 className="mt-2 break-words text-sm font-semibold text-gray-900">{part.name}</h3>
                      <p className="mt-1 text-xs text-gray-500">{part.brand || 'No brand'} {part.vehicleModel ? `- ${part.vehicleModel}` : ''}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <span className="rounded-md bg-gray-50 px-2 py-1">Rs. {part.price}</span>
                        <span className="rounded-md bg-gray-50 px-2 py-1">Stock: {part.stock}</span>
                      </div>
                    </div>
                  </div>
                  {part.description ? <p className="mt-3 line-clamp-2 text-sm text-gray-600">{part.description}</p> : null}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button className="w-full" onClick={() => editPart(part)}>Edit</Button>
                    <Button
                      variant="danger"
                      className="w-full"
                      disabled={actionLoading === `part-${part._id}`}
                      onClick={() => withAction(`part-${part._id}`, () => apiRequest(`/api/parts/${part._id}`, { method: 'DELETE', token }), 'Failed to delete part.')}
                    >
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden md:block">
              <TableShell columns={['Part', 'Category', 'Price / Stock', 'Flags', 'Actions']}>
                {paginated.items.map((part, index) => (
                  <tr key={part._id} className={cx('hover:bg-gray-50', index % 2 ? 'bg-gray-50/40' : 'bg-white')}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                      {part.imageUrl ? (
                        <img src={part.imageUrl} alt={part.name} className="h-12 w-12 rounded-md object-cover" />
                      ) : null}
                        <div>
                          <p className="font-medium text-gray-900">{part.name}</p>
                          <p className="mt-1 text-sm text-gray-500">{part.brand || 'No brand'} {part.vehicleModel ? `- ${part.vehicleModel}` : ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><Badge tone="admin">{part.category}</Badge></td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-700">Rs. {part.price} / {part.stock}</td>
                    <td className="px-4 py-4">{part.featured ? <Badge tone="completed">featured</Badge> : <Badge tone="cancelled">standard</Badge>}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Button onClick={() => editPart(part)}>Edit</Button>
                        <Button variant="danger" disabled={actionLoading === `part-${part._id}`} onClick={() => withAction(`part-${part._id}`, () => apiRequest(`/api/parts/${part._id}`, { method: 'DELETE', token }), 'Failed to delete part.')}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </TableShell>
            </div>
            <Pagination page={paginated.currentPage} totalPages={paginated.totalPages} totalItems={parts.length} onPageChange={setPage} />
          </>
        )}
      </Section>
    </div>
  );
}

function PartOrdersPanel({ orders, query, setQuery, orderFilter, setOrderFilter, loadData, page, setPage, actionLoading, withAction, token }) {
  const paginated = paginate(orders, page);

  return (
    <Section
      title="Part Orders"
      description="Review customer parts purchases and update fulfillment status."
      action={<Button variant="dark" onClick={loadData}>Apply Filters</Button>}
    >
      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_220px]">
        <TextInput label="Search orders" leftIcon={Search} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Customer, phone, address, part" />
        <SelectInput label="Status" value={orderFilter} onChange={(event) => setOrderFilter(event.target.value)}>
          <option value="all">All statuses</option>
          {partOrderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </SelectInput>
      </div>

      {orders.length === 0 ? (
        <EmptyState title="No part orders found" description="New customer part orders will appear here." />
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {paginated.items.map((order) => (
              <article key={order._id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.customerName}</p>
                    <p className="mt-1 text-xs text-gray-500">{order.phone}</p>
                  </div>
                  <Badge tone={order.status}>{order.status}</Badge>
                </div>
                <p className="mt-3 text-sm text-gray-600">{order.items.map((item) => `${item.name} x ${item.quantity}`).join(', ')}</p>
                <p className="mt-3 text-sm font-semibold text-gray-900">Rs. {order.total}</p>
                <SelectInput label="Update status" value={order.status} onChange={(event) => withAction(`part-order-${order._id}`, () => apiRequest(`/api/parts-orders/${order._id}/status`, { method: 'PATCH', token, body: { status: event.target.value } }), 'Failed to update part order.')}>
                  {partOrderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </SelectInput>
              </article>
            ))}
          </div>

          <div className="hidden md:block">
            <TableShell columns={['Customer', 'Items', 'Total', 'Fee', 'Refunded', 'Payment', 'Status', 'Actions']}>
              {paginated.items.map((order, index) => (
                <tr key={order._id} className={cx('hover:bg-gray-50', index % 2 ? 'bg-gray-50/40' : 'bg-white')}>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="mt-1 text-sm text-gray-500">{order.userId?.email || order.phone}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-400">{order.address}</p>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{order.items.map((item) => `${item.name} x ${item.quantity}`).join(', ')}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900">Rs. {order.total}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-gray-600">Rs. {Number(order.khaltiFee || 0) / 100}</td>
                  <td className="px-4 py-4"><Badge tone={order.khaltiRefunded ? 'cancelled' : 'completed'}>{order.khaltiRefunded ? 'true' : 'false'}</Badge></td>
                  <td className="px-4 py-4"><Badge tone={order.paymentStatus === 'Completed' ? 'completed' : order.paymentStatus === 'Initiated' || order.paymentStatus === 'Pending' ? 'pending' : 'cancelled'}>{order.paymentStatus || 'Initiated'}</Badge></td>
                  <td className="px-4 py-4"><Badge tone={order.status}>{order.status}</Badge></td>
                  <td className="px-4 py-4">
                    <select
                      value={order.status}
                      disabled={actionLoading === `part-order-${order._id}`}
                      onChange={(event) => withAction(`part-order-${order._id}`, () => apiRequest(`/api/parts-orders/${order._id}/status`, { method: 'PATCH', token, body: { status: event.target.value } }), 'Failed to update part order.')}
                      className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
                    >
                      {partOrderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </TableShell>
          </div>
          <Pagination page={paginated.currentPage} totalPages={paginated.totalPages} totalItems={orders.length} onPageChange={setPage} />
        </>
      )}
    </Section>
  );
}

function UsersPanel({ users, userQuery, setUserQuery, page, setPage, currentUserId, actionLoading, withAction, token }) {
  const paginated = paginate(users, page);

  return (
    <Section title="User Management" description="Search users, review account type, and update roles.">
      <div className="mb-5 max-w-xl">
        <TextInput label="Search users" leftIcon={Search} value={userQuery} onChange={(event) => setUserQuery(event.target.value)} placeholder="Name, email, phone, role" />
      </div>

      {users.length === 0 ? (
        <EmptyState title="No users found" description="Try a different search term." />
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {paginated.items.map((account) => (
              <article key={account._id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={account.role}>{account.role}</Badge>
                  <Badge tone="user">{account.authProvider || 'local'}</Badge>
                </div>
                <h3 className="mt-3 break-words text-sm font-semibold text-gray-900">{account.name}</h3>
                <p className="mt-1 break-all text-xs text-gray-500">{account.email}</p>
                <p className="mt-2 text-xs text-gray-500">Joined: {account.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'Unknown'}</p>
                <div className="mt-3 grid gap-2">
                  <Button
                    className="w-full"
                    disabled={actionLoading === `user-${account._id}`}
                    onClick={() => withAction(`user-${account._id}`, () => apiRequest(`/api/users/${account._id}/role`, { method: 'PATCH', token, body: { role: account.role === 'admin' ? 'user' : 'admin' } }), 'Failed to update user role.')}
                  >
                    Make {account.role === 'admin' ? 'User' : 'Admin'}
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full"
                    disabled={String(account._id) === String(currentUserId) || actionLoading === `user-${account._id}`}
                    onClick={() => withAction(`user-${account._id}`, () => apiRequest(`/api/users/${account._id}`, { method: 'DELETE', token }), 'Failed to delete user.')}
                  >
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden md:block">
            <TableShell columns={['User', 'Role', 'Provider', 'Joined', 'Actions']}>
              {paginated.items.map((account, index) => (
                <tr key={account._id} className={cx('hover:bg-gray-50', index % 2 ? 'bg-gray-50/40' : 'bg-white')}>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{account.name}</p>
                    <p className="mt-1 break-all text-sm text-gray-500">{account.email}</p>
                  </td>
                  <td className="px-4 py-4"><Badge tone={account.role}>{account.role}</Badge></td>
                  <td className="px-4 py-4 text-gray-600">{account.authProvider || 'local'}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-gray-600">{account.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'Unknown'}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        disabled={actionLoading === `user-${account._id}`}
                        onClick={() => withAction(`user-${account._id}`, () => apiRequest(`/api/users/${account._id}/role`, { method: 'PATCH', token, body: { role: account.role === 'admin' ? 'user' : 'admin' } }), 'Failed to update user role.')}
                      >
                        Make {account.role === 'admin' ? 'User' : 'Admin'}
                      </Button>
                      <Button
                        variant="danger"
                        disabled={String(account._id) === String(currentUserId) || actionLoading === `user-${account._id}`}
                        onClick={() => withAction(`user-${account._id}`, () => apiRequest(`/api/users/${account._id}`, { method: 'DELETE', token }), 'Failed to delete user.')}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </TableShell>
          </div>
          <Pagination page={paginated.currentPage} totalPages={paginated.totalPages} totalItems={users.length} onPageChange={setPage} />
        </>
      )}
    </Section>
  );
}

function ReviewsPanel({ reviews, actionLoading, withAction, token, updateReview }) {
  return (
    <Section title="Review Moderation" description="Approve or reject customer testimonials.">
      {reviews.length === 0 ? (
        <EmptyState title="No reviews found" description="Customer reviews will appear here." />
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => {
            const status = getReviewStatus(review);
            const statusLabel = getReviewStatusLabel(status);
            const isBusy = actionLoading === `review-${review._id}`;
            return (
              <article key={review._id} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="admin">{review.name}</Badge>
                      <Badge tone={statusLabel}>{statusLabel}</Badge>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-700">&quot;{review.message}&quot;</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-400">Rating: {review.rating}/5</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="primary"
                      disabled={isBusy || status === 'approved'}
                      onClick={() => withAction(
                        `review-${review._id}`,
                        () => apiRequest(`/api/reviews/${review._id}/approve`, { method: 'PATCH', token }),
                        'Failed to approve review.',
                        updateReview
                      )}
                    >
                      {status === 'approved' ? 'Accepted' : 'Accept'}
                    </Button>
                    <Button
                      variant="danger"
                      disabled={isBusy || status === 'rejected'}
                      onClick={() => withAction(
                        `review-${review._id}`,
                        () => apiRequest(`/api/reviews/${review._id}/reject`, { method: 'PATCH', token }),
                        'Failed to reject review.',
                        updateReview
                      )}
                    >
                      {status === 'rejected' ? 'Rejected' : 'Reject'}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Section>
  );
}

function MessagesPanel({ messages, actionLoading, withAction, token }) {
  return (
    <Section title="Contact Messages" description="Read, mark, and remove customer inquiries.">
      {messages.length === 0 ? (
        <EmptyState title="No contact messages" description="Messages from the contact page will appear here." />
      ) : (
        <div className="grid gap-4">
          {messages.map((message) => (
            <article key={message._id} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="admin">{message.name}</Badge>
                    <Badge tone={message.status}>{message.status}</Badge>
                  </div>
                  <p className="mt-3 break-all text-sm text-gray-600">{message.email}</p>
                  {message.subject ? <p className="mt-1 text-sm font-medium text-gray-900">{message.subject}</p> : null}
                  <p className="mt-2 text-sm leading-6 text-gray-700">{message.message}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button disabled={actionLoading === `message-${message._id}`} onClick={() => withAction(`message-${message._id}`, () => apiRequest(`/api/contact/${message._id}/${message.status === 'read' ? 'unread' : 'read'}`, { method: 'PATCH', token }), 'Failed to update message.')}>
                    {message.status === 'read' ? 'Mark Unread' : 'Mark Read'}
                  </Button>
                  <Button variant="danger" disabled={actionLoading === `message-${message._id}`} onClick={() => withAction(`message-${message._id}`, () => apiRequest(`/api/contact/${message._id}`, { method: 'DELETE', token }), 'Failed to delete message.')}>Delete</Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}

function SettingsPanel() {
  return (
    <Section title="Settings" description="Operational notes for this dashboard.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h3 className="font-semibold text-gray-900">Authentication</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">Manual JWT and Clerk sessions are both supported. Admin access is controlled by the MongoDB user role.</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h3 className="font-semibold text-gray-900">Catalog</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">Services and parts can be updated here. Customer pages read from the same backend APIs.</p>
        </div>
      </div>
    </Section>
  );
}

function BookingDialog({ booking, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-600">Booking Details</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900">{booking.serviceName}</h2>
          </div>
          <Button variant="ghost" onClick={onClose} aria-label="Close booking details">
            <X size={18} />
          </Button>
        </div>
        <dl className="grid gap-4 px-6 py-5 text-sm">
          <div>
            <dt className="font-medium text-gray-500">Customer</dt>
            <dd className="mt-1 text-gray-900">{booking.userId?.name || 'Unknown'} - {booking.userId?.email || 'No email'}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Vehicle</dt>
            <dd className="mt-1 text-gray-900">{booking.vehicleModel}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Schedule</dt>
            <dd className="mt-1 text-gray-900">{booking.date} at {booking.time}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Status</dt>
            <dd className="mt-1"><Badge tone={booking.status}>{booking.status}</Badge></dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Notes</dt>
            <dd className="mt-1 text-gray-900">{booking.notes || 'No notes'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
