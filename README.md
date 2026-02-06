# MrMikes Complete Website Package

A complete, self-contained website with all images included.

## Package Contents

```
mrmikes-complete/
├── index.html          # Main website
├── admin.html          # Admin panel
├── styles.css          # All styles
├── config.js           # Configuration
├── app.js              # Website JavaScript
├── admin.js            # Admin JavaScript
├── setup-supabase.sql  # Database setup (optional)
├── README.md           # This file
└── images/             # All 343 product images
```

## Quick Start

1. Upload all files to your hosting or Lovable.dev
2. Open `index.html` - your website is ready!
3. Open `admin.html` to manage content

**Admin Login:**
- Password: `mrmikes2024`
- (Change this in `config.js`)

## Features

### Website
- Product showcase with your actual images
- Customer testimonials
- Contact form
- Mobile responsive design
- Smooth scrolling navigation

### Admin Panel
- **Products:** Add, edit, delete products
- **Gallery:** Manage image gallery by category
- **Testimonials:** Manage customer reviews
- **Page Content:** Edit hero, about, contact sections
- **Export:** Download all data as backup

## Images Included

All 343 original images are in the `images/` folder:
- Product photos
- Customer examples
- Installation guides
- Color swatches

## Customization

### Change Admin Password
Edit `config.js`:
```javascript
SIMPLE_PASSWORD: 'your-new-password',
```

### Add Cloud Storage (Supabase)
1. Create free account at [supabase.com](https://supabase.com)
2. Create project and run `setup-supabase.sql`
3. Update `config.js`:
```javascript
SUPABASE_URL: 'https://your-project.supabase.co',
SUPABASE_ANON_KEY: 'your-key',
USE_SIMPLE_AUTH: false,
```

### Change Colors
Edit CSS variables in `styles.css`:
```css
:root {
  --primary: #b91c1c;    /* Red brand color */
  --secondary: #1e293b;  /* Dark blue */
  --accent: #f59e0b;     /* Gold accent */
}
```

## For Lovable.dev

1. Create new project
2. Upload all files including the `images` folder
3. Deploy!

## File Sizes

- Total package: ~8MB
- Images folder: ~7.9MB (343 images)
- Code files: ~50KB

## Browser Support

Chrome, Firefox, Safari, Edge (latest versions)

## License

Copyright MrMikes. All rights reserved.
