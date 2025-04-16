import React from "react";

import HeroCarousel from "./HeroCarousel";            // 🔥 Новый компонент

import FeaturedProducts from "./FeaturedProducts";
import Benefits from "./Benefits";
import Promotions from "./Promotions";
import Testimonials from "./Testimonials";
import LatestNews from "./LatestNews";

const Home = () => {
  return (
    <div className="home-page">
      <section id="hero-carousel">
        <HeroCarousel />
      </section>
      
      <section id="featured-products">
        <FeaturedProducts />
      </section>

      <section id="benefits">
        <Benefits />
      </section>

      <section id="promotions">
        <Promotions />
      </section>

      <section id="testimonials">
        <Testimonials />
      </section>

      <section id="latest-news">
        <LatestNews />
      </section>
    </div>
  );
};

export default Home;
