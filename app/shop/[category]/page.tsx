import { Suspense } from 'react';
import ShopPage from '../page';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading catalogue...</div>}>
      <ShopPage />
    </Suspense>
  );
}
