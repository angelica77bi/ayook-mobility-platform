import type { Booking } from '~/types/booking';
import { formatCurrency } from '~/utils/pricing';
import { getBookingQRCodeUrl, getWhatsAppUrl } from '~/utils/booking';
import { COLOR_NAMES } from '~/data/scooters';

interface BookingConfirmationProps {
  booking: Booking;
}

export default function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const qrCodeUrl = getBookingQRCodeUrl(booking.bookingNumber);
  const whatsappUrl = getWhatsAppUrl(booking.bookingNumber);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/70">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e7edf7] rounded-full mb-4 shadow-md">
            <svg
              className="w-8 h-8 text-[#2259A7]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600">
            Your electric scooter rental has been reserved.
          </p>
        </div>

        {/* Booking Number */}
        <div className="bg-[#e7edf7] border-2 border-[#c8d8ff] rounded-xl p-3 sm:p-4 mb-6 text-center">
          <p className="text-sm text-gray-600 mb-1">Booking Number</p>
          <p className="text-2xl font-bold text-[#2259A7]">{booking.bookingNumber}</p>
        </div>

        {/* QR Code */}
        <div className="text-center mb-6">
          <img
            src={qrCodeUrl}
            alt="Booking QR Code"
            className="mx-auto rounded-xl shadow-md"
          />
          <p className="text-sm text-gray-600 mt-2">
            Show this QR code at our shop
          </p>
        </div>

        {/* Booking Details */}
        <div className="border-t border-b border-gray-200 py-6 mb-6 space-y-3">
          <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>

          <div className="flex justify-between">
            <span className="text-gray-600">Scooter:</span>
            <span className="font-semibold text-gray-900">
              {booking.model === 'vision1' ? 'Vision 1' : 'Vision Pro'} ({COLOR_NAMES[booking.color]})
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold text-gray-900">
              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Total Days:</span>
            <span className="font-semibold text-gray-900">{booking.rentalDays} days</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Total Price:</span>
            <div className="text-right">
              {booking.originalTotalPrice && booking.appliedDiscountPercentage ? (
                <span className="block text-sm text-gray-400 line-through">
                  {formatCurrency(booking.originalTotalPrice)}
                </span>
              ) : null}
              <span className="font-semibold text-[#2259A7] text-lg">
                {formatCurrency(booking.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {booking.appliedDiscountPercentage ? (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-[linear-gradient(135deg,#f1fbf6_0%,#f8fbff_100%)] p-4">
            <p className="font-semibold text-emerald-700">
              {booking.appliedDiscountPercentage}% welcome offer applied
            </p>
            <p className="mt-1 text-sm text-slate-600">
              You saved {formatCurrency(booking.discountAmount ?? 0)} on this booking.
            </p>
          </div>
        ) : null}

        {/* Customer Info */}
        <div className="mb-6 space-y-2">
          <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
          <p className="text-gray-700">{booking.customerName}</p>
          <p className="text-gray-600">{booking.customerEmail}</p>
          <p className="text-gray-600">{booking.customerPhone}</p>
        </div>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#2259A7] hover:bg-[#1b4a8f] text-white py-3 sm:py-4 rounded-full font-semibold text-center transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.01] flex items-center justify-center gap-2 whitespace-nowrap mb-4"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Send to WhatsApp
        </a>

        {/* Info */}
        <div className="bg-[#e7edf7] border border-[#c8d8ff] rounded-xl p-3 sm:p-4">
          <h4 className="font-semibold text-[#0f2ea6] mb-2">Next Steps:</h4>
          <ul className="text-sm text-[#1b4a8f] space-y-1">
            <li>• Save your booking number: {booking.bookingNumber}</li>
            <li>• Contact us via WhatsApp to confirm your arrival time</li>
            <li>• Show the QR code when you arrive at our shop</li>
            <li>• Bring a valid ID or driver's license</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
