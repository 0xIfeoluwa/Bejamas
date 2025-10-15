(() => {
  // Data
  const photoOfTheDay = {
    id: 99,
    img: "./images/dog.png",
    title: "Samurai King Resting",
    category: "Pets",
    price: 10000.0,
    isPremium: true,
    description:
      "So how did the classical Latin become so incoherent? According to McClintock, a 15th century typesetter likely scrambled part of Cicero's De Finibus in order to provide placeholder text to mockup various fonts for a type specimen book. So how did the classical Latin become so incoherent? According to McClintock, a 15th century typesetter likely scrambled part of Cicero's De Finibus in order to provide placeholder text to mockup various fonts for a type specimen book. So how did the classical Latin become so incoherent? According to McClintock.",
  };

  const cardObject = [
    { img: "./images/people.png", category: "People", title: "Red Bench", price: 3.86, isPremium: true, id: crypto.randomUUID() },
    { img: "./images/man.png", category: "People", title: "Man", price: 100.0, isPremium: false, id: crypto.randomUUID() },
    { img: "./images/landmarks.png", category: "Landmarks", title: "Architecture", price: 101.0, isPremium: true, id: crypto.randomUUID() },
    { img: "./images/food.png", category: "Food", title: "Egg Balloon", price: 93.89, id: crypto.randomUUID() },
    { img: "./images/people.png", category: "People", title: "Red Bench", price: 3.86, id: crypto.randomUUID(), isPremium: true },
    { img: "./images/man.png", category: "People", title: "Man", price: 100.0, id: crypto.randomUUID() },
    { img: "./images/landmarks.png", category: "Landmarks", title: "Architecture", id: crypto.randomUUID(), price: 101.0 },
    { img: "./images/food.png", category: "Food", title: "Egg Balloon", price: 93.89, id: crypto.randomUUID() },
    { img: "./images/people.png", category: "People", title: "Red Bench", price: 3.86, id: crypto.randomUUID() },
    { img: "./images/man.png", category: "People", title: "Man", price: 100.0, id: crypto.randomUUID() },
    { img: "./images/landmarks.png", category: "Landmarks", title: "Architecture", isPremium: true, id: crypto.randomUUID(), price: 101.0 },
    { img: "./images/food.png", category: "Food", title: "Egg Balloon", isPremium: true, id: crypto.randomUUID(), price: 93.89 },
    { img: "./images/people.png", category: "People", title: "Red Bench", id: crypto.randomUUID(), price: 3.86 },
    { img: "./images/man.png", category: "People", title: "Man", price: 100.0, isPremium: true, id: crypto.randomUUID() },
    { img: "./images/landmarks.png", category: "Landmarks", id: crypto.randomUUID(), title: "Architecture", price: 101.0 },
    { img: "./images/food.png", category: "Food", title: "Egg Balloon", id: crypto.randomUUID(), isPremium: true, price: 93.89 },
  ];

  const Category = [
    { name: "People" },
    { name: "Pets" },
    { name: "Food" },
    { name: "Landmarks" },
    { name: "Cities" },
    { name: "Nature" },
  ];

  const PriceRange = [
    { Label: "Lower than 20$", min: 0, max: 20 },
    { Label: "21$ - 100$", min: 21, max: 100 },
    { Label: "101$ - 200$", min: 101, max: 200 },
    { Label: "201$ and above", min: 201, max: Infinity },
  ];

  // State
  let cart = new Map();
  let priceRange = null;
  let selectedCategories = [];
  let sortOrder = "none";
  let isPremiumFilterActive = false;

  let currentPage = 1;
  const itemsPerPage = 6;

  const allItems = [...cardObject, photoOfTheDay];

  // Elements
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const el = {
    logo: $("#logo"),
    cartIconContainer: $("#cartIconContainer"),
    samurai: $("#samurai"),
    addPhotoOfDay: $("#addPhotoOfDay"),
    photoOfDayImg: $("#photoOfDayImg"),
    aboutTitle: $("#aboutTitle"),
    aboutText: $("#about-text"),
    tabPhotography: $("#tabPhotography"),
    tabPremium: $("#tabPremium"),
    sortSelect: $("#sort-select"),
    toggleFilters: $("#toggleFilters"),
    filters: $("#filters"),
    categoryFilters: $("#categoryFilters"),
    priceFilters: $("#priceFilters"),
    cards: $("#cards"),
    pagination: $("#pagination"),
    cartModalRoot: $("#cartModalRoot"),
  };

  function setImgFallback(imageEl, fallbackUrl) {
    imageEl.onerror = () => {
      imageEl.onerror = null;
      imageEl.src = fallbackUrl;
    };
  }

  // Header
  function renderHeader() {
    el.logo.innerHTML = getLogoSVG();
    el.cartIconContainer.innerHTML = `<div class="cart-icon" id="cartIcon">${getCartSVG()}<span class="item-count" id="cartCount" style="display:none">0</span></div>`;
    $("#cartIcon").addEventListener("click", () => openCartModal());
  }

  function updateCartCount() {
    const count = Array.from(cart.values()).reduce((t, c) => t + c, 0);
    const badge = $("#cartCount");
    if (!badge) return;
    if (count > 0) {
      badge.textContent = String(count);
      badge.style.display = "inline-flex";
    } else {
      badge.style.display = "none";
    }
  }

  // Photo of the day
  function renderPhotoOfTheDay() {
    el.samurai.textContent = photoOfTheDay.title;
    el.photoOfDayImg.src = photoOfTheDay.img;
    el.photoOfDayImg.alt = photoOfTheDay.title;
    setImgFallback(
      el.photoOfDayImg,
      "https://placehold.co/1020x1020/cccccc/000000?text=Image+Error"
    );

    el.aboutTitle.textContent = `About the ${photoOfTheDay.title}`;
    el.aboutText.textContent = photoOfTheDay.description;

    el.addPhotoOfDay.addEventListener("click", () => addToCart(photoOfTheDay));
  }

  // Filters
  function buildCategoryFilters() {
    el.categoryFilters.innerHTML = "";
    Category.forEach((cat) => {
      const id = `cat-${cat.name}`;
      const wrapper = document.createElement("div");
      wrapper.className = "checkbox";
      wrapper.innerHTML = `
        <label for="${id}">
          <input id="${id}" type="checkbox" /> ${cat.name}
        </label>
      `;
      const input = wrapper.querySelector("input");
      input.checked = selectedCategories.some((c) => c.name === cat.name);
      input.addEventListener("change", () => {
        const exists = selectedCategories.some((c) => c.name === cat.name);
        if (exists) {
          selectedCategories = selectedCategories.filter((c) => c.name !== cat.name);
        } else {
          selectedCategories = [...selectedCategories, cat];
        }
        currentPage = 1;
        renderMain();
      });
      el.categoryFilters.appendChild(wrapper);
    });
  }

  function buildPriceFilters() {
    el.priceFilters.innerHTML = "";
    PriceRange.forEach((range, idx) => {
      const id = `price-${idx}`;
      const wrapper = document.createElement("div");
      wrapper.className = "checkbox";
      wrapper.innerHTML = `
        <label for="${id}">
          <input id="${id}" type="checkbox" /> ${range.Label}
        </label>
      `;
      const input = wrapper.querySelector("input");
      input.checked = !!priceRange && priceRange.min === range.min && priceRange.max === range.max;
      input.addEventListener("change", () => {
        if (priceRange && priceRange.min === range.min && priceRange.max === range.max) {
          priceRange = null; // toggle off
        } else {
          priceRange = range;
        }
        // Ensure only one is checked
        buildPriceFilters();
        currentPage = 1;
        renderMain();
      });
      el.priceFilters.appendChild(wrapper);
    });
  }

  function setupSortAndTabs() {
    el.sortSelect.value = sortOrder;
    el.sortSelect.addEventListener("change", (e) => {
      sortOrder = e.target.value;
      currentPage = 1;
      renderMain();
    });

    function updateTabStyles() {
      const activeStyle = (active) => active ? "font-weight:600;color:#111" : "color:#656565";
      el.tabPhotography.style.cssText = activeStyle(!isPremiumFilterActive);
      el.tabPremium.style.cssText = activeStyle(isPremiumFilterActive);
    }

    el.tabPhotography.classList.add("cursor-pointer");
    el.tabPremium.classList.add("cursor-pointer");

    el.tabPhotography.addEventListener("click", () => {
      isPremiumFilterActive = false;
      selectedCategories = [];
      priceRange = null;
      sortOrder = "none";
      el.sortSelect.value = sortOrder;
      currentPage = 1;
      updateTabStyles();
      buildCategoryFilters();
      buildPriceFilters();
      renderMain();
    });

    el.tabPremium.addEventListener("click", () => {
      isPremiumFilterActive = true;
      selectedCategories = [];
      priceRange = null;
      sortOrder = "none";
      el.sortSelect.value = sortOrder;
      currentPage = 1;
      updateTabStyles();
      buildCategoryFilters();
      buildPriceFilters();
      renderMain();
    });

    updateTabStyles();

    el.toggleFilters.addEventListener("click", () => {
      el.filters.classList.toggle("show");
    });
  }

  // Cards and pagination
  function getFilteredAndSortedItems() {
    let filtered = cardObject.slice();

    if (isPremiumFilterActive) {
      filtered = filtered.filter((item) => item.isPremium);
    }

    if (selectedCategories.length > 0) {
      const names = new Set(selectedCategories.map((c) => c.name));
      filtered = filtered.filter((item) => names.has(item.category));
    }

    if (priceRange) {
      filtered = filtered.filter(
        (item) => item.price >= priceRange.min && item.price <= priceRange.max
      );
    }

    if (sortOrder !== "none") {
      filtered = filtered.slice().sort((a, b) => {
        if (sortOrder === "low-to-high") return a.price - b.price;
        if (sortOrder === "high-to-low") return b.price - a.price;
        return 0;
      });
    }

    return filtered;
  }

  function renderCards() {
    const filtered = getFilteredAndSortedItems();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

    el.cards.innerHTML = "";

    if (currentItems.length === 0) {
      const p = document.createElement("p");
      p.className = "no-results";
      p.textContent = "No items match your selected filters.";
      el.cards.appendChild(p);
      return;
    }

    currentItems.forEach((card) => {
      const ul = document.createElement("ul");
      const section = document.createElement("section");
      section.className = "card";

      const imgContainer = document.createElement("div");
      imgContainer.className = "card-img-container";

      if (card.isPremium) {
        const badge = document.createElement("div");
        badge.className = "premium-badge";
        badge.textContent = "Premium";
        imgContainer.appendChild(badge);
      }

      const img = document.createElement("img");
      img.src = card.img;
      img.alt = card.title;
      setImgFallback(img, "https://placehold.co/600x600/cccccc/000000?text=Error");

      const btn = document.createElement("button");
      btn.className = "card-btn";
      btn.textContent = "ADD TO CART";
      btn.addEventListener("click", () => addToCart(card));

      imgContainer.appendChild(img);
      imgContainer.appendChild(btn);

      const cat = document.createElement("p");
      cat.className = "card-category";
      cat.textContent = card.category;

      const title = document.createElement("p");
      title.className = "card-title";
      title.textContent = card.title;

      const price = document.createElement("p");
      price.className = "card-price";
      price.textContent = `$${card.price.toFixed(2)}`;

      section.appendChild(imgContainer);
      section.appendChild(cat);
      section.appendChild(title);
      section.appendChild(price);

      ul.appendChild(section);
      el.cards.appendChild(ul);
    });
  }

  function renderPagination() {
    const total = getFilteredAndSortedItems().length;
    const totalPages = Math.ceil(total / itemsPerPage);

    if (totalPages <= 1) {
      el.pagination.innerHTML = "";
      return;
    }

    const frag = document.createDocumentFragment();

    const prev = document.createElement("button");
    prev.textContent = "Prev";
    prev.disabled = currentPage === 1;
    prev.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage -= 1;
        renderMain();
      }
    });
    frag.appendChild(prev);

    for (let i = 1; i <= totalPages; i += 1) {
      const page = document.createElement("ul");
      page.textContent = String(i);
      if (i === currentPage) page.classList.add("active-page");
      page.style.margin = "0 4px";
      page.style.cursor = "pointer";
      page.addEventListener("click", () => {
        currentPage = i;
        renderMain();
      });
      frag.appendChild(page);
    }

    const next = document.createElement("button");
    next.textContent = "Next";
    next.disabled = currentPage === totalPages;
    next.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage += 1;
        renderMain();
      }
    });
    frag.appendChild(next);

    el.pagination.innerHTML = "";
    el.pagination.appendChild(frag);
  }

  // Cart logic
  function addToCart(item) {
    const current = cart.get(item.id) || 0;
    cart.set(item.id, current + 1);
    updateCartCount();
  }

  function increaseCount(itemId) {
    const current = cart.get(itemId) || 0;
    cart.set(itemId, current + 1);
    updateCartCount();
    renderCartModal();
  }

  function decreaseCount(itemId) {
    const current = cart.get(itemId);
    if (!current) return;
    if (current > 1) {
      cart.set(itemId, current - 1);
    } else {
      cart.delete(itemId);
    }
    updateCartCount();
    renderCartModal();
  }

  function removeFromCart(itemId) {
    cart.delete(itemId);
    updateCartCount();
    renderCartModal();
  }

  function clearCart() {
    cart = new Map();
    updateCartCount();
    renderCartModal();
  }

  function openCartModal() {
    renderCartModal();
  }

  function renderCartModal() {
    const totalCartItems = Array.from(cart.values()).reduce((t, c) => t + c, 0);

    if (totalCartItems === 0) {
      el.cartModalRoot.innerHTML = `
        <div class="modal-overlay" id="cartOverlay">
          <div class="modal-panel">
            <div class="modal-header">
              <h2>Shopping Cart (0)</h2>
              <button class="close-btn" id="closeCart">✕</button>
            </div>
            <div class="modal-body">
              <p class="text-center text-gray">Your cart is empty. Start adding some photos!</p>
            </div>
          </div>
        </div>
      `;
    } else {
      const itemsHTML = Array.from(cart.entries())
        .map(([id, count]) => {
          const item = allItems.find((x) => x.id === id);
          if (!item) return "";
          const itemTotal = (item.price * count).toFixed(2);
          return `
            <div class="cart-item">
              <img src="${item.img}" alt="${item.title}" class="cart-item-img" />
              <div class="cart-item-info">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-qty">Qty: ${count}</p>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
              </div>
              <div class="cart-item-actions">
                <p class="cart-item-total">$${itemTotal}</p>
                <div class="cart-btn">
                  <button class="qty-btn" data-action="dec" data-id="${id}">-</button>
                  <span class="qty-count">${count}</span>
                  <button class="qty-btn" data-action="inc" data-id="${id}">+</button>
                </div>
                <button class="remove-btn" data-action="remove" data-id="${id}">Remove</button>
              </div>
            </div>
          `;
        })
        .join("");

      const subtotal = Array.from(cart.entries()).reduce((sum, [id, count]) => {
        const item = allItems.find((x) => x.id === id);
        return sum + (item ? item.price * count : 0);
      }, 0);

      el.cartModalRoot.innerHTML = `
        <div class="modal-overlay" id="cartOverlay">
          <div class="modal-panel">
            <div class="modal-header">
              <h2>Shopping Cart (${totalCartItems})</h2>
              <button class="close-btn" id="closeCart">✕</button>
            </div>
            <div class="modal-body">${itemsHTML}</div>
            <div class="modal-footer">
              <button class="clear-cart" id="clearCartBtn">CLEAR CART</button>
              <div class="checkout">
                <span class="subtotal-label">Subtotal:</span>
                <span class="subtotal-value">$${subtotal.toFixed(2)}</span>
                <button class="checkout-btn">Checkout</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    const overlay = $("#cartOverlay");
    if (!overlay) return;
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeCart();
    });

    const closeBtn = $("#closeCart");
    if (closeBtn) closeBtn.addEventListener("click", () => closeCart());

    $$(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const action = btn.getAttribute("data-action");
        if (action === "inc") increaseCount(id);
        if (action === "dec") decreaseCount(id);
      });
    });

    $$(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => removeFromCart(btn.getAttribute("data-id")));
    });

    const clearBtn = $("#clearCartBtn");
    if (clearBtn) clearBtn.addEventListener("click", clearCart);
  }

  function closeCart() {
    el.cartModalRoot.innerHTML = "";
  }

  // Icons (inline SVG)
  function getLogoSVG() {
    return `
    <svg width="159" height="26" viewBox="0 0 159 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.32147 21.285C1.0124 21.285 0 20.3016 0 19.1387V2.41513C0 1.19313 1.07178 0.268661 2.32147 0.268661H7.35162C11.8153 0.268661 14.0474 3.13082 14.0474 6.111C14.0474 8.19806 12.7084 9.47937 10.9228 10.3444C12.7678 11.089 14.6132 12.4312 14.6132 15.0234C14.6132 18.5124 11.8152 21.2853 7.23258 21.2853H2.32147V21.285ZM7.58926 8.49594C8.63104 8.49594 9.88064 7.78025 9.88064 6.17066C9.88064 5.03881 9.34484 4.02454 7.79734 4.02454H4.16679V8.49603H7.58926V8.49594ZM4.16687 12.3118V17.498H7.49987C9.46414 17.498 10.4467 16.5152 10.4467 14.9638C10.4467 13.2645 9.2565 12.3118 7.67856 12.3118H4.16687Z" fill="black"/>
      <path d="M32.4668 21.285H24.5801C23.1219 21.285 21.8131 20.778 21.8131 19.1685V2.38508C21.8131 1.34216 22.7945 0.268578 24.1046 0.268578H32.1692C33.3007 0.268578 34.2526 1.16308 34.2526 2.20618C34.2526 3.27994 33.3007 4.05451 32.1692 4.05451H25.9795V8.85384H31.6043C32.6455 8.85384 33.6579 9.65828 33.6579 10.7321C33.6579 11.8046 32.7645 12.6399 31.6043 12.6399H25.9795V17.4979H32.4668C33.5685 17.4979 34.5503 18.3331 34.5503 19.3474C34.5503 20.4212 33.5986 21.285 32.4668 21.285Z" fill="black"/>
      <path d="M50.5002 14.2793C50.5002 18.8096 48.8937 21.5533 43.5965 21.5533C42.465 21.5533 40.1732 21.4341 40.1732 19.4964C40.1732 18.3035 41.2748 17.6169 42.1077 17.6169C42.7926 17.6169 43.1797 17.7962 43.923 17.7962C45.9167 17.7962 46.3339 16.455 46.3339 14.279V1.90756C46.3338 0.864905 47.2269 1.14441e-05 48.4173 1.14441e-05C49.5177 1.14441e-05 50.5003 0.89478 50.5003 1.90765L50.5002 14.2793Z" fill="black"/>
      <path d="M99.3941 19.6752C99.3941 20.6885 98.4409 21.5533 97.3401 21.5533C96.2098 21.5533 95.2272 20.6885 95.2272 19.6752V9.41941L91.8348 16.0972C91.4478 16.8714 90.7031 17.2294 89.8706 17.2294C89.0666 17.2294 88.3232 16.8714 87.936 16.0972L84.5436 9.41941V19.6753C84.5436 20.6886 83.561 21.5534 82.4009 21.5534C81.2692 21.5534 80.3771 20.6886 80.3771 19.6753V1.96758C80.3771 0.835205 81.2991 0.000273507 82.5198 0.000273507C83.4718 0.000273507 84.2161 0.387951 84.6033 1.16322L89.9003 11.6856L95.1974 1.13352C95.6145 0.268626 96.4173 1.14441e-05 97.2509 1.14441e-05C98.4709 1.14441e-05 99.3941 0.89478 99.3941 1.9674V19.6752Z" fill="black"/>
      <path d="M122.902 18.9894L117.099 2.02715C116.682 0.835117 116.086 1.14441e-05 114.658 1.14441e-05C113.23 1.14441e-05 112.635 0.864905 112.247 2.02707L106.444 18.9893C106.385 19.1386 106.356 19.4966 106.356 19.6457C106.356 20.7781 107.337 21.5535 108.498 21.5535C109.212 21.5535 110.165 21.0166 110.462 20.1528C110.462 20.1528 114.539 6.64784 114.658 5.72372C114.777 6.64784 118.825 20.1528 118.825 20.1528C119.123 20.9871 120.074 21.5535 120.848 21.5535C122.068 21.5535 122.991 20.7781 122.991 19.6457C122.992 19.4966 122.962 19.1387 122.902 18.9894Z" fill="black"/>
      <path d="M73.594 18.9894L67.7906 2.02715C67.3735 0.835117 66.7783 1.14441e-05 65.3503 1.14441e-05C63.9218 1.14441e-05 63.3263 0.864905 62.9389 2.02707L57.1358 18.9893C57.0761 19.1386 57.0474 19.4966 57.0474 19.6457C57.0474 20.7781 58.0289 21.5535 59.1892 21.5535C59.9039 21.5535 60.8566 21.0166 61.1536 20.1528C61.1536 20.1528 65.2307 6.64784 65.3503 5.72372C65.4691 6.64784 69.5167 20.1528 69.5167 20.1528C69.8145 20.9871 70.7661 21.5535 71.54 21.5535C72.7599 21.5535 73.683 20.7781 73.683 19.6457C73.6831 19.4966 73.6536 19.1387 73.594 18.9894Z" fill="black"/>
      <path d="M137.81 13.1752C137.185 12.9078 136.442 12.6398 135.638 12.3714C132.722 11.4765 129.566 10.4933 129.566 6.17062C129.566 2.32538 132.245 1.14441e-05 136.472 1.14441e-05C138.227 1.14441e-05 142.452 0.447352 142.452 2.68336C142.452 3.6667 141.679 4.56139 140.37 4.56139C139.834 4.56139 139.417 4.3824 138.911 4.23346C138.346 4.02433 137.691 3.78612 136.65 3.78612C135.191 3.78612 133.822 4.29303 133.822 6.0513C133.822 7.36257 134.567 7.81009 135.072 8.04856C135.846 8.43633 136.56 8.67489 137.215 8.85388C140.132 9.77757 143.316 10.7916 143.316 15.0233C143.316 19.1685 140.162 21.5535 135.905 21.5535C133.703 21.5535 129.536 20.7781 129.536 18.6901C129.536 17.7366 130.4 16.812 131.501 16.812C131.947 16.812 132.424 16.9611 132.989 17.1702C133.703 17.4088 134.656 17.7668 135.935 17.7668C137.989 17.7668 139.03 16.8419 139.03 15.2025C139.03 13.8611 138.346 13.4141 137.81 13.1752Z" fill="black"/>
      <path d="M156.946 21.4302C157.989 21.4302 159 22.2645 159 23.338C159 24.4108 158.108 25.216 156.946 25.216H149.021C147.861 25.216 146.967 24.4108 146.967 23.338C146.967 22.2645 147.98 21.4302 149.021 21.4302H156.946Z" fill="black"/>
    </svg>`;
  }

  function getCartSVG() {
    return `
      <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.3982 34.9106H17.4007C17.4028 34.9106 17.4048 34.9102 17.4069 34.9102H46.0898C46.796 34.9102 47.4169 34.4417 47.6109 33.7628L53.939 11.6143C54.0754 11.1368 53.9798 10.6235 53.6811 10.2272C53.382 9.83085 52.9144 9.59766 52.418 9.59766H13.7497L12.6188 4.50838C12.4577 3.78452 11.8158 3.26954 11.0742 3.26954H1.58203C0.708206 3.26954 0 3.97775 0 4.85157C0 5.7254 0.708206 6.4336 1.58203 6.4336H9.8053C10.0055 7.33544 15.2172 30.7882 15.5171 32.1375C13.8358 32.8684 12.6562 34.5447 12.6562 36.4922C12.6562 39.1091 14.7854 41.2383 17.4023 41.2383H46.0898C46.9637 41.2383 47.6719 40.5301 47.6719 39.6563C47.6719 38.7824 46.9637 38.0742 46.0898 38.0742H17.4023C16.5302 38.0742 15.8203 37.3644 15.8203 36.4922C15.8203 35.6213 16.5277 34.9126 17.3982 34.9106ZM50.3205 12.7617L44.8963 31.7461H18.6713L14.4525 12.7617H50.3205Z" fill="black"/>
        <path d="M15.8203 45.9844C15.8203 48.6013 17.9495 50.7305 20.5664 50.7305C23.1834 50.7305 25.3125 48.6013 25.3125 45.9844C25.3125 43.3674 23.1834 41.2383 20.5664 41.2383C17.9495 41.2383 15.8203 43.3674 15.8203 45.9844ZM20.5664 44.4023C21.4386 44.4023 22.1484 45.1122 22.1484 45.9844C22.1484 46.8566 21.4386 47.5664 20.5664 47.5664C19.6942 47.5664 18.9844 46.8566 18.9844 45.9844C18.9844 45.1122 19.6942 44.4023 20.5664 44.4023Z" fill="black"/>
        <path d="M38.1797 45.9844C38.1797 48.6013 40.3088 50.7305 42.9258 50.7305C45.5427 50.7305 47.6719 48.6013 47.6719 45.9844C47.6719 43.3674 45.5427 41.2383 42.9258 41.2383C40.3088 41.2383 38.1797 43.3674 38.1797 45.9844ZM42.9258 44.4023C43.798 44.4023 44.5078 45.1122 44.5078 45.9844C44.5078 46.8566 43.798 47.5664 42.9258 47.5664C42.0536 47.5664 41.3438 46.8566 41.3438 45.9844C41.3438 45.1122 42.0536 44.4023 42.9258 44.4023Z" fill="black"/>
      </svg>`;
  }

  // Main render orchestrator
  function renderMain() {
    renderCards();
    renderPagination();
  }

  // Init
  function init() {
    renderHeader();
    renderPhotoOfTheDay();
    buildCategoryFilters();
    buildPriceFilters();
    setupSortAndTabs();
    renderMain();
    updateCartCount();

    // Set static suggestions images in About section
    // Already hard-coded in HTML; nothing else to do
  }

  document.addEventListener("DOMContentLoaded", init);
})();