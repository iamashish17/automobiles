import React from 'react'
import Navbar from '../component/layout/Navbar'
import HeroSection from '../component/about/HeroSection'
import Mission from '../component/about/Mission'
import Team from '../component/about/Team'
import Footer from '../component/layout/Footer'

const About = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Mission />
      <Team />
      <Footer />
    </div>
  )
}

export default About
