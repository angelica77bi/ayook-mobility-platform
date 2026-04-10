import type { Route } from './+types/api.bookings.$bookingNumber';

interface Env {
  DB: D1Database;
}

export async function loader({ params, context }: Route.LoaderArgs) {
  try {
    const env = context.cloudflare.env as Env;
    const { bookingNumber } = params;

    const booking = await env.DB.prepare(
      'SELECT * FROM bookings WHERE booking_number = ?'
    )
      .bind(bookingNumber)
      .first();

    if (!booking) {
      return new Response('Booking not found', { status: 404 });
    }

    return Response.json({
      id: booking.id,
      bookingNumber: booking.booking_number,
      model: booking.model,
      color: booking.color,
      startDate: booking.start_date,
      endDate: booking.end_date,
      rentalDays: booking.rental_days,
      pricePerDay: booking.price_per_day,
      totalPrice: booking.total_price,
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_phone,
      customerNotes: booking.customer_notes,
      status: booking.status,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
    });
  } catch (error) {
    console.error('Booking fetch error:', error);
    return new Response('Failed to fetch booking', { status: 500 });
  }
}
