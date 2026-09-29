import React from 'react'
import Navbar from '../component/layout/Navbar'
import PartsCatalog from '../component/parts/PartsCatalog'
import PartsCategories from '../component/parts/PartsCategories'
import FeaturesParts from '../component/parts/FeaturesParts'
import Footer from '../component/layout/Footer'

const Parts = () => {
  return (
    <div>
        <Navbar />
        <PartsCatalog />
        <PartsCategories />
        <FeaturesParts />
        <Footer />
    </div>
  )
}

export default Parts
