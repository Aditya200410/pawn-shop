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
      console.log('Carousel data received:', data); // Debug log
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

  const renderCarouselItem = (item) => {
    const mediaUrl = config.fixImageUrl(item.image); // Changed from mediaUrl to image
    const isVideo = mediaUrl.toLowerCase().endsWith('.mp4');

    return (
      <div key={item.id} className="carousel-item"> {/* Changed from _id to id */}
        {isVideo ? (
          <video
            className="carousel-media"
            autoPlay
            loop
            muted
            playsInline
            onError={handleMediaError}
          >
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={mediaUrl}
            alt={item.title || 'Carousel item'}
            className="carousel-media"
            onError={handleMediaError}
          />
        )}
        <div className="carousel-content">
          <h2>{item.title}</h2>
          {item.subtitle && <h3>{item.subtitle}</h3>}
          {item.description && <p>{item.description}</p>}
          {item.buttonText && (
            <a href={item.buttonLink || '/shop'} className="carousel-button">
              {item.buttonText}
            </a>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="carousel-loading">Loading...</div>;
  }

  if (error) {
    return <div className="carousel-error">{error}</div>;
  }

  if (!carouselData.length) {
    return null;
  }

  return (
    <div className="hero-section">
      <Carousel
        showArrows={true}
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
        stopOnHover={true}
        swipeable={true}
        emulateTouch={true}
        dynamicHeight={false}
        className="main-carousel"
      >
        {carouselData.map(renderCarouselItem)}
      </Carousel>
    </div>
  );
};

export default Hero; 