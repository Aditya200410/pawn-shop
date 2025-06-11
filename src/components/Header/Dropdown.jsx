import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Dropdown = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (main, sub = null, item = null) => {
    navigate('/shop', { 
      state: { 
        selectedCategory: {
          main,
          sub,
          item
        }
      }
    });
    setIsOpen(false);
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`px-3 py-2 hover:text-primary transition-colors duration-200
          ${isOpen ? 'text-primary' : 'text-gray-700'}`}
      >
        {category.name}
      </button>

      {/* Dropdown panel */}
      <div 
        className={`absolute left-0 mt-0 w-[280px] bg-white rounded-lg shadow-lg border border-gray-100 
          transform transition-all duration-200 ease-in-out origin-top
          ${isOpen 
            ? 'opacity-100 scale-y-100 translate-y-0' 
            : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'}`}
      >
        <div className="p-4">
          {category.submenu?.map((submenu) => (
            <div key={submenu.name} className="mb-4 last:mb-0">
              <div 
                className="text-gray-800 font-medium mb-2 hover:text-primary cursor-pointer transition-colors duration-200"
                onClick={() => handleCategoryClick(category.name, submenu.name)}
              >
                {submenu.name}
              </div>
              {submenu.items && (
                <div className="grid grid-cols-2 gap-2">
                  {submenu.items.map((item) => (
                    <div
                      key={item}
                      className="text-sm text-gray-600 hover:text-primary cursor-pointer transition-colors duration-200"
                      onClick={() => handleCategoryClick(category.name, submenu.name, item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown; 