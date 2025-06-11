import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Slider } from '@mui/material';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const location = useLocation();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 400]);
  const [selectedCategories, setSelectedCategories] = useState({
    main: null,
    sub: null,
    item: null
  });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState(16);

  // Handle category selection from header dropdown
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategories(location.state.selectedCategory);
      if (location.state.selectedCategory.main) {
        setExpandedCategories(prev => ({
          ...prev,
          [location.state.selectedCategory.main]: true
        }));
      }
    }
  }, [location.state]);

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
    if (selectedCategories.main) {
      filtered = filtered.filter(product => {
        if (selectedCategories.item) {
          return product.category === selectedCategories.main && 
                 product.subcategory === selectedCategories.sub &&
                 product.item === selectedCategories.item;
        }
        if (selectedCategories.sub) {
          return product.category === selectedCategories.main && 
                 product.subcategory === selectedCategories.sub;
        }
        return product.category === selectedCategories.main;
      });
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

  const handleCategoryClick = (main, sub = null, item = null) => {
    setSelectedCategories({
      main: main === selectedCategories.main && !sub ? null : main,
      sub: sub === selectedCategories.sub && !item ? null : sub,
      item: item === selectedCategories.item ? null : item
    });
  };

  const isCategorySelected = (main, sub = null, item = null) => {
    return selectedCategories.main === main && 
           (!sub || selectedCategories.sub === sub) && 
           (!item || selectedCategories.item === item);
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
            <div className="space-y-1">
              {categories.map((category) => (
                <div key={category.name} className="border-b border-gray-100 last:border-0">
                  <div 
                    className={`flex items-center justify-between py-2 cursor-pointer hover:text-primary transition-colors ${
                      isCategorySelected(category.name) ? 'text-primary font-medium' : ''
                    }`}
                    onClick={() => {
                      handleCategoryClick(category.name);
                      if (category.submenu?.length > 0) {
                        toggleCategory(category.name);
                      }
                    }}
                  >
                    <span>{category.name}</span>
                    {category.submenu?.length > 0 && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedCategories[category.name] ? 'rotate-180' : ''
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
                  <div 
                    className={`overflow-hidden transition-all duration-200 ease-in-out ${
                      expandedCategories[category.name] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="ml-4 mb-2 space-y-1">
                      {category.submenu?.map((submenu) => (
                        <div key={submenu.name}>
                          <div 
                            className={`py-2 cursor-pointer hover:text-primary transition-colors ${
                              isCategorySelected(category.name, submenu.name) ? 'text-primary font-medium' : ''
                            }`}
                            onClick={() => handleCategoryClick(category.name, submenu.name)}
                          >
                            {submenu.name}
                          </div>

                          {/* Items */}
                          <div 
                            className={`overflow-hidden transition-all duration-200 ease-in-out ${
                              isCategorySelected(category.name, submenu.name) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="ml-4 space-y-1">
                              {submenu.items?.map((item) => (
                                <div
                                  key={item}
                                  className={`py-1 cursor-pointer hover:text-primary transition-colors ${
                                    isCategorySelected(category.name, submenu.name, item) ? 'text-primary font-medium' : ''
                                  }`}
                                  onClick={() => handleCategoryClick(category.name, submenu.name, item)}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full md:w-3/4">
          {/* Category Path */}
          {selectedCategories.main && (
            <div className="mb-6 flex items-center text-sm text-gray-600">
              <span className="hover:text-primary cursor-pointer" onClick={() => handleCategoryClick(null)}>
                All Categories
              </span>
              <span className="mx-2">›</span>
              <span className={`${!selectedCategories.sub ? 'text-primary font-medium' : 'hover:text-primary cursor-pointer'}`}
                    onClick={() => handleCategoryClick(selectedCategories.main)}>
                {selectedCategories.main}
              </span>
              {selectedCategories.sub && (
                <>
                  <span className="mx-2">›</span>
                  <span className={`${!selectedCategories.item ? 'text-primary font-medium' : 'hover:text-primary cursor-pointer'}`}
                        onClick={() => handleCategoryClick(selectedCategories.main, selectedCategories.sub)}>
                    {selectedCategories.sub}
                  </span>
                </>
              )}
              {selectedCategories.item && (
                <>
                  <span className="mx-2">›</span>
                  <span className="text-primary font-medium">
                    {selectedCategories.item}
                  </span>
                </>
              )}
            </div>
          )}

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