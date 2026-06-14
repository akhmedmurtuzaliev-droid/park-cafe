class ParkCafe {
  constructor() {
    this.cart = [];
    this.favorites = [];
    this.currentCategory = 'all';
    this.init();
  }

  init() {
    this.renderProducts('hitsGrid', products.filter(p => p.badges.includes('hit')).slice(0, 8));
    this.renderProducts('popularGrid', products.slice(0, 12));
    this.renderProducts('mobilePopularGrid', products.slice(0, 8));
    this.bindEvents();
  }

  bindEvents() {
    document.querySelectorAll('.category-chip, .sidebar-item').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.filterCategory(el.dataset.category);
      });
    });

    document.getElementById('searchInput')?.addEventListener('input', (e) => {
      this.searchProducts(e.target.value);
    });

    document.getElementById('modalClose')?.addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('productModal')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.closeModal();
      }
    });

    document.getElementById('cartBtn')?.addEventListener('click', () => {
      this.scrollToCart();
    });

    document.getElementById('favoritesBtn')?.addEventListener('click', () => {
      this.showFavorites();
    });
  }

  renderProducts(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = items.map(product => this.createProductCard(product)).join('');
    
    container.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-add') && !e.target.closest('.product-favorite')) {
          this.openModal(product.id);
        }
      });
    });

    container.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        this.addToCart(id);
      });
    });

    container.querySelectorAll('.product-favorite').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        this.toggleFavorite(id, btn);
      });
    });
  }

  createProductCard(product) {
    const badges = product.badges.map(b => {
      const labels = { hit: 'Хит', new: 'Новинка', discount: '-20%' };
      return `<span class="product-badge ${b}">${labels[b]}</span>`;
    }).join('');

    const isFavorite = this.favorites.includes(product.id);

    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-badges">${badges}</div>
          <button class="product-favorite ${isFavorite ? 'active' : ''}" data-id="${product.id}">
            <svg viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-weight">${product.weight}</p>
          <div class="product-bottom">
            <div class="product-price">${product.price} <span class="product-price-currency">₽</span></div>
            <button class="btn-add" data-id="${product.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              Добавить
            </button>
          </div>
        </div>
      </div>
    `;
  }

  filterCategory(category) {
    this.currentCategory = category;
    
    document.querySelectorAll('.category-chip, .sidebar-item').forEach(el => {
      el.classList.toggle('active', el.dataset.category === category);
    });

    const filtered = category === 'all' 
      ? products 
      : products.filter(p => p.category === category);

    this.renderProducts('hitsGrid', filtered.filter(p => p.badges.includes('hit')).slice(0, 8));
    this.renderProducts('popularGrid', filtered.slice(0, 12));
    this.renderProducts('mobilePopularGrid', filtered.slice(0, 8));
  }

  searchProducts(query) {
    if (!query.trim()) {
      this.filterCategory(this.currentCategory);
      return;
    }

    const results = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );

    this.renderProducts('popularGrid', results);
    this.renderProducts('mobilePopularGrid', results);
  }

  addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = this.cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }

    this.updateCart();
    this.showToast(`${product.name} добавлен в корзину`);
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.updateCart();
  }

  updateQuantity(productId, delta) {
    const item = this.cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    
    if (item.quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.updateCart();
    }
  }

  updateCart() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    document.getElementById('cartBadge').textContent = totalItems;
    document.getElementById('cartNavBadge').textContent = totalItems;
    document.getElementById('cartCount').textContent = `${totalItems} товаров`;

    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');

    if (this.cart.length === 0) {
      cartItems.innerHTML = '<p style="color: var(--text-tertiary); text-align: center; padding: var(--space-8) 0;">Корзина пуста</p>';
      cartSummary.style.display = 'none';
    } else {
      cartItems.innerHTML = this.cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">${item.price * item.quantity} ₽</div>
          </div>
          <div class="cart-item-controls">
            <button class="cart-item-btn" data-action="decrease" data-id="${item.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14"></path>
              </svg>
            </button>
            <span class="cart-item-quantity">${item.quantity}</span>
            <button class="cart-item-btn" data-action="increase" data-id="${item.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
            </button>
          </div>
        </div>
      `).join('');

      document.getElementById('cartSubtotal').textContent = `${totalPrice} ₽`;
      document.getElementById('cartTotal').textContent = `${totalPrice} ₽`;
      cartSummary.style.display = 'block';

      cartItems.querySelectorAll('.cart-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id);
          const action = btn.dataset.action;
          this.updateQuantity(id, action === 'increase' ? 1 : -1);
        });
      });
    }
  }

  openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalWeight').textContent = product.weight;
    document.getElementById('modalRating').textContent = product.rating;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalCalories').textContent = `${product.calories} ккал`;
    document.getElementById('modalProtein').textContent = product.protein;
    document.getElementById('modalWeightValue').textContent = product.weight;
    document.getElementById('modalPrice').textContent = `${product.price} ₽`;

    const badges = product.badges.map(b => {
      const labels = { hit: 'Хит', new: 'Новинка', discount: '-20%' };
      return `<span class="product-badge ${b}">${labels[b]}</span>`;
    }).join('');
    document.getElementById('modalBadges').innerHTML = badges;

    document.getElementById('modalAddBtn').onclick = () => {
      this.addToCart(productId);
    };

    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = '';
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  toggleFavorite(productId, btn) {
    const index = this.favorites.indexOf(productId);
    
    if (index > -1) {
      this.favorites.splice(index, 1);
      btn.classList.remove('active');
      btn.querySelector('svg').setAttribute('fill', 'none');
      this.showToast('Удалено из избранного');
    } else {
      this.favorites.push(productId);
      btn.classList.add('active');
      btn.querySelector('svg').setAttribute('fill', 'currentColor');
      this.showToast('Добавлено в избранное');
    }
  }

  scrollToCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
      cartSidebar.scrollIntoView({ behavior: 'smooth' });
    }
  }

  showFavorites() {
    const favProducts = products.filter(p => this.favorites.includes(p.id));
    this.renderProducts('popularGrid', favProducts);
    this.renderProducts('mobilePopularGrid', favProducts);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new ParkCafe();
});
