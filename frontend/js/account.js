// const API_BASE_URL = 'https://elegancewear-backend.onrender.com';
// const API_BASE_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://192.168.49.2:30001';

feather.replace();

const authSection = document.getElementById("auth-section");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  showAuthForm("login");
} else {
  showAccountDetails();
}

function showAuthForm(mode) {
  const isLogin = mode === "login";
  authSection.innerHTML = `
    <h2 style="color: #4d1d25">${isLogin ? "Login to Your Account" : "Create an Account"}</h2>
    <input type="text" id="username" placeholder="Username" required />
    <input type="password" id="password" placeholder="Password" required />
    ${!isLogin ? '<input type="email" id="email" placeholder="Email" required />' : ""}
    <button class="btn" onclick="${isLogin ? "loginUser()" : "signupUser()"}">
      ${isLogin ? "Login" : "Sign Up"}
    </button>
    <div class="toggle-link">
      ${isLogin
        ? `Don't have an account? <a href="#" onclick="showAuthForm('signup')">Sign Up</a>`
        : `Already have an account? <a href="#" onclick="showAuthForm('login')">Login</a>`}
    </div>
  `;
}

async function loginUser() {
  const name = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password })
    });

    const data = await response.json();

    if (response.ok) {
      const userInfo = { id: data._id, name: data.name, email: data.email };
      localStorage.setItem("currentUser", JSON.stringify(userInfo));
      alert("Login successful!");
      location.reload();
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert("Error logging in. Please try again.");
  }
}

async function signupUser() {
  const name = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      const userInfo = { id: data._id, name: data.name, email: data.email };
      localStorage.setItem("currentUser", JSON.stringify(userInfo));
      alert("Account created successfully!");
      location.reload();
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert("Error creating account. Please try again.");
  }
}

function showAccountDetails() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  authSection.innerHTML = `
    <h2>Welcome, ${user.name}</h2>
    <button class="btn" onclick="confirmOrder()">Place Order</button>
    <button class="btn" onclick="goToDashboard()">Go to my dashboard</button>
    <button class="btn logout-btn" onclick="logout()">Log Out</button>
  `;
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}

function confirmOrder() {
  alert("Thank you for your purchase!");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}

function goToDashboard() {
  showReAuthModal();
}

function showReAuthModal() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); display: flex; justify-content: center;
    align-items: center; z-index: 1000;
  `;

  modal.innerHTML = `
    <div style="
      background: #fff0f5;
      padding: 20px;
      border-radius: 12px;
      max-width: 320px;
      border: 2px solid #a24cad;
      box-shadow: 0 6px 24px rgba(0,0,0,0.15);
    ">
      <h3 style="color: #4d1d25; margin-top: 0; text-align: center; font-family: 'Playfair Display', serif;">
        Confirm Your Identity
      </h3>
      <p style="color: #444; text-align: center; margin-bottom: 20px;">
        Please enter your password to access the dashboard
      </p>
      <input
        type="password"
        id="reauth-password"
        placeholder="Enter your password"
        style="
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          color: #333;
          box-sizing: border-box;
          font-size: 1rem;
        "
      >
      <button
        onclick="verifyPasswordAndRedirect()"
        style="
          width: 100%;
          padding: 12px;
          background: #4d1d25;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 6px;
          font-weight: bold;
          margin-bottom: 8px;
        "
      >
        Verify
      </button>
      <button
        onclick="closeReAuthModal()"
        style="
          width: 100%;
          padding: 12px;
          background: #888;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 6px;
        "
      >
        Cancel
      </button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.id = 'reauth-modal';
}

async function verifyPasswordAndRedirect() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const password = document.getElementById("reauth-password").value;

  if (!password) {
    alert("Please enter your password.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: currentUser.name, password })
    });

    if (response.ok) {
      closeReAuthModal();
      window.location.href = 'dashboard.html';
    } else {
      alert("Incorrect password. Please try again.");
    }
  } catch (error) {
    console.error('Re-auth error:', error);
    alert("Error verifying password. Please try again.");
  }
}

function closeReAuthModal() {
  const modal = document.getElementById('reauth-modal');
  if (modal) modal.remove();
}
