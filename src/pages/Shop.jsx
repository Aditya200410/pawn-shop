import { useState, useEffect } from 'react';
import { Slider } from '@mui/material';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 400]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState(16);

  useEffect(() => {
    filterProducts();
  }, [priceRange, selectedCategories, sortBy, viewMode]);

  const filterProducts = () => {
    let filtered = [...products];

    // Price filter
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.some(cat => 
          product.category === cat.main || 
          (cat.sub && product.subcategory === cat.sub) ||
          (cat.item && product.item === cat.item)
        )
      );
    }

    // Sorting
    switch (sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'latest':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredProducts(viewMode === -1 ? filtered : filtered.slice(0, viewMode));
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleCategoryChange = (main, sub = null, item = null) => {
    const categoryKey = JSON.stringify({ main, sub, item });
    setSelectedCategories(prev => {
      const exists = prev.some(cat => 
        JSON.stringify({ main: cat.main, sub: cat.sub, item: cat.item }) === categoryKey
      );
      if (exists) {
        return prev.filter(cat => 
          JSON.stringify({ main: cat.main, sub: cat.sub, item: cat.item }) !== categoryKey
        );
      }
      return [...prev, { main, sub, item }];
    });
  };

  const isSelected = (main, sub = null, item = null) => {
    return selectedCategories.some(cat => 
      cat.main === main && 
      cat.sub === sub && 
      cat.item === item
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Filter by Price</h3>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={400}
              className="text-primary"
            />
            <div className="flex justify-between mt-2 text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-4">Product Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.name} className="border-b border-gray-100 pb-2">
                  <div className="flex items-center justify-between cursor-pointer hover:text-primary"
                       onClick={() => toggleCategory(category.name)}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={category.name}
                        checked={isSelected(category.name)}
                        onChange={() => handleCategoryChange(category.name)}
                        className="mr-2 accent-primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label htmlFor={category.name} className="cursor-pointer">
                        {category.name}
                      </label>
                    </div>
                    {category.submenu && category.submenu.length > 0 && (
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          expandedCategories[category.name] ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Submenu */}
                  {expandedCategories[category.name] && category.submenu && (
                    <div className="ml-6 mt-2 space-y-2">
                      {category.submenu.map((submenu) => (
                        <div key={submenu.name}>
                          <div className="flex items-center hover:text-primary">
                            <input
                              type="checkbox"
                              id={`${category.name}-${submenu.name}`}
                              checked={isSelected(category.name, submenu.name)}
                              onChange={() => handleCategoryChange(category.name, submenu.name)}
                              className="mr-2 accent-primary"
                            />
                            <label htmlFor={`${category.name}-${submenu.name}`} className="cursor-pointer">
                              {submenu.name}
                            </label>
                          </div>
                          
                          {/* Items */}
                          {submenu.items && submenu.items.length > 0 && (
                            <div className="ml-6 mt-1 space-y-1">
                              {submenu.items.map((item) => (
                                <div key={item} className="flex items-center hover:text-primary">
                                  <input
                                    type="checkbox"
                                    id={`${category.name}-${submenu.name}-${item}`}
                                    checked={isSelected(category.name, submenu.name, item)}
                                    onChange={() => handleCategoryChange(category.name, submenu.name, item)}
                                    className="mr-2 accent-primary"
                                  />
                                  <label htmlFor={`${category.name}-${submenu.name}-${item}`} className="cursor-pointer text-sm">
                                    {item}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="default">Default sorting</option>
                <option value="popularity">Sort by popularity</option>
                <option value="latest">Sort by latest</option>
                <option value="price-low">Sort by price: low to high</option>
                <option value="price-high">Sort by price: high to low</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">View:</span>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(Number(e.target.value))}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={16}>16</option>
                <option value={32}>32</option>
                <option value={-1}>All</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No products found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop; 