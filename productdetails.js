"use strict";

const id = new URLSearchParams(window.location.search).get("id");
const productURL = "https://kea-alt-del.dk/t7/api/products/" + id;
const productContainer = document.querySelector(".product_container");

function getData(url) {
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showProduct(data);
    });
}

function showProduct(product) {
  console.log("product", product);

  let soldoutClass = "";
  if (product.soldout) {
    soldoutClass = "udsolgt";
  }

  let discountClass = "";
  if (product.discount) {
    discountClass = "nedsat";
  }

  document.querySelector(".breadcrumbs").innerHTML = `
    <li><a href="index.html">Home</a></li>
    <li><a href="productlist.html?category=${product.category}">${product.category}</a></li>
    <li>${product.productdisplayname}</li>
  `;

  productContainer.className = `product_container ${soldoutClass} ${discountClass}`;

  productContainer.innerHTML = `
    <div class="produkt_billede">
      <img src="https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp" alt="${product.productdisplayname}">
      <p class="soldout_tag">Sold Out</p>
    </div>

    <div class="product_info">
      <h2>Product Information</h2>
      <dl>
        <dt>Model</dt>
        <dd>${product.productdisplayname}</dd>
        <dt>Color</dt>
        <dd>${product.basecolour}</dd>
        <dt>Season</dt>
        <dd>${product.season}</dd>
        <dt>Inventory number</dt>
        <dd>${product.id}</dd>
        <dt>Description</dt>
        <dd class="description">${product.description}</dd>
      </dl>

      <h2 class="brand">${product.brandname}</h2>
      <p>${product.brandbio}</p>
    </div>

    <div class="koeb_boks">
      <h1>${product.productdisplayname}</h1>
      <p class="product_type">${product.brandname} | ${product.category}</p>

      <div class="price">
        <p class="normal_pris">DKK ${product.price},-</p>
        ${product.discount ? `<p class="ny_pris">Now DKK ${getDiscountPrice(product.price, product.discount)},- <span>-${product.discount}%</span></p>` : ""}
      </div>

      <form>
        <label>
          Choose a size
          <select name="size">
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
          </select>
        </label>
        <button type="button">Add to basket</button>
      </form>
    </div>
  `;
}

function getDiscountPrice(originalPrice, discount) {
  return Math.round((originalPrice * (100 - discount)) / 100);
}

getData(productURL);
