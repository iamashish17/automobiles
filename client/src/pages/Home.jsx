import React from 'react'
import Navbar from '../component/layout/Navbar'
import Hero from '../component/home/Hero'
import Services from '../component/home/Services'
import Testimonials from '../component/home/Testimonials'
import Contact from '../component/home/Contact'
import Footer from '../component/layout/Footer'
import PartsSection from '../component/home/PartsSection'

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <PartsSection />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}

export default Home;
