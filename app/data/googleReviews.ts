export type GoogleReview = {
	name: string;
	role: string;
	postedAt: string;
	rating: number;
	review: string;
	badgeLabel: string;
	avatarColorClass: string;
};

export const GOOGLE_REVIEWS_SOURCE_URL =
	'https://www.google.com/maps/place/AYOOK+RENTAL+-+Electric+Scooter+Rental+Service+Bali/@-8.6506566,115.142534,17z/data=!4m8!3m7!1s0x2dd239076410da01:0x30010975fd81a62f!8m2!3d-8.6506566!4d115.1451089!9m1!1b1!16s%2Fg%2F11mzqkjx2k?entry=ttu&g_ep=EgoyMDI2MDQwNS4wIKXMDSoASAFQAw%3D%3D';

export const GOOGLE_REVIEWS: GoogleReview[] = [
	{
		name: 'De Ajus',
		role: 'Google Review',
		postedAt: '2 weeks ago',
		rating: 5,
		review:
			'Good scooter.. next time I want to rent again! Thanks AYOOK RENTAL, best experience in Bali.',
		badgeLabel: 'Verified Google Review',
		avatarColorClass: 'bg-[#D64532]',
	},
	{
		name: 'Kajetan Moro',
		role: 'Local Guide',
		postedAt: '3 weeks ago',
		rating: 5,
		review:
			'Amazing eco-friendly scooter rental in Bali. Super smooth ride, very responsive team. Perfect for exploring the island!',
		badgeLabel: 'Verified Google Review',
		avatarColorClass: 'bg-[#8B5CF6]',
	},
	{
		name: 'Lucas T.',
		role: 'Google Review',
		postedAt: '3 weeks ago',
		rating: 5,
		review:
			'Rented for a week in Canggu. Free delivery, free helmets, and no petrol cost. Super affordable. Highly recommend to everyone.',
		badgeLabel: 'Verified Google Review',
		avatarColorClass: 'bg-[#1798C1]',
	},
	{
		name: 'Sarah M.',
		role: 'Google Review',
		postedAt: '1 month ago',
		rating: 5,
		review:
			'Best decision for exploring Bali! The scooter was clean, fully charged, and delivered on time. Will definitely rent again!',
		badgeLabel: 'Verified Google Review',
		avatarColorClass: 'bg-[#FFAA14]',
	},
	{
		name: 'Remi',
		role: 'Google Review',
		postedAt: '5 weeks ago',
		rating: 5,
		review:
			'Really affordable brand new electric scooter and the staff is great. I highly recommend!',
		badgeLabel: 'Verified Google Review',
		avatarColorClass: 'bg-[#2F6BEB]',
	},
	{
		name: 'Andika Putra',
		role: 'Google Review',
		postedAt: '8 weeks ago',
		rating: 5,
		review:
			'Tempat sewa motor listrik paling stylish dan terbaik di Bali!',
		badgeLabel: 'Verified Google Review',
		avatarColorClass: 'bg-[#22C55E]',
	},
];
