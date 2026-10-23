"use strict";

/* =========================================================
   Pengaturan
   ========================================================= */
const API_URL = "https://dummyjson.com/products?limit=20";

/* =========================================================
   1. FETCH API — Data produk
   ========================================================= */
const listEl = document.getElementById("product-list");
const statusEl = document.getElementById("status");
const retryBtn = document.getElementById("retry");
const searchEl = document.getElementById("search");
const categoryEl = document.getElementById("category-filter");

let allProducts = [];

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = "status" + (type ? " is-" + type : "");
}

async function loadProducts() {
  setStatus("Memuat produk...");
  retryBtn.hidden = true;
  listEl.innerHTML = "";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Server menjawab dengan status " + response.status);
    }
    const data = await response.json();   // olah response JSON
    allProducts = data.products;          // array produk ada di properti "products"
    populateCategories(allProducts);
    renderProducts(allProducts);
    setStatus(allProducts.length + " produk dimuat.");
  } catch (error) {
    console.error(error);
    setStatus("Produk gagal dimuat: " + error.message + ". Periksa koneksi internet lalu coba lagi.", "error");
    retryBtn.hidden = false;
  }
}

function renderProducts(products) {
  listEl.innerHTML = "";

  if (products.length === 0) {
    setStatus("Tidak ada produk yang cocok dengan pencarian.");
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("li");
    card.className = "product";

    const img = document.createElement("img");
    img.src = product.thumbnail;
    img.alt = product.title;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "product__body";

    const category = document.createElement("p");
    category.className = "product__meta";
    category.textContent = product.category;

    const name = document.createElement("h3");
    name.className = "product__name";
    name.textContent = product.title;

    const price = document.createElement("p");
    price.className = "product__price";
    price.textContent = "$" + product.price.toFixed(2);

    body.append(category, name, price);
    card.append(img, body);
    listEl.appendChild(card);
  });
}

// Isi dropdown kategori dari data produk (tanpa duplikat, urut abjad)
function populateCategories(products) {
  const categories = [...new Set(products.map((p) => p.category))].sort();
  categoryEl.length = 1; // sisakan opsi "Semua Kategori"
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryEl.appendChild(option);
  });
}

// Gabungkan filter pencarian dan kategori
function applyFilters() {
  const keyword = searchEl.value.trim().toLowerCase();
  const category = categoryEl.value;

  const filtered = allProducts.filter((p) =>
    p.title.toLowerCase().includes(keyword) &&
    (category === "all" || p.category === category)
  );

  setStatus("");
  renderProducts(filtered);
  if (filtered.length > 0) setStatus(filtered.length + " produk ditampilkan.");
}

searchEl.addEventListener("input", applyFilters);     // saat mengetik
categoryEl.addEventListener("change", applyFilters);  // saat kategori diganti

retryBtn.addEventListener("click", loadProducts);

/* =========================================================
   Mulai
   ========================================================= */
loadProducts();