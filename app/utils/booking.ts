export function generateBookingNumber(): string {
  const prefix = 'AYK';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function getBookingQRCodeUrl(bookingNumber: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const bookingUrl = `${baseUrl}/booking/${bookingNumber}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(bookingUrl)}`;
}

export function getWhatsAppUrl(bookingNumber: string): string {
  const phoneNumber = '6282174024786'; // Remove spaces and +
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const bookingUrl = `${baseUrl}/booking/${bookingNumber}`;
  const message = `Hi AYOOK RENTAL, I have a booking:\n${bookingUrl}`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function saveBookingToLocalStorage(bookingNumber: string): void {
  if (typeof window === 'undefined') return;

  const bookings = getBookingsFromLocalStorage();
  if (!bookings.includes(bookingNumber)) {
    bookings.push(bookingNumber);
    localStorage.setItem('ayook_bookings', JSON.stringify(bookings));
  }
}

export function getBookingsFromLocalStorage(): string[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem('ayook_bookings');
  return stored ? JSON.parse(stored) : [];
}
