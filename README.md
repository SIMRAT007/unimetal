# Unimetal

A fully dynamic Vite + React website with a Firebase-backed CMS. Every section, link, image, and page is editable from the admin panel.

## Features

- **Public site**: home page with dynamic hero, categories, industries, capabilities, quotes, why us, about, stats, CTA, contact, and footer
- **Product catalog**: category pages, product detail pages, image galleries, enquiry links
- **Industry & capability pages**: full detail pages driven by Firestore
- **Search**: live product search in the navbar
- **Admin panel**: secure login with Firebase Auth; CRUD, reorder, image upload, and rich-text editing for every module
- **Firebase**: Firestore database, Firebase Authentication, and Firebase Storage

## Firestore Collections

```
config/
  topbar
  navbar
  whyUs
  about
  stats
  cta
  contact
  footer
  setup
navLinks/{id}
heroSlides/{id}
categories/{id}
products/{id}
quotes/{id}
industries/{id}
capabilities/{id}
```

## Getting Started

1. Create a Firebase project at https://console.firebase.google.com.
2. Enable **Firestore Database** and **Authentication** (Email/Password provider). No Storage is needed — all images use external URLs.
3. In the Firebase console, go to **Firestore Database → Rules** and paste the contents of `firestore.rules`.
4. Make sure `.env` in the project root contains your Firebase config.
5. Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

## First-time setup

Open **http://localhost:5179/admin/setup** and create the first admin account. This also seeds the 21 default product categories and 8 capabilities.

After setup, log in at `/admin/login` and manage all content from the admin panel.

## Public Routes

- `/` — home page
- `/category/:slug` — category page with products
- `/product/:slug` — product detail
- `/industries/:slug` — industry detail
- `/capabilities/:slug` — capability detail
- `/contact` — contact page

## Admin Routes

- `/admin/login` — sign in
- `/admin/setup` — one-time first admin & seed
- `/admin` — dashboard
- `/admin/products` — categories & products
- `/admin/:module` — any other CMS module (topbar, navbar, hero, quotes, etc.)

## Tech Stack

- Vite 5
- React 18
- React Router 6
- Firebase (Auth, Firestore, Storage)
- react-helmet-async (SEO meta tags)
- react-quill (rich text editor)
- @dnd-kit (drag-and-drop reordering)
- lucide-react (icons)

