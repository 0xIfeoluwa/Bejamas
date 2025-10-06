import { useState, useMemo, useCallback } from "react";
import "./App.css";
import { Card } from "./components/card";
import { CheckButton } from "./components/checkbutton";
import { CartIcon, CloseIcon, LogoIcon, Sort } from "./components/icons/Icons";
import { photoOfTheDay, cardObject } from "./objects/cardObject";
import { Category } from "./objects/category";

function App() {
  const [isChecked, setIschecked] = useState(false);
  const [items, setItems] = useState(cardObject);
  const [cart, setCart] = useState([]);

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cardObject.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cardObject.length / itemsPerPage);

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart Logic
  const totalCartItems = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );
  const addToCart = useCallback((item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  }, []);

  // Logic to remove an item from the cart completely
  const removeFromCart = useCallback((itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  }, []);

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

      {/* Cart Banner/Modal UI - Appears when isCartOpen is true */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end transition-opacity duration-300"
          // Close if clicking the backdrop
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsCartOpen(false);
            }
          }}
        >
          <div
            // Banner container uses transform for slide-in effect
            className="w-full sm:w-96 bg-white h-full shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out translate-x-0"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Banner Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white shadow-sm z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Shopping Cart ({totalCartItems})
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
              >
                {/* Close Icon (X) */}
                <CloseIcon />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-6 space-y-4 flex-grow">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 p-8">
                  Your cart is empty. Start adding some photos!
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
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
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-gray-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-lg font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Conditional Clear Cart Button */}
            {cart.length > 0 && (
              <div>
                <button className="clear-cart" onClick={() => setCart([])}>
                  CLEAR
                </button>
              </div>
            )}

            {/* Cart Footer / Subtotal */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 sticky bottom-0 bg-white shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold text-gray-700">
                    Subtotal:
                  </p>
                  <p className="text-2xl font-extrabold text-gray-900">
                    $
                    {cart
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
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
          <p className="photo-text">
            Photography /{" "}
            <span
              onClick={() => setItems(items.filter((item) => item.isPremium))}
            >
              Premium Photos
            </span>
          </p>
          <aside>
            <Sort />
            <p>Sort By</p>
            {/* <input type="" /> */}
          </aside>
        </section>

        <section className="card-category-grid">
          <section className="checkbutton-flex">
            <div className="check-div">
              <p className="checkbox-category">Category</p>

              {Category.map((cat) => (
                <CheckButton
                  key={cat}
                  label={cat}
                  checked={isChecked}
                  onChange={(e) => setIschecked(e.target.isChecked)}
                />
              ))}
            </div>
            <hr />
            <div className="check-div">
              <p className="checkbox-category">Price Range</p>
              <CheckButton label="Lower than $20" />
              <CheckButton label="$20 - $100" />
              <CheckButton label="$100 - $200" />
              <CheckButton label="More than $200" />
            </div>
          </section>
          <div className="card-section">
            {currentItems.map((card, index) => {
              return (
                <ul key={index}>
                  <Card
                    src={card.img}
                    alt={card.title}
                    category={card.category}
                    title={card.title}
                    price={"$" + card.price.toFixed(2)}
                    onClick={() => addToCart(card)}
                  />
                </ul>
              );
            })}
          </div>
        </section>
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {/* Page number buttons */}
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
      </section>
    </>
  );
}

export default App;
