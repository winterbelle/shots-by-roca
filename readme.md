# Shots By Roca — Photography Portfolio

Official portfolio website for automotive photographer and videographer Michael Roca, based in New York.

This site showcases Michael’s photography and video work through a modern, responsive gallery experience powered by Supabase Storage and a lightweight frontend built with HTML, CSS, and vanilla JavaScript.

Live site: *(add once deployed)*

---

## Overview

Shots By Roca is a custom-built portfolio designed to present automotive photography in a clean, immersive format while allowing easy media management without requiring code changes.

The site includes:

- Dynamic photo galleries powered by Supabase Storage
- Fullscreen lightbox viewing experience
- Hero slideshow loaded dynamically from cloud storage
- Video gallery linking directly to Instagram reels
- Contact form powered by Formspree
- Fully responsive design for desktop and mobile
- Modular structure for easy maintenance and expansion

---

## Features

### Dynamic Photo Galleries
Photos are loaded directly from Supabase Storage buckets:

```
photos/
├── performance/
├── events/
├── details/
├── scenic/
├── slideshow/
```



New images can be added without modifying code.

---

### Hero Slideshow
The homepage hero slideshow loads images dynamically from Supabase:

- No hardcoded image paths
- Automatically updates when new images are added
- Smooth fade transitions
- Responsive scaling for all screen sizes

---

### Video Gallery
Video section links to Instagram Reels:

- No large video files hosted on the site
- Fast load times
- Maintains Instagram engagement and view counts

---

### Contact Form
Contact form uses Formspree to send inquiries via email.

Includes:

- Name
- Email
- Optional phone number
- Message field
- Toast confirmation feedback

---

### Responsive Design
Optimized for:

- Desktop
- Tablet
- Mobile devices

Uses flexible layouts, adaptive image scaling, and mobile-specific adjustments.

---

## Tech Stack

Frontend:
- HTML5
- CSS3
- Vanilla JavaScript

Backend / Cloud:
- Supabase Storage (image hosting)
- Supabase JS Client (CDN)
- Formspree (contact form handling)

Hosting:
- Netlify (recommended)
- GitHub Pages compatible

---

## Project Structure

```
shots-by-roca/
│
├── index.html
├── photos.html
├── videos.html
│
├── style.css
│
├── scripts/
│ ├── gallery.js
│ ├── hero-slideshow.js
│ ├── contact.js
│ └── footer-loader.js
│
├── partials/
│ └── footer.html
│
└── assets/
```

---

## Supabase Setup

Media is stored in a Supabase Storage bucket named: photos

### Folder structure

```
photos/
├── details/
├── events/
├── performance/
├── scenic/
├── Slideshow-Mobile/
└── Slideshow/

```

Storage policies allow public read access for gallery loading.

---

## How to Add Photos

Images are managed through Supabase Storage.

To add new photos:

1. Open the Supabase Dashboard  
2. Go to **Storage → photos bucket**
3. Navigate to the appropriate folder:

```
photos/
├── performance/
├── events/
├── details/
├── scenic/
└── slideshow/
```

4. Upload your image file (JPG, PNG, or WebP recommended)

Example:

```
photos/performance/new-image.jpg
```


The gallery will automatically update when the page reloads.

No code changes are required.


## Deployment

Recommended deployment options:

Netlify:
- Drag and drop project folder
- Instant deployment

GitHub Pages:
- Push repository
- Enable Pages in settings

---

## Author

Developed for Michael Roca  
Automotive Photographer — New York  

Site designed and built to provide a fast, scalable, and professional portfolio experience.

Instagram:
https://www.instagram.com/a90_gouf/

---

## License

This project is for portfolio use. All photography and media belong to Michael Roca.
