import type { Scooter } from '~/types/booking';

export const SCOOTERS: Scooter[] = [
  {
    model: 'vision1',
    name: 'Vision 1',
    description: 'Perfect for city rides and short trips around Bali. Eco-friendly electric scooter with great range.',
    colors: ['red', 'green', 'blue'],
    basePrice: 160000,
    specs: {
      range: 100,
      maxSpeed: 80,
      chargingTime: 2,
    },
    image: '/images/scooter/vision1-red.png',
    colorImages: {
      red: '/images/scooter/vision1-red.png',
      green: '/images/scooter/vision1-green.png',
      blue: '/images/scooter/vision-blue.png',
    },
    features: [
      '1 Day 160K',
      '3 Days 430K',
      '7 Days 940K',
      '14 Days 1.570K',
      '30 Days 3.000K',
    ],
  },
  {
    model: 'vision-pro',
    name: 'Vision Pro',
    description: 'Premium electric scooter with extended range and superior performance for longer journeys.',
    colors: ['gray'],
    basePrice: 200000,
    specs: {
      range: 90,
      maxSpeed: 105,
      chargingTime: 2,
    },
    image: '/images/scooter/vision-pro-grey.png',
    colorImages: {
      gray: '/images/scooter/vision-pro-grey.png',
    },
    features: [
      '1 Day 200K',
      '3 Days 530K',
      '7 Days 1.180K',
      '14 Days 1.970K',
      '30 Days 3.750K',
    ],
  },
];

export const COLOR_NAMES: Record<string, string> = {
  red: 'Red',
  green: 'Green',
  blue: 'Blue',
  gray: 'Gray',
};

export const COLOR_HEX: Record<string, string> = {
  red: '#B21F0E',
  green: '#00D67F',
  blue: '#2F3A5B',
  gray: '#B4B8B1',
};

export function getScooterByModel(model: string): Scooter | undefined {
  return SCOOTERS.find(s => s.model === model);
}
