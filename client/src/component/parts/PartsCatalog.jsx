import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { apiRequest } from '../../lib/api'

const PartsCatalog = () => {
  const [query, setQuery] = useState('')
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <div className="max-w-6xl mx-auto px-4 pt-8 pb-6 sm:px-6 sm:pt-10 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Parts Catalog</h1>
      <p className="text-sm text-slate-500 mt-1">Find the right parts for your vehicle</p>

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

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-slate-500">Loading parts...</p>
        ) : error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : parts.length === 0 ? (
          <p className="text-sm text-slate-500">No matching parts found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {parts.map((part) => (
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
                  <span className="text-slate-500">Stock: {part.stock}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PartsCatalog
