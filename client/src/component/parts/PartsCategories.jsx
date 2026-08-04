import React from 'react'
import Engine from "../../assets/parts/engine.jpg"
import BrakeSystem from "../../assets/parts/BrakeSystem.jpg"
import Suspension from "../../assets/parts/Suspension.jpg"
import ElectricalComponent from "../../assets/parts/ElectricalComponent.jpg"
import BodyParts from "../../assets/parts/BodyParts.jpg"
import Accessories from "../../assets/parts/Acceseries.jpg"

const categories = [
  { id: 1, name: 'Engine Parts',          image: Engine },
  { id: 2, name: 'Brake System',          image: BrakeSystem },
  { id: 3, name: 'Suspension',            image: Suspension },
  { id: 4, name: 'Electrical Components', image: ElectricalComponent },
  { id: 5, name: 'Body Parts',            image: BodyParts },
  { id: 6, name: 'Accessories',           image: Accessories },
]

const PartsCategories = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 pb-10 sm:px-6">
      <h2 className="text-base font-bold text-gray-900 mb-4">Categories</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((cat) => (
          <div key={cat.id} className="flex min-w-0 flex-col items-start cursor-pointer group">
            <div className="w-full aspect-square bg-gray-100 rounded-xl mb-2 overflow-hidden group-hover:opacity-90 transition-opacity duration-200 sm:rounded-2xl">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs sm:text-sm text-gray-700 leading-snug">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PartsCategories
