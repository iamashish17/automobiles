import { useEffect, useState } from 'react'
import HighEngine from "../../assets/parts/HighEngine.jpg"
import BrakePremium from "../../assets/parts/BrakePremium.jpg"
import SuspensionKit from "../../assets/parts/SuspensionKit.jpg"
import Headlight from "../../assets/parts/HeadLight.jpg"
import { apiRequest } from '../../lib/api'

const fallbackFeaturedParts = [
  { id: 1, name: 'High-Performance Engine Block', description: "Enhance your engine's power and efficiency", image: HighEngine },
  { id: 2, name: 'Premium Brake Pads', description: 'Ensure safe and reliable braking', image: BrakePremium },
  { id: 3, name: 'Adjustable Suspension Kit', description: 'Improve handling and comfort', image: SuspensionKit},
  { id: 4, name: 'LED Headlight Assembly', description: "Upgrade your vehicle's light", image: Headlight },
]

const normalizePart = (part) => ({
  id: part._id || part.id,
  name: part.name,
  description: part.description || `${part.brand || 'Quality'} ${part.category || 'part'}`,
  image: part.imageUrl,
})

const FeaturedParts = () => {
  const [featuredParts, setFeaturedParts] = useState(fallbackFeaturedParts)

  useEffect(() => {
    let alive = true

    const loadFeaturedParts = async () => {
      try {
        const data = await apiRequest('/api/parts?featured=true')
        const nextParts = Array.isArray(data)
          ? data.filter((part) => part.imageUrl).slice(0, 4).map(normalizePart)
          : []

        if (alive && nextParts.length > 0) {
          setFeaturedParts(nextParts)
        }
      } catch {
        if (alive) setFeaturedParts(fallbackFeaturedParts)
      }
    }

    loadFeaturedParts()

    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 pb-2 sm:px-6 lg:px-8">
      <h2 className="text-base font-bold text-gray-900 mb-4">Featured Parts</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {featuredParts.map((part) => (
          <div key={part.id} className="flex flex-col cursor-pointer group">
            <div className="w-full aspect-square bg-gray-100 rounded-2xl mb-2 overflow-hidden group-hover:opacity-90 transition-opacity duration-200">
              <img src={part.image} alt={part.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-medium text-gray-900 leading-tight">{part.name}</span>
            <span className="text-xs text-gray-400 mt-0.5 leading-tight">{part.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeaturedParts;
