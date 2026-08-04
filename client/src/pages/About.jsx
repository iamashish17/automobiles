import React from 'react'
import Navbar from '../component/layout/Navbar'
import HeroSection from '../component/about/HeroSection'
import Mission from '../component/about/Mission'
import Team from '../component/about/Team'
import Aboutfooter from '../component/about/Aboutfooter'

const About = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Mission />
      <Team />
      <Aboutfooter />
    </div>
  )
}

export default About
