import { cart } from "../data/cart.js"; // Import giỏ hàng
import { products } from "../data/products.js"; // Import danh sách sản phẩm
import { js_cart_quantity } from "./share/header.js"; // Import hàm cập nhật số lượng giỏ hàng trên header

// Hàm để render các sản phẩm trong giỏ hàng trên trang thanh toán
function renderCheckoutSummary() {
    let productsHTML = '';
    let totalPrice = 0; // Tổng giá tiền

    if (cart.length === 0) {
        productsHTML = `
            <div style="text-align: center; padding: 20px; color: #555;">
                Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.
            </div>
        `;
    } else {
        cart.forEach(cartItem => {
            const productId = cartItem.id;
            const quantity = cartItem.quantity;

            // Tìm sản phẩm trong danh sách products
            let matchingProduct;
            products.forEach(product => {
                if (product.id === productId) {
                    matchingProduct = product;
                }
            });

            if (matchingProduct) {
                // Tính thành tiền cho từng mặt hàng
                const itemSubtotal = matchingProduct.price * quantity;
                totalPrice += itemSubtotal;

                productsHTML += `
                    <div class="checkout_product_item">
                        <div class="product_image">
                            <img src="${matchingProduct.image}" alt="${matchingProduct.name}">
                        </div>
                        <div class="product_info">
                            <div class="product_name">${matchingProduct.name}</div>
                            <div class="product_price_per_unit">Giá mỗi SP: ${matchingProduct.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                            <div class="product_quantity">Số lượng: ${quantity}</div>
                            <div class="product_subtotal">Thành tiền: ${itemSubtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                        </div>
                    </div>
                `;
            }
        });
    }

    // Hiển thị danh sách sản phẩm
    const checkoutProductsListElement = document.querySelector('.js_checkout_products_list');
    if (checkoutProductsListElement) {
        checkoutProductsListElement.innerHTML = productsHTML;
    } else {
        console.error('Lỗi: Không tìm thấy phần tử .js_checkout_products_list trong HTML của thanhtoan.html.');
    }

    // Hiển thị tổng giá tiền
    const checkoutTotalMoneyElement = document.querySelector('.js_checkout_total_money');
    if (checkoutTotalMoneyElement) {
        checkoutTotalMoneyElement.textContent = totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    } else {
        console.error('Lỗi: Không tìm thấy phần tử .js_checkout_total_money trong HTML của thanhtoan.html.');
    }
}

// Gọi hàm render khi trang được tải hoàn chỉnh
document.addEventListener('DOMContentLoaded', () => {
    renderCheckoutSummary();
    js_cart_quantity(); // Cập nhật số lượng giỏ hàng trên header khi trang thanh toán tải
});

// Bạn có thể thêm chức năng xử lý nút "Đặt hàng" ở đây
document.querySelector('.js_place_order_button').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Giỏ hàng trống! Vui lòng thêm sản phẩm để đặt hàng.');
        return;
    }

    // Kiểm tra thông tin địa chỉ đã có chưa
    const savedAddress = JSON.parse(localStorage.getItem('shippingAddress'));
    if (!savedAddress || !savedAddress.name || !savedAddress.phone || !savedAddress.addr) {
        alert('Vui lòng điền đầy đủ thông tin địa chỉ nhận hàng trước khi đặt hàng.');
        return;
    }

    // ✅ Thông báo đặt hàng thành công
    alert('Đơn hàng của bạn đã được đặt thành công!\nTổng tiền: ' + document.querySelector('.js_checkout_total_money').textContent);

    // Xoá giỏ hàng và chuyển hướng
    cart.length = 0;
    localStorage.removeItem('cart');
    js_cart_quantity();
    window.location.href = 'thankyou.html';
});
// Tạo đơn hàng mới
const newOrder = {
  id: Date.now(), // Mã đơn hàng duy nhất
  date: new Date().toLocaleDateString('vi-VN'),
  total: document.querySelector('.js_checkout_total_money').textContent,
  status: 'Đang xử lý',
  items: [...cart]
};

const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
existingOrders.push(newOrder);
localStorage.setItem('orders', JSON.stringify(existingOrders));



