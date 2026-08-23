import React from 'react';

export const ProductSkeleton = ({ count = 8 }) => {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="product-card skeleton-card">
          <div className="skeleton-media shimmer" />
          <div className="card-body">
            <div className="skeleton-line skeleton-brand shimmer" />
            <div className="skeleton-line skeleton-title shimmer" />
            <div className="skeleton-line skeleton-price shimmer" />
            <div className="skeleton-button shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
};
