import { useState, useEffect } from 'react';
import type { Route } from './+types/home';
import BookingForm from '~/components/BookingForm';
import BookingConfirmation from '~/components/BookingConfirmation';
import GoogleReviewsSection from '~/components/GoogleReviewsSection';
import ScooterCard from '~/components/ScooterCard';
import PromoOfferModal from '~/components/PromoOfferModal';
import { SCOOTERS } from '~/data/scooters';
import type { BookingFormData, Booking } from '~/types/booking';
import { calculateRentalDays, calculatePrice } from '~/utils/pricing';
import { generateBookingNumber, saveBookingToLocalStorage } from '~/utils/booking';
import {
  getIntroPromoChoice,
  INTRO_PROMO_DISCOUNT_PERCENTAGE,
  saveIntroPromoChoice,
} from '~/utils/promo';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'AYOOK RENTAL - Electric Scooter Rental Bali' },
    {
      name: 'description',
      content:
        'Rent eco-friendly electric scooters in Bali. Affordable rates, convenient locations. Vision 1 and Vision Pro models available.',
    },
  ];
}

const BACKGROUND_IMAGES = [
  '/images/1eb958cb4a125a40f2c61455fa596115.jpg',
  '/images/2a53a7d118a4482df5ed7ca84981b011.jpg',
  '/images/540eb1307218015899bed022ac8be29e.jpg',
  '/images/599d64052ea9cd42b268b4700461d442.jpg',
  '/images/700d0dd4266a9e34c22eb87dbc5e7224.jpg',
  '/images/893694cf31269962d83706cb7b0436d1.jpg',
  '/images/da8905ac2cb256318426d57f41fa7286.jpg',
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [introPromoChoice, setIntroPromoChoice] = useState<ReturnType<typeof getIntroPromoChoice>>(null);
  const [hasLoadedPromoChoice, setHasLoadedPromoChoice] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIntroPromoChoice(getIntroPromoChoice());
    setHasLoadedPromoChoice(true);
    setIsPromoModalOpen(true);
  }, []);

  const hasClaimedPromo = introPromoChoice === 'claimed';
  const shouldShowPromoModal = hasLoadedPromoChoice && isPromoModalOpen;

  const handleClaimPromo = () => {
    saveIntroPromoChoice('claimed');
    setIntroPromoChoice('claimed');
    setIsPromoModalOpen(false);

    setTimeout(() => {
      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const handleDismissPromo = () => {
    saveIntroPromoChoice('full-price');
    setIntroPromoChoice('full-price');
    setIsPromoModalOpen(false);
  };

  const handleBookingSubmit = async (formData: BookingFormData) => {
    setIsSubmitting(true);

    try {
      const rentalDays = calculateRentalDays(formData.startDate, formData.endDate);
      const pricing = calculatePrice(formData.model, rentalDays, {
        discountPercentage: hasClaimedPromo ? INTRO_PROMO_DISCOUNT_PERCENTAGE : 0,
      });
      const bookingNumber = generateBookingNumber();

      const bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> = {
        ...formData,
        bookingNumber,
        rentalDays,
        pricePerDay: pricing.pricePerDay,
        totalPrice: pricing.totalPrice,
        status: 'pending',
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create booking' }));
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const booking: Booking = await response.json();
      saveBookingToLocalStorage(booking.bookingNumber);
      setConfirmedBooking({
        ...booking,
        originalTotalPrice: pricing.baseTotalPrice,
        discountAmount: pricing.discountAmount,
        appliedDiscountPercentage: pricing.discount,
      });

      setTimeout(() => {
        document.getElementById('confirmation')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create booking. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    'Hi! I\'m interested in renting an electric scooter in Bali. Can you help me?'
  );

  return (
    <div className="min-h-screen">
      <PromoOfferModal
        discountPercentage={INTRO_PROMO_DISCOUNT_PERCENTAGE}
        isOpen={shouldShowPromoModal}
        onClaim={handleClaimPromo}
        onDismiss={handleDismissPromo}
      />

      {/* Hero Section with Background */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background Image Slideshow with Ken Burns Effect */}
        <div className="absolute inset-0">
          {BACKGROUND_IMAGES.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${image})`,
                  animation: index === currentImageIndex ? 'kenBurns 5s ease-out forwards' : 'none',
                }}
              />
            </div>
          ))}
        </div>

        {/* Light Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-[#e8f1ff]/40 to-[#d7e6ff]/30 z-20" />

        {/* Header */}
        <header className="relative z-30 flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
          {/* Logo and Company Name */}
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="AYOOK RENTAL"
              className="h-12 sm:h-14 md:h-16 lg:h-18 max-h-16 w-auto drop-shadow-xl"
            />
          </div>

          {/* Contact Us Button */}
          <a
            href={`https://wa.me/6282174024786?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#2259A7] hover:bg-[#1b4a8f] text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Contact Us
          </a>
        </header>

        {/* Main Content - Two Column Layout */}
        <div className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column - Hero Content */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <img
                  src="/images/bander.png"
                  alt="Ride the future not the fumes"
                  className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[640px] h-auto drop-shadow-2xl"
                />
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#2259A7] rounded-lg p-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Eco-Friendly</h3>
                      <p className="text-sm text-white/80">100% Electric, Zero Emissions, No Petrol Fee</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#2259A7] rounded-lg p-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Free Riding Accessories</h3>
                      <p className="text-sm text-white/80">1 Charger, 2 Helmets, and Phone Holder Included</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#2259A7] rounded-lg p-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Delivery & Pick Up</h3>
                      <p className="text-sm text-white/80">Canggu Area Free / Paid Rest of Bali</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#2259A7] rounded-lg p-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Insurance & Help Policy</h3>
                      <p className="text-sm text-white/80">Optional Damage Insurance & 24/7 Help</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div id="booking-form" className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Book Your Scooter</h3>
              {!confirmedBooking ? (
                <BookingForm
                  initialModel="vision1"
                  onSubmit={handleBookingSubmit}
                  isSubmitting={isSubmitting}
                  discountPercentage={hasClaimedPromo ? INTRO_PROMO_DISCOUNT_PERCENTAGE : 0}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="bg-[#e7edf7] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#2259A7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h4>
                  <p className="text-gray-600 mb-4">Scroll down to see your booking details.</p>
                  <button
                    onClick={() => setConfirmedBooking(null)}
                    className="text-[#2259A7] hover:text-[#1b4a8f] font-semibold whitespace-nowrap"
                  >
                    Make Another Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
          <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Confirmation Section */}
      {confirmedBooking && (
        <section id="confirmation" className="py-12 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <BookingConfirmation booking={confirmedBooking} />
          </div>
        </section>
      )}

      {/* Our Scooters Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Electric Scooters</h2>
            <p className="text-xl text-gray-600">Choose from our premium eco-friendly models</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {SCOOTERS.map((scooter) => (
              <ScooterCard key={scooter.model} scooter={scooter} />
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-10 sm:py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Payment Methods</h2>
            <p className="text-lg sm:text-xl text-gray-600">We support QRIS, CARD, CASH</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-[#2259A7]/10 flex items-center justify-center">
                <img
                  src="/images/qris.jpg"
                  alt="QRIS"
                  className="h-8 w-8 object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-base font-semibold text-gray-900">QRIS</p>
              <p className="text-sm text-gray-500">Scan &amp; pay</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-[#2259A7]/10 text-[#2259A7] flex items-center justify-center">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.6" />
                  <path d="M3 10h18" strokeWidth="1.6" />
                  <path d="M7 15h4" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-base font-semibold text-gray-900">CARD</p>
              <p className="text-sm text-gray-500">Debit &amp; credit</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-[#2259A7]/10 text-[#2259A7] flex items-center justify-center">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="6" width="18" height="12" rx="2" strokeWidth="1.6" />
                  <circle cx="8.5" cy="12" r="2" strokeWidth="1.6" />
                  <path d="M13 12h6" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-base font-semibold text-gray-900">CASH</p>
              <p className="text-sm text-gray-500">Pay on pickup</p>
            </div>
          </div>
        </div>
      </section>

      <GoogleReviewsSection />

      {/* Contact Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Visit Us in Canggu</h2>
            <div className="bg-[#0f2ea6]/50 rounded-2xl overflow-hidden backdrop-blur-sm">
              {/* Google Maps Iframe */}
              <div className="w-full h-64 md:h-80">
                <iframe
                  width="100%"
                  height="100%"
                  title="Ayook Rental Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.4292964573187!2d115.14252861129715!3d-8.650656591360425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd239076410da01%3A0x30010975fd81a62f!2sAYOOK%20RENTAL%20-%20Electric%20scooter%20rental%20bali!5e0!3m2!1szh-CN!2sid!4v1770119884255!5m2!1szh-CN!2sid"
                  className="w-full h-full border-0"
                ></iframe>
              </div>

              <div className="p-5 sm:p-8">
                <div className="space-y-4 text-lg mb-8">
                  <a
                    href="https://maps.app.goo.gl/55dEt9GgxKPRMuL7A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 hover:text-[#2259A7] transition-colors duration-300 group"
                  >
                    <svg className="w-5 h-5 text-[#2259A7] group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="border-b border-transparent group-hover:border-[#2259A7]">
                      Gg. Jalak 10, Tibubeneng, Kec. Kuta Utara, Kabupaten Badung, Bali 80361
                    </span>
                  </a>
                  <p className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-[#2259A7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +62 821-7402-4786
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-[#2259A7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    ayook@ayook.id
                  </p>
                </div>
                <a
                  href={`https://wa.me/6282174024786?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#2259A7] hover:bg-[#1b4a8f] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 whitespace-nowrap"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Message Us on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <p className="text-gray-400">© 2025 AYOOK RENTAL. All rights reserved.</p>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes kenBurns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          100% {
            transform: scale(1.15) translate(-3%, -3%);
          }
        }
      `}</style>
    </div>
  );
}
