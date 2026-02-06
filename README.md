# MrMikes - Complete Website Import Instructions

## LOVABLE.DEV IMPORT INSTRUCTIONS

**THIS IS A COMPLETE 390-FILE WEBSITE. YOU MUST IMPORT ALL FILES.**

### REQUIRED FILES TO IMPORT

#### 1. STYLESHEETS (IMPORT THESE FIRST)
```
styles.css      - Main website styles (REQUIRED for all pages)
admin.css       - Admin panel styles (REQUIRED for admin pages)
```

#### 2. JAVASCRIPT FILES (IMPORT THESE SECOND)
```
config.js       - Configuration and default data (REQUIRED)
app.js          - Main website functionality (REQUIRED)
admin.js        - Admin panel functionality (REQUIRED for admin)
```

#### 3. ALL 40 HTML PAGES (IMPORT ALL OF THESE)

**Main Pages:**
```
index.html              - Homepage (links to all other pages)
about.html              - About page
contact.html            - Contact page with form
faq.html                - FAQ page
legal.html              - Legal/terms page
```

**Product Pages:**
```
fiero.html              - Fiero products
corvette.html           - Corvette products
mg.html                 - MG products
triumph.html            - Triumph/Miata products
kitcar.html             - Kit-Car & Pantera products
ponycars.html           - Mustang & Camaro products
retro.html              - Retro-Mods products
trimbright.html         - TrimBright products
trimbright-details.html - TrimBright details
colors.html             - Color selection guide
```

**Fiero Sub-Pages:**
```
fiero-style-classic.html
fiero-style-gt.html
fiero-style-vetter.html
fiero-style-italian.html
fiero-style-sport.html
fiero-carpet.html
fiero-examples.html
fiero-instructions.html
```

**Miata Sub-Pages:**
```
miata-seat-types.html
miata-pleat-styles.html
miata-options.html
miata-instructions.html
miata-why-change.html
miata-mounting.html
```

**Information Pages:**
```
options.html
tips.html
instructions.html
how-to-order.html
matching-materials.html
tr6-panels.html
gift-certificates.html
associates.html
sitemap-mapping.html
```

**Admin Pages:**
```
admin.html              - Admin login
admin-dashboard.html    - Admin dashboard
```

#### 4. IMAGES FOLDER (IMPORT ENTIRE FOLDER - 343 FILES)

**YOU MUST IMPORT THE ENTIRE `images/` FOLDER**

The images folder contains 343 image files that are referenced by the HTML pages:

```
images/
├── rocky1_star.jpg           - Used by index.html, config.js
├── fieroinvette01.jpg        - Used by corvette.html, config.js
├── blackwyellowmgandweltsm.jpg - Used by mg.html, config.js
├── tr6beforeandafter_sm.jpg  - Used by triumph.html, config.js
├── pilasmira.jpg             - Used by kitcar.html, config.js
├── FieroSeatsIn65Mustang01.jpg - Used by ponycars.html, config.js
├── transam02_sm.jpg          - Used by retro.html, config.js
├── mustangpink01.jpg         - Used by trimbright.html, config.js
├── [335 more image files...]
└── youtubemrmikes2017b.jpg
```

**Image files are referenced in HTML like this:**
```html
<img src="images/rocky1_star.jpg" alt="Product">
```

**ALL images use relative paths starting with `images/`**

---

## FILE DEPENDENCIES

### styles.css is required by:
- index.html
- about.html
- contact.html
- faq.html
- legal.html
- fiero.html (and all fiero-*.html pages)
- corvette.html
- mg.html
- triumph.html
- kitcar.html
- ponycars.html
- retro.html
- trimbright.html, trimbright-details.html
- colors.html
- options.html
- tips.html
- instructions.html
- how-to-order.html
- matching-materials.html
- tr6-panels.html
- gift-certificates.html
- associates.html
- sitemap-mapping.html
- miata-*.html (all 6 miata pages)

### admin.css is required by:
- admin.html
- admin-dashboard.html

### config.js is required by:
- index.html
- admin.html
- admin-dashboard.html

### app.js is required by:
- index.html

### admin.js is required by:
- admin.html
- admin-dashboard.html

### images/ folder is required by:
- ALL HTML pages (they reference images with src="images/filename.jpg")
- config.js (contains default image paths)

---

## COLOR SCHEME (defined in styles.css)

```css
:root {
  --primary: #b91c1c;      /* Red - brand color */
  --secondary: #1e293b;    /* Dark blue - headers */
  --accent: #f59e0b;       /* Gold - accents */
  --background: #ffffff;   /* White - page background */
  --text: #1e293b;         /* Dark - body text */
  --text-light: #64748b;   /* Gray - secondary text */
  --border: #e2e8f0;       /* Light gray - borders */
}
```

---

## LAYOUT STRUCTURE

Each HTML page follows this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <!-- Navigation menu linking to other pages -->
  </header>

  <main>
    <!-- Page content with images from images/ folder -->
    <img src="images/example.jpg">
  </main>

  <footer>
    <!-- Footer with links -->
  </footer>
</body>
</html>
```

---

## COMPLETE FILE MANIFEST

**Total: 390 files**

| Category | Count | Files |
|----------|-------|-------|
| HTML Pages | 40 | index.html, about.html, contact.html, faq.html, legal.html, fiero.html, fiero-style-classic.html, fiero-style-gt.html, fiero-style-vetter.html, fiero-style-italian.html, fiero-style-sport.html, fiero-carpet.html, fiero-examples.html, fiero-instructions.html, corvette.html, mg.html, triumph.html, kitcar.html, ponycars.html, retro.html, trimbright.html, trimbright-details.html, colors.html, options.html, tips.html, instructions.html, how-to-order.html, matching-materials.html, tr6-panels.html, gift-certificates.html, associates.html, sitemap-mapping.html, miata-seat-types.html, miata-pleat-styles.html, miata-options.html, miata-instructions.html, miata-why-change.html, miata-mounting.html, admin.html, admin-dashboard.html |
| CSS Files | 2 | styles.css, admin.css |
| JS Files | 3 | config.js, app.js, admin.js |
| SQL Files | 1 | setup-supabase.sql |
| Images | 343 | All files in images/ folder |
| Documentation | 1 | README.md |

---

## IMPORT CHECKLIST

- [ ] Import `styles.css` (main stylesheet)
- [ ] Import `admin.css` (admin stylesheet)
- [ ] Import `config.js` (configuration)
- [ ] Import `app.js` (main JavaScript)
- [ ] Import `admin.js` (admin JavaScript)
- [ ] Import `index.html` (homepage)
- [ ] Import all 39 other HTML pages
- [ ] Import entire `images/` folder (343 images)
- [ ] Verify all pages load with correct styling
- [ ] Verify all images display correctly

---

## TESTING AFTER IMPORT

1. Open `index.html` - should show styled homepage with images
2. Click navigation links - should go to other pages
3. Check `fiero.html` - should show product images
4. Check `colors.html` - should show color swatches
5. Open `admin.html` - should show login page
6. Login with password: `mrmikes2024`

---

## TROUBLESHOOTING

**Pages have no styling:**
- Ensure `styles.css` is imported
- Check that HTML files reference `href="styles.css"`

**Images not showing:**
- Ensure entire `images/` folder is imported
- Check that image paths use `src="images/filename.jpg"`

**Admin not working:**
- Ensure `config.js`, `admin.js`, and `admin.css` are imported

---

## TECHNOLOGY

- Pure HTML5, CSS3, JavaScript
- No build process required
- No npm/node dependencies
- Works as static files
- LocalStorage for data persistence

## LICENSE

Copyright MrMikes. All rights reserved.
