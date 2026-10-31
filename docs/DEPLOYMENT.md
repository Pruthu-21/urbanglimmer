# Urban Glimmer — Production Build & Deployment Guide

## 1. Prerequisites
- **Node.js**: v20.9.0 or higher (v24 LTS recommended)
- **Package Manager**: `npm` (v10+)
- **System Memory**: Minimum 2GB RAM for production build compilation

---

## 2. Standard Production Build

```bash
# 1. Install production dependencies
npm install

# 2. Run static TypeScript validation
npm run typecheck

# 3. Execute automated business logic test suite
npm test

# 4. Compile optimized Next.js production build
npm run build

# 5. Start production Node server
npm run start
```

Default listening port: `http://localhost:3000` (configurable via `PORT=8080 npm start`).

---

## 3. Hostinger Deployment

The project includes an automated deployment packaging script in `scripts/package-hostinger.sh`:

```bash
npm run package:hostinger
```

This script:
1. Performs static verification and creates an optimized Next.js standalone bundle.
2. Packages `.next/standalone`, `.next/static`, and `public/` into `hostinger-deploy.zip`.
3. You can upload `hostinger-deploy.zip` directly to the Hostinger Cloud / VPS Node.js application manager.

---

## 4. Vercel & Netlify Deployment

1. Connect the GitHub repository to Vercel.
2. Framework Preset: **Next.js**.
3. Build Command: `npm run build`
4. Output Directory: `.next`
5. Configure Environment Variables in the project settings as specified in `.env.example`.

---

## 5. Docker Deployment

Create a `Dockerfile` for containerized environments:

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```
