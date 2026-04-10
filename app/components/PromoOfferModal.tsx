import { useEffect } from 'react';

const VISION_ONE_REGULAR_PRICE = 'Rp 160.000/day';
const VISION_ONE_DISCOUNTED_PRICE = 'Rp 128.000';

interface PromoOfferModalProps {
	discountPercentage: number;
	isOpen: boolean;
	onClaim: () => void;
	onDismiss: () => void;
}

export default function PromoOfferModal({
	discountPercentage,
	isOpen,
	onClaim,
	onDismiss,
}: PromoOfferModalProps) {
	useEffect(() => {
		if (!isOpen || typeof document === 'undefined') return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onDismiss();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onDismiss]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#081b40]/65 p-4 backdrop-blur-md">
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="promo-offer-title"
				aria-describedby="promo-offer-description"
				className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/50 bg-white shadow-[0_32px_80px_rgba(8,27,64,0.35)] animate-in fade-in zoom-in-95 duration-300"
			>
				<button
					type="button"
					onClick={onDismiss}
					className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white transition hover:bg-white/25"
					aria-label="Close offer and continue with full price"
					title="Continue with full price"
				>
					<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				<div className="bg-[linear-gradient(135deg,#0f2ea6_0%,#2259A7_58%,#2d7e8a_100%)] px-6 pb-8 pt-10 text-center text-white sm:px-10">
					<p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/72">
						LIMITED TIME OFFER
					</p>
					<h2 id="promo-offer-title" className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
						Get {discountPercentage}% Off
					</h2>
					<p className="mt-3 text-lg text-white/88">
						Your First Rental in Bali!
					</p>
				</div>

				<div className="space-y-6 px-6 py-7 sm:px-10 sm:py-9">
					<div className="text-center">
						<p className="text-lg text-gray-400 line-through decoration-2">
							{VISION_ONE_REGULAR_PRICE}
						</p>
						<p
							id="promo-offer-description"
							className="mt-2 text-5xl font-black tracking-tight text-[#143c7d] sm:text-6xl"
						>
							{VISION_ONE_DISCOUNTED_PRICE}
						</p>
						<p className="mt-2 text-base font-medium text-[#4b6179]">
							per day • Vision 1
						</p>
					</div>

					<div className="rounded-3xl border border-[#d6e4ff] bg-[linear-gradient(135deg,#f4f9ff_0%,#eef7f4_100%)] p-5 text-center">
						<p className="text-base font-semibold text-[#143c7d]">
							Keep Bali Green — Ride electric, save the island.
						</p>
						<p className="mt-2 text-sm leading-6 text-[#48627f]">
							Free delivery in Canggu area!
						</p>
					</div>

					<div className="space-y-3">
						<button
							type="button"
							onClick={onClaim}
							className="w-full rounded-full bg-[#2259A7] px-6 py-4 text-lg font-bold text-white shadow-[0_16px_36px_rgba(34,89,167,0.35)] transition hover:bg-[#1b4a8f]"
						>
							BOOK NOW &amp; CLAIM DISCOUNT
						</button>
						<button
							type="button"
							onClick={onDismiss}
							className="w-full rounded-full border border-[#d4deef] bg-white px-6 py-4 text-sm font-semibold text-[#51647d] transition hover:border-[#b6c8e6] hover:text-[#294f8e]"
						>
							No thanks, I&apos;ll pay full price
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
