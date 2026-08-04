import React from 'react'
import Navbar from '../component/layout/Navbar'
import ContactUs from '../component/contact/ContactUs'
import ContactMap from '../component/contact/ContactMap'
import ContactInfo from '../component/contact/ContactInfo'
import Message from '../component/contact/Message'

const Contact = () => {
  return (
    <div>
      <Navbar />
      <ContactUs />
      <ContactInfo />
      <ContactMap />
      <Message />
    </div>
  )
}

export default Contact
