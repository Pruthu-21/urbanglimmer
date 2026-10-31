import { MetadataRoute } from 'next';
import { getAllProducts, Product } from '@/lib/productStore';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://urbanglimmer.com';
  const products: Product[] = getAllProducts();

  const staticRoutes = [
    '',
    '/shop',
    '/collections',
    '/offers',
    '/about',
    '/contact',
    '/faq',
    '/shipping-policy',
    '/returns-policy',
    '/privacy-policy',
    '/terms',
    '/cookie-policy',
    '/virtual-studio',
    '/track-order',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : route.startsWith('/shop') ? 0.9 : 0.7,
  }));

  const categoryRoutes = ['earrings', 'necklaces', 'rings', 'bracelets', 'cuffs'].map((cat) => ({
    url: `${baseUrl}/shop/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const collectionRoutes = [
    'festive-edit',
    'modern-gold',
    'royal-polki',
    'everyday-elegance',
    'statement-pieces',
  ].map((slug) => ({
    url: `${baseUrl}/collections/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const productRoutes = products.map((prod) => ({
    url: `${baseUrl}/products/${prod.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...collectionRoutes, ...productRoutes];
}
