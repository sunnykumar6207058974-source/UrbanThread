import React from 'react';
import { REVIEWS } from '../data/ecommerceData';
import { Star, CheckCircle, MessageSquareQuote, ThumbsUp } from 'lucide-react';

export const CustomerReviews = () => {
  return (
    <section className="section-container reviews-section">
      <div className="section-header text-center">
        <div className="section-tag center-tag">
          <MessageSquareQuote size={16} color="#ff3f6c" /> REVIEWS & TESTIMONIALS
        </div>
        <h2 className="section-title">What Our Customers Say</h2>
        <p className="section-description">
          Real reviews from verified shoppers. Rated 4.9/5 stars based on 45,000+ purchases.
        </p>
      </div>

      <div className="reviews-grid">
        {REVIEWS.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="reviewer-profile">
                <img src={review.avatar} alt={review.name} className="reviewer-img" />
                <div>
                  <h4 className="reviewer-name">{review.name}</h4>
                  <span className="reviewer-location">{review.location}</span>
                </div>
              </div>
              <span className="verified-badge">
                <CheckCircle size={14} /> Verified Buyer
              </span>
            </div>

            <div className="review-stars">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={16} fill="#ffb400" color="#ffb400" />
              ))}
              <span className="review-date">{review.date}</span>
            </div>

            <p className="review-comment">"{review.comment}"</p>

            <div className="review-product-tag">
              <span>Item purchased:</span> <strong>{review.product}</strong>
            </div>

            <div className="review-footer">
              <button className="helpful-btn">
                <ThumbsUp size={14} /> Helpful (24)
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
