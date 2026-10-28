import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F0E6] text-[#302326] flex flex-col items-center justify-center p-6 text-center font-sans">
      <span className="font-serif text-5xl font-bold text-[#603A46]">404</span>
      <h2 className="font-serif text-2xl font-semibold mt-2 text-[#302326]">
        Piece Not Found
      </h2>
      <p className="text-sm text-[#7E6B72] mt-2 max-w-sm">
        The piece or page you are looking for may have been moved or is no longer available in the studio archive.
      </p>
      <Link
        href="/"
        className="mt-6 px-5 py-2.5 bg-[#603A46] text-[#F7F0E6] text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#852F3A] transition-colors"
      >
        Return to Storefront
      </Link>
    </div>
  );
}
