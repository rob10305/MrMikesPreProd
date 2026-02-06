/**
 * MrMikes Admin Panel JavaScript
 * Handles authentication, content management, and data persistence
 */

// =====================
// Authentication Module
// =====================
const AdminAuth = {
  // Default credentials (in production, this should be handled server-side)
  // Password is stored as a simple hash for basic protection
  defaultCredentials: {
    username: 'admin',
    // Default password: 'mrmikes2024' - change this after first login
    passwordHash: 'bXJtaWtlczIwMjQ=' // Base64 encoded for basic obfuscation
  },

  // Simple hash function for password comparison
  hashPassword(password) {
    return btoa(password);
  },

  // Login function
  login(username, password) {
    const storedCredentials = this.getStoredCredentials();
    const hashedPassword = this.hashPassword(password);

    if (username === storedCredentials.username &&
        hashedPassword === storedCredentials.passwordHash) {
      sessionStorage.setItem('adminLoggedIn', 'true');
      sessionStorage.setItem('adminUsername', username);
      sessionStorage.setItem('adminLoginTime', Date.now().toString());
      return true;
    }
    return false;
  },

  // Check if user is logged in
  isLoggedIn() {
    const loggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    const loginTime = parseInt(sessionStorage.getItem('adminLoginTime') || '0');
    const sessionTimeout = 4 * 60 * 60 * 1000; // 4 hours

    // Check session timeout
    if (loggedIn && (Date.now() - loginTime) > sessionTimeout) {
      this.logout();
      return false;
    }
    return loggedIn;
  },

  // Get current username
  getUsername() {
    return sessionStorage.getItem('adminUsername') || 'Admin';
  },

  // Logout function
  logout() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUsername');
    sessionStorage.removeItem('adminLoginTime');
  },

  // Get stored credentials (from localStorage or defaults)
  getStoredCredentials() {
    const stored = localStorage.getItem('adminCredentials');
    if (stored) {
      return JSON.parse(stored);
    }
    return this.defaultCredentials;
  },

  // Update password
  updatePassword(currentPassword, newPassword) {
    const storedCredentials = this.getStoredCredentials();
    const currentHash = this.hashPassword(currentPassword);

    if (currentHash !== storedCredentials.passwordHash) {
      return { success: false, message: 'Current password is incorrect' };
    }

    const newCredentials = {
      username: storedCredentials.username,
      passwordHash: this.hashPassword(newPassword)
    };

    localStorage.setItem('adminCredentials', JSON.stringify(newCredentials));
    return { success: true, message: 'Password updated successfully' };
  }
};

// =====================
// GitHub Upload Module
// =====================
const GitHubUpload = {
  // Upload a file to GitHub repository
  async uploadImage(file) {
    if (!CONFIG.isGitHubConfigured()) {
      return {
        success: false,
        error: 'GitHub not configured. Go to Settings and enter your GitHub token.',
        path: null
      };
    }

    try {
      // Convert file to base64
      const base64Content = await this.fileToBase64(file);

      // Generate unique filename to avoid conflicts
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}_${safeName}`;
      const path = `images/${filename}`;

      // GitHub API endpoint
      const url = `https://api.github.com/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/contents/${path}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${CONFIG.getGitHubToken()}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Upload image: ${filename}`,
          content: base64Content,
          branch: CONFIG.GITHUB_BRANCH
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();

      return {
        success: true,
        path: path,
        url: data.content.download_url,
        sha: data.content.sha
      };
    } catch (error) {
      console.error('GitHub upload error:', error);
      return {
        success: false,
        error: error.message,
        path: null
      };
    }
  },

  // Convert file to base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Check if GitHub is configured
  isConfigured() {
    return typeof CONFIG !== 'undefined' && CONFIG.isGitHubConfigured && CONFIG.isGitHubConfigured();
  }
};

// =====================
// Content Storage Module
// =====================
const ContentStorage = {
  storageKey: 'mrmikesContent',

  // Get all content
  getAll() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : this.getDefaultContent();
  },

  // Save all content
  saveAll(content) {
    localStorage.setItem(this.storageKey, JSON.stringify(content));
  },

  // Get specific section
  getSection(section) {
    const content = this.getAll();
    return content[section] || {};
  },

  // Save specific section
  saveSection(section, data) {
    const content = this.getAll();
    content[section] = data;
    this.saveAll(content);
  },

  // Export content as JSON
  exportContent() {
    const content = this.getAll();
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mrmikes-content-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Default content structure
  getDefaultContent() {
    return {
      products: {
        fiero: {
          title: 'Fiero',
          description: 'Complete seat upholstery kits for all Fiero models',
          image: 'images/rocky1_star.jpg'
        },
        corvette: {
          title: 'Corvette',
          description: 'Classic Corvette interior restoration kits',
          image: 'images/fieroinvette01.jpg'
        },
        mg: {
          title: 'MG',
          description: 'British classic car upholstery solutions',
          image: 'images/blackwyellowmgandweltsm.jpg'
        },
        triumph: {
          title: 'Triumph - Miata',
          description: 'Miata seats customized for Triumph fitment',
          image: 'images/tr6beforeandafter_sm.jpg'
        },
        kitcar: {
          title: 'Kit-Car & Pantera',
          description: 'Fiero-based kit cars and exotic applications',
          image: 'images/pilasmira.jpg'
        },
        ponycars: {
          title: 'Vintage Mustang & Camaro',
          description: 'Classic American muscle car interiors',
          image: 'images/FieroSeatsIn65Mustang01.jpg'
        },
        retro: {
          title: 'Retro-Mods',
          description: 'Modern seats with vintage styling',
          image: 'images/transam02_sm.jpg'
        },
        trimbright: {
          title: 'TrimBright Welt',
          description: 'Premium trim and welt accessories',
          image: 'images/mustangpink01.jpg'
        }
      },
      gallery: [],
      testimonials: [
        {
          id: 1,
          author: 'Steve',
          location: 'Mentone, Indiana',
          content: 'I received my upholstery kit on Friday and had them finished on Sunday. I was a little reluctant to spend that much on my seats but I have to tell you they were worth every penny. I am a Quality Control Manager and these seats were of the highest quality I could have imagined. They feel great to sit in and look even better. You made it simple with your video guidance. Thanks for a great product.',
          rating: 5
        },
        {
          id: 2,
          author: 'Rick',
          location: 'TR6 Owner',
          content: 'The fit and finish exceeded my expectations. MrMikes made the entire process simple with clear instructions and responsive customer service. My TR6 has never looked better!',
          rating: 5
        }
      ],
      hero: {
        title: 'Show Winning Upholstery Kits',
        subtitle: 'Ready to Install. Do-it-Right. Do-it-Yourself.',
        description: 'We craft premium upholstery kits for Fiero and Miata seats that fit perfectly in a wide variety of sports cars including MG, Corvette, Triumph, and vintage Mustang & Camaro.'
      },
      about: {
        title: 'Why Choose MrMikes?',
        description: 'With over 30 years of experience and 24+ years selling online, we\'ve perfected the art of crafting upholstery kits that transform ordinary seats into show-winning masterpieces.'
      },
      contact: {
        phone: '941-922-5070',
        email: 'mrmike@mrmikes.com',
        hours: 'Mon-Fri 10am-4pm Eastern'
      }
    };
  }
};

// =====================
// Admin Dashboard Class
// =====================
class AdminDashboard {
  constructor() {
    this.modal = document.getElementById('edit-modal');
    this.modalTitle = document.getElementById('modal-title');
    this.modalBody = document.getElementById('modal-body');
    this.currentEditType = null;
    this.currentEditId = null;

    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindLogout();
    this.bindModal();
    this.bindMobileSidebar();
    this.loadProducts();
    this.bindProductEdits();
    this.bindGallery();
    this.bindTestimonials();
    this.bindContentEdits();
    this.bindSettings();
    this.updateDashboardStats();
    this.loadGallery();
    this.loadTestimonials();
  }

  // Navigation
  bindNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item[data-section]');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        this.switchSection(section);
      });
    });
  }

  switchSection(section) {
    // Update nav
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.admin-section').forEach(s => {
      s.classList.remove('active');
    });
    document.getElementById(`${section}-section`).classList.add('active');

    // Update title
    const titles = {
      dashboard: 'Dashboard',
      products: 'Product Management',
      gallery: 'Gallery Management',
      testimonials: 'Testimonials',
      content: 'Page Content',
      settings: 'Settings'
    };
    document.getElementById('section-title').textContent = titles[section] || section;

    // Close mobile sidebar
    document.querySelector('.admin-sidebar').classList.remove('open');
  }

  // Logout
  bindLogout() {
    document.getElementById('logout-btn').addEventListener('click', () => {
      AdminAuth.logout();
      window.location.href = 'admin.html';
    });
  }

  // Mobile sidebar
  bindMobileSidebar() {
    const toggle = document.querySelector('.mobile-sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Modal
  bindModal() {
    const closeBtn = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('modal-cancel');
    const saveBtn = document.getElementById('modal-save');

    closeBtn.addEventListener('click', () => this.closeModal());
    cancelBtn.addEventListener('click', () => this.closeModal());
    saveBtn.addEventListener('click', () => this.saveModal());

    // Close on outside click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
  }

  openModal(title, content) {
    this.modalTitle.textContent = title;
    this.modalBody.innerHTML = content;
    this.modal.classList.add('active');
  }

  closeModal() {
    this.modal.classList.remove('active');
    this.currentEditType = null;
    this.currentEditId = null;
  }

  saveModal() {
    switch (this.currentEditType) {
      case 'product':
        this.saveProduct();
        break;
      case 'gallery':
        this.saveGalleryItem();
        break;
      case 'testimonial':
        this.saveTestimonial();
        break;
      case 'content':
        this.saveContent();
        break;
    }
  }

  // Product management
  loadProducts() {
    const products = ContentStorage.getSection('products');
    const container = document.getElementById('product-categories');
    if (!container) return;

    const productKeys = Object.keys(products);

    if (productKeys.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--admin-text-muted);">
          <p>No products yet. Click "Add Product" to add your first product.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = productKeys.map(key => {
      const product = products[key];
      return `
        <div class="admin-card" data-category="${key}">
          <div class="admin-card-image">
            <img src="${product.image}" alt="${product.title}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22><rect fill=%22%23ddd%22 width=%22300%22 height=%22200%22/><text fill=%22%23999%22 x=%22150%22 y=%22100%22 text-anchor=%22middle%22>No Image</text></svg>'">
          </div>
          <div class="admin-card-content">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <div class="admin-card-actions">
              <button class="btn btn-secondary btn-sm edit-product-btn" data-category="${key}">Edit</button>
              <button class="btn btn-danger btn-sm delete-product-btn" data-category="${key}">Delete</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  bindProductEdits() {
    // Add product button
    document.getElementById('add-product-btn')?.addEventListener('click', () => {
      this.editProduct(null);
    });

    // Edit and delete buttons (using event delegation)
    document.getElementById('product-categories')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-product-btn')) {
        const category = e.target.dataset.category;
        this.editProduct(category);
      } else if (e.target.classList.contains('delete-product-btn')) {
        const category = e.target.dataset.category;
        this.deleteProduct(category);
      }
    });
  }

  editProduct(category) {
    const products = ContentStorage.getSection('products');
    const product = category ? (products[category] || {}) : {};
    const isNew = !category;

    this.currentEditType = 'product';
    this.currentEditId = category;

    const formHtml = `
      <form class="admin-form" id="product-form">
        ${isNew ? `
        <div class="form-group">
          <label for="product-id">Product ID (URL-friendly, no spaces)</label>
          <input type="text" id="product-id" placeholder="e.g., classic-cars" required pattern="[a-z0-9-]+" title="Only lowercase letters, numbers, and hyphens">
          <small style="color: var(--admin-text-muted); font-size: 0.75rem;">This will be used as the product key and cannot be changed later</small>
        </div>
        ` : ''}
        <div class="form-group">
          <label for="product-title">Title</label>
          <input type="text" id="product-title" value="${product.title || ''}" required>
        </div>
        <div class="form-group">
          <label for="product-description">Description</label>
          <textarea id="product-description" rows="3" required>${product.description || ''}</textarea>
        </div>
        <div class="form-group">
          <label for="product-image">Image</label>
          <div class="file-input-wrapper">
            <input type="file" id="product-image-file" accept="image/*">
            <label for="product-image-file" class="file-input-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              ${isNew ? 'Upload Image' : 'Change Image'}
            </label>
          </div>
          <input type="text" id="product-image" value="${product.image || ''}" placeholder="Or enter image path" style="margin-top: 0.5rem;">
        </div>
        ${product.image ? `<div class="image-preview"><img src="${product.image}" alt="Current image"></div>` : ''}
      </form>
    `;

    this.openModal(isNew ? 'Add New Product' : `Edit ${product.title || category}`, formHtml);

    // Handle file upload with GitHub integration
    document.getElementById('product-image-file').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const fileInput = e.target;
      const imagePathInput = document.getElementById('product-image');
      const form = document.getElementById('product-form');

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = document.querySelector('.image-preview');
        if (preview) {
          preview.querySelector('img').src = event.target.result;
        } else {
          const newPreview = document.createElement('div');
          newPreview.className = 'image-preview';
          newPreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
          form.appendChild(newPreview);
        }
      };
      reader.readAsDataURL(file);

      // Upload to GitHub if configured
      if (GitHubUpload.isConfigured()) {
        // Show uploading status
        const originalLabel = fileInput.nextElementSibling.innerHTML;
        fileInput.nextElementSibling.innerHTML = '<span style="color: #f59e0b;">Uploading...</span>';
        fileInput.disabled = true;

        const result = await GitHubUpload.uploadImage(file);

        fileInput.disabled = false;
        fileInput.nextElementSibling.innerHTML = originalLabel;

        if (result.success) {
          imagePathInput.value = result.path;
          this.showNotification('Image uploaded to GitHub!');
        } else {
          this.showNotification('Upload failed: ' + result.error, 'error');
          imagePathInput.value = `images/${file.name}`;
        }
      } else {
        // No GitHub config - just set the path (user must upload manually)
        imagePathInput.value = `images/${file.name}`;
        this.showNotification('Note: Configure GitHub token in config.js for auto-upload', 'error');
      }
    });
  }

  saveProduct() {
    const products = ContentStorage.getSection('products');
    const isNew = !this.currentEditId;

    if (isNew) {
      // Creating a new product
      const newId = document.getElementById('product-id').value.toLowerCase().trim();

      // Check if ID already exists
      if (products[newId]) {
        this.showNotification('A product with this ID already exists!', 'error');
        return;
      }

      products[newId] = {
        title: document.getElementById('product-title').value,
        description: document.getElementById('product-description').value,
        image: document.getElementById('product-image').value
      };

      ContentStorage.saveSection('products', products);
      this.loadProducts();
      this.updateDashboardStats();
      this.closeModal();
      this.showNotification('Product added successfully!');
    } else {
      // Updating existing product
      products[this.currentEditId] = {
        title: document.getElementById('product-title').value,
        description: document.getElementById('product-description').value,
        image: document.getElementById('product-image').value
      };

      ContentStorage.saveSection('products', products);
      this.loadProducts();
      this.closeModal();
      this.showNotification('Product updated successfully!');
    }
  }

  deleteProduct(category) {
    const products = ContentStorage.getSection('products');
    const product = products[category];

    if (!confirm(`Are you sure you want to delete "${product?.title || category}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    delete products[category];
    ContentStorage.saveSection('products', products);
    this.loadProducts();
    this.updateDashboardStats();
    this.showNotification('Product deleted');
  }

  // Gallery management
  bindGallery() {
    document.getElementById('add-image-btn').addEventListener('click', () => {
      this.editGalleryItem(null);
    });

    document.getElementById('gallery-category').addEventListener('change', () => {
      this.loadGallery();
    });
  }

  loadGallery() {
    const gallery = ContentStorage.getSection('gallery') || [];
    const filter = document.getElementById('gallery-category').value;
    const grid = document.getElementById('gallery-grid');

    const filteredGallery = filter === 'all'
      ? gallery
      : gallery.filter(item => item.category === filter);

    document.getElementById('gallery-count').textContent = gallery.length;

    if (filteredGallery.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--admin-text-muted);">
          <p>No images in gallery. Click "Add Image" to add your first image.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filteredGallery.map((item, index) => `
      <div class="gallery-item" data-id="${item.id}">
        <div class="gallery-item-image">
          <img src="${item.image}" alt="${item.caption || ''}">
          <div class="gallery-item-overlay">
            <button class="btn btn-sm btn-secondary edit-gallery-btn" data-id="${item.id}">Edit</button>
            <button class="btn btn-sm btn-danger delete-gallery-btn" data-id="${item.id}">Delete</button>
          </div>
        </div>
        <div class="gallery-item-info">
          <p>${item.caption || 'No caption'}</p>
        </div>
      </div>
    `).join('');

    // Bind edit/delete buttons
    grid.querySelectorAll('.edit-gallery-btn').forEach(btn => {
      btn.addEventListener('click', () => this.editGalleryItem(btn.dataset.id));
    });

    grid.querySelectorAll('.delete-gallery-btn').forEach(btn => {
      btn.addEventListener('click', () => this.deleteGalleryItem(btn.dataset.id));
    });
  }

  editGalleryItem(id) {
    const gallery = ContentStorage.getSection('gallery') || [];
    const item = id ? gallery.find(g => g.id == id) : null;

    this.currentEditType = 'gallery';
    this.currentEditId = id;

    const formHtml = `
      <form class="admin-form" id="gallery-form">
        <div class="form-group">
          <label for="gallery-image">Image</label>
          <div class="file-input-wrapper">
            <input type="file" id="gallery-image-file" accept="image/*">
            <label for="gallery-image-file" class="file-input-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              ${item ? 'Change Image' : 'Upload Image'}
            </label>
          </div>
          <input type="text" id="gallery-image" value="${item?.image || ''}" placeholder="Or enter image path" style="margin-top: 0.5rem;" required>
        </div>
        <div class="form-group">
          <label for="gallery-caption">Caption</label>
          <input type="text" id="gallery-caption" value="${item?.caption || ''}" placeholder="Enter image caption">
        </div>
        <div class="form-group">
          <label for="gallery-category">Category</label>
          <select id="gallery-cat" required>
            <option value="">Select category...</option>
            <option value="fiero" ${item?.category === 'fiero' ? 'selected' : ''}>Fiero</option>
            <option value="corvette" ${item?.category === 'corvette' ? 'selected' : ''}>Corvette</option>
            <option value="mg" ${item?.category === 'mg' ? 'selected' : ''}>MG</option>
            <option value="triumph" ${item?.category === 'triumph' ? 'selected' : ''}>Triumph</option>
            <option value="kitcar" ${item?.category === 'kitcar' ? 'selected' : ''}>Kit Car</option>
            <option value="ponycars" ${item?.category === 'ponycars' ? 'selected' : ''}>Pony Cars</option>
            <option value="retro" ${item?.category === 'retro' ? 'selected' : ''}>Retro-Mods</option>
            <option value="trimbright" ${item?.category === 'trimbright' ? 'selected' : ''}>TrimBright</option>
          </select>
        </div>
        ${item?.image ? `<div class="image-preview"><img src="${item.image}" alt="Current image"></div>` : ''}
      </form>
    `;

    this.openModal(item ? 'Edit Image' : 'Add Image', formHtml);

    // Handle file upload with GitHub integration
    document.getElementById('gallery-image-file').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const fileInput = e.target;
      const imagePathInput = document.getElementById('gallery-image');
      const form = document.getElementById('gallery-form');

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = document.querySelector('.image-preview');
        if (preview) {
          preview.querySelector('img').src = event.target.result;
        } else {
          const newPreview = document.createElement('div');
          newPreview.className = 'image-preview';
          newPreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
          form.appendChild(newPreview);
        }
      };
      reader.readAsDataURL(file);

      // Upload to GitHub if configured
      if (GitHubUpload.isConfigured()) {
        const originalLabel = fileInput.nextElementSibling.innerHTML;
        fileInput.nextElementSibling.innerHTML = '<span style="color: #f59e0b;">Uploading...</span>';
        fileInput.disabled = true;

        const result = await GitHubUpload.uploadImage(file);

        fileInput.disabled = false;
        fileInput.nextElementSibling.innerHTML = originalLabel;

        if (result.success) {
          imagePathInput.value = result.path;
          this.showNotification('Image uploaded to GitHub!');
        } else {
          this.showNotification('Upload failed: ' + result.error, 'error');
          imagePathInput.value = `images/${file.name}`;
        }
      } else {
        imagePathInput.value = `images/${file.name}`;
        this.showNotification('Note: Configure GitHub token in config.js for auto-upload', 'error');
      }
    });
  }

  saveGalleryItem() {
    const gallery = ContentStorage.getSection('gallery') || [];
    const newItem = {
      id: this.currentEditId || Date.now(),
      image: document.getElementById('gallery-image').value,
      caption: document.getElementById('gallery-caption').value,
      category: document.getElementById('gallery-cat').value
    };

    if (this.currentEditId) {
      const index = gallery.findIndex(g => g.id == this.currentEditId);
      if (index !== -1) {
        gallery[index] = newItem;
      }
    } else {
      gallery.push(newItem);
    }

    ContentStorage.saveSection('gallery', gallery);
    this.loadGallery();
    this.closeModal();
    this.showNotification(this.currentEditId ? 'Image updated!' : 'Image added!');
  }

  deleteGalleryItem(id) {
    if (!confirm('Are you sure you want to delete this image?')) return;

    let gallery = ContentStorage.getSection('gallery') || [];
    gallery = gallery.filter(g => g.id != id);
    ContentStorage.saveSection('gallery', gallery);
    this.loadGallery();
    this.showNotification('Image deleted');
  }

  // Testimonials management
  bindTestimonials() {
    document.getElementById('add-testimonial-btn').addEventListener('click', () => {
      this.editTestimonial(null);
    });
  }

  loadTestimonials() {
    const testimonials = ContentStorage.getSection('testimonials') || [];
    const list = document.getElementById('testimonials-list');

    document.getElementById('testimonial-count').textContent = testimonials.length;

    if (testimonials.length === 0) {
      list.innerHTML = `
        <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--admin-text-muted);">
          <p>No testimonials yet. Click "Add Testimonial" to add your first testimonial.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = testimonials.map(item => `
      <div class="testimonial-item" data-id="${item.id}">
        <div class="testimonial-item-header">
          <div class="testimonial-item-author">
            <strong>${item.author}</strong>
            <span>${item.location}</span>
          </div>
          <div class="testimonial-item-actions">
            <button class="btn btn-sm btn-secondary edit-testimonial-btn" data-id="${item.id}">Edit</button>
            <button class="btn btn-sm btn-danger delete-testimonial-btn" data-id="${item.id}">Delete</button>
          </div>
        </div>
        <div class="testimonial-item-content">
          <p>"${item.content}"</p>
        </div>
      </div>
    `).join('');

    // Bind edit/delete buttons
    list.querySelectorAll('.edit-testimonial-btn').forEach(btn => {
      btn.addEventListener('click', () => this.editTestimonial(btn.dataset.id));
    });

    list.querySelectorAll('.delete-testimonial-btn').forEach(btn => {
      btn.addEventListener('click', () => this.deleteTestimonial(btn.dataset.id));
    });
  }

  editTestimonial(id) {
    const testimonials = ContentStorage.getSection('testimonials') || [];
    const item = id ? testimonials.find(t => t.id == id) : null;

    this.currentEditType = 'testimonial';
    this.currentEditId = id;

    const formHtml = `
      <form class="admin-form" id="testimonial-form">
        <div class="form-group">
          <label for="testimonial-author">Customer Name</label>
          <input type="text" id="testimonial-author" value="${item?.author || ''}" required>
        </div>
        <div class="form-group">
          <label for="testimonial-location">Location / Vehicle</label>
          <input type="text" id="testimonial-location" value="${item?.location || ''}" placeholder="e.g., TR6 Owner, California">
        </div>
        <div class="form-group">
          <label for="testimonial-content">Testimonial</label>
          <textarea id="testimonial-content" rows="5" required>${item?.content || ''}</textarea>
        </div>
        <div class="form-group">
          <label for="testimonial-rating">Rating</label>
          <select id="testimonial-rating">
            <option value="5" ${item?.rating === 5 ? 'selected' : ''}>5 Stars</option>
            <option value="4" ${item?.rating === 4 ? 'selected' : ''}>4 Stars</option>
            <option value="3" ${item?.rating === 3 ? 'selected' : ''}>3 Stars</option>
          </select>
        </div>
      </form>
    `;

    this.openModal(item ? 'Edit Testimonial' : 'Add Testimonial', formHtml);
  }

  saveTestimonial() {
    const testimonials = ContentStorage.getSection('testimonials') || [];
    const newItem = {
      id: this.currentEditId || Date.now(),
      author: document.getElementById('testimonial-author').value,
      location: document.getElementById('testimonial-location').value,
      content: document.getElementById('testimonial-content').value,
      rating: parseInt(document.getElementById('testimonial-rating').value)
    };

    if (this.currentEditId) {
      const index = testimonials.findIndex(t => t.id == this.currentEditId);
      if (index !== -1) {
        testimonials[index] = newItem;
      }
    } else {
      testimonials.push(newItem);
    }

    ContentStorage.saveSection('testimonials', testimonials);
    this.loadTestimonials();
    this.closeModal();
    this.showNotification(this.currentEditId ? 'Testimonial updated!' : 'Testimonial added!');
  }

  deleteTestimonial(id) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    let testimonials = ContentStorage.getSection('testimonials') || [];
    testimonials = testimonials.filter(t => t.id != id);
    ContentStorage.saveSection('testimonials', testimonials);
    this.loadTestimonials();
    this.showNotification('Testimonial deleted');
  }

  // Content editing
  bindContentEdits() {
    document.querySelectorAll('.edit-content-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        this.editContent(page);
      });
    });
  }

  editContent(page) {
    const content = ContentStorage.getSection(page) || {};
    this.currentEditType = 'content';
    this.currentEditId = page;

    let formHtml = '';

    switch (page) {
      case 'hero':
        formHtml = `
          <form class="admin-form" id="content-form">
            <div class="form-group">
              <label for="content-title">Main Title</label>
              <input type="text" id="content-title" value="${content.title || ''}" required>
            </div>
            <div class="form-group">
              <label for="content-subtitle">Subtitle</label>
              <input type="text" id="content-subtitle" value="${content.subtitle || ''}">
            </div>
            <div class="form-group">
              <label for="content-description">Description</label>
              <textarea id="content-description" rows="4">${content.description || ''}</textarea>
            </div>
          </form>
        `;
        break;

      case 'about':
        formHtml = `
          <form class="admin-form" id="content-form">
            <div class="form-group">
              <label for="content-title">Section Title</label>
              <input type="text" id="content-title" value="${content.title || ''}" required>
            </div>
            <div class="form-group">
              <label for="content-description">Description</label>
              <textarea id="content-description" rows="4">${content.description || ''}</textarea>
            </div>
          </form>
        `;
        break;

      case 'contact':
        formHtml = `
          <form class="admin-form" id="content-form">
            <div class="form-group">
              <label for="content-phone">Phone Number</label>
              <input type="text" id="content-phone" value="${content.phone || ''}">
            </div>
            <div class="form-group">
              <label for="content-email">Email Address</label>
              <input type="email" id="content-email" value="${content.email || ''}">
            </div>
            <div class="form-group">
              <label for="content-hours">Business Hours</label>
              <input type="text" id="content-hours" value="${content.hours || ''}">
            </div>
          </form>
        `;
        break;
    }

    const titles = {
      hero: 'Edit Homepage Hero',
      about: 'Edit About Section',
      contact: 'Edit Contact Information'
    };

    this.openModal(titles[page], formHtml);
  }

  saveContent() {
    let newContent = {};

    switch (this.currentEditId) {
      case 'hero':
        newContent = {
          title: document.getElementById('content-title').value,
          subtitle: document.getElementById('content-subtitle').value,
          description: document.getElementById('content-description').value
        };
        break;

      case 'about':
        newContent = {
          title: document.getElementById('content-title').value,
          description: document.getElementById('content-description').value
        };
        break;

      case 'contact':
        newContent = {
          phone: document.getElementById('content-phone').value,
          email: document.getElementById('content-email').value,
          hours: document.getElementById('content-hours').value
        };
        break;
    }

    ContentStorage.saveSection(this.currentEditId, newContent);
    this.closeModal();
    this.showNotification('Content updated successfully!');
  }

  // Settings
  bindSettings() {
    // GitHub Token handling
    const githubTokenInput = document.getElementById('github-token');
    const githubTokenStatus = document.getElementById('github-token-status');
    const saveGithubTokenBtn = document.getElementById('save-github-token');

    // Load existing token (masked)
    const existingToken = CONFIG.getGitHubToken();
    if (existingToken) {
      githubTokenInput.value = existingToken;
      githubTokenStatus.innerHTML = '<span style="color: var(--admin-success);">Token configured. Image uploads enabled.</span>';
    } else {
      githubTokenStatus.innerHTML = '<span style="color: var(--admin-text-muted);">No token configured. Enter your GitHub token to enable image uploads.</span>';
    }

    // Save GitHub token
    saveGithubTokenBtn.addEventListener('click', () => {
      const token = githubTokenInput.value.trim();
      if (token) {
        CONFIG.setGitHubToken(token);
        githubTokenStatus.innerHTML = '<span style="color: var(--admin-success);">Token saved! Image uploads are now enabled.</span>';
        this.showNotification('GitHub token saved!');
      } else {
        CONFIG.setGitHubToken('');
        githubTokenStatus.innerHTML = '<span style="color: var(--admin-text-muted);">Token removed.</span>';
        this.showNotification('GitHub token removed');
      }
    });

    // Password form
    document.getElementById('settings-form').addEventListener('submit', (e) => {
      e.preventDefault();

      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const messageDiv = document.getElementById('settings-message');

      if (newPassword !== confirmPassword) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'New passwords do not match';
        messageDiv.style.display = 'block';
        return;
      }

      const result = AdminAuth.updatePassword(currentPassword, newPassword);
      messageDiv.className = `message ${result.success ? 'success' : 'error'}`;
      messageDiv.textContent = result.message;
      messageDiv.style.display = 'block';

      if (result.success) {
        document.getElementById('settings-form').reset();
      }
    });

    document.getElementById('export-btn').addEventListener('click', () => {
      ContentStorage.exportContent();
      this.showNotification('Content exported!');
    });
  }

  // Dashboard stats
  updateDashboardStats() {
    const products = ContentStorage.getSection('products') || {};
    const gallery = ContentStorage.getSection('gallery') || [];
    const testimonials = ContentStorage.getSection('testimonials') || [];

    document.getElementById('product-count').textContent = Object.keys(products).length;
    document.getElementById('gallery-count').textContent = gallery.length;
    document.getElementById('testimonial-count').textContent = testimonials.length;
  }

  // Notification
  showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.textContent = message;
    const bgColor = type === 'error' ? '#ef4444' : 'var(--admin-success)';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 300;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);
