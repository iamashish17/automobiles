import React from 'react'
import Navbar from '../component/layout/Navbar'
import PartsCatalog from '../component/parts/PartsCatalog'
import PartsCategories from '../component/parts/PartsCategories'
import FeaturesParts from '../component/parts/FeaturesParts'
import Aboutfooter from '../component/about/Aboutfooter'

const Parts = () => {
  return (
    <div>
        <Navbar />
        <PartsCatalog />
        <PartsCategories />
        <FeaturesParts />
        <Aboutfooter />
    </div>
  )
}

export default Parts
