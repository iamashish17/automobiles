import Navbar from '../component/layout/Navbar'
import Footer from '../component/layout/Footer'
import ServiceBooking from '../component/services/ServiceBooking'

const ServiceBookingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-6 sm:py-8 lg:py-10">
        <ServiceBooking />
      </main>
      <Footer />
    </div>
  )
}

export default ServiceBookingPage
