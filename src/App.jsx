import { useState, useMemo, useCallback, useEffect } from "react";
import "./App.css";
import { Card } from "./components/card";
import { CheckButton } from "./components/checkbutton";
import {
  CartIcon,
  CloseIcon,
  LogoIcon,
  Sort,
  ChevronDownIcon,
} from "./components/icons/Icons";
import { photoOfTheDay, cardObject } from "./objects/cardObject";
import { Category } from "./objects/category";
import { PriceRange } from "./objects/priceRange";

function App() {
  const [cart, setCart] = useState(new Map());
  const [priceRange, setPriceRange] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("none");
  const [isPremiumFilterActive, setIsPremiumFilterActive] = useState(false);

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filtered and sorted items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = cardObject;

    // Apply premium filter first
    if (isPremiumFilterActive) {
      filtered = filtered.filter((item) => item.isPremium);
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.some((cat) => cat.name === item.category)
      );
    }

    // Apply price range filter
    if (priceRange) {
      filtered = filtered.filter(
        (item) => item.price >= priceRange.min && item.price <= priceRange.max
      );
    }

    // Apply sorting
    if (sortOrder !== "none") {
      filtered = [...filtered].sort((a, b) => {
        if (sortOrder === "low-to-high") {
          return a.price - b.price;
        }
        if (sortOrder === "high-to-low") {
          return b.price - a.price;
        }
        return 0;
      });
    }

    return filtered;
  }, [selectedCategories, priceRange, sortOrder, isPremiumFilterActive]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, priceRange, sortOrder, isPremiumFilterActive]);

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);

  // Cart Logic
  const totalCartItems = useMemo(
    () => Array.from(cart.values()).reduce((total, count) => total + count, 0),
    [cart]
  );

  const addToCart = useCallback((item) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      const currentCount = newCart.get(item.id) || 0;
      newCart.set(item.id, currentCount + 1);
      return newCart;
    });
  }, []);

  // Increase count function
  const increaseCount = useCallback((itemId) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      const currentCount = newCart.get(itemId) || 0;
      newCart.set(itemId, currentCount + 1);
      return newCart;
    });
  }, []);

  // Decrease count function
  const decreaseCount = useCallback((itemId) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      const currentCount = newCart.get(itemId);

      if (currentCount > 1) {
        // Decrease by 1
        newCart.set(itemId, currentCount - 1);
      } else {
        // If count is 1, remove the item
        newCart.delete(itemId);
      }

      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      newCart.delete(itemId);
      return newCart;
    });
  }, []);

  // Category toggle handler
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.some((cat) => cat.name === category.name);

      if (isSelected) {
        return prev.filter((cat) => cat.name !== category.name);
      } else {
        return [...prev, category];
      }
    });
  };

  // Price range toggle handler
  const handlePriceRangeChange = (range) => {
    if (
      priceRange &&
      priceRange.min === range.min &&
      priceRange.max === range.max
    ) {
      setPriceRange(null);
    } else {
      setPriceRange(range);
    }
  };

  // Sort handler
  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  // Show all photos (Photography clicked)
  const handleShowAllPhotos = () => {
    setIsPremiumFilterActive(false);
    setSelectedCategories([]);
    setPriceRange(null);
    setSortOrder("none");
  };

  // Show premium photos only
  const handleShowPremiumPhotos = () => {
    setIsPremiumFilterActive(true);
    setSelectedCategories([]);
    setPriceRange(null);
    setSortOrder("none");
  };

  const allItems = useMemo(() => [...cardObject, photoOfTheDay], []);

  return (
    <>
      <section className="header">
        <LogoIcon className="logo" />
        <CartIcon
          className="cart"
          itemCount={totalCartItems}
          onClick={() => setIsCartOpen(true)}
        />
      </section>
      <hr color="#E4E4E4" />

      {/* Cart Banner/Modal UI */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end transition-opacity duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsCartOpen(false);
            }
          }}
        >
          <div
            className="w-full sm:w-96 bg-white h-full shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white shadow-sm z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Shopping Cart ({totalCartItems})
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-grow">
              {cart.size === 0 ? (
                <p className="text-center text-gray-500 p-8">
                  Your cart is empty. Start adding some photos!
                </p>
              ) : (
                Array.from(cart.entries()).map(([id, count]) => {
                  const item = allItems.find((card) => card.id === id);
                  if (!item) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-start space-x-4 border-b pb-4 last:border-b-0"
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/100x100/cccccc/000000?text=Error";
                        }}
                      />
                      <div className="flex-grow min-w-0">
                        <h3 className="text-base font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500">Qty: {count}</p>
                        <p className="text-sm font-semibold text-gray-600">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="text-lg font-bold text-gray-900">
                          ${(item.price * count).toFixed(2)}
                        </p>
                        <div className="cart-btn flex items-center gap-2 mt-2">
                          <button
                            onClick={() => decreaseCount(item.id)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-bold transition-colors"
                          >
                            -
                          </button>
                          <span className="text-sm font-semibold min-w-[20px] text-center">
                            {count}
                          </span>
                          <button
                            onClick={() => increaseCount(item.id)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-500 hover:text-red-700 mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cart.size > 0 && (
              <div className="p-4">
                <button
                  className="clear-cart"
                  onClick={() => setCart(new Map())}
                >
                  CLEAR CART
                </button>
              </div>
            )}

            {cart.size > 0 && (
              <div className="p-6 border-t border-gray-100 sticky bottom-0 bg-white shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold text-gray-700">
                    Subtotal:
                  </p>
                  <p className="text-2xl font-extrabold text-gray-900">
                    $
                    {Array.from(cart.entries())
                      .reduce((sum, [id, count]) => {
                        const item = allItems.find((card) => card.id === id);
                        return sum + (item ? item.price * count : 0);
                      }, 0)
                      .toFixed(2)}
                  </p>
                </div>
                <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-xl">
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <section className="section">
        <p id="samurai">{photoOfTheDay.title}</p>
        <button
          className="cart-button"
          onClick={() => addToCart(photoOfTheDay)}
        >
          ADD TO CART
        </button>
      </section>

      <section className="main-section">
        <img
          src={photoOfTheDay.img}
          alt={photoOfTheDay.title}
          height="43%"
          width="100%"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/1020x1020/cccccc/000000?text=Image+Error";
          }}
        />
        <p className="photo">Photo of the day</p>
      </section>

      <section className="about">
        <div>
          <p className="about-pet">About the {photoOfTheDay.title}</p>
          <p id="animal">Pets</p>
          <p id="about-text">{photoOfTheDay.description}</p>
        </div>
        <aside>
          <section className="side">
            <p className="about-pet">People also buy</p>
          </section>

          <section className="card-suggestion">
            <img className="card-suggestion" src="/images/a.png" alt="Door" />
            <img className="card-suggestion" src="/images/b.png" alt="Window" />
            <img className="card-suggestion" src="/images/c.png" alt="Food" />
          </section>
          <section className="side">
            <p className="about-pet">Details</p>
            <p className="size">Size: 1020 x 1020 pixel</p>
            <p className="size">Size: 15 mb</p>
          </section>
        </aside>
      </section>
      <hr color="#E4E4E4" />

      <section>
        <section className="photo-category">
          <div className="photo-text">
            <div>
              <p>
                <span
                  onClick={handleShowAllPhotos}
                  className={`cursor-pointer ${
                    !isPremiumFilterActive
                      ? "font-semibold text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  style={{ fontSize: "18px", transition: "color 0.2s" }}
                >
                  Photography
                </span>
                {" / "}
                <span
                  onClick={handleShowPremiumPhotos}
                  className={`cursor-pointer ${
                    isPremiumFilterActive
                      ? "font-semibold text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  style={{ fontSize: "18px", transition: "color 0.2s" }}
                >
                  Premium Photos
                </span>
              </p>
            </div>
            <div
              className="hide-btn"
              onClick={() => {
                document
                  .querySelector(".checkbutton-flex")
                  .classList.add("show");
                document.body.classList.add("modal-open");
              }}
            >
              <ChevronDownIcon />
            </div>
          </div>
          <div className="sort-by">
            <aside className="flex items-center space-x-2">
              <Sort />
              <label htmlFor="sort-select" className="text-sm">
                Sort By
              </label>
              <select
                id="sort-select"
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="none">Price: Default</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </aside>
          </div>
        </section>

        <section className="card-category-grid">
          <section className="checkbutton-flex">
            <div className="mobile-filter-header">
              <h2 className="text-xl font-bold">Filter</h2>
              <button
                className="close-filter-btn"
                onClick={() => {
                  document
                    .querySelector(".checkbutton-flex")
                    .classList.remove("show");
                  document
                    .querySelector(".hide-btn")
                    .classList.remove("active");
                  document.body.classList.remove("modal-open");
                }}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="check-div">
              <p className="checkbox-category">Category</p>
              {Category.map((cat) => (
                <CheckButton
                  key={cat.name}
                  label={cat.name}
                  checked={selectedCategories.some((c) => c.name === cat.name)}
                  onChange={() => handleCategoryChange(cat)}
                />
              ))}
            </div>
            <div className="check-div">
              <p className="checkbox-category">Price Range</p>
              {PriceRange.map((range) => (
                <CheckButton
                  key={range.Label}
                  label={range.Label}
                  checked={
                    priceRange?.min === range.min &&
                    priceRange?.max === range.max
                  }
                  onChange={() => handlePriceRangeChange(range)}
                />
              ))}
            </div>
            <button
              className="apply-filters-btn"
              onClick={() => {
                document
                  .querySelector(".checkbutton-flex")
                  .classList.remove("show");
                document.querySelector(".hide-btn").classList.remove("active");
              }}
            >
              Apply Filters
            </button>
          </section>

          <div className="card-section">
            {currentItems.length > 0 ? (
              currentItems.map((card) => (
                <ul key={card.id}>
                  <Card
                    src={card.img}
                    alt={card.title}
                    category={card.category}
                    title={card.title}
                    price={"$" + card.price.toFixed(2)}
                    isPremium={card.isPremium}
                    onClick={() => addToCart(card)}
                  />
                </ul>
              ))
            ) : (
              <p className="no-results">
                No items match your selected filters.
              </p>
            )}
          </div>
        </section>

        {filteredAndSortedItems.length > 0 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <ul
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "active-page" : ""}
                style={{
                  margin: "0 4px",
                  fontWeight: currentPage === i + 1 ? "bold" : "normal",
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </ul>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </>
  );
}

export default App;
