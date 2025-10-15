// Simple junior-style JS (no IIFE, minimal helpers)

// ----- Data -----
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

// ----- State -----
// Using a plain object for the cart for simplicity
var cart = {}; // { [id]: count }
var priceRange = null;
var selectedCategories = []; // array of { name }
var sortOrder = "none";
var isPremiumFilterActive = false;
var currentPage = 1;
var itemsPerPage = 6;

var allItems = cardObject.concat([photoOfTheDay]);

// ----- Elements -----
var samuraiEl = document.getElementById("samurai");
var addPhotoBtn = document.getElementById("addPhotoOfDay");
var photoImgEl = document.getElementById("photoOfDayImg");
var aboutTitleEl = document.getElementById("aboutTitle");
var aboutTextEl = document.getElementById("about-text");
var tabPhotographyEl = document.getElementById("tabPhotography");
var tabPremiumEl = document.getElementById("tabPremium");
var sortSelectEl = document.getElementById("sort-select");
var toggleFiltersEl = document.getElementById("toggleFilters");
var filtersEl = document.getElementById("filters");
var categoryFiltersEl = document.getElementById("categoryFilters");
var priceFiltersEl = document.getElementById("priceFilters");
var cardsEl = document.getElementById("cards");
var paginationEl = document.getElementById("pagination");
var cartModalRootEl = document.getElementById("cartModalRoot");
var cartIconEl = document.getElementById("cartIcon");
var cartCountEl = document.getElementById("cartCount");

// ----- Helpers -----
function setImgFallback(imageEl, fallbackUrl) {
  imageEl.onerror = function () {
    imageEl.onerror = null;
    imageEl.src = fallbackUrl;
  };
}

function getCartItemCount() {
  var total = 0;
  for (var id in cart) {
    if (Object.prototype.hasOwnProperty.call(cart, id)) {
      total += cart[id];
    }
  }
  return total;
}

function updateCartCount() {
  var count = getCartItemCount();
  if (!cartCountEl) return;
  if (count > 0) {
    cartCountEl.textContent = String(count);
    cartCountEl.style.display = "inline-flex";
  } else {
    cartCountEl.style.display = "none";
  }
}

// ----- Photo of the day -----
function renderPhotoOfTheDay() {
  samuraiEl.textContent = photoOfTheDay.title;
  photoImgEl.src = photoOfTheDay.img;
  photoImgEl.alt = photoOfTheDay.title;
  setImgFallback(
    photoImgEl,
    "https://placehold.co/1020x1020/cccccc/000000?text=Image+Error"
  );

  aboutTitleEl.textContent = "About the " + photoOfTheDay.title;
  aboutTextEl.textContent = photoOfTheDay.description;

  addPhotoBtn.addEventListener("click", function () {
    addToCart(photoOfTheDay);
  });
}

// ----- Filters -----
function buildCategoryFilters() {
  categoryFiltersEl.innerHTML = "";
  for (var i = 0; i < Category.length; i++) {
    var cat = Category[i];
    var id = "cat-" + cat.name;

    var wrapper = document.createElement("div");
    wrapper.className = "checkbox";

    var label = document.createElement("label");
    label.setAttribute("for", id);

    var input = document.createElement("input");
    input.id = id;
    input.type = "checkbox";

    // set checked
    var isChecked = false;
    for (var j = 0; j < selectedCategories.length; j++) {
      if (selectedCategories[j].name === cat.name) { isChecked = true; break; }
    }
    input.checked = isChecked;

    (function (catCopy) {
      input.addEventListener("change", function () {
        var existsIndex = -1;
        for (var k = 0; k < selectedCategories.length; k++) {
          if (selectedCategories[k].name === catCopy.name) { existsIndex = k; break; }
        }
        if (existsIndex >= 0) {
          selectedCategories.splice(existsIndex, 1);
        } else {
          selectedCategories.push(catCopy);
        }
        currentPage = 1;
        renderMain();
      });
    })(cat);

    label.appendChild(input);
    label.appendChild(document.createTextNode(" " + cat.name));
    wrapper.appendChild(label);
    categoryFiltersEl.appendChild(wrapper);
  }
}

function buildPriceFilters() {
  priceFiltersEl.innerHTML = "";
  for (var i = 0; i < PriceRange.length; i++) {
    var range = PriceRange[i];
    var id = "price-" + i;

    var wrapper = document.createElement("div");
    wrapper.className = "checkbox";

    var label = document.createElement("label");
    label.setAttribute("for", id);

    var input = document.createElement("input");
    input.id = id;
    input.type = "checkbox";

    input.checked = !!priceRange && priceRange.min === range.min && priceRange.max === range.max;

    (function (rangeCopy, inputEl) {
      input.addEventListener("change", function () {
        if (priceRange && priceRange.min === rangeCopy.min && priceRange.max === rangeCopy.max) {
          priceRange = null; // toggle off
        } else {
          priceRange = rangeCopy; // ensure only one
        }
        buildPriceFilters();
        currentPage = 1;
        renderMain();
      });
    })(range, input);

    label.appendChild(input);
    label.appendChild(document.createTextNode(" " + range.Label));
    wrapper.appendChild(label);
    priceFiltersEl.appendChild(wrapper);
  }
}

function setupSortAndTabs() {
  sortSelectEl.value = sortOrder;
  sortSelectEl.addEventListener("change", function (e) {
    sortOrder = e.target.value;
    currentPage = 1;
    renderMain();
  });

  function updateTabStyles() {
    var activePhotography = !isPremiumFilterActive;
    tabPhotographyEl.style.fontWeight = activePhotography ? "600" : "400";
    tabPhotographyEl.style.color = activePhotography ? "#111" : "#656565";
    var activePremium = isPremiumFilterActive;
    tabPremiumEl.style.fontWeight = activePremium ? "600" : "400";
    tabPremiumEl.style.color = activePremium ? "#111" : "#656565";
  }

  tabPhotographyEl.addEventListener("click", function () {
    isPremiumFilterActive = false;
    selectedCategories = [];
    priceRange = null;
    sortOrder = "none";
    sortSelectEl.value = sortOrder;
    currentPage = 1;
    updateTabStyles();
    buildCategoryFilters();
    buildPriceFilters();
    renderMain();
  });

  tabPremiumEl.addEventListener("click", function () {
    isPremiumFilterActive = true;
    selectedCategories = [];
    priceRange = null;
    sortOrder = "none";
    sortSelectEl.value = sortOrder;
    currentPage = 1;
    updateTabStyles();
    buildCategoryFilters();
    buildPriceFilters();
    renderMain();
  });

  updateTabStyles();

  toggleFiltersEl.addEventListener("click", function () {
    if (filtersEl.classList.contains("show")) {
      filtersEl.classList.remove("show");
    } else {
      filtersEl.classList.add("show");
    }
  });
}

// ----- Cards & Pagination -----
function getFilteredAndSortedItems() {
  var filtered = [];

  // copy all
  for (var i = 0; i < cardObject.length; i++) {
    filtered.push(cardObject[i]);
  }

  // premium filter
  if (isPremiumFilterActive) {
    var onlyPremium = [];
    for (var p = 0; p < filtered.length; p++) {
      if (filtered[p].isPremium) {
        onlyPremium.push(filtered[p]);
      }
    }
    filtered = onlyPremium;
  }

  // category filter
  if (selectedCategories.length > 0) {
    var categories = [];
    for (var c = 0; c < selectedCategories.length; c++) {
      categories.push(selectedCategories[c].name);
    }
    var afterCat = [];
    for (var f = 0; f < filtered.length; f++) {
      var item = filtered[f];
      var match = false;
      for (var k = 0; k < categories.length; k++) {
        if (item.category === categories[k]) { match = true; break; }
      }
      if (match) afterCat.push(item);
    }
    filtered = afterCat;
  }

  // price range
  if (priceRange) {
    var afterPrice = [];
    for (var r = 0; r < filtered.length; r++) {
      var it = filtered[r];
      if (it.price >= priceRange.min && it.price <= priceRange.max) {
        afterPrice.push(it);
      }
    }
    filtered = afterPrice;
  }

  // sort
  if (sortOrder !== "none") {
    filtered = filtered.slice();
    filtered.sort(function (a, b) {
      if (sortOrder === "low-to-high") return a.price - b.price;
      if (sortOrder === "high-to-low") return b.price - a.price;
      return 0;
    });
  }

  return filtered;
}

function renderCards() {
  var filtered = getFilteredAndSortedItems();
  var indexOfLastItem = currentPage * itemsPerPage;
  var indexOfFirstItem = indexOfLastItem - itemsPerPage;
  var currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  cardsEl.innerHTML = "";

  if (currentItems.length === 0) {
    var noP = document.createElement("p");
    noP.className = "no-results";
    noP.textContent = "No items match your selected filters.";
    cardsEl.appendChild(noP);
    return;
  }

  for (var i = 0; i < currentItems.length; i++) {
    var card = currentItems[i];

    var ul = document.createElement("ul");
    var section = document.createElement("section");
    section.className = "card";

    var imgContainer = document.createElement("div");
    imgContainer.className = "card-img-container";

    if (card.isPremium) {
      var badge = document.createElement("div");
      badge.className = "premium-badge";
      badge.textContent = "Premium";
      imgContainer.appendChild(badge);
    }

    var img = document.createElement("img");
    img.src = card.img;
    img.alt = card.title;
    setImgFallback(img, "https://placehold.co/600x600/cccccc/000000?text=Error");

    var btn = document.createElement("button");
    btn.className = "card-btn";
    btn.textContent = "ADD TO CART";
    (function (cardCopy) {
      btn.addEventListener("click", function () { addToCart(cardCopy); });
    })(card);

    imgContainer.appendChild(img);
    imgContainer.appendChild(btn);

    var cat = document.createElement("p");
    cat.className = "card-category";
    cat.textContent = card.category;

    var title = document.createElement("p");
    title.className = "card-title";
    title.textContent = card.title;

    var price = document.createElement("p");
    price.className = "card-price";
    price.textContent = "$" + card.price.toFixed(2);

    section.appendChild(imgContainer);
    section.appendChild(cat);
    section.appendChild(title);
    section.appendChild(price);

    ul.appendChild(section);
    cardsEl.appendChild(ul);
  }
}

function renderPagination() {
  var total = getFilteredAndSortedItems().length;
  var totalPages = Math.ceil(total / itemsPerPage);

  if (totalPages <= 1) {
    paginationEl.innerHTML = "";
    return;
  }

  var frag = document.createDocumentFragment();

  var prev = document.createElement("button");
  prev.textContent = "Prev";
  prev.disabled = currentPage === 1;
  prev.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage -= 1;
      renderMain();
    }
  });
  frag.appendChild(prev);

  for (var i = 1; i <= totalPages; i++) {
    var page = document.createElement("ul");
    page.textContent = String(i);
    if (i === currentPage) page.classList.add("active-page");
    page.style.margin = "0 4px";
    page.style.cursor = "pointer";
    (function (pageNum) {
      page.addEventListener("click", function () {
        currentPage = pageNum;
        renderMain();
      });
    })(i);
    frag.appendChild(page);
  }

  var next = document.createElement("button");
  next.textContent = "Next";
  next.disabled = currentPage === totalPages;
  next.addEventListener("click", function () {
    if (currentPage < totalPages) {
      currentPage += 1;
      renderMain();
    }
  });
  frag.appendChild(next);

  paginationEl.innerHTML = "";
  paginationEl.appendChild(frag);
}

// ----- Cart -----
function addToCart(item) {
  if (!cart[item.id]) {
    cart[item.id] = 0;
  }
  cart[item.id] += 1;
  updateCartCount();
}

function increaseCount(itemId) {
  if (!cart[itemId]) cart[itemId] = 0;
  cart[itemId] += 1;
  updateCartCount();
  renderCartModal();
}

function decreaseCount(itemId) {
  if (!cart[itemId]) return;
  if (cart[itemId] > 1) {
    cart[itemId] -= 1;
  } else {
    delete cart[itemId];
  }
  updateCartCount();
  renderCartModal();
}

function removeFromCart(itemId) {
  delete cart[itemId];
  updateCartCount();
  renderCartModal();
}

function clearCart() {
  cart = {};
  updateCartCount();
  renderCartModal();
}

function openCartModal() {
  renderCartModal();
}

function renderCartModal() {
  var totalCartItems = getCartItemCount();

  if (totalCartItems === 0) {
    cartModalRootEl.innerHTML =
      '<div class="modal-overlay" id="cartOverlay">' +
      '  <div class="modal-panel">' +
      '    <div class="modal-header">' +
      '      <h2>Shopping Cart (0)</h2>' +
      '      <button class="close-btn" id="closeCart">✕</button>' +
      '    </div>' +
      '    <div class="modal-body">' +
      '      <p class="text-center text-gray">Your cart is empty. Start adding some photos!</p>' +
      '    </div>' +
      '  </div>' +
      '</div>';
  } else {
    var itemsHTML = "";
    var subtotal = 0;

    for (var id in cart) {
      if (!Object.prototype.hasOwnProperty.call(cart, id)) continue;
      var count = cart[id];
      var item = null;
      for (var i = 0; i < allItems.length; i++) {
        if (String(allItems[i].id) === String(id)) { item = allItems[i]; break; }
      }
      if (!item) continue;
      var itemTotal = (item.price * count);
      subtotal += itemTotal;

      itemsHTML +=
        '<div class="cart-item">' +
        '  <img src="' + item.img + '" alt="' + item.title + '" class="cart-item-img" />' +
        '  <div class="cart-item-info">' +
        '    <h3 class="cart-item-title">' + item.title + '</h3>' +
        '    <p class="cart-item-qty">Qty: ' + count + '</p>' +
        '    <p class="cart-item-price">$' + item.price.toFixed(2) + '</p>' +
        '  </div>' +
        '  <div class="cart-item-actions">' +
        '    <p class="cart-item-total">$' + itemTotal.toFixed(2) + '</p>' +
        '    <div class="cart-btn">' +
        '      <button class="qty-btn" data-action="dec" data-id="' + id + '">-</button>' +
        '      <span class="qty-count">' + count + '</span>' +
        '      <button class="qty-btn" data-action="inc" data-id="' + id + '">+</button>' +
        '    </div>' +
        '    <button class="remove-btn" data-action="remove" data-id="' + id + '">Remove</button>' +
        '  </div>' +
        '</div>';
    }

    cartModalRootEl.innerHTML =
      '<div class="modal-overlay" id="cartOverlay">' +
      '  <div class="modal-panel">' +
      '    <div class="modal-header">' +
      '      <h2>Shopping Cart (' + totalCartItems + ')</h2>' +
      '      <button class="close-btn" id="closeCart">✕</button>' +
      '    </div>' +
      '    <div class="modal-body">' + itemsHTML + '</div>' +
      '    <div class="modal-footer">' +
      '      <button class="clear-cart" id="clearCartBtn">CLEAR CART</button>' +
      '      <div class="checkout">' +
      '        <span class="subtotal-label">Subtotal:</span>' +
      '        <span class="subtotal-value">$' + subtotal.toFixed(2) + '</span>' +
      '        <button class="checkout-btn">Checkout</button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>';
  }

  var overlay = document.getElementById("cartOverlay");
  if (!overlay) return;
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeCart();
  });

  var closeBtn = document.getElementById("closeCart");
  if (closeBtn) closeBtn.addEventListener("click", closeCart);

  var qtyBtns = document.querySelectorAll(".qty-btn");
  for (var q = 0; q < qtyBtns.length; q++) {
    qtyBtns[q].addEventListener("click", function () {
      var id = this.getAttribute("data-id");
      var action = this.getAttribute("data-action");
      if (action === "inc") increaseCount(id);
      if (action === "dec") decreaseCount(id);
    });
  }

  var removeBtns = document.querySelectorAll(".remove-btn");
  for (var m = 0; m < removeBtns.length; m++) {
    removeBtns[m].addEventListener("click", function () {
      var id = this.getAttribute("data-id");
      removeFromCart(id);
    });
  }

  var clearBtn = document.getElementById("clearCartBtn");
  if (clearBtn) clearBtn.addEventListener("click", clearCart);
}

function closeCart() {
  cartModalRootEl.innerHTML = "";
}

// ----- Main render orchestrator -----
function renderMain() {
  renderCards();
  renderPagination();
}

// ----- Init -----
document.addEventListener("DOMContentLoaded", function () {
  renderPhotoOfTheDay();
  buildCategoryFilters();
  buildPriceFilters();
  setupSortAndTabs();
  renderMain();
  updateCartCount();

  if (cartIconEl) {
    cartIconEl.addEventListener("click", openCartModal);
  }
});