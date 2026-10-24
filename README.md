# Urban Glimmer — Premium E-commerce Frontend Demo

A responsive jewellery and fashion accessories storefront built with **Next.js App Router, React, TypeScript, Tailwind CSS v4, shadcn-style UI components, Motion, and Lucide icons**.

## What's included

- Editorial, responsive storefront and brand story sections
- Product grid with category filtering, search, sorting, ratings, and badges
- Product quick-view modal with finish/details
- Wishlist interactions
- Cart drawer with quantity changes, remove item, subtotal, shipping threshold, and order summary
- Demo checkout form with validation and simulated order success
- Newsletter signup interaction (client-side demo only)
- Mobile navigation and filter controls
- Toast feedback and reduced-motion support
- Reusable button component and utility class helper

## Run locally

Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm run start
```

## Demo limitations

This is a **frontend-only prototype**. Cart, wishlist, newsletter confirmation, and checkout state live in browser memory and reset on refresh. The order confirmation is simulated. There is no real authentication, database, admin panel, email delivery, inventory synchronization, live chat backend, or payment processing yet. Product photos are loaded from Unsplash URLs, so internet access is needed to display them.

## Suggested next phase

Add persistent storage and API routes, customer authentication, admin product/order management, server-side inventory checks, and a real-time customer support inbox. Add a payment provider only after choosing a supported Indian payment gateway and configuring its sandbox credentials.
