// const API_BASE_URL = "https://elegancewear-backend.onrender.com";
// const API_BASE_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://192.168.49.2:30001';

const user = JSON.parse(localStorage.getItem("currentUser"));
const url = new URLSearchParams(window.location.search);
const productIdQuery = url.get('id');

document.addEventListener('DOMContentLoaded', async () => {
  const gridSection = document.getElementById('product-grid-section');
  const productGrid = document.getElementById('product-grid');
  const detailSection = document.getElementById('product-detail');
  const addBtn = document.getElementById('add-to-cart-btn');

  if (productIdQuery) {
    logAction('viewed_product', productIdQuery);

    const product = products.find(p => p.id == productIdQuery);
    if (product) {
      gridSection.style.display = 'none';
      detailSection.style.display = 'flex';

      document.getElementById('product-image').src = product.image;
      document.getElementById('product-name').textContent = product.name;
      document.getElementById('product-price').textContent = `Rs. ${product.price}`;
      document.getElementById('product-description').textContent = product.description || "This elegant piece is crafted for comfort and style.";
      document.getElementById('add-to-cart-btn').onclick = () => addToCart(productIdQuery);
    }
  } else {
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <a href="products.html?id=${product.id}" style="text-decoration:none; color:inherit;">
          <img src="${product.image}" alt="${product.name}">
          <h4>${product.name}</h4>
          <p>Rs. ${product.price}</p>
        </a>
        <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productGrid.appendChild(card);
    });
  }
});

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Product added to cart!');
  logAction('added_to_cart', productId);
}

async function logAction(action, productId) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    let currProduct = null;
    if (Array.isArray(data)) {
      currProduct = data.find(product => product.id == productId);
    }

  const viewedBody = JSON.stringify({
    user: user.id,
    product: currProduct._id,
    action: 'viewed_product',
    dataType: 'product_interaction',
    purpose: 'analytics',
    accessedBy: 'internal_service'
  });

  console.log(viewedBody);

  fetch('http://localhost:3000/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: user.id,
      product: currProduct._id,
      action: action,
      dataType: 'product_interaction',
      purpose: 'analytics',
      accessedBy: 'internal_service'
    })
  }).catch(err => console.error('Log failed:', err));
}
