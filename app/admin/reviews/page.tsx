'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  CheckCircle,
  EyeOff,
  Eye,
  Reply,
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import {
  Review,
  getStoredReviews,
  updateReviewStatus,
  replyToReview,
} from '@/lib/reviewStore';
import { getAdminSession } from '@/lib/customerStore';
import { logAdminAction } from '@/lib/settingsStore';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'hidden'>('all');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
    const handleUpdate = () => loadReviews();
    window.addEventListener('ug_reviews_updated', handleUpdate);
    return () => window.removeEventListener('ug_reviews_updated', handleUpdate);
  }, []);

  const loadReviews = () => {
    setReviews(getStoredReviews());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusChange = (id: string, newStatus: 'approved' | 'pending' | 'hidden') => {
    const success = updateReviewStatus(id, newStatus);
    if (success) {
      const admin = getAdminSession();
      // log action
      logAdminAction?.(admin?.name || 'Admin', 'REVIEW_MODERATION', `Review #${id}`, `Updated status to ${newStatus}`);
      showToast(`Review #${id} updated to ${newStatus}`);
      loadReviews();
    }
  };

  const handleSendReply = (id: string) => {
    if (!replyText.trim()) return;
    const success = replyToReview(id, replyText.trim());
    if (success) {
      const admin = getAdminSession();
      logAdminAction?.(admin?.name || 'Admin', 'REVIEW_REPLY', `Review #${id}`, `Replied: ${replyText.slice(0, 40)}...`);
      showToast(`Official reply posted to Review #${id}`);
      setReplyingToId(null);
      setReplyText('');
      loadReviews();
    }
  };

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.author.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#211C1D] text-[#C6A064] border border-[#C6A064]/30 px-4 py-3 rounded-md shadow-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-4">
        <div>
          <h1 className="font-serif text-2xl text-[#211B1C] font-normal">Customer Reviews & Feedback</h1>
          <p className="text-xs text-[#766D6D] mt-1">
            Moderate genuine patron feedback, verify verified-purchase authenticity, and issue official atelier replies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#766D6D]">
            Total: <strong className="text-[#211B1C]">{reviews.length}</strong> reviews
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-[#E8DFD5] flex flex-col sm:flex-row items-center gap-4 justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#766D6D]" />
          <input
            type="text"
            placeholder="Search by patron, product, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#766D6D]" />
          <div className="flex items-center gap-1 border border-[#E8DFD5] rounded-md p-1 bg-[#F8F4EE]/40 text-xs">
            {(['all', 'approved', 'pending', 'hidden'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded text-[11px] font-medium capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-[#603A46] text-white shadow-xs'
                    : 'text-[#766D6D] hover:text-[#211B1C]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Table / List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#E8DFD5] p-12 text-center text-[#766D6D]">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-[#C6A064]" />
            <p className="text-sm font-medium text-[#211B1C]">No reviews match your query</p>
            <p className="text-xs mt-1">Try clearing filters or search terms.</p>
          </div>
        ) : (
          filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-lg border border-[#E8DFD5] p-5 shadow-xs transition-shadow hover:shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#211B1C]">{rev.author}</span>
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle className="w-2.5 h-2.5" />
                        Verified Atelier Purchase
                      </span>
                    )}
                    <span className="text-[11px] text-[#766D6D]">· {rev.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= rev.rating ? 'fill-current' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[#211B1C]">{rev.title}</span>
                  </div>

                  <p className="text-xs text-[#766D6D] font-mono">
                    Product: <strong className="text-[#211B1C] font-sans">{rev.productName}</strong> (ID #{rev.productId})
                  </p>
                </div>

                {/* Status Badge & Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
                      rev.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : rev.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-stone-100 text-stone-600 border-stone-200'
                    }`}
                  >
                    {rev.status}
                  </span>

                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange(rev.id, 'approved')}
                      title="Approve & Publish"
                      className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px]">Approve</span>
                    </button>
                  )}

                  {rev.status !== 'hidden' && (
                    <button
                      onClick={() => handleStatusChange(rev.id, 'hidden')}
                      title="Hide from Storefront"
                      className="p-1.5 text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded text-xs flex items-center gap-1"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px]">Hide</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (replyingToId === rev.id) {
                        setReplyingToId(null);
                      } else {
                        setReplyingToId(rev.id);
                        setReplyText(rev.adminReply || '');
                      }
                    }}
                    className="p-1.5 text-[#603A46] bg-[#F8F4EE] hover:bg-[#E8DFD5] border border-[#E8DFD5] rounded text-xs flex items-center gap-1 font-medium"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{rev.adminReply ? 'Edit Reply' : 'Reply'}</span>
                  </button>
                </div>
              </div>

              {/* Comment text */}
              <p className="text-xs text-[#211B1C]/90 mt-3 leading-relaxed bg-[#F8F4EE]/30 p-3 rounded border border-[#E8DFD5]/60">
                &ldquo;{rev.comment}&rdquo;
              </p>

              {/* Admin reply display */}
              {rev.adminReply && replyingToId !== rev.id && (
                <div className="mt-3 pl-4 border-l-2 border-[#C6A064] text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#603A46]">
                    Urban Glimmer Atelier Response:
                  </span>
                  <p className="text-[#211B1C]/80 italic">&ldquo;{rev.adminReply}&rdquo;</p>
                </div>
              )}

              {/* Reply form */}
              {replyingToId === rev.id && (
                <div className="mt-4 pt-3 border-t border-[#E8DFD5] space-y-2">
                  <label className="text-[11px] font-semibold text-[#211B1C] block">
                    Write Official Concierge / Atelier Response:
                  </label>
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="E.g., Thank you for your feedback! The 18k vermeil finish was engineered for durability..."
                    className="w-full p-2.5 text-xs border border-[#E8DFD5] rounded-md focus:outline-[#C6A064] bg-[#F8F4EE]/50"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setReplyingToId(null)}
                      className="px-3 py-1.5 text-xs text-[#766D6D] hover:text-[#211B1C]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendReply(rev.id)}
                      className="px-3 py-1.5 text-xs bg-[#603A46] hover:bg-[#852F3A] text-white font-medium rounded-md transition-colors shadow-xs"
                    >
                      Post Atelier Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
