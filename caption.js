"use strict";

/* =========================================================
   2. FORM — DOM & Event Handling
   ========================================================= */
const form = document.getElementById("caption-form");
const namaEl = document.getElementById("nama");
const hargaEl = document.getElementById("harga");
const templateEl = document.getElementById("template");
const hasilEl = document.getElementById("hasil");
const counterEl = document.getElementById("counter");
const copyBtn = document.getElementById("copy");
const feedbackEl = document.getElementById("feedback");

const formatRupiah = (angka) => "Rp" + angka.toLocaleString("id-ID");

// Template caption: setiap template adalah fungsi yang menerima nama & harga
const templates = {
  promo: (n, h) =>
    `PROMO SPESIAL!\n\n${n} sekarang hanya ${h}.\n\nJangan sampai kehabisan, pesan hari ini ya!\n\n#promo #diskon #belanjaonline`,
  baru: (n, h) =>
    `Hai, kenalan dulu sama produk terbaru kami!\n\n${n} sudah tersedia dengan harga ${h}.\n\nCek dan pesan sekarang.\n\n#produkbaru #newarrival #belanjaonline`,
  terbatas: (n, h) =>
    `STOK TERBATAS!\n\n${n} cuma ${h} dan jumlahnya tidak banyak.\n\nAmankan bagianmu sebelum habis.\n\n#stokterbatas #limitededition #belanjaonline`,
  testimoni: (n, h) =>
    `"Beli ${n} dan tidak menyesal!" kata pelanggan kami.\n\nSekarang giliran kamu coba, harganya ${h} saja.\n\nKirim pesan untuk memesan.\n\n#testimoni #pelangganpuas #belanjaonline`
};

function showError(input, message) {
  const field = input.closest(".field");
  field.classList.toggle("has-error", message !== "");
  document.getElementById(input.id + "-error").textContent = message;
  input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
}

// Validasi sederhana — mengembalikan pesan error atau "" jika valid
function validateNama() {
  const nama = namaEl.value.trim();
  if (nama === "") return "Nama produk wajib diisi.";
  if (nama.length < 3) return "Nama produk minimal 3 karakter.";
  return "";
}

function validateHarga() {
  const raw = hargaEl.value.trim();
  if (raw === "") return "Harga wajib diisi.";
  if (!/^\d+$/.test(raw)) return "Harga hanya boleh berisi angka, tanpa titik atau huruf.";
  if (Number(raw) <= 0) return "Harga harus lebih dari 0.";
  return "";
}

function setFeedback(message, type = "") {
  feedbackEl.textContent = message;
  feedbackEl.className = "status" + (type ? " is-" + type : "");
}

function updateResultState() {
  const length = hasilEl.value.length;
  counterEl.textContent = length + " karakter";
  copyBtn.disabled = length === 0;
}

// Event "input": hapus pesan error begitu pengguna memperbaiki isian
namaEl.addEventListener("input", () => {
  if (namaEl.closest(".field").classList.contains("has-error")) showError(namaEl, validateNama());
});
hargaEl.addEventListener("input", () => {
  if (hargaEl.closest(".field").classList.contains("has-error")) showError(hargaEl, validateHarga());
});

// Event "submit": validasi lalu buat caption
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const namaError = validateNama();
  const hargaError = validateHarga();
  showError(namaEl, namaError);
  showError(hargaEl, hargaError);

  if (namaError || hargaError) {
    hasilEl.value = "";
    updateResultState();
    setFeedback("Periksa kembali isian yang bertanda merah.", "error");
    (namaError ? namaEl : hargaEl).focus();
    return;
  }

  const caption = templates[templateEl.value](namaEl.value.trim(), formatRupiah(Number(hargaEl.value)));
  hasilEl.value = caption;
  updateResultState();
  setFeedback("Caption berhasil dibuat.", "ok");
});

// Event "click": salin hasil ke clipboard
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(hasilEl.value);
    setFeedback("Caption disalin ke clipboard.", "ok");
  } catch {
    hasilEl.select();
    setFeedback("Salin otomatis gagal. Teks sudah dipilih, tekan Ctrl+C.", "error");
  }
});

/* =========================================================
   Mulai
   ========================================================= */
updateResultState();