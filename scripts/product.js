import { products } from "../data/products.js";
import { addToCart } from "../data/cart.js";
import { js_cart_quantity } from "./share/header.js"; // Import js_cart_quantity từ header.js

// Hàm để lấy tham số từ URL
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Lấy ID sản phẩm từ URL
const productId = getUrlParameter('id');

// Tìm sản phẩm phù hợp
let matchingProduct;
if (productId) {
  products.forEach(product => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });
}

// Nếu không tìm thấy sản phẩm, có thể chuyển hướng hoặc hiển thị thông báo lỗi
if (!matchingProduct) {
  console.error('Không tìm thấy sản phẩm với ID: ' + productId + '. Vui lòng kiểm tra lại URL hoặc dữ liệu sản phẩm.');
  // Tùy chọn: Bạn có thể chuyển hướng người dùng về trang chính nếu sản phẩm không tồn tại
  // window.location.href = 'Taibel.html';
} else {
  // Hiển thị thông tin sản phẩm chính
  document.querySelector('.img_product').src = matchingProduct.image;
  document.querySelector('.product_name').textContent = matchingProduct.name;
  document.querySelector('.product_price').textContent = `Giá: ${matchingProduct.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`;
  document.querySelector('.product_detail_content').innerHTML = matchingProduct.decription;

  // Lấy tham chiếu đến các phần tử điều khiển số lượng và nút thêm vào giỏ hàng
  const minusButton = document.querySelector('.js_minus_button');
  const quantityInput = document.querySelector('.js_quantity');
  const plusButton = document.querySelector('.js_plus_button');
  const addToCartButton = document.querySelector('.js_bt_add_to_cart');

  // Đảm bảo các phần tử này tồn tại trước khi gán sự kiện
  if (minusButton && quantityInput && plusButton && addToCartButton) {
      // Cập nhật data-product-id cho các nút điều khiển số lượng và input số lượng
      minusButton.dataset.productId = matchingProduct.id;
      quantityInput.dataset.productId = matchingProduct.id;
      quantityInput.classList.add(`js_quantity-${matchingProduct.id}`); // Thêm class để dễ dàng chọn
      plusButton.dataset.productId = matchingProduct.id;
      addToCartButton.dataset.productId = matchingProduct.id;

      // Xử lý số lượng sản phẩm
      let quantity = 1; // Số lượng mặc định là 1 khi vào trang chi tiết sản phẩm
      quantityInput.value = quantity; // Gán giá trị ban đầu cho input

      minusButton.addEventListener('click', () => {
        if (quantity > 1) {
          quantity--;
          quantityInput.value = quantity;
        }
      });

      plusButton.addEventListener('click', () => {
        quantity++;
        quantityInput.value = quantity;
      });

      // Xử lý thêm vào giỏ hàng cho sản phẩm chính
      addToCartButton.addEventListener('click', () => {
        addToCart(matchingProduct.id, quantity); // Truyền số lượng hiện tại
        js_cart_quantity(); // Cập nhật số lượng trên icon giỏ hàng
      });
  } else {
      console.error('Không tìm thấy các phần tử điều khiển số lượng hoặc nút thêm vào giỏ hàng của sản phẩm chính trong HTML. Vui lòng kiểm tra lại class của chúng.');
  }

  // Hiển thị sản phẩm liên quan
  let relatedProductsHTML = '';
  // Lấy 4 sản phẩm bất kỳ, trừ sản phẩm hiện tại
  const filteredProducts = products.filter(product => product.id !== matchingProduct.id);
  // Tùy chọn: Trộn ngẫu nhiên sản phẩm để hiển thị các sản phẩm liên quan đa dạng hơn
  // for (let i = filteredProducts.length - 1; i > 0; i--) {
  //   const j = Math.floor(Math.random() * (i + 1));
  //   [filteredProducts[i], filteredProducts[j]] = [filteredProducts[j], filteredProducts[i]];
  // }
  const numberOfRelatedProducts = Math.min(4, filteredProducts.length); // Giới hạn 4 sản phẩm hoặc ít hơn nếu không đủ

  for (let i = 0; i < numberOfRelatedProducts; i++) {
    const relatedProduct = filteredProducts[i]; 

    relatedProductsHTML += `
      <div class="product_related js_related_product_item" data-product-id="${relatedProduct.id}">
        <div class="image_product">
          <img class="image" src="${relatedProduct.image}">
        </div>
        <div class="name_product">
          ${relatedProduct.name}
        </div>
        <div class="price_product">
          ${relatedProduct.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </div>
        <div class="button_product">
          <button class="button_addToCart js_button_addToCart_related" data-product-id="${relatedProduct.id}">Thêm vào giỏ hàng</button>
        </div>
      </div>
    `;
  }

  const relatedProductsList = document.querySelector('.js_related_products_list');
  if (relatedProductsList) {
    relatedProductsList.innerHTML = relatedProductsHTML;

    // Thêm sự kiện nhấp chuột cho sản phẩm liên quan để xem chi tiết
    document.querySelectorAll('.js_related_product_item').forEach(item => {
      item.addEventListener('click', (event) => {
        // Đảm bảo không kích hoạt khi nhấp vào nút "Thêm vào giỏ hàng"
        if (!event.target.classList.contains('js_button_addToCart_related')) {
          const relatedProductId = item.dataset.productId;
          window.location.href = `product.html?id=${relatedProductId}`;
        }
      });
    });

    // Thêm sự kiện cho nút "Thêm vào giỏ hàng" của sản phẩm liên quan
    document.querySelectorAll('.js_button_addToCart_related').forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        addToCart(productId, 1); // Thêm 1 sản phẩm liên quan vào giỏ hàng
        js_cart_quantity(); // Cập nhật số lượng trên icon giỏ hàng
      });
    });
  } else {
      console.error('Không tìm thấy phần tử .js_related_products_list trong HTML. Vui lòng kiểm tra lại class của nó.');
  }

  // Cập nhật số lượng giỏ hàng ban đầu khi trang tải
  js_cart_quantity();
}