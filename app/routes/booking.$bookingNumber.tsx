import { useLoaderData } from 'react-router';
import type { Route } from './+types/booking.$bookingNumber';
import Header from '~/components/Header';
import BookingConfirmation from '~/components/BookingConfirmation';
import type { Booking, ScooterModel, ScooterColor, BookingStatus } from '~/types/booking';

interface LocalEnv {
  DB: D1Database;
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const { bookingNumber } = params;
  const env = context.cloudflare.env as unknown as LocalEnv;

  try {
    const booking = await env.DB.prepare(
      'SELECT * FROM bookings WHERE booking_number = ?'
    )
      .bind(bookingNumber)
      .first();

    if (!booking) {
      throw new Response('Booking not found', { status: 404 });
    }

    // Map the DB result to the Booking type
    const mappedBooking: Booking = {
      id: booking.id as number,
      bookingNumber: booking.booking_number as string,
      model: booking.model as ScooterModel,
      color: booking.color as ScooterColor,
      startDate: booking.start_date as string,
      endDate: booking.end_date as string,
      rentalDays: booking.rental_days as number,
      pricePerDay: booking.price_per_day as number,
      totalPrice: booking.total_price as number,
      customerName: booking.customer_name as string,
      customerEmail: booking.customer_email as string,
      customerPhone: booking.customer_phone as string,
      customerNotes: booking.customer_notes as string,
      status: booking.status as BookingStatus,
      createdAt: booking.created_at as string,
      updatedAt: booking.updated_at as string,
    };

    return { booking: mappedBooking };
  } catch (error) {
    console.error('Booking fetch error:', error);
    if (error instanceof Response) throw error;
    throw new Response('Failed to fetch booking', { status: 500 });
  }
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.booking) {
    return [{ title: 'Booking Not Found' }];
  }

  return [
    { title: `Booking ${data.booking.bookingNumber} - AYOOK RENTAL` },
    { name: 'description', content: 'View your electric scooter rental booking details' },
  ];
}

export default function BookingDetail() {
  const { booking } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f7ff] via-white to-[#e9efff]">
      <Header />

      <main className="pt-28 sm:pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-sm font-semibold text-[#2259A7] tracking-[0.2em] uppercase mb-3">
              AYOOK RENTAL
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Your Booking Details
            </h1>
            <p className="text-gray-600">
              Keep this page for your trip. Your booking number and QR code are ready.
            </p>
          </div>
          <BookingConfirmation booking={booking} />
        </div>
      </main>
    </div>
  );
}
