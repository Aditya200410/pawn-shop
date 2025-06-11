import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Categories from './components/Categories/Categories';
import FeaturedProducts from './components/Products/FeaturedProducts';
import Testimonials from './components/Testimonials/Testimonials';
import Footer from './components/Footer/Footer';
import MissionVision from './components/MissionVision/MissionVision';
import FAQ from './components/FAQ/FAQ';
import Story from './pages/Story';
import ContactPage from './pages/ContactPage';
import Shop from './pages/Shop';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={
            <main>
              <Hero />
              <Categories />
              <FeaturedProducts />
              <Testimonials />
              <MissionVision />
            </main>
          } />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/story" element={<Story />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
