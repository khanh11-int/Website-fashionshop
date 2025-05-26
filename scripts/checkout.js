import {cart, removeFromCart, updateCartQuantityMinus, updateCartQuantityPlus, total_cart_product
  ,reloadCart, updateCartQuantityNumber} from "../data/cart.js";
import {products} from "../data/products.js";
import {js_cart_quantity} from "../scripts/share/header.js";

  let yourCartHTML = '';
  
  cart.forEach((cartItem) => {
  
    const matchingProduct = products.find((product) => product.id === cartItem.id);
  
      yourCartHTML += `
          <div class="cart_product js_cart_product-${matchingProduct.id}">
            <div class="left_cart_product">
              <div class="cart_picture">
                <img class="cart_product_picture" src="${matchingProduct.image}">
              </div>
              <div class="cart_name_and_delbtn">
                <div class="cart_name">${matchingProduct.name}</div>
                <div><span class="delete_button js_delete_button" data-product-id="${matchingProduct.id}"><i class="fa-solid fa-trash-can"></i> Xóa sản phẩm</span></div>
              </div>
            </div>
            
            <div class="right_cart_product">
              <div class="cart_price_of_taskbar">${matchingProduct.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
              <div class="quantity_control">
                <button class="minus_button js_minus_button" data-product-id="${matchingProduct.id}">-</button>
                <input class="quantity js_quantity js_quantity-${matchingProduct.id}" value="${cartItem.quantity}" data-product-id="${matchingProduct.id}"></input>
                <button class="plus_button js_plus_button" data-product-id="${matchingProduct.id}">+</button>
              </div>  
              <div class="cart_total_of_taskbar js_cart_total_of_taskbar_${matchingProduct.id}">${(cartItem.quantity * matchingProduct.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
            </div>
          </div>
      `;
  });
  
  reloadCart();

  document.querySelector('.js_cart_product').innerHTML = yourCartHTML;

  document.querySelectorAll('.js_delete_button').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
  
      removeFromCart(productId);

      const cartProduct = document.querySelector(`.js_cart_product-${productId}`);
      cartProduct.remove();

      reloadCart();
    });
  });

  document.querySelectorAll('.js_quantity').forEach((input) => {
    input.addEventListener('input', () => {
      const productId = input.dataset.productId;
      updateCartQuantityNumber(productId, input.value);
      total_cart_product(productId);

      reloadCart();
    });
  });

  document.querySelectorAll('.js_minus_button').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
  
      updateCartQuantityMinus(productId);
      total_cart_product(productId);
  
      reloadCart();
    });
  });
      
  document.querySelectorAll('.js_plus_button').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
  
      updateCartQuantityPlus(productId);
      total_cart_product(productId);
  
      reloadCart();
    });
  });

  js_cart_quantity();
    

  

