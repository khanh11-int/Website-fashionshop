import { products } from "../data/products.js";
import { addToCart } from "../data/cart.js";
import { js_cart_quantity } from "./share/header.js";

// Lấy tham chiếu đến phần tử chứa sản phẩm và tiêu đề "SẢN PHẨM NỔI BẬT"
const productsContainer = document.querySelector('.js_cosmetics_products');
const mainProductNameSection = document.querySelector('.main_name_product'); // Phần tử chứa tiêu đề và HR

// Hàm để hiển thị sản phẩm
function renderProducts(productsToDisplay) {
  let productsHTML = '';

  productsToDisplay.forEach((product) => {
    productsHTML += `
      <div class="product js_product" data-product-id="${product.id}">
        <div class="image_product">
          <img class="image" src="${product.image}">
        </div>
        <div class="name_product">
          ${product.name}
        </div>
        <div class="price_product">
          ${product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </div>
        <div class="button_product">
          <button class="button_addToCart js_button_addToCart" data-product-id="${product.id}">Thêm vào giỏ hàng</button>
        </div>
      </div>
    `;
  });

  productsContainer.innerHTML = productsHTML;

  // Gắn lại sự kiện cho các nút "Thêm vào giỏ hàng"
  document.querySelectorAll('.js_button_addToCart').forEach((button) => {
    button.addEventListener('click', (event) => {
      // Ngăn chặn sự kiện click lan truyền lên phần tử sản phẩm (để không chuyển trang)
      event.stopPropagation();
      const productId = button.dataset.productId;
      addToCart(productId);
      js_cart_quantity();
    });
  });

  // Gắn lại sự kiện cho các sản phẩm để chuyển đến trang chi tiết
  document.querySelectorAll('.js_product').forEach((product) => {
    product.addEventListener('click', (event) => {
      // Kiểm tra xem phần tử được nhấp có phải là nút "Thêm vào giỏ hàng" hay không
      // Nếu không phải, thì chuyển đến trang chi tiết sản phẩm
      if (!event.target.classList.contains('js_button_addToCart')) {
        const productId = product.dataset.productId;
        const productUrl = `product.html?id=${productId}`;
        window.location.href = productUrl;
      }
    });
  });
}

// 1. Hiển thị tất cả sản phẩm khi trang tải lần đầu (chức năng ban đầu)
renderProducts(products);
js_cart_quantity(); // Cập nhật số lượng giỏ hàng ban đầu

// 2. Xử lý sự kiện click vào các liên kết danh mục
document.querySelectorAll('.js_category_link').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a> (chuyển trang)

    const category = link.dataset.category; // Lấy giá trị data-category

    // Lọc sản phẩm theo danh mục
    const filteredProducts = products.filter(product => product.category === category);

    // Ẩn phần tiêu đề "SẢN PHẨM NỔI BẬT"
    mainProductNameSection.style.display = 'none';

    // Hiển thị các sản phẩm đã lọc
    renderProducts(filteredProducts);
  });
});

// Bạn có thể thêm một cách để hiển thị lại "SẢN PHẨM NỔI BẬT" và tất cả sản phẩm
// Ví dụ: khi click vào "Trang chủ" hoặc một nút "Xem tất cả sản phẩm"
// Hiện tại, nếu bạn muốn quay lại trạng thái ban đầu, bạn sẽ cần refresh trang.
// Nếu muốn có nút "Xem tất cả sản phẩm", bạn có thể thêm như sau vào HTML:
/*
<button class="js_show_all_products">Xem tất cả sản phẩm</button>
*/
// Và thêm JS sau:
/*
document.querySelector('.js_show_all_products').addEventListener('click', () => {
  mainProductNameSection.style.display = ''; // Hiện lại tiêu đề
  renderProducts(products); // Hiển thị lại tất cả sản phẩm
});
*/

