import { products } from "../data/products.js";
import { addToCart } from "../data/cart.js";
import { js_cart_quantity } from "../scripts/share/header.js";

const searchButtonInMain = document.querySelector('.js_search_button_in_main');
const searchInputInMain = document.querySelector('.searching_search_input_in_main');

const searchButtonInSearch = document.querySelector('.js_search_button');
const searchInputInSearch = document.querySelector('.js_search_bar');
const seaconSearchInput = document.querySelector('.js_seacon_search_bar');

searchButtonInMain.addEventListener('click', () => {
  const searchTerm = searchInputInMain.value.trim();
  localStorage.setItem('searchTerm', searchTerm);
  const searchUrl = `search.html?search=${encodeURIComponent(searchTerm)}`;
  window.location.href = searchUrl;
});

searchInputInMain.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const searchTerm = searchInputInMain.value.trim();
    localStorage.setItem('searchTerm', searchTerm);
    const searchUrl = `search.html?search=${encodeURIComponent(searchTerm)}`;
    window.location.href = searchUrl;
  }
});

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

document.addEventListener('DOMContentLoaded', () => {
  const searchInputTerm = localStorage.getItem('searchTerm');
  const searchingNone = document.querySelector('.searching_input_none');

  const searchResults = [];// Mảng để lưu trữ các kết quả tìm kiếm gần giống

  if (searchInputTerm) {
    searchInputInSearch.value = searchInputTerm;
    seaconSearchInput.value = searchInputTerm;
    searchingNone.style.display = 'none';

    products.forEach(product => {
      if (product && product.name) {
        if (isCloseMatch(searchInputTerm, product.name)) {
          searchResults.push({ product, distance: levenshteinDistance(removeVietnameseTones(searchInputTerm.toLowerCase()), removeVietnameseTones(product.name.toLowerCase())) });
        }
      } else {
        console.error("Sản phẩm không có thuộc tính 'name':", product);
      }
    });

    // Sắp xếp các kết quả tìm kiếm dựa trên tên sản phẩm
    searchResults.sort((a, b) => {
      const nameA = removeVietnameseTones(a.product.name.toLowerCase());
      const nameB = removeVietnameseTones(b.product.name.toLowerCase());
      const searchTermLower = removeVietnameseTones(searchInputTerm.toLowerCase());
    
      const includesA = nameA.includes(searchTermLower);
      const includesB = nameB.includes(searchTermLower);
    
      if (includesA && !includesB) return -1;
      if (!includesA && includesB) return 1;
    
      // Nếu mức độ chứa tương đương, sắp xếp theo khoảng cách Levenshtein
      return a.distance - b.distance;
    });

    const searchingNoneFinding = document.querySelector('.searching_none_finding');
    if (searchResults.length === 0) {
      searchingNoneFinding.style.display = 'block';
    }

    // Hiển thị searchResults lên trang
    // ... (code để hiển thị kết quả)
    searchResults.forEach(result => {
      const product = result.product;
      const productHTML = `
        <div class="product">
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
      document.querySelector('.js_cosmetics_products').innerHTML += productHTML;
    });
    localStorage.removeItem('searchTerm');

  }else {
    searchingNone.style.display = 'block';
  }

  document.querySelectorAll('.js_button_addToCart').forEach((button) => {
    button.addEventListener('click', () =>{
      const productId = button.dataset.productId;
  
      addToCart(productId);
      js_cart_quantity();
    });
  });

  js_cart_quantity();
  
});


function isCloseMatch(text1, text2, minMatchLength = 2, minSimilarityRatio = 0.4) {
  const normalizedText1 = removeVietnameseTones(text1.toLowerCase());
  const normalizedText2 = removeVietnameseTones(text2.toLowerCase());

  // Kiểm tra xem normalizedText1 có chứa trong normalizedText2 không
  if (normalizedText2.includes(normalizedText1)) {
    return true;
  }

  // Nếu không chứa hoàn toàn, vẫn kiểm tra độ tương đồng dựa trên khoảng cách Levenshtein
  const distance = levenshteinDistance(normalizedText1, normalizedText2);
  const maxLength = Math.max(normalizedText1.length, normalizedText2.length);
  const matchLength = maxLength - distance;
  const similarityRatio = matchLength / maxLength;

  return matchLength >= minMatchLength && similarityRatio >= minSimilarityRatio;
}

export function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= b.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = (a[j - 1] === b[i - 1]) ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Deletion
        matrix[i][j - 1] + 1, // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return matrix[b.length][a.length];
}


export function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
  str = str.replace(/đ/g,"d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Một vài trường hợp đặc biệt
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền, sắc, hỏi, ngã, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, ă, ư
  return str;
}
