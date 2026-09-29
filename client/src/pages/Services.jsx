import React from 'react'
import Navbar from '../component/layout/Navbar'
import OurServices from '../component/services/OurServices'
import RepairServices from '../component/services/RepairServices'
import MaintenanceServices from '../component/services/MaintenanceServices'
import AdditionalServices from '../component/services/AdditionalServices'
import Footer from '../component/layout/Footer'

const Services = () => {
  return (
    <div>
      <Navbar />
      <OurServices />
      <RepairServices />
      <MaintenanceServices />
      <AdditionalServices />
      <Footer />
    </div>
  )
}

export default Services
