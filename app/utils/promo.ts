export type IntroPromoChoice = 'claimed' | 'full-price';

export const INTRO_PROMO_STORAGE_KEY = 'ayook_intro_offer_v1';
export const INTRO_PROMO_DISCOUNT_PERCENTAGE = 20;

export function getIntroPromoChoice(): IntroPromoChoice | null {
	if (typeof window === 'undefined') return null;

	const value = window.localStorage.getItem(INTRO_PROMO_STORAGE_KEY);
	return value === 'claimed' || value === 'full-price' ? value : null;
}

export function saveIntroPromoChoice(choice: IntroPromoChoice): void {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(INTRO_PROMO_STORAGE_KEY, choice);
}

export function hasClaimedIntroPromo(): boolean {
	return getIntroPromoChoice() === 'claimed';
}
