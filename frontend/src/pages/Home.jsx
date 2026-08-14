
/**
 * LUXDRIVE — Home Page (Landing Page)
 *
 * Composes all landing page sections in order.
 * Route: "/" — register in src/App.jsx as shown below.
 *
 * App.jsx addition needed:
 *   import Home from '@/pages/Home';
 *   <Route path="/" element={<Home />} />
 */

import Navbar from '@/components/layout/Navbar';
import Hero   from '@/components/sections/Hero';
import About  from '@/components/sections/About';

export default function Home() {
    return (
    <>
      {/* Fixed navigation — overlays the Hero section */}
        <Navbar />

      {/* Page sections — add new sections below as phases progress */}
        <main id="main-content">
        <Hero />
        <About />
        {/* <FeaturedVehicles /> */}
        {/* <HowItWorks />      */}
        {/* <Services />        */}
        {/* <Testimonials />    */}
        {/* <FAQ />             */}
        {/* <Footer />          */}
        </main>
    </>
    );
}
