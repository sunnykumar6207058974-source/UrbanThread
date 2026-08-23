import React from 'react';
import { CATEGORIES } from '../data/ecommerceData';
import { useEcommerce } from '../context/EcommerceContext';
import { ArrowRight, Flame } from 'lucide-react';

export const TrendingCategories = () => {
  const { selectedCategory, setSelectedCategory } = useEcommerce();

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section-container" id="categories">
      <div className="section-header">
        <div>
          <div className="section-tag">
            <Flame size={16} color="#ff3f6c" /> TOP CATEGORIES
          </div>
          <h2 className="section-title">Shop By Category</h2>
        </div>
        <p className="section-description">
          Explore millions of trendsetting fashion pieces, kicks & flagship electronics.
        </p>
      </div>

      <div className="categories-grid">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className={`category-card ${
              (cat.targetCategory && selectedCategory.toLowerCase() === cat.targetCategory.toLowerCase()) ||
              selectedCategory.toLowerCase() === cat.id.toLowerCase()
                ? 'selected'
                : ''
            }`}
            onClick={() => handleCategoryClick(cat.targetCategory || cat.name.split("'")[0])}
          >
            <div className="category-image-box">
              <img src={cat.image} alt={cat.name} className="category-img" loading="lazy" />
              <div className="category-overlay" />
              <span className="category-tag-badge">{cat.tag}</span>
            </div>
            <div className="category-info">
              <h3 className="category-name">{cat.name}</h3>
              <p className="category-count">{cat.itemCount}</p>
              <span className="category-cta">
                Shop Now <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
