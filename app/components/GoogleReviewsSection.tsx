import { GOOGLE_REVIEWS, GOOGLE_REVIEWS_SOURCE_URL } from '~/data/googleReviews';

function StarRating({ rating }: { rating: number }) {
	return (
		<div className="flex items-center gap-1 text-[#FFC107]" aria-label={`${rating} out of 5 stars`}>
			{Array.from({ length: rating }).map((_, index) => (
				<svg key={index} className="h-5 w-5 fill-current" viewBox="0 0 20 20" aria-hidden="true">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
				</svg>
			))}
		</div>
	);
}

export default function GoogleReviewsSection() {
	return (
		<section className="py-10 sm:py-12 lg:py-16 bg-[#EFF4FF]">
			<div className="container mx-auto px-4 sm:px-6 lg:px-12">
				<div className="flex flex-col gap-4 text-center mb-8 sm:mb-10">
						<div className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-[#2259A7]/10 bg-white px-4 py-2 text-sm font-medium text-[#2259A7] shadow-sm">
						<svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d="M21.35 11.1h-9.18v2.92h5.3c-.23 1.48-1.78 4.35-5.3 4.35-3.19 0-5.79-2.64-5.79-5.9s2.6-5.9 5.79-5.9c1.82 0 3.04.78 3.74 1.45l2.55-2.47C16.83 4.03 14.7 3 12.17 3 7.2 3 3.17 7.03 3.17 12s4.03 9 9 9c5.2 0 8.65-3.65 8.65-8.79 0-.59-.06-1.04-.17-1.11z" />
						</svg>
						Latest Google Maps Reviews
					</div>
					<div>
						<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">What Riders Say About Ayook</h2>
						<p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
							Recent guest feedback from our Google Maps listing, displayed in a clean card layout for quick trust building.
						</p>
					</div>
					<div>
						<a
							href={GOOGLE_REVIEWS_SOURCE_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-full bg-[#2259A7] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#1b4a8f] hover:shadow-xl"
						>
							<span>See all reviews on Google Maps</span>
							<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 17L17 7M17 7H9M17 7v8" />
							</svg>
						</a>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
					{GOOGLE_REVIEWS.map((review) => (
						<article
							key={`${review.name}-${review.postedAt}`}
							className="flex h-full flex-col rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_18px_45px_rgba(34,89,167,0.08)]"
						>
							<div className="mb-5 flex items-start gap-4">
								<div
									className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${review.avatarColorClass}`}
									aria-hidden="true"
								>
									{review.name.charAt(0)}
								</div>
								<div className="min-w-0">
									<h3 className="text-xl font-bold leading-tight text-gray-900">{review.name}</h3>
									<p className="text-sm sm:text-base text-gray-500">
										{review.postedAt} <span aria-hidden="true">·</span> {review.role}
									</p>
								</div>
							</div>

							<div className="mb-4">
								<StarRating rating={review.rating} />
							</div>

							<p className="flex-1 text-base sm:text-lg leading-8 text-gray-700">{review.review}</p>

							<div className="mt-6 flex items-center gap-2 text-sm sm:text-base font-semibold text-[#2259A7]">
								<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
								<span>{review.badgeLabel}</span>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
