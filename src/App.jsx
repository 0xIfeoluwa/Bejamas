import { useState } from "react";
import "./App.css";
import { Card } from "./components/card";
import { CheckButton } from "./components/checkbutton";
import { CartIcon, LogoIcon, Sort } from "./components/icons/Icons";
import { cardObject } from "./objects/cardObject";

function App() {
  const [isChecked, setIschecked] = useState(false);

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cardObject.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cardObject.length / itemsPerPage);

  return (
    <>
      <section className="header">
        <LogoIcon className="logo" />
        <CartIcon className="cart" />
      </section>
      <hr color="#E4E4E4" />
      <section className="section">
        <p id="samurai">Samurai King Resting</p>
        <button className="cart-button">ADD TO CART</button>
      </section>
      <section className="main-section">
        <img src="/images/dog.png" alt="Dog" height="43%" width="100%" />
        <p className="photo">Photo of the day</p>
      </section>
      <section className="about">
        <div>
          <p className="about-pet">About the Samurai King Resting</p>
          <p id="animal">Pets</p>
          <p id="about-text">
            So how did the classical Latin become so incoherent? According to
            McClintock, a 15th century typesetter likely scrambled part of
            Cicero's De Finibus in order to provide placeholder text to mockup
            various fonts for a type specimen book.So how did the classical
            Latin become so incoherent? According to McClintock, a 15th century
            typesetter likely scrambled part of Cicero's De Finibus in order to
            provide placeholder text to mockup various fonts for a type specimen
            book.So how did the classical Latin become so incoherent? According
            to McClintock.
          </p>
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
          <p>
            Photography / <span>Premium Photos</span>
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
              <CheckButton
                label="People"
                checked={isChecked}
                onChange={(e) => setIschecked(e.target.checked)}
              />
              <CheckButton label="Premium" />
              <CheckButton label="Pets" />
              <CheckButton label="Food" />
              <CheckButton label="Landmarks" />
              <CheckButton label="Cities" />
              <CheckButton label="Nature" />
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
          <section className="card-section">
            {currentItems.map((card, index) => {
              return (
                <ul key={index}>
                  <Card
                    src={card.img}
                    alt={card.title}
                    category={card.category}
                    title={card.title}
                    price={"$" + card.price}
                  />
                </ul>
              );
            })}
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
                  style={{ margin: "0 4px", fontWeight: currentPage === i + 1 ? "bold" : "normal", cursor: "pointer" }}
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
        </section>
      </section>
    </>
  );
}

export default App;
