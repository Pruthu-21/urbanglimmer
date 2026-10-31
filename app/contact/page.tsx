'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, MessageCircle, Clock, ShieldCheck, Check } from 'lucide-react';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Consultation');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#211B1C] flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#852F3A] font-semibold block">
            CLIENT CONCIERGE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#603A46] font-medium tracking-tight">
            Connect With Our Ateliers
          </h1>
          <p className="text-xs sm:text-sm text-[#766D6D] leading-relaxed font-light">
            Whether you need bespoke bridal styling guidance, sizing consultations, or order assistance, our jewellery advisors are at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Atelier Contact Details */}
          <div className="md:col-span-5 space-y-6 text-xs text-[#766D6D]">
            <div className="bg-white p-6 rounded border border-[#E8DFD5] space-y-4 shadow-xs">
              <h2 className="font-serif text-xl font-medium text-[#603A46] border-b border-[#E8DFD5] pb-2">
                Concierge Desks
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-[#211B1C]">WhatsApp Private Styling</strong>
                    <a
                      href="https://wa.me/919820012345"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#603A46] hover:underline font-mono"
                    >
                      +91 98200 12345
                    </a>
                    <span className="block text-[10px] text-[#766D6D]">Average reply time: 10 minutes</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#603A46] mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-[#211B1C]">Email Inquiries</strong>
                    <a href="mailto:concierge@urbanglimmer.com" className="text-[#603A46] hover:underline">
                      concierge@urbanglimmer.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C6A064] mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-[#211B1C]">Advisor Hours</strong>
                    <span>Monday to Saturday · 10:00 AM – 7:00 PM IST</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#852F3A] mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-[#211B1C]">Flagship Ateliers</strong>
                    <p className="mt-0.5 leading-relaxed">
                      Studio 4, Goldsmiths Quarter, Johari Bazaar, Jaipur 302001 <br />
                      Pali Hill Studio, Bandra West, Mumbai 400050
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded border border-[#E8DFD5] shadow-xs text-xs">
            <h2 className="font-serif text-2xl font-medium text-[#603A46] border-b border-[#E8DFD5] pb-3 mb-5">
              Send An Atelier Note
            </h2>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-[#F8F4EE] rounded border border-[#E8DFD5]">
                <Check className="w-8 h-8 text-emerald-700 mx-auto" />
                <h3 className="font-serif text-xl text-[#211B1C]">Message Received</h3>
                <p className="text-xs text-[#766D6D] max-w-sm mx-auto">
                  Thank you, {name}. A member of our concierge team will reach out to <strong>{email}</strong> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2.5 focus:outline-[#603A46]"
                      placeholder="e.g. Ananya Singhal"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2.5 focus:outline-[#603A46]"
                      placeholder="ananya@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2.5 focus:outline-[#603A46]"
                  >
                    <option value="Product Consultation">Product & Styling Consultation</option>
                    <option value="Bridal Order">Bespoke Bridal Trousseau</option>
                    <option value="Order Tracking">Existing Order Inquiry</option>
                    <option value="Returns & Exchanges">15-Day Exchange Request</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#766D6D] block mb-1">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#F8F4EE] border border-[#E8DFD5] rounded px-3 py-2.5 focus:outline-[#603A46]"
                    placeholder="How can our artisans assist you today?"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#603A46] hover:bg-[#852F3A] text-white text-xs uppercase tracking-wider font-bold rounded transition-colors"
                >
                  Dispatch Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
