import type { Route } from './+types/api.bookings';

interface Env {
	DB: D1Database;
	TELEGRAM_BOT_TOKEN?: string;
	TELEGRAM_CHAT_ID?: string;
}

export async function action({ request, context }: Route.ActionArgs) {
	if (request.method !== 'POST') {
		return new Response('Method not allowed', { status: 405 });
	}

	try {
		const { env, ctx } = context.cloudflare;
		const data = await request.json();

		await env.DB.prepare(
			`INSERT INTO bookings (
				booking_number, model, color, start_date, end_date, rental_days,
				price_per_day, total_price, customer_name, customer_email,
				customer_phone, customer_notes, status
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
			.bind(
				data.bookingNumber,
				data.model,
				data.color,
				data.startDate,
				data.endDate,
				data.rentalDays,
				data.pricePerDay,
				data.totalPrice,
				data.customerName,
				data.customerEmail,
				data.customerPhone,
				data.customerNotes || '',
				data.status || 'pending'
			)
			.run();

		// Fetch the created booking
		const booking = await env.DB.prepare(
			'SELECT * FROM bookings WHERE booking_number = ?'
		)
			.bind(data.bookingNumber)
			.first();

		if (!booking) {
			throw new Error('Failed to create booking');
		}

		const telegramPromise = sendTelegramBookingNotification(env as Env, {
			bookingNumber: booking.booking_number as string,
			model: booking.model as string,
			color: booking.color as string,
			startDate: booking.start_date as string,
			endDate: booking.end_date as string,
			rentalDays: booking.rental_days as number,
			totalPrice: booking.total_price as number,
			customerName: booking.customer_name as string,
			customerEmail: booking.customer_email as string,
			customerPhone: booking.customer_phone as string,
			customerNotes: booking.customer_notes as string,
		}, new URL(request.url).origin);
		ctx.waitUntil(telegramPromise);

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
		console.error('Booking creation error:', error);
		const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
		return Response.json({ error: errorMessage }, { status: 500 });
	}
}

async function sendTelegramBookingNotification(
	env: Env,
	booking: {
		bookingNumber: string;
		model: string;
		color: string;
		startDate: string;
		endDate: string;
		rentalDays: number;
		totalPrice: number;
		customerName: string;
		customerEmail: string;
		customerPhone: string;
		customerNotes: string;
	},
	origin: string
) {
	if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
		console.warn('Telegram config missing; skipping notification.');
		return;
	}

	const bookingUrl = `${origin}/booking/${booking.bookingNumber}`;
	const notes = booking.customerNotes?.trim();
	const message = [
		'New booking received',
		`Model: ${booking.model}`,
		`Color: ${booking.color}`,
		`Dates: ${booking.startDate} to ${booking.endDate} (${booking.rentalDays} days)`,
		`Total: ${booking.totalPrice}`,
		`Customer: ${booking.customerName}`,
		`Email: ${booking.customerEmail}`,
		`Phone: ${booking.customerPhone}`,
		notes ? `Notes: ${notes}` : null,
		`Booking link: ${bookingUrl}`,
	]
		.filter(Boolean)
		.join('\n');

	try {
		const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				chat_id: env.TELEGRAM_CHAT_ID,
				text: message,
				disable_web_page_preview: true,
			}),
		});

		if (!response.ok) {
			const body = await response.text().catch(() => '');
			console.error('Telegram notification failed:', response.status, body);
		}
	} catch (error) {
		console.error('Telegram notification error:', error);
	}
}
