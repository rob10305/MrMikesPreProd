/**
 * MrMikes Main Website JavaScript
 */

// Storage helper
const Storage = {
  get(key) {
    const data = localStorage.getItem('mrmikes_' + key);
    return data ? JSON.parse(data) : (DEFAULT_DATA[key] || null);
  },
  set(key, value) {
    localStorage.setItem('mrmikes_' + key, JSON.stringify(value));
  }
};

// Initialize website
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadTestimonials();
  loadPageContent();
  initMobileMenu();
  initContactForm();
  initSmoothScroll();
});

// Load products
function loadProducts() {
  const products = Storage.get('products');
  const grid = document.getElementById('product-grid');
  const footerList = document.getElementById('footer-products');

  if (!products || !grid) return;

  grid.innerHTML = Object.entries(products).map(([id, product]) => `
    <a href="#" class="product-card" data-product="${id}">
      <img src="${product.image}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
      <div class="product-info">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <span class="product-link">View Kits &rarr;</span>
      </div>
    </a>
  `).join('');

  if (footerList) {
    footerList.innerHTML = Object.entries(products).slice(0, 5).map(([id, product]) =>
      `<li><a href="#products">${product.title}</a></li>`
    ).join('');
  }
}

// Load testimonials
function loadTestimonials() {
  const testimonials = Storage.get('testimonials');
  const grid = document.getElementById('testimonial-grid');

  if (!testimonials || !grid) return;

  grid.innerHTML = testimonials.map(t => `
    <blockquote class="testimonial-card">
      <div class="testimonial-content">
        <p>"${t.content}"</p>
      </div>
      <footer class="testimonial-author">
        <div>
          <strong>${t.author}</strong>
          <span>${t.location}</span>
        </div>
        <div class="rating">${'★'.repeat(t.rating || 5)}</div>
      </footer>
    </blockquote>
  `).join('');
}

// Load page content
function loadPageContent() {
  const hero = Storage.get('hero');
  const about = Storage.get('about');
  const contact = Storage.get('contact');

  if (hero) {
    const titleEl = document.getElementById('hero-title');
    const subtitleEl = document.getElementById('hero-subtitle');
    const descEl = document.getElementById('hero-description');
    if (titleEl) titleEl.textContent = hero.title;
    if (subtitleEl) subtitleEl.textContent = hero.subtitle;
    if (descEl) descEl.textContent = hero.description;
  }

  if (about) {
    const titleEl = document.getElementById('about-title');
    const descEl = document.getElementById('about-description');
    if (titleEl) titleEl.textContent = about.title;
    if (descEl) descEl.textContent = about.description;
  }

  if (contact) {
    const phoneEl = document.getElementById('contact-phone');
    const emailEl = document.getElementById('contact-email');
    const hoursEl = document.getElementById('contact-hours');
    if (phoneEl) { phoneEl.textContent = contact.phone; phoneEl.href = 'tel:' + contact.phone; }
    if (emailEl) { emailEl.textContent = contact.email; emailEl.href = 'mailto:' + contact.email; }
    if (hoursEl) hoursEl.textContent = contact.hours;
  }
}

// Mobile menu
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
    });
  }
}

// Contact form
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Here you would send to your backend or Supabase
    console.log('Contact form submitted:', data);
    alert('Thank you for your message! We will get back to you soon.');
    form.reset();
  });
}

// Smooth scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu
        document.querySelector('.main-nav')?.classList.remove('is-open');
      }
    });
  });
}
