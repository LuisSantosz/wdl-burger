const products = [
  {
    id: 1,
    name: 'WDL Supreme',
    category: 'burgers',
    price: 34.90,
    desc: 'Blend 160g, cheddar inglês, bacon crocante, cebola caramelizada e molho WDL no brioche.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=88',
    tag: 'Mais pedido',
    hot: true
  },
  {
    id: 2,
    name: 'Black Angus',
    category: 'burgers',
    price: 39.90,
    desc: 'Blend angus 180g, queijo prato, cebola crispy, picles artesanal e maionese defumada.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=88',
    tag: 'Premium'
  },
  {
    id: 3,
    name: 'Smash Double',
    category: 'burgers',
    price: 31.90,
    desc: 'Dois smash de 90g, cheddar duplo, picles, cebola roxa e molho especial da casa.',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=88',
    tag: 'Duplo'
  },
  {
    id: 4,
    name: 'WDL Bacon Melt',
    category: 'burgers',
    price: 36.90,
    desc: 'Blend 160g, muito bacon, cheddar cremoso, cebola caramelizada e barbecue artesanal.',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=900&q=88',
    tag: 'Intenso'
  },
  {
    id: 5,
    name: 'Combo Supreme',
    category: 'combos',
    price: 49.90,
    desc: 'WDL Supreme + fritas crocantes + refrigerante lata. O combo completo da casa.',
    image: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=900&q=88',
    tag: 'Combo'
  },
  {
    id: 6,
    name: 'Combo Smash',
    category: 'combos',
    price: 43.90,
    desc: 'Smash Double + fritas individuais + refrigerante lata para fechar o pedido.',
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=900&q=88',
    tag: 'Oferta'
  },
  {
    id: 7,
    name: 'Fritas WDL',
    category: 'porcoes',
    price: 18.90,
    desc: 'Fritas douradas e crocantes com páprica defumada e molho especial da casa.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=88',
    tag: 'Crocante'
  },
  {
    id: 8,
    name: 'Fritas Cheddar & Bacon',
    category: 'porcoes',
    price: 24.90,
    desc: 'Porção de fritas com cheddar cremoso, bacon crocante e finalização de cebolinha.',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=88',
    tag: 'Favorita'
  },
  {
    id: 9,
    name: 'Coca-Cola Lata',
    category: 'bebidas',
    price: 7.00,
    desc: 'Coca-Cola lata 350ml, bem gelada para acompanhar seu burger.',
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=900&q=88',
    tag: '350ml'
  }
];

const menuGrid = document.getElementById('menuGrid');
const categories = document.querySelectorAll('.category');
const searchPanel = document.getElementById('searchPanel');
const searchToggle = document.getElementById('searchToggle');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const emptyState = document.getElementById('emptyState');

const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsEl = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const mobileCartCount = document.getElementById('mobileCartCount');
const toast = document.getElementById('toast');

let activeCategory = 'todos';
let cart = JSON.parse(localStorage.getItem('wdlBurgerCart') || '[]');

function money(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderProducts() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(product => {
    const categoryMatch = activeCategory === 'todos' || product.category === activeCategory;
    const searchMatch = !term || `${product.name} ${product.desc}`.toLowerCase().includes(term);
    return categoryMatch && searchMatch;
  });

  menuGrid.innerHTML = filtered.map((product, index) => `
    <article class="product-card" style="animation-delay:${index * 45}ms">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="product-tag ${product.hot ? 'hot' : ''}">${product.tag}</span>
      </div>
      <div class="product-content">
        <div class="product-top">
          <div>
            <h3>${product.name}</h3>
          </div>
          <div class="product-price"><small>a partir de</small>${money(product.price)}</div>
        </div>
        <p>${product.desc}</p>
        <button class="add-btn" onclick="addToCart(${product.id})">
          <span>Adicionar ao pedido</span>
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </article>
  `).join('');

  emptyState.classList.toggle('show', filtered.length === 0);
}

categories.forEach(button => {
  button.addEventListener('click', () => {
    categories.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    activeCategory = button.dataset.category;
    renderProducts();
  });
});

searchToggle.addEventListener('click', () => {
  searchPanel.classList.toggle('show');
  if (searchPanel.classList.contains('show')) setTimeout(() => searchInput.focus(), 60);
});
searchInput.addEventListener('input', renderProducts);
clearSearch.addEventListener('click', () => { searchInput.value = ''; renderProducts(); searchInput.focus(); });

function addToCart(productId) {
  const existing = cart.find(item => item.id === productId);
  if (existing) existing.qty += 1;
  else cart.push({ id: productId, qty: 1 });
  persistCart();
  renderCart();
  showToast();
}

function changeQty(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) cart = cart.filter(item => item.id !== productId);
  persistCart();
  renderCart();
}

function removeItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  persistCart();
  renderCart();
}

function persistCart() {
  localStorage.setItem('wdlBurgerCart', JSON.stringify(cart));
}

function renderCart() {
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = itemCount;
  mobileCartCount.textContent = itemCount;

  if (!cart.length) {
    cartItemsEl.innerHTML = '';
    cartEmpty.classList.add('show');
    cartFooter.style.display = 'none';
    return;
  }

  cartEmpty.classList.remove('show');
  cartFooter.style.display = 'block';

  let total = 0;
  cartItemsEl.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    const subtotal = product.price * item.qty;
    total += subtotal;
    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}" />
        <div class="cart-item-info">
          <div class="cart-item-head">
            <h4>${product.name}</h4>
            <span class="cart-item-price">${money(subtotal)}</span>
          </div>
          <div class="qty-row">
            <div class="qty-controls">
              <button onclick="changeQty(${product.id}, -1)"><i class="fa-solid fa-minus"></i></button>
              <span>${item.qty}</span>
              <button onclick="changeQty(${product.id}, 1)"><i class="fa-solid fa-plus"></i></button>
            </div>
            <button class="remove-item" onclick="removeItem(${product.id})">Remover</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  cartTotal.textContent = money(total);
}

function openCart() {
  cartDrawer.classList.add('show');
  cartOverlay.classList.add('show');
  document.body.classList.add('no-scroll');
}
function closeCart() {
  cartDrawer.classList.remove('show');
  cartOverlay.classList.remove('show');
  document.body.classList.remove('no-scroll');
}

document.getElementById('openCart').addEventListener('click', openCart);
document.getElementById('heroCartBtn').addEventListener('click', openCart);
document.getElementById('mobileCartBtn').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('continueShopping').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function showToast() {
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 1700);
}

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (!cart.length) return;
  const lines = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return `• ${item.qty}x ${product.name} — ${money(product.price * item.qty)}`;
  });
  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.qty;
  }, 0);

  const message = [
    '🍔 *NOVO PEDIDO — WDL BURGER*',
    '',
    ...lines,
    '',
    `*Total:* ${money(total)}`,
    '',
    'Olá! Gostaria de finalizar este pedido.'
  ].join('\n');

  // TROQUE PELO WHATSAPP OFICIAL DA LANCHONETE:
  const whatsappNumber = '5511999999999';
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const mobileLinks = document.querySelectorAll('.mobile-nav a');
mobileLinks.forEach(link => link.addEventListener('click', () => {
  mobileLinks.forEach(item => item.classList.remove('active'));
  link.classList.add('active');
}));

renderProducts();
renderCart();
