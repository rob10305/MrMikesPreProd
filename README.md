# MrMikes - Premium Car Upholstery Kits

A complete multi-page website for MrMikes car upholstery business with 40 HTML pages, admin panel, and 343 product images.

## IMPORTANT: Complete File Structure

This is a **40-page website** - not just a single page. All HTML files in the root directory are part of the website.

### All HTML Pages (40 total)

#### Main Pages
| File | Description |
|------|-------------|
| `index.html` | Homepage - main landing page |
| `about.html` | About MrMikes page |
| `contact.html` | Contact information and form |
| `faq.html` | Frequently asked questions |
| `legal.html` | Legal/terms page |

#### Product Category Pages
| File | Description |
|------|-------------|
| `fiero.html` | Fiero seat upholstery kits |
| `corvette.html` | Corvette interior kits |
| `mg.html` | MG British classic car kits |
| `triumph.html` | Triumph/Miata seat kits |
| `kitcar.html` | Kit-Car & Pantera applications |
| `ponycars.html` | Vintage Mustang & Camaro kits |
| `retro.html` | Retro-Mods styling |
| `trimbright.html` | TrimBright welt products |
| `trimbright-details.html` | Detailed TrimBright info |
| `colors.html` | Color selection guide |

#### Fiero Specific Pages
| File | Description |
|------|-------------|
| `fiero-style-classic.html` | Classic style Fiero kits |
| `fiero-style-gt.html` | GT style Fiero kits |
| `fiero-style-vetter.html` | Vetter style Fiero kits |
| `fiero-style-italian.html` | Italian style Fiero kits |
| `fiero-style-sport.html` | Sport style Fiero kits |
| `fiero-carpet.html` | Fiero carpet options |
| `fiero-examples.html` | Fiero customer examples |
| `fiero-instructions.html` | Fiero installation guide |

#### Miata Specific Pages
| File | Description |
|------|-------------|
| `miata-seat-types.html` | Miata seat type guide |
| `miata-pleat-styles.html` | Miata pleat style options |
| `miata-options.html` | Miata customization options |
| `miata-instructions.html` | Miata installation guide |
| `miata-why-change.html` | Why upgrade Miata seats |
| `miata-mounting.html` | Miata seat mounting info |

#### Information & Help Pages
| File | Description |
|------|-------------|
| `options.html` | Product options overview |
| `tips.html` | Installation tips |
| `instructions.html` | General installation guide |
| `how-to-order.html` | Ordering information |
| `matching-materials.html` | Material matching guide |
| `tr6-panels.html` | TR6 panel information |
| `gift-certificates.html` | Gift certificate info |
| `associates.html` | Business associates |
| `sitemap-mapping.html` | Site navigation map |

#### Admin Pages
| File | Description |
|------|-------------|
| `admin.html` | Admin login page |
| `admin-dashboard.html` | Admin control panel |

### CSS Files (2 total)
| File | Description |
|------|-------------|
| `styles.css` | Main website styles |
| `admin.css` | Admin panel styles |

### JavaScript Files (3 total)
| File | Description |
|------|-------------|
| `app.js` | Main website functionality |
| `admin.js` | Admin panel functionality |
| `config.js` | Site configuration & default data |

### Other Files
| File | Description |
|------|-------------|
| `setup-supabase.sql` | Database setup for Supabase (optional) |
| `README.md` | This documentation file |

### Images Folder
The `images/` folder contains **343 product images**:
- Product photography
- Customer installation examples
- Color swatches
- Installation guide photos
- Brand assets

## Page Navigation Structure

```
index.html (Homepage)
├── Product Pages
│   ├── fiero.html → fiero-style-*.html, fiero-*.html
│   ├── corvette.html
│   ├── mg.html
│   ├── triumph.html
│   ├── kitcar.html
│   ├── ponycars.html
│   ├── retro.html
│   └── trimbright.html → trimbright-details.html
├── Information Pages
│   ├── about.html
│   ├── contact.html
│   ├── faq.html
│   ├── options.html
│   ├── colors.html
│   ├── tips.html
│   ├── instructions.html
│   ├── how-to-order.html
│   └── matching-materials.html
├── Miata Section
│   ├── miata-seat-types.html
│   ├── miata-pleat-styles.html
│   ├── miata-options.html
│   ├── miata-instructions.html
│   ├── miata-why-change.html
│   └── miata-mounting.html
└── Admin Section
    ├── admin.html (login)
    └── admin-dashboard.html (dashboard)
```

## Quick Start

1. **View Website:** Open `index.html` in a browser
2. **Admin Access:** Open `admin.html` (password: `mrmikes2024`)
3. **Deploy:** Upload ALL files to your hosting provider

## Admin Panel Features

- **Products:** Add, edit, delete product categories
- **Gallery:** Manage image gallery by category
- **Testimonials:** Manage customer reviews
- **Page Content:** Edit hero, about, contact sections
- **Export:** Download all data as backup

## Configuration

Edit `config.js` to customize:

```javascript
const CONFIG = {
  SUPABASE_URL: 'YOUR_SUPABASE_URL',      // For cloud storage
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_KEY', // For cloud storage
  USE_SIMPLE_AUTH: true,                   // Simple password auth
  SIMPLE_PASSWORD: 'mrmikes2024',          // Admin password
  SITE_NAME: 'MrMikes',
  SITE_TAGLINE: 'Premium Car Upholstery Kits'
};
```

## For Lovable.dev Import

**IMPORTANT:** This repository contains 40 HTML pages, not just index.html.

To import the complete website:
1. Connect this GitHub repository
2. Ensure ALL .html files are recognized (40 total)
3. Include the `images/` folder (343 images)
4. Include all .css and .js files

### File Count Summary
- HTML files: 40
- CSS files: 2
- JS files: 3
- SQL files: 1
- Images: 343
- **Total: 390 files**

## Technology Stack

- Pure HTML5, CSS3, JavaScript (no frameworks)
- LocalStorage for data persistence
- Optional Supabase integration for cloud storage
- Responsive design for mobile/tablet/desktop

## Browser Support

Chrome, Firefox, Safari, Edge (latest versions)

## License

Copyright MrMikes. All rights reserved.
