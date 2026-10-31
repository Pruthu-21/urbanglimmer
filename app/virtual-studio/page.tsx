'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, Sparkles, Layers, ShoppingBag } from 'lucide-react';
import { Product, getStoredProducts } from '@/lib/productStore';

const VirtualStudioModal = dynamic(() => import('@/components/studio/VirtualStudioModal'), {
  ssr: false,
});

export default function VirtualStudioPage() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = (product: any) => {
    setCartCount((c) => c + 1);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 bg-[#151313] z-50 overflow-hidden">
      <VirtualStudioModal
        isOpen={true}
        onClose={handleClose}
        cartCount={cartCount}
        onAddToCart={handleAddToCart}
        onOpenCart={() => router.push('/cart')}
      />
    </div>
  );
}
