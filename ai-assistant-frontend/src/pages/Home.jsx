import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Pricing from '../components/landing/Pricing';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import Newsletter from '../components/landing/Newsletter';
import CTAStrip from '../components/landing/CTAStrip';
import Footer from '../components/landing/Footer';

const Home = () => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.reveal'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Sections are rendered via dedicated components with IDs for smooth scrolling

  return (
    <div className="min-h-screen">
      <Hero isAuthenticated={isAuthenticated} />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <CTAStrip isAuthenticated={isAuthenticated} />
      <Footer />
    </div>
  );
};

export default Home;
