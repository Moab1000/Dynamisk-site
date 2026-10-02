"use strict";

// Læs category og season fra URL'en (fx productlist.html?category=Apparel)
const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get("category");
const selectedSeason = params.get("season");

// Byg URL'en til API'et ud fra det der er valgt
let productURL = "https://kea-alt-del.dk/t7/api/products?limit=100";
if (selectedCategory) {
  productURL += `&category=${selectedCategory}`;
}
if (selectedSeason) {
  productURL += `&season=${selectedSeason}`;
}

const listContainer = document.querySelector(".product_list_container");
let allProducts = [];

// Overskrift
if (selectedCategory) {
  document.querySelector("h1").textContent = selectedCategory;
} else if (selectedSeason) {
  document.querySelector("h1").textContent = selectedSeason;
}

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

// Filter: Category (skifter URL'en, så API'et henter nye produkter)
const categoryButtons = document.querySelectorAll(".filter_category button");
categoryButtons.forEach((button) => {
  if (button.dataset.category === (selectedCategory || "All")) {
    button.classList.add("selected");
  }
  button.addEventListener("click", (evt) => {
    const newParams = new URLSearchParams(window.location.search);
    if (evt.target.dataset.category === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", evt.target.dataset.category);
    }
    window.location.href = `productlist.html?${newParams.toString()}`;
  });
});

// Filter: Season (skifter også URL'en)
const seasonButtons = document.querySelectorAll(".filter_season button");
seasonButtons.forEach((button) => {
  if (button.dataset.season === (selectedSeason || "All")) {
    button.classList.add("selected");
  }
  button.addEventListener("click", (evt) => {
    const newParams = new URLSearchParams(window.location.search);
    if (evt.target.dataset.season === "All") {
      newParams.delete("season");
    } else {
      newParams.set("season", evt.target.dataset.season);
    }
    window.location.href = `productlist.html?${newParams.toString()}`;
  });
});

// Filter: Who (filtrerer de produkter vi allerede har hentet)
const whoButtons = document.querySelectorAll(".filter_who button");
whoButtons.forEach((button) => {
  button.addEventListener("click", (evt) => {
    whoButtons.forEach((button) => {
      button.classList.remove("selected");
    });
    evt.target.classList.add("selected");

    if (evt.target.dataset.gender === "All") {
      showProducts(allProducts);
    } else {
      const who = allProducts.filter((product) => product.gender === evt.target.dataset.gender);
      showProducts(who);
    }
  });
});

// Filter: Deals
const dealButtons = document.querySelectorAll(".filter_deals button");
dealButtons.forEach((button) => {
  button.addEventListener("click", (evt) => {
    dealButtons.forEach((button) => {
      button.classList.remove("selected");
    });
    evt.target.classList.add("selected");
    const deal = evt.target.dataset.deal;

    if (deal === "All") {
      showProducts(allProducts);
    } else if (deal === "Sale") {
      const onSale = allProducts.filter((product) => product.discount);
      showProducts(onSale);
    } else if (deal === "InStock") {
      const inStock = allProducts.filter((product) => product.soldout === 0);
      showProducts(inStock);
    }
  });
});

// Sortering: Price (bruger tilbudsprisen hvis der er rabat)
const priceButtons = document.querySelectorAll(".filter_price button");
priceButtons.forEach((button) => {
  button.addEventListener("click", (evt) => {
    priceButtons.forEach((button) => {
      button.classList.remove("selected");
    });
    evt.target.classList.add("selected");

    const sorted = allProducts.sort((a, b) => {
      const priceA = a.discount ? getDiscountPrice(a.price, a.discount) : a.price;
      const priceB = b.discount ? getDiscountPrice(b.price, b.discount) : b.price;

      if (evt.target.dataset.sort === "low") {
        return priceA - priceB;
      }
      return priceB - priceA;
    });
    showProducts(sorted);
  });
});

function showProducts(products) {
  listContainer.innerHTML = "";

  products.forEach((product) => {
    let soldoutClass = "";
    if (product.soldout) {
      soldoutClass = "soldout";
    }

    listContainer.innerHTML += `
      <article class="product ${soldoutClass}">
        <a href="productdetails.html?id=${product.id}">
          <img src="https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp" alt="${product.productdisplayname}" />
        </a>
        <h3>${product.productdisplayname}</h3>
        <p>${product.brandname} - ${product.articletype}</p>
        <div>
          ${product.discount ? `<p>${getDiscountPrice(product.price, product.discount)} kr</p>` : ""}
          <p>${product.price} kr ${product.discount ? "<em class='discount_tag'>- " + product.discount + "%</em>" : ""}</p>
        </div>
        <p><a href="productdetails.html?id=${product.id}">Read More</a></p>
        ${product.soldout ? `<p class="soldout_tag">Sold Out</p>` : ""}
      </article>
    `;
  });
}

function getDiscountPrice(originalPrice, discount) {
  return Math.round((originalPrice * (100 - discount)) / 100);
}

getData(productURL);
