"use strict";

const categoryURL = "https://kea-alt-del.dk/t7/api/categories";
const seasonURL = "https://kea-alt-del.dk/t7/api/seasons";

const categoryContainer = document.querySelector(".category_list_container");
const seasonContainer = document.querySelector(".season_list_container");

// Mine egne billeder til kategorierne
const categoryImages = {
  Accessories: "img/accessories.jpg",
  Apparel: "img/apparel.jpg",
  Footwear: "img/footwear.jpg",
  "Free Items": "img/free-items.jpg",
  "Personal Care": "img/personal-care.jpg",
  "Sporting Goods": "img/sporting-goods.jpg",
};

// Mine egne billeder til sæsonerne
const seasonImages = {
  Spring: "img/Spring.webp",
  Summer: "img/sommer.webp",
  Fall: "img/efteraar.jpg",
  Winter: "img/vinter.webp",
};

// Kategorier
function getCategories() {
  fetch(categoryURL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showCategories(data);
    });
}

function showCategories(categories) {
  categoryContainer.innerHTML = "";

  categories.forEach((cat) => {
    categoryContainer.innerHTML += `
      <a href="productlist.html?category=${cat.category}" class="card">
        <img src="${categoryImages[cat.category]}" alt="${cat.category}">
        <span>${cat.category}</span>
      </a>
    `;
  });
}

// Sæsoner
function getSeasons() {
  fetch(seasonURL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showSeasons(data);
    });
}

function showSeasons(seasons) {
  seasonContainer.innerHTML = "";

  seasons.forEach((s) => {
    seasonContainer.innerHTML += `
      <a href="productlist.html?season=${s.season}" class="card">
        ${seasonImages[s.season] ? `<img src="${seasonImages[s.season]}" alt="${s.season}">` : ""}
        <span>${s.season}</span>
      </a>
    `;
  });
}

getCategories();
getSeasons();
