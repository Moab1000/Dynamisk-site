"use strict";

const categoryURL = "https://kea-alt-del.dk/t7/api/categories";
const seasonURL = "https://kea-alt-del.dk/t7/api/seasons";

const categoryContainer = document.querySelector(".category_list_container");
const seasonContainer = document.querySelector(".season_list_container");

// Mine egne billeder til sæsonerne (Fall har intet billede endnu)
const seasonImages = {
  Spring: "img/Spring.webp",
  Summer: "img/sommer.webp",
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
    categoryContainer.innerHTML += `<a href="productlist.html?category=${cat.category}">${cat.category}</a>`;
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
      <a href="productlist.html?season=${s.season}" class="season_card">
        ${seasonImages[s.season] ? `<img src="${seasonImages[s.season]}" alt="${s.season}">` : ""}
        <span>${s.season}</span>
      </a>
    `;
  });
}

getCategories();
getSeasons();
