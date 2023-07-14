import Image from 'next/image'

import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className='gradient-bg-one'>
        
        <Hero/>
      </div>
      <About/>
      <Footer/>
    </main>
  )
}
