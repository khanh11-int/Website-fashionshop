import { cart } from '../../data/cart.js';

export function js_cart_quantity() {
  let quantity = 0;
  cart.forEach(() => {
    quantity++;
  });
  document.querySelector('.js_cart_quantity').innerHTML = `${quantity}`;
}

const seaconSearchButton = document.querySelector('.js_seacon_search_button');
const seaconSearchInput = document.querySelector('.js_seacon_search_bar');

seaconSearchButton.addEventListener('click', () => {
  const searchTerm = seaconSearchInput.value.trim();
  localStorage.setItem('searchTerm', searchTerm);
  const searchUrl = `search.html?search=${encodeURIComponent(searchTerm)}`;
  window.location.href = searchUrl;
});

seaconSearchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const searchTerm = seaconSearchInput.value.trim();
    localStorage.setItem('searchTerm', searchTerm);
    const searchUrl = `search.html?search=${encodeURIComponent(searchTerm)}`;
    window.location.href = searchUrl;
  }
});


const searchButtonInSearch = document.querySelector('.js_search_button');
const searchInputInSearch = document.querySelector('.js_search_bar');

searchButtonInSearch.addEventListener('click', () => {
  const searchTerm = searchInputInSearch.value.trim();
  localStorage.setItem('searchTerm', searchTerm);
  const searchUrl = `search.html?search=${encodeURIComponent(searchTerm)}`;
  window.location.href = searchUrl;
});

searchInputInSearch.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const searchTerm = searchInputInSearch.value.trim();
    localStorage.setItem('searchTerm', searchTerm);
    const searchUrl = `search.html?search=${encodeURIComponent(searchTerm)}`;
    window.location.href = searchUrl;
  }
});

