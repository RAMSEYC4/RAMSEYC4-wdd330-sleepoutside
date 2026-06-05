import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
  const totalEl = document.querySelector(".cart-total");
  if (cartItems.length > 0) {
    totalEl.textContent = `Total: $${total.toFixed(2)}`;
  } else {
    totalEl.textContent = "";
  }

  document.querySelectorAll(".cart-card__remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      removeCartItem(e.target.dataset.id);
    });
  });
}

function removeCartItem(productId) {
  const cartItems = getLocalStorage("so-cart") || [];
  const updated = cartItems.filter((item) => item.Id !== productId);
  setLocalStorage("so-cart", updated);
  renderCartContents();
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryLarge}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="cart-card__remove" data-id="${item.Id}">Remove</button>
</li>`;
  return newItem;
}

renderCartContents();
