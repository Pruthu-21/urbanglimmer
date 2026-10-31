import { redirect } from 'next/navigation';
import { getProductBySlug, INITIAL_PRODUCTS } from '@/lib/productStore';

export default async function ProductSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug || String(p.id) === slug);

  if (product) {
    redirect(`/products/${product.id}`);
  }

  redirect('/shop');
}
