import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareText, Star } from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../context/useAuth';

const StarIcon = ({ filled }) => (
  <Star
    size={16}
    className={filled ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-300'}
  />
);

const RatingStars = ({ rating }) => (
  <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <StarIcon key={n} filled={n <= Math.floor(rating)} />
    ))}
  </div>
);

const InteractiveStars = ({ value, onChange }) => (
  <div className="flex gap-1.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className="rounded-md p-1 transition hover:bg-amber-50"
        aria-label={`Rate ${n} star${n === 1 ? '' : 's'}`}
      >
        <StarIcon filled={n <= value} />
      </button>
    ))}
  </div>
);

const normalizeReview = (review) => ({
  id: review._id || review.id,
  name: review.name,
  date: review.createdAt || review.date,
  rating: review.rating,
  text: review.message || review.text,
  approved: review.approved,
});

const Testimonial = () => {
  const { isAuthenticated, token, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newReview, setNewReview] = useState({
    name: '',
    text: '',
    rating: 0,
  });

  const fetchReviewsPage = async (nextPage, { append = false } = {}) => {
    const data = await apiRequest(`/api/reviews/approved?page=${nextPage}&limit=3`);
    const nextReviews = Array.isArray(data?.reviews) ? data.reviews.map(normalizeReview) : [];

    setReviews((current) => (append ? [...current, ...nextReviews] : nextReviews));
    setPage(data?.page || nextPage);
    setHasMore(Boolean(data?.hasMore));
  };

  useEffect(() => {
    let alive = true;

    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/api/reviews/approved?page=1&limit=3');
        if (!alive) return;
        const firstPage = Array.isArray(data?.reviews) ? data.reviews.map(normalizeReview) : [];
        setReviews(firstPage);
        setPage(data?.page || 1);
        setHasMore(Boolean(data?.hasMore));
      } catch (requestError) {
        if (!alive) return;
        setError(requestError.message || 'Failed to load testimonials.');
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadReviews();

    return () => {
      alive = false;
    };
  }, []);

  const openForm = () => {
    if (!isAuthenticated) return;

    setNewReview({
      name: user?.name || '',
      text: '',
      rating: 0,
    });
    setIsFormOpen((current) => !current);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newReview.name.trim()) {
      setError('Name is required.');
      return;
    }

    if (!newReview.text.trim()) {
      setError('Please write your testimonial.');
      return;
    }

    if (newReview.rating === 0) {
      setError('Please choose a star rating.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      await apiRequest('/api/reviews', {
        method: 'POST',
        token,
        body: {
          name: newReview.name,
          rating: newReview.rating,
          message: newReview.text,
        },
      });

      setNewReview({ name: user?.name || '', text: '', rating: 0 });
      setIsFormOpen(false);
      setSuccess('Thank you. Your testimonial was submitted and is waiting for approval.');
    } catch (requestError) {
      setError(requestError.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeeMore = async () => {
    if (!hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      await fetchReviewsPage(page + 1, { append: true });
    } catch (requestError) {
      setError(requestError.message || 'Failed to load more testimonials.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <section className="w-full bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Customer Testimonials
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Real stories from customers who trust us.
            </p>
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={openForm}
              className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
            >
              {isFormOpen ? 'Cancel' : 'Share Experience'}
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
            >
              Login to Share
            </Link>
          )}
        </header>

        {!isAuthenticated && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            Login is required to submit a testimonial. Approved customer stories are shown below.
          </div>
        )}

        {success ? (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        ) : null}

        {isAuthenticated && isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm sm:p-5"
          >
            <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-gray-500">Your Name</label>
                <input
                  required
                  placeholder="Full name"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-gray-500">Rating</label>
                  <InteractiveStars
                    value={newReview.rating}
                    onChange={(v) => setNewReview({ ...newReview, rating: v })}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-gray-500">Testimonial</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Write about your experience"
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {error ? (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <div className="mt-4 grid gap-2 sm:flex sm:justify-end">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="min-h-10 rounded-md border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Discard
              </button>

              <button
                disabled={submitting}
                className="min-h-10 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Loading testimonials...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((rev) => (
              <article
                key={rev.id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-50 text-sm font-bold text-blue-700">
                    {rev.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="break-words text-sm font-semibold text-gray-900">{rev.name}</h3>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {new Date(rev.date).toDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <RatingStars rating={rev.rating} />
                  {rev.rating >= 4 ? (
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">Verified</span>
                  ) : null}
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-600">&quot;{rev.text}&quot;</p>
              </article>
            ))}

            {hasMore && (
              <div className="flex justify-center pt-2 md:col-span-2 lg:col-span-3">
                <button
                  type="button"
                  onClick={handleSeeMore}
                  disabled={isLoadingMore}
                  className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoadingMore ? 'Loading...' : 'See More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonial;
