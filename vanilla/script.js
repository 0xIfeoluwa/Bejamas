// Junior style script: simple globals and functions

// Helpers
function generateId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "id-" + Math.random().toString(36).slice(2);
}

function setImgFallback(imageEl, fallbackUrl) {
  imageEl.onerror = function () {
    imageEl.onerror = null;
    imageEl.src = fallbackUrl;
  };
}

// Data
var photoOfTheDay = {
  id: 99,
  img: "./images/dog.png",
  title: "Samurai King Resting",
  category: "Pets",
  price: 10000.0,
  isPremium: true,
  description:
    "So how did the classical Latin become so incoherent? According to McClintock, a 15th century typesetter likely scrambled part of Cicero's De Finibus in order to provide placeholder text to mockup various fonts for a type specimen book. So how did the classical Latin become so incoherent? According to McClintock, a 15th century typesetter likely scrambled part of Cicero's De Finibus in order to provide placeholder text to mockup various fonts for a type specimen book. So how did the classical Latin become so incoherent? According to McClintock.",
};

var items = [
  { id: generateId(), img: "./images/people.png", category: "People", title: "Red Bench", price: 3.86, isPremium: true },
  { id: generateId(), img: "./images/man.png", category: "People", title: "Man", price: 100.0, isPremium: false },
  { id: generateId(), img: "./images/landmarks.png", category: "Landmarks", title: "Architecture", price: 101.0, isPremium: true },
  { id: generateId(), img: "./images/food.png", category: "Food", title: "Egg Balloon", price: 93.89 },
  { id: generateId(), img: "./images/people.png", category: "People", title: "Red Bench", price: 3.86, isPremium: true },
  { id: generateId(), img: "./images/man.png", category: "People", title: "Man", price: 100.0 },
  { id: generateId(), img: "./images/landmarks.png", category: "Landmarks", title: "Architecture", price: 101.0 },
  { id: generateId(), img: "./images/food.png", category: "Food", title: "Egg Balloon", price: 93.89 },
  { id: generateId(), img: "./images/people.png", category: "People", title: "Red Bench", price: 3.86 },
  { id: generateId(), img: "./images/man.png", category: "People", title: "Man", price: 100.0 },
  { id: generateId(), img: "./images/landmarks.png", category: "Landmarks", title: "Architecture", price: 101.0, isPremium: true },
  { id: generateId(), img: "./images/food.png", category: "Food", title: "Egg Balloon", price: 93.89, isPremium: true },
  { id: generateId(), img: "./images/people.png", category: "People", title: "Red Bench", price: 3.86 },
  { id: generateId(), img: "./images/man.png", category: "People", title: "Man", price: 100.0, isPremium: true },
  { id: generateId(), img: "./images/landmarks.png", category: "Landmarks", title: "Architecture", price: 101.0 },
  { id: generateId(), img: "./images/food.png", category: "Food", title: "Egg Balloon", price: 93.89, isPremium: true },
];

var categories = [
  { name: "People" },
  { name: "Pets" },
  { name: "Food" },
  { name: "Landmarks" },
  { name: "Cities" },
  { name: "Nature" },
];

var priceRanges = [
  { Label: "Lower than 20$", min: 0, max: 20 },
  { Label: "21$ - 100$", min: 21, max: 100 },
  { Label: "101$ - 200$", min: 101, max: 200 },
  { Label: "201$ and above", min: 201, max: Infinity },
];

// State
var cart = {}; // { [id]: count }
var selectedPriceRange = null;
var selectedCategories = []; // array of names
var sortOrder = "none";
var premiumOnly = false;
var currentPage = 1;
var itemsPerPage = 6;

// Elements
var elSamurai = document.getElementById("samurai");
var elAddPhotoOfDay = document.getElementById("addPhotoOfDay");
var elPhotoOfDayImg = document.getElementById("photoOfDayImg");
var elAboutTitle = document.getElementById("aboutTitle");
var elAboutText = document.getElementById("about-text");
var elTabPhotography = document.getElementById("tabPhotography");
var elTabPremium = document.getElementById("tabPremium");
var elSortSelect = document.getElementById("sort-select");
var elToggleFilters = document.getElementById("toggleFilters");
var elFilters = document.getElementById("filters");
var elCategoryFilters = document.getElementById("categoryFilters");
var elPriceFilters = document.getElementById("priceFilters");
var elCards = document.getElementById("cards");
var elPagination = document.getElementById("pagination");
var elCartModalRoot = document.getElementById("cartModalRoot");
var elCartIcon = document.getElementById("cartIcon");
var elCartCount = document.getElementById("cartCount");

// Init
function init() {
  // Header events
  if (elCartIcon) {
    elCartIcon.addEventListener("click", openCartModal);
  }

  // Photo of the day
  elSamurai.textContent = photoOfTheDay.title;
  elPhotoOfDayImg.src = photoOfTheDay.img;
  elPhotoOfDayImg.alt = photoOfTheDay.title;
  setImgFallback(elPhotoOfDayImg, "https://placehold.co/1020x1020/cccccc/000000?text=Image+Error");
  elAboutTitle.textContent = "About the " + photoOfTheDay.title;
  elAboutText.textContent = photoOfTheDay.description;
  elAddPhotoOfDay.addEventListener("click", function () {
    addToCart(photoOfTheDay);
  });

  // Filters
  buildCategoryFilters();
  buildPriceFilters();

  // Sort and tabs
  elSortSelect.value = sortOrder;
  elSortSelect.addEventListener("change", function (e) {
    sortOrder = e.target.value;
    currentPage = 1;
    renderMain();
  });

  elTabPhotography.addEventListener("click", function () {
    premiumOnly = false;
    selectedCategories = [];
    selectedPriceRange = null;
    sortOrder = "none";
    elSortSelect.value = sortOrder;
    currentPage = 1;
    updateTabStyles();
    buildCategoryFilters();
    buildPriceFilters();
    renderMain();
  });

  elTabPremium.addEventListener("click", function () {
    premiumOnly = true;
    selectedCategories = [];
    selectedPriceRange = null;
    sortOrder = "none";
    elSortSelect.value = sortOrder;
    currentPage = 1;
    updateTabStyles();
    buildCategoryFilters();
    buildPriceFilters();
    renderMain();
  });

  elToggleFilters.addEventListener("click", function () {
    if (elFilters) {
      if (elFilters.classList.contains("show")) {
        elFilters.classList.remove("show");
      } else {
        elFilters.classList.add("show");
      }
    }
  });

  updateTabStyles();
  renderMain();
  updateCartCount();
}

overrideTabClasses = null;
function updateTabStyles() {
  if (premiumOnly) {
    elTabPremium.style.fontWeight = "600";
    elTabPremium.style.color = "#111";
    elTabPhotography.style.fontWeight = "400";
    elTabPhotography.style.color = "#656565";
  } else {
    elTabPhotography.style.fontWeight = "600";
    elTabPhotography.style.color = "#111";
    elTabPremium.style.fontWeight = "400";
    elTabPremium.style.color = "#656565";
  }
}

function buildCategoryFilters() {
  elCategoryFilters.innerHTML = "";
  for (var i = 0; i < categories.length; i++) {
    var cat = categories[i];
    var id = "cat-" + cat.name;
    var wrapper = document.createElement("div");
    wrapper.className = "checkbox";
    wrapper.innerHTML = '<label for="' + id + '"><input id="' + id + '" type="checkbox" /> ' + cat.name + "</label>";
    var input = wrapper.querySelector("input");
    input.checked = selectedCategories.indexOf(cat.name) !== -1;
    input.addEventListener("change", (function (name) {
      return function () {
        var idx = selectedCategories.indexOf(name);
        if (idx !== -1) {
          selectedCategories.splice(idx, 1);
        } else {
          selectedCategories.push(name);
        }
        currentPage = 1;
        renderMain();
      };
    })(cat.name));
    elCategoryFilters.appendChild(wrapper);
  }
}

function buildPriceFilters() {
  elPriceFilters.innerHTML = "";
  for (var i = 0; i < priceRanges.length; i++) {
    var range = priceRanges[i];
    var id = "price-" + i;
    var wrapper = document.createElement("div");
    wrapper.className = "checkbox";
    wrapper.innerHTML = '<label for="' + id + '"><input id="' + id + '" type="checkbox" /> ' + range.Label + "</label>";
    var input = wrapper.querySelector("input");
    input.checked = selectedPriceRange && selectedPriceRange.min === range.min && selectedPriceRange.max === range.max;
    input.addEventListener("change", (function (thisRange) {
      return function () {
        if (selectedPriceRange && selectedPriceRange.min === thisRange.min && selectedPriceRange.max === thisRange.max) {
          selectedPriceRange = null;
        } else {
          selectedPriceRange = thisRange;
        }
        buildPriceFilters();
        currentPage = 1;
        renderMain();
      };
    })(range));
    elPriceFilters.appendChild(wrapper);
  }
}

function getFilteredAndSortedItems() {
  var filtered = [];
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    if (premiumOnly && !it.isPremium) continue;
    if (selectedCategories.length > 0 && selectedCategories.indexOf(it.category) === -1) continue;
    if (selectedPriceRange && (it.price < selectedPriceRange.min || it.price > selectedPriceRange.max)) continue;
    filtered.push(it);
  }

  if (sortOrder === "low-to-high") {
    filtered.sort(function (a, b) { return a.price - b.price; });
  } else if (sortOrder === "high-to-low") {
    filtered.sort(function (a, b) { return b.price - a.price; });
  }

  return filtered;
}

function renderCards() {
  var filtered = getFilteredAndSortedItems();
  var indexOfLastItem = currentPage * itemsPerPage;
  var indexOfFirstItem = indexOfLastItem - itemsPerPage;
  var currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  elCards.innerHTML = "";

  if (currentItems.length === 0) {
    var p = document.createElement("p");
    p.className = "no-results";
    p.textContent = "No items match your selected filters.";
    elCards.appendChild(p);
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
    (function (c) {
      btn.addEventListener("click", function () { addToCart(c); });
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
    elCards.appendChild(ul);
  }
}

function renderPagination() {
  var total = getFilteredAndSortedItems().length;
  var totalPages = Math.ceil(total / itemsPerPage);

  if (totalPages <= 1) {
    elPagination.innerHTML = "";
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
    (function (n) {
      page.addEventListener("click", function () {
        currentPage = n;
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

  elPagination.innerHTML = "";
  elPagination.appendChild(frag);
}

// Cart logic (plain object state)
function addToCart(item) {
  var id = item.id;
  if (!cart[id]) cart[id] = 0;
  cart[id] += 1;
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

function updateCartCount() {
  var total = 0;
  for (var id in cart) {
    total += cart[id];
  }
  if (!elCartCount) return;
  if (total > 0) {
    elCartCount.textContent = String(total);
    elCartCount.style.display = "inline-flex";
  } else {
    elCartCount.style.display = "none";
  }
}

function openCartModal() {
  renderCartModal();
}

function renderCartModal() {
  var totalCartItems = 0;
  for (var id in cart) totalCartItems += cart[id];

  if (totalCartItems === 0) {
    elCartModalRoot.innerHTML = '
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
      </div>';
  } else {
    var itemsHTML = "";
    var subtotal = 0;
    for (var key in cart) {
      var count = cart[key];
      var item = null;
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === key) { item = items[i]; break; }
      }
      if (!item && String(photoOfTheDay.id) === String(key)) {
        item = photoOfTheDay;
      }
      if (!item) continue;
      var itemTotal = item.price * count;
      subtotal += itemTotal;
      itemsHTML +=
        '<div class="cart-item">' +
          '<img src="' + item.img + '" alt="' + item.title + '" class="cart-item-img" />' +
          '<div class="cart-item-info">' +
            '<h3 class="cart-item-title">' + item.title + '</h3>' +
            '<p class="cart-item-qty">Qty: ' + count + '</p>' +
            '<p class="cart-item-price">$' + item.price.toFixed(2) + '</p>' +
          '</div>' +
          '<div class="cart-item-actions">' +
            '<p class="cart-item-total">$' + itemTotal.toFixed(2) + '</p>' +
            '<div class="cart-btn">' +
              '<button class="qty-btn" data-action="dec" data-id="' + key + '">-</button>' +
              '<span class="qty-count">' + count + '</span>' +
              '<button class="qty-btn" data-action="inc" data-id="' + key + '">+</button>' +
            '</div>' +
            '<button class="remove-btn" data-action="remove" data-id="' + key + '">Remove</button>' +
          '</div>' +
        '</div>';
    }

    elCartModalRoot.innerHTML =
      '<div class="modal-overlay" id="cartOverlay">' +
        '<div class="modal-panel">' +
          '<div class="modal-header">' +
            '<h2>Shopping Cart (' + totalCartItems + ')</h2>' +
            '<button class="close-btn" id="closeCart">✕</button>' +
          '</div>' +
          '<div class="modal-body">' + itemsHTML + '</div>' +
          '<div class="modal-footer">' +
            '<button class="clear-cart" id="clearCartBtn">CLEAR CART</button>' +
            '<div class="checkout">' +
              '<span class="subtotal-label">Subtotal:</span>' +
              '<span class="subtotal-value">$' + subtotal.toFixed(2) + '</span>' +
              '<button class="checkout-btn">Checkout</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  var overlay = document.getElementById("cartOverlay");
  if (!overlay) return;
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeCart();
  });

  var closeBtn = document.getElementById("closeCart");
  if (closeBtn) closeBtn.addEventListener("click", closeCart);

  var qtyBtns = elCartModalRoot.querySelectorAll(".qty-btn");
  for (var i = 0; i < qtyBtns.length; i++) {
    qtyBtns[i].addEventListener("click", function () {
      var id = this.getAttribute("data-id");
      var action = this.getAttribute("data-action");
      if (action === "inc") increaseCount(id);
      if (action === "dec") decreaseCount(id);
    });
  }

  var removeBtns = elCartModalRoot.querySelectorAll(".remove-btn");
  for (var j = 0; j < removeBtns.length; j++) {
    removeBtns[j].addEventListener("click", function () {
      removeFromCart(this.getAttribute("data-id"));
    });
  }

  var clearBtn = document.getElementById("clearCartBtn");
  if (clearBtn) clearBtn.addEventListener("click", clearCart);
}

function closeCart() {
  elCartModalRoot.innerHTML = "";
}

function renderMain() {
  renderCards();
  renderPagination();
}

// Start
document.addEventListener("DOMContentLoaded", init);
