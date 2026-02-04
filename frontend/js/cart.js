document.addEventListener("DOMContentLoaded", () => {

  // const API_BASE_URL = 'https://elegancewear-backend.onrender.com';
  // const API_BASE_URL = 'http://localhost:3000';
  const API_BASE_URL = 'http://192.168.49.2:30001';

  feather.replace();

  const cartContainer = document.getElementById('cart-items');
  const totalContainer = document.getElementById('cart-total');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function renderCart() {
    cartContainer.innerHTML = '';
    const grouped = cart.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    let total = 0;

    Object.entries(grouped).forEach(([id, quantity]) => {
      const product = products.find(p => p.id == id);
      if (product) {
        total += product.price * quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          <img src="${product.image}" alt="${product.name}" onclick="location.href='product-detail.html?id=${product.id}'" />
          <div class="cart-item-details">
            <h4>${product.name}</h4>
            <p>Quantity: ${quantity}</p>
            <p>Total: ₹${product.price * quantity}</p> <br>
            <button class="remove-btn" onclick="removeItem(${product.id})">Remove Item</button>
          </div>
        `;
        cartContainer.appendChild(div);
      }
    });

    totalContainer.textContent = `Grand Total: ₹${total}`;
  }

  window.removeItem = function(id) {
    const index = cart.indexOf(id);
    if (index !== -1) {
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    }
  };

  window.checkout = async function() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      alert("Please log in to proceed with checkout.");
      window.location.href = "account.html";
      return;
    }

    const grouped = cart.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const items = Object.entries(grouped).map(([productId, quantity]) => ({
      productId,
      quantity
    }));

    const total = Object.entries(grouped).reduce((sum, [id, quantity]) => {
      const product = products.find(p => p.id == id);
      return sum + (product ? product.price * quantity : 0);
    }, 0);

    const orderData = {
      userId: user.id,
      orderRef: `ORD-${Date.now()}`,
      items,
      amount: total
    };

    try {
      await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      await fetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: user.id,
          action: 'checkout_initiated',
          accessedBy: 'internal_service'
        })
      });

      localStorage.removeItem('cart');
      window.location.href = "account.html";
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  renderCart();
});
