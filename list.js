"use strict";

//console.log("list.js");

const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get("category");
console.log(selectedCategory);

let productURL = "https://kea-alt-del.dk/t7/api/products";
if (selectedCategory) {
  productURL = `https://kea-alt-del.dk/t7/api/products?category=${selectedCategory}`;
}
const listContainer = document.querySelector(".product_list_container");

let allProducts = [];

function getData(url) {
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      allProducts = data;
      showProducts(data);
    });
}

// Filter: Alle
document.querySelector("#alle").addEventListener("click", () => {
  showProducts(allProducts);
});

// Filter: Tilbud
document.querySelector("#tilbud").addEventListener("click", () => {
  const tilbud = allProducts.filter((product) => product.discount);
  showProducts(tilbud);
});

// Filter: På lager
document.querySelector("#paaLager").addEventListener("click", () => {
  const paaLager = allProducts.filter((product) => product.soldout === 0);
  showProducts(paaLager);
});

function showProducts(products) {
  console.log("first product", products[0]);
  console.log("number of products", products.length);

  listContainer.innerHTML = "";

  products.forEach((product) => {
    let soldoutClass = "";
    if (product.soldout) {
      soldoutClass = "soldout";
    } else {
      soldoutClass = "";
    }

    listContainer.innerHTML += `
      <article class="product ${soldoutClass}">
        <img src="https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp" alt="${product.productdisplayname}" />
        <h3>${product.productdisplayname}</h3>
        <p>${product.brandname} - ${product.articletype}</p>
        <div>
          ${product.discount ? `<p>${getDiscountPrice(product.price, product.discount)} kr</p>` : ""}
          <p>${product.price} kr ${product.discount ? "<em class='discount_tag'>- " + product.discount + "%</em>" : ""}</p>
        </div>
        <p><a href="product.html?id=${product.id}">Read More</a></p>
        ${product.soldout ? `<p class="soldout_tag">Sold Out</p>` : ""}
      </article>
    `;
  });
}

getData(productURL);

function getDiscountPrice(originalPrice, discount) {
  return (originalPrice * (100 - discount)) / 100;
}

console.log("100 - 25%", getDiscountPrice(100, 25));

const products = [
  { season: "fall", brand: "Adidas", price: 233 },
  { season: "fall", brand: "Asics", price: 440 },
  { season: "summer", brand: "Nike", price: 12 },
  { season: "spring", brand: "NB", price: 499 },
];

const result = products.filter((product) => product.price < 300);

console.log(result);
