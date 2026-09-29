import Navbar from '../component/layout/Navbar'
import ContactUs from '../component/contact/ContactUs'
import ContactMap from '../component/contact/ContactMap'
import ContactInfo from '../component/contact/ContactInfo'
import Message from '../component/contact/Message'
import Footer from '../component/layout/Footer'

const Contact = () => {
  return (
    <div>
      <Navbar />
      <ContactUs />
      <ContactInfo />
      <section className="mx-auto grid max-w-6xl items-stretch gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
        <ContactMap />
        <Message />
      </section>
      <Footer />
    </div>
  )
}

export default Contact
