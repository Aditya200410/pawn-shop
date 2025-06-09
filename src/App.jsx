import { motion } from 'framer-motion';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Categories from './components/Categories/Categories';
import FeaturedProducts from './components/Products/FeaturedProducts';
import Testimonials from './components/Testimonials/Testimonials';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

export default App;
