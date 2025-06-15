import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories/FeaturedCategories';
import WeeklyBestsellers from '../components/Products/WeeklyBestsellers';
import MostLoved from '../components/Products/MostLoved';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <WeeklyBestsellers />
      <MostLoved />
      <Testimonials />
      <Newsletter />
    </div>
  );
} 