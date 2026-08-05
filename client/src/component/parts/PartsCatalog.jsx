import { useEffect, useState } from 'react'
import { Minus, Plus, Search, ShoppingCart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../lib/api'
import { useAuth } from '../../context/useAuth'

const PartsCatalog = () => {
  const { isAuthenticated, user, token } = useAuth()
  const [query, setQuery] = useState('')
  const [parts, setParts] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [checkoutError, setCheckoutError] = useState('')
  const [checkoutSuccess, setCheckoutSuccess] = useState('')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [checkout, setCheckout] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    notes: '',
  })

  const isCustomer = isAuthenticated && String(user?.role || 'user').toLowerCase() === 'user'

  useEffect(() => {
    let alive = true
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true)
        setError('')
        const params = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''
        const data = await apiRequest(`/api/parts${params}`)
        if (alive) setParts(Array.isArray(data) ? data : [])
      } catch (requestError) {
        if (alive) setError(requestError.message || 'Failed to load parts.')
      } finally {
        if (alive) setLoading(false)
      }
    }, 250)

    return () => {
      alive = false
      window.clearTimeout(timer)
    }
  }, [query])

  useEffect(() => {
    setCheckout((current) => ({
      ...current,
      customerName: current.customerName || user?.name || '',
      phone: current.phone || user?.phone || '',
    }))
  }, [user?.name, user?.phone])

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = (part) => {
    if (!isCustomer || part.stock < 1) return
    setCheckoutError('')
    setCheckoutSuccess('')
    setCart((current) => {
      const existing = current.find((item) => item.partId === part._id)
      if (existing) {
        return current.map((item) =>
          item.partId === part._id
            ? { ...item, quantity: Math.min(item.quantity + 1, part.stock) }
            : item
        )
      }

      return [
        ...current,
        {
          partId: part._id,
          name: part.name,
          price: part.price,
          stock: part.stock,
          imageUrl: part.imageUrl,
          quantity: 1,
        },
      ]
    })
  }

  const updateQuantity = (partId, nextQuantity) => {
    setCheckoutError('')
    setCheckoutSuccess('')
    setCart((current) =>
      current
        .map((item) => (
          item.partId === partId
            ? { ...item, quantity: Math.max(0, Math.min(nextQuantity, item.stock)) }
            : item
        ))
        .filter((item) => item.quantity > 0)
    )
  }

  const submitOrder = async (event) => {
    event.preventDefault()
    setCheckoutError('')
    setCheckoutSuccess('')

    if (!isCustomer) {
      setCheckoutError('Please login with a customer account to buy parts.')
      return
    }

    if (cart.length === 0) {
      setCheckoutError('Your cart is empty.')
      return
    }

    if (!checkout.customerName.trim() || !checkout.phone.trim() || !checkout.address.trim()) {
      setCheckoutError('Name, phone and delivery address are required.')
      return
    }

    try {
      setPlacingOrder(true)
      const data = await apiRequest('/api/parts-orders', {
        method: 'POST',
        token,
        body: {
          ...checkout,
          returnUrl: `${window.location.origin}/payment/khalti-return`,
          items: cart.map((item) => ({ partId: item.partId, quantity: item.quantity })),
        },
      })

      if (!data?.payment_url) {
        throw new Error('Khalti payment URL was not returned.')
      }

      window.location.assign(data.payment_url)
    } catch (requestError) {
      setCheckoutError(requestError.message || 'Failed to place order.')
    } finally {
      setPlacingOrder(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-6 sm:px-6 sm:pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parts Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">Find the right parts for your vehicle</p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
          <ShoppingCart size={16} />
          <span>{cartCount} item{cartCount === 1 ? '' : 's'}</span>
        </div>
      </div>

      <div className="relative mt-4 w-full">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by vehicle model, part, or brand"
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-300 shadow-sm"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          {loading ? (
            <p className="text-sm text-slate-500">Loading parts...</p>
          ) : error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          ) : parts.length === 0 ? (
            <p className="text-sm text-slate-500">No matching parts found.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {parts.map((part) => {
                const quantityInCart = cart.find((item) => item.partId === part._id)?.quantity || 0
                const isOutOfStock = part.stock < 1

                return (
                  <article key={part._id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    {part.imageUrl ? (
                      <div className="mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                        <img src={part.imageUrl} alt={part.name} className="h-full w-full object-cover" />
                      </div>
                    ) : null}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-blue-600">{part.category}</p>
                        <h2 className="mt-2 text-base font-semibold text-gray-900">{part.name}</h2>
                      </div>
                      {part.featured ? <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">Featured</span> : null}
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{part.brand || 'Generic'} {part.vehicleModel ? `- ${part.vehicleModel}` : ''}</p>
                    {part.description ? <p className="mt-2 text-sm text-slate-600">{part.description}</p> : null}
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-900">Rs. {part.price}</span>
                      <span className={isOutOfStock ? 'text-red-600' : 'text-slate-500'}>Stock: {part.stock}</span>
                    </div>
                    <button
                      type="button"
                      disabled={!isCustomer || isOutOfStock || quantityInCart >= part.stock}
                      onClick={() => addToCart(part)}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      <ShoppingCart size={16} />
                      {isOutOfStock ? 'Out of Stock' : quantityInCart > 0 ? `Add More (${quantityInCart})` : 'Add to Cart'}
                    </button>
                  </article>
                )
              })}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-gray-900">Cart</h2>
            <span className="text-sm font-medium text-gray-600">Rs. {cartTotal}</span>
          </div>

          {!isAuthenticated ? (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <p>Login to buy parts.</p>
              <Link to="/login" className="mt-2 inline-flex font-semibold text-amber-900 underline underline-offset-4">Login</Link>
            </div>
          ) : !isCustomer ? (
            <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              Admin accounts can manage parts, but only customer accounts can buy them.
            </p>
          ) : cart.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">Your cart is empty.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {cart.map((item) => (
                <div key={item.partId} className="rounded-lg border border-gray-100 bg-slate-50 p-3">
                  <div className="flex gap-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-14 w-14 rounded-md object-cover" />
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">Rs. {item.price} each</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white">
                      <button type="button" onClick={() => updateQuantity(item.partId, item.quantity - 1)} className="p-2 text-gray-600 hover:text-gray-900" aria-label="Decrease quantity">
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.partId, item.quantity + 1)} className="p-2 text-gray-600 hover:text-gray-900" aria-label="Increase quantity">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button type="button" onClick={() => updateQuantity(item.partId, 0)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label="Remove item">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isCustomer && cart.length > 0 ? (
            <form className="mt-5 space-y-3" onSubmit={submitOrder}>
              <input
                type="text"
                value={checkout.customerName}
                onChange={(event) => setCheckout((current) => ({ ...current, customerName: event.target.value }))}
                placeholder="Full name"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <input
                type="tel"
                value={checkout.phone}
                onChange={(event) => setCheckout((current) => ({ ...current, phone: event.target.value }))}
                placeholder="Phone number"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <textarea
                value={checkout.address}
                onChange={(event) => setCheckout((current) => ({ ...current, address: event.target.value }))}
                placeholder="Delivery address"
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <textarea
                value={checkout.notes}
                onChange={(event) => setCheckout((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Notes"
                rows={2}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              {checkoutError ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{checkoutError}</p> : null}
              {checkoutSuccess ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{checkoutSuccess}</p> : null}
              <button
                type="submit"
                disabled={placingOrder}
                className="w-full rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {placingOrder ? 'Opening Khalti...' : 'Pay with Khalti'}
              </button>
            </form>
          ) : checkoutSuccess ? (
            <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{checkoutSuccess}</p>
          ) : null}
        </aside>
      </div>
    </div>
  )
}

export default PartsCatalog
