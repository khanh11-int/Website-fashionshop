import {products} from "../data/products.js";
import {js_cart_quantity} from "../scripts/share/header.js";

export let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(id) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (cartItem.id === id) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity++;
  } else {
    cart.push({
      id: id,
      quantity: 1
    });
  }
  saveToStorage();
}

export function removeFromCart(id) {
  cart = cart.filter((cartItem) => cartItem.id !== id);
  js_cart_quantity();
  saveToStorage();
}

export function updateCartQuantity() {
  let cartTitleQuantity = 0;
  cart.forEach((cartItem) => {
    cartTitleQuantity += parseInt(cartItem.quantity);
  });
  document.querySelector('.js_cart_title_quantity').innerHTML = `(${cartTitleQuantity} sản phẩm)`;
}

export function updateCartQuantityPlus(id) {
  cart.forEach((cartItem) => {
    if (cartItem.id === id) {
      cartItem.quantity++;
      document.querySelector(`.js_quantity-${id}`).value = cartItem.quantity;
    }
  });
  saveToStorage();
}
export function updateCartQuantityMinus(id) {
  cart.forEach((cartItem) => {
    if (cartItem.id === id && cartItem.quantity > 1) {
      cartItem.quantity--;
      document.querySelector(`.js_quantity-${id}`).value = cartItem.quantity;
    } else if (cartItem.id === id && cartItem.quantity === 1) {
      removeFromCart(id);
      const cartProduct = document.querySelector(`.js_cart_product-${id}`);
      cartProduct.remove();
    }
  });
  saveToStorage();
}
export function updateCartQuantityNumber(id, value) {
  if (!isNaN(value) && value > 0){
    cart.forEach((cartItem) => {
      if (cartItem.id === id) {
        cartItem.quantity = value;
      }
    });
    saveToStorage();
  }else{
    document.querySelector(`.js_quantity-${id}`).value = 1;
  }
}

export function quantity_cart_summary() {
  const cartQuantitySummary = cart.reduce((total, cartItem) => total + parseInt(cartItem.quantity), 0);
  document.querySelector('.js_item_summary_name').innerHTML = `Sản phẩm(${cartQuantitySummary}):`;
}

export function total_cart_product(id) {
  if (!cart || cart.length === 0) return;
  const cartItem = cart.find((item) => item.id === id);
  const matchingProduct = products.find((product) => product.id === id);
  const totalPrice = cartItem.quantity * matchingProduct.price;
  document.querySelector(`.js_cart_total_of_taskbar_${id}`).innerHTML = totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

export function item_summary_cart() {
  const total = cart.reduce((total, cartItem) => {
    const matchingProduct = products.find((product) => product.id === cartItem.id);
    return total + (cartItem.quantity * matchingProduct.price);
  }, 0);
  document.querySelector('.js_item_summary_money').innerHTML = total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  return total;
}

export function total_summary_cart() {
  const total = item_summary_cart();
  document.querySelector('.js_total_summary_money').innerHTML = total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

export function none_cart() { //kiểm tra giỏ hàng có rỗng hay không
  const noneCart = document.querySelector('.none_cart');
  noneCart.style.display = cart.length === 0 ? 'block' : 'none';
  const cartTaskBar = document.querySelector('.cart_taskbar');
  cartTaskBar.style.display = cart.length === 0 ? 'none' : 'grid';
  const cartSummary = document.querySelector('.cart_summary');
  cartSummary.style.display = cart.length === 0 ? 'none' : 'block';
}

export function reloadCart() {
  updateCartQuantity();
  quantity_cart_summary();
  item_summary_cart();
  total_summary_cart();
  none_cart();
}