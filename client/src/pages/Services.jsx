import React from 'react'
import Navbar from '../component/layout/Navbar'
import OurServices from '../component/services/OurServices'
import RepairServices from '../component/services/RepairServices'
import MaintenanceServices from '../component/services/MaintenanceServices'
import AdditionalServices from '../component/services/AdditionalServices'
import ServicesFooter from '../component/services/ServicesFooter'

const Services = () => {
  return (
    <div>
      <Navbar />
      <OurServices />
      <RepairServices />
      <MaintenanceServices />
      <AdditionalServices />
      <ServicesFooter />
    </div>
  )
}

export default Services
