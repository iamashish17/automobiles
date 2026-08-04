import React from 'react'
import History from "/src/assets/about/history.png"

const HeroSection = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">

      <h1 className="text-2xl font-bold text-gray-900 pt-6 pb-7 sm:text-3xl">
        About New Purnagiri Automobiles
      </h1>

      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-2">Our History</h2>

        <p className="text-sm text-gray-600 leading-relaxed">
          Founded in 2005, New Purnagiri Automobiles began as a small auto parts store in the heart
          of the city. Over the years, we've grown into a leading provider of high-quality automobile
          parts and expert repair services. Our commitment to customer satisfaction and our deep
          knowledge of the automotive industry have been the cornerstones of our success.
        </p>
      </div>

<div className="w-full h-80 overflow-hidden sm:h-110 lg:h-150">
  <img
    src={History}
    alt="History Image"
    className="w-full h-full object-cover"
  />
</div>

    </div>
  )
}

export default HeroSection
