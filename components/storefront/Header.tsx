'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { getStoredProducts } from '@/lib/productStore';

interface HeaderProps {
  cartCount?: number;
  wishlistCount?: number;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
  onOpenStudio?: () => void;
}

export default function Header({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenSearch,
  onOpenStudio,
}: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(null);
  }, [pathname]);

  const navLinks = [
    { name: 'New Arrivals', href: '/shop?filter=new', hasMega: false },
    {
      name: 'Earrings',
      href: '/shop/earrings',
      hasMega: true,
      megaType: 'earrings',
    },
    {
      name: 'Necklaces',
      href: '/shop/necklaces',
      hasMega: true,
      megaType: 'necklaces',
    },
    {
      name: 'Rings',
      href: '/shop/rings',
      hasMega: true,
      megaType: 'rings',
    },
    {
      name: 'Bracelets & Bangles',
      href: '/shop/bracelets',
      hasMega: true,
      megaType: 'bracelets',
    },
    {
      name: 'Collections',
      href: '/collections',
      hasMega: true,
      megaType: 'collections',
    },
    {
      name: 'Festive Edit',
      href: '/collections/festive-radiance',
      highlight: true,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#F8F4EE]/95 backdrop-blur-md shadow-sm border-b border-[#E8DFD5]'
          : 'bg-[#F8F4EE] border-b border-[#E8DFD5]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#211B1C] hover:text-[#603A46] focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={onOpenSearch}
              className="p-2 ml-1 text-[#211B1C] hover:text-[#603A46] focus:outline-none"
              aria-label="Search catalogue"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Wordmark & Logo */}
          <div className="flex-1 lg:flex-initial flex items-center justify-center lg:justify-start">
            <Link href="/" className="group flex flex-col items-center lg:items-start text-center lg:text-left">
              <span className="font-serif text-2xl sm:text-3xl tracking-tight text-[#603A46] group-hover:text-[#852F3A] transition-colors font-medium">
                URBAN GLIMMER
                <span className="text-[#C6A064] ml-1 text-sm inline-block">✦</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#766D6D] -mt-1 font-sans font-semibold">
                Haute Joaillerie · India
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.hasMega && setMegaMenuOpen(item.megaType || null)}
                onMouseLeave={() => setMegaMenuOpen(null)}
              >
                <Link
                  href={item.href}
                  className={`text-xs uppercase tracking-wider font-semibold py-2 transition-colors flex items-center gap-1 ${
                    pathname === item.href
                      ? 'text-[#852F3A] border-b-2 border-[#852F3A]'
                      : item.highlight
                      ? 'text-[#852F3A] hover:text-[#603A46]'
                      : 'text-[#211B1C] hover:text-[#603A46]'
                  }`}
                >
                  {item.highlight && <Sparkles className="w-3 h-3 text-[#C6A064] inline" />}
                  <span>{item.name}</span>
                  {item.hasMega && <ChevronDown className="w-3 h-3 opacity-60" />}
                </Link>

                {/* Mega Menu Dropdown */}
                {item.hasMega && megaMenuOpen === item.megaType && (
                  <div className="absolute top-full -left-12 w-[540px] bg-[#FFFFFF] shadow-2xl rounded-sm border border-[#E8DFD5] p-6 grid grid-cols-2 gap-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div>
                      <h4 className="text-[11px] uppercase tracking-widest text-[#766D6D] font-bold pb-2 border-b border-[#E8DFD5] mb-3">
                        Featured in {item.name}
                      </h4>
                      <ul className="space-y-2 text-xs">
                        <li>
                          <Link
                            href={item.href}
                            className="text-[#211B1C] hover:text-[#852F3A] font-medium flex items-center justify-between group"
                          >
                            <span>Shop All {item.name}</span>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#C6A064]" />
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/collections/everyday-elegance"
                            className="text-[#766D6D] hover:text-[#211B1C] transition-colors"
                          >
                            Everyday Elegance
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/collections/festive-radiance"
                            className="text-[#766D6D] hover:text-[#211B1C] transition-colors"
                          >
                            Festive Radiance Edit
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/collections/wedding-collection"
                            className="text-[#766D6D] hover:text-[#211B1C] transition-colors"
                          >
                            Royal Wedding Trousseau
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-[#F8F4EE] p-4 rounded border border-[#E8DFD5] flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] tracking-widest uppercase font-semibold text-[#852F3A] block mb-1">
                          Curated Craft
                        </span>
                        <p className="font-serif text-lg text-[#211B1C] leading-snug">
                          Hand-finished in 18k Gold Vermeil & natural baroque pearls.
                        </p>
                      </div>
                      <Link
                        href={item.href}
                        className="text-[11px] uppercase tracking-wider font-bold text-[#603A46] hover:text-[#852F3A] flex items-center gap-1 mt-4"
                      >
                        <span>Explore Gallery</span>
                        <ArrowRight className="w-3 h-3 text-[#C6A064]" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Virtual 3D Studio Nav Link */}
            <Link
              href="/virtual-studio"
              className="text-xs uppercase tracking-wider font-semibold py-1.5 px-3 bg-[#603A46]/10 text-[#603A46] hover:bg-[#603A46] hover:text-[#F8F4EE] rounded border border-[#603A46]/20 transition-all flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-[#C6A064]" />
              <span>Virtual Studio 3D</span>
            </Link>
          </nav>

          {/* Header Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="hidden lg:flex items-center gap-2 text-xs text-[#766D6D] hover:text-[#211B1C] bg-[#FFFFFF] border border-[#E8DFD5] rounded-full py-1.5 px-3.5 transition-colors shadow-2xs"
              aria-label="Search jewelry catalogue"
            >
              <Search className="w-3.5 h-3.5 text-[#603A46]" />
              <span className="font-sans">Search jewellery...</span>
            </button>

            {/* Account Link & Dropdown */}
            <div className="relative group">
              <Link
                href="/account"
                className="p-2 text-[#211B1C] hover:text-[#603A46] transition-colors relative block"
                aria-label="Customer Account"
              >
                <User className="w-5 h-5" />
              </Link>
              {/* Account mini popup */}
              <div className="hidden group-hover:block absolute right-0 top-full pt-2 z-50">
                <div className="w-48 bg-white shadow-xl rounded border border-[#E8DFD5] py-2 text-xs">
                  <div className="px-3 py-1.5 border-b border-[#E8DFD5] text-[11px] text-[#766D6D]">
                    Welcome to Urban Glimmer
                  </div>
                  <Link href="/account" className="block px-3 py-2 text-[#211B1C] hover:bg-[#F8F4EE]">
                    My Account Overview
                  </Link>
                  <Link href="/account/orders" className="block px-3 py-2 text-[#211B1C] hover:bg-[#F8F4EE]">
                    My Orders
                  </Link>
                  <Link href="/track-order" className="block px-3 py-2 text-[#211B1C] hover:bg-[#F8F4EE]">
                    Track An Order
                  </Link>
                  <div className="border-t border-[#E8DFD5] my-1" />
                  <Link href="/admin" className="block px-3 py-2 text-[#852F3A] hover:bg-[#F8F4EE] font-medium">
                    Admin Staff Portal →
                  </Link>
                </div>
              </div>
            </div>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="p-2 text-[#211B1C] hover:text-[#603A46] transition-colors relative"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#852F3A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Trigger */}
            <button
              onClick={onOpenCart}
              className="p-2 text-[#211B1C] hover:text-[#603A46] transition-colors relative"
              aria-label={`Shopping bag (${cartCount} items)`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#603A46] text-[#C6A064] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#C6A064]/50">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-[#F8F4EE] h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-4 border-b border-[#E8DFD5] flex items-center justify-between">
              <div>
                <span className="font-serif text-xl tracking-tight text-[#603A46] font-medium">
                  URBAN GLIMMER
                </span>
                <span className="block text-[8px] tracking-widest uppercase text-[#766D6D]">
                  Luxury Indian Jewellery
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#211B1C] hover:text-[#603A46]"
                aria-label="Close navigation"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 flex-1 space-y-4">
              <nav className="space-y-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm uppercase tracking-wider font-semibold text-[#211B1C] hover:bg-[#EFE8DE] rounded transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-[#E8DFD5] pt-4 space-y-2 text-xs">
                <Link
                  href="/virtual-studio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#603A46] text-[#F8F4EE] rounded font-semibold uppercase tracking-wider text-[11px]"
                >
                  <Layers className="w-4 h-4 text-[#C6A064]" />
                  <span>Experience Virtual Studio 3D</span>
                </Link>
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-[#766D6D] hover:text-[#211B1C]"
                >
                  Track Order
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-[#766D6D] hover:text-[#211B1C]"
                >
                  My Account
                </Link>
                <Link
                  href="/offers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-[#852F3A] font-semibold"
                >
                  Festive Offers & Coupons
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-[#603A46] font-semibold"
                >
                  Admin Management
                </Link>
              </div>
            </div>

            <div className="p-4 border-t border-[#E8DFD5] bg-[#EFE8DE] text-xs text-[#766D6D] space-y-1">
              <p className="font-serif italic text-sm text-[#603A46]">Handcrafted for your most meaningful moments.</p>
              <p className="text-[10px]">Complimentary Indian insured shipping above ₹1,999</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
