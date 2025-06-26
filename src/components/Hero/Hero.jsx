import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import config from '../../config/config';
import './Hero.css';

const Hero = () => {
  const [carouselData, setCarouselData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCarouselData();
  }, []);

  const fetchCarouselData = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/hero-carousel/active`);
      if (!response.ok) throw new Error('Failed to fetch carousel data');
      const data = await response.json();
      console.log('Carousel data received:', data);
      setCarouselData(data);
    } catch (err) {
      console.error('Error fetching carousel data:', err);
      setError('Failed to load carousel content');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaError = (e) => {
    console.error('Media loading error:', e);
    e.target.style.display = 'none';
    const fallbackText = document.createElement('div');
    fallbackText.className = 'media-error';
    fallbackText.textContent = 'Media unavailable';
    e.target.parentNode.appendChild(fallbackText);
  };

  if (loading) {
    return (
      <div className="hero-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!carouselData || carouselData.length === 0) {
    return (
      <div className="hero-empty">
        <p>No carousel items available</p>
      </div>
    );
  }

  return (
    <div className="hero-section">
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showThumbs={false}
        interval={5000}
        transitionTime={500}
        stopOnHover={true}
        dynamicHeight={false}
        className="hero-carousel"
      >
        {carouselData.map((item) => (
          <div key={item._id} className="carousel-item">
            {item.image.endsWith('.mp4') ? (
              <video
                className="carousel-media"
                autoPlay
                loop
                muted
                playsInline
                onError={handleMediaError}
              >
                <source src={item.image} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={item.image}
                alt={item.title}
                className="carousel-media"
                onError={handleMediaError}
              />
            )}
            <div className="carousel-content">
              <h2 className="carousel-title">{item.title}</h2>
              {item.subtitle && (
                <h3 className="carousel-subtitle">{item.subtitle}</h3>
              )}
              {item.description && (
                <p className="carousel-description">{item.description}</p>
              )}
              <a href={item.buttonLink} className="carousel-button">
                {item.buttonText}
              </a>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Hero; 