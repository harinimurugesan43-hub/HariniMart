const products = [
  {
    id:1,name:"Samsung Galaxy A56 5G",price:32999,oldPrice:37999,rating:"4.4 ★",
    image:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    description:"5G smartphone with a bright display, powerful performance and long battery life."
  },
  {
    id:2,name:"iPhone 15",price:54999,oldPrice:69900,rating:"4.6 ★",
    image:"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
    description:"Premium smartphone with an advanced camera system and smooth performance."
  },
  {
    id:3,name:"HP 15s Laptop",price:45999,oldPrice:52999,rating:"4.3 ★",
    image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
    description:"Everyday laptop for college, office work, browsing and entertainment."
  },
  {
    id:4,name:"Dell Inspiron 14",price:58999,oldPrice:64999,rating:"4.5 ★",
    image:"https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
    description:"Compact laptop with a modern design and dependable everyday performance."
  },
  {
    id:5,name:"Sony Wireless Headphones",price:7999,oldPrice:9999,rating:"4.5 ★",
    image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    description:"Wireless headphones with comfortable ear cushions and immersive sound."
  },
  {
    id:6,name:"boAt Smart Watch",price:2499,oldPrice:3999,rating:"4.2 ★",
    image:"https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
    description:"Smart watch with fitness tracking, notifications and a stylish display."
  },
  {
    id:7,name:"JBL Bluetooth Speaker",price:3499,oldPrice:4999,rating:"4.4 ★",
    image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80",
    description:"Portable Bluetooth speaker designed for clear and powerful audio."
  },
  {
    id:8,name:"Apple AirPods",price:10999,oldPrice:12900,rating:"4.6 ★",
    image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=600&q=80",
    description:"True wireless earbuds with a compact charging case and seamless connectivity."
  }
];

let cart = JSON.parse(localStorage.getItem("HariniMart_cart") || "[]");
let selectedProduct = null;

const loginPage = document.getElementById("loginPage");
const shopPage = document.getElementById("shopPage");
const loginForm = document.getElementById("loginForm");
const googleBtn = document.getElementById("googleBtn");
const loginMessage = document.getElementById("loginMessage");

function showShop() {
  loginPage.classList.add("hidden");
  shopPage.classList.remove("hidden");
  renderProducts(products);
  updateCart();
}

function renderProducts(list) {
  const grid = document.getElementById("productGrid");
  document.getElementById("productCount").textContent = `${list.length} products`;
  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <img src="${p.image}" alt="${p.name}" onclick="openProduct(${p.id})">
      <h3>${p.name}</h3>
      <span class="rating">${p.rating}</span>
      <div class="price">₹${p.price.toLocaleString("en-IN")}
        <span class="old-price">₹${p.oldPrice.toLocaleString("en-IN")}</span>
      </div>
      <div class="card-actions">
        <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
        <button class="buy-btn" onclick="buyNow(${p.id})">Buy Now</button>
      </div>
    </article>
  `).join("");
}

loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || password.length < 6) {
    loginMessage.textContent = "Please enter a valid email and 6+ character password.";
    loginMessage.style.color = "#d32f2f";
    return;
  }

  localStorage.setItem("HariniMart_user", email);
  loginMessage.textContent = "Login successful!";
  loginMessage.style.color = "#2e7d32";
  setTimeout(showShop, 450);
});

googleBtn.addEventListener("click", () => {
  localStorage.setItem("HariniMart_user", "Google User");
  loginMessage.textContent = "Google login demo successful!";
  loginMessage.style.color = "#2e7d32";
  setTimeout(showShop, 450);
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("HariniMart_user");
  shopPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
  loginForm.reset();
});

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty++;
  else cart.push({id, qty:1});
  saveCart();
  updateCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCart();
}

function changeQty(id, amount) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); updateCart(); }
}

function saveCart() {
  localStorage.setItem("HariniMart_cart", JSON.stringify(cart));
}

function updateCart() {
  const count = cart.reduce((sum,i) => sum+i.qty,0);
  document.getElementById("cartCount").textContent = count;

  const items = document.getElementById("cartItems");
  if (!cart.length) {
    items.innerHTML = "<p style='text-align:center;color:#777;margin-top:40px'>Your cart is empty.</p>";
  } else {
    items.innerHTML = cart.map(item => {
      const p = products.find(x => x.id === item.id);
      return `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.name}">
          <div class="cart-item-info">
            <h4>${p.name}</h4>
            <strong>₹${(p.price * item.qty).toLocaleString("en-IN")}</strong>
            <div class="qty">
              <button onclick="changeQty(${p.id},-1)">−</button>
              <span>${item.qty}</span>
              <button onclick="changeQty(${p.id},1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${p.id})">Remove</button>
          </div>
        </div>`;
    }).join("");
  }

  const total = cart.reduce((sum,item) => {
    const p = products.find(x => x.id === item.id);
    return sum + p.price * item.qty;
  },0);
  document.getElementById("cartTotal").textContent = `₹${total.toLocaleString("en-IN")}`;
}

function openCart() {
  document.getElementById("cartPanel").classList.add("open");
  document.getElementById("cartOverlay").classList.remove("hidden");
}
function closeCart() {
  document.getElementById("cartPanel").classList.remove("open");
  document.getElementById("cartOverlay").classList.add("hidden");
}
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);

function openProduct(id) {
  selectedProduct = products.find(p => p.id === id);
  document.getElementById("modalImage").src = selectedProduct.image;
  document.getElementById("modalName").textContent = selectedProduct.name;
  document.getElementById("modalRating").textContent = selectedProduct.rating;
  document.getElementById("modalPrice").textContent = `₹${selectedProduct.price.toLocaleString("en-IN")}`;
  document.getElementById("modalDescription").textContent = selectedProduct.description;
  document.getElementById("productModal").classList.remove("hidden");
}
document.getElementById("closeModal").addEventListener("click",()=>document.getElementById("productModal").classList.add("hidden"));
document.getElementById("modalAdd").addEventListener("click",()=>{addToCart(selectedProduct.id);document.getElementById("productModal").classList.add("hidden")});
document.getElementById("modalBuy").addEventListener("click",()=>{document.getElementById("productModal").classList.add("hidden");buyNow(selectedProduct.id)});

function buyNow(id) {
  cart = [{id,qty:1}];
  saveCart();
  updateCart();
  openCheckout();
}

function openCheckout() {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }
  const total = cart.reduce((sum,item)=>{
    const p=products.find(x=>x.id===item.id);
    return sum+p.price*item.qty;
  },0);
  document.getElementById("checkoutTotal").textContent = `₹${total.toLocaleString("en-IN")}`;
  document.getElementById("checkoutModal").classList.remove("hidden");
  closeCart();
}

document.getElementById("buyCartBtn").addEventListener("click",openCheckout);
document.getElementById("closeCheckout").addEventListener("click",()=>document.getElementById("checkoutModal").classList.add("hidden"));

document.getElementById("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const orderId = "SK" + Date.now().toString().slice(-8);
  document.getElementById("orderMessage").textContent = `Order placed successfully! Order ID: ${orderId}`;
  document.getElementById("orderMessage").style.color = "#2e7d32";
  cart=[];
  saveCart();
  updateCart();
  setTimeout(()=>{
    document.getElementById("checkoutModal").classList.add("hidden");
    document.getElementById("checkoutForm").reset();
    document.getElementById("orderMessage").textContent="";
  },1800);
});

function searchProducts() {
  const q = document.getElementById("searchInput").value.toLowerCase().trim();
  const filtered = products.filter(p => p.name.toLowerCase().includes(q));
  renderProducts(filtered);
}
document.getElementById("searchBtn").addEventListener("click",searchProducts);
document.getElementById("searchInput").addEventListener("input",searchProducts);

if (localStorage.getItem("Hariniart_user")) showShop();
