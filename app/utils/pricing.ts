import type { ScooterModel, PriceCalculation } from '~/types/booking';

type PackagePrice = {
  days: number;
  price: number;
};

const PACKAGE_PRICES: Record<ScooterModel, PackagePrice[]> = {
  'vision1': [
    { days: 30, price: 3000000 },
    { days: 14, price: 1570000 },
    { days: 7, price: 940000 },
    { days: 3, price: 430000 },
    { days: 1, price: 160000 },
  ],
  'vision-pro': [
    { days: 30, price: 3750000 },
    { days: 14, price: 1970000 },
    { days: 7, price: 1180000 },
    { days: 3, price: 530000 },
    { days: 1, price: 200000 },
  ],
};

function calculateTieredTotal(model: ScooterModel, days: number): number {
  const packages = PACKAGE_PRICES[model];
  const applicablePackage = packages.find((pkg) => pkg.days <= days) ?? packages[packages.length - 1];
  const averagePerDay = applicablePackage.price / applicablePackage.days;
  return Math.round(averagePerDay * days);
}

export function calculatePrice(
  model: ScooterModel,
  days: number,
  options?: {
    discountPercentage?: number;
  }
): PriceCalculation {
  if (days < 1) {
    throw new Error('Rental duration must be at least 1 day');
  }

  const discountPercentage = options?.discountPercentage ?? 0;
  const baseTotalPrice = calculateTieredTotal(model, days);
  const totalPrice =
    discountPercentage > 0
      ? Math.round(baseTotalPrice * ((100 - discountPercentage) / 100))
      : baseTotalPrice;
  const basePricePerDay = Math.round(baseTotalPrice / days);
  const pricePerDay = Math.round(totalPrice / days);

  return {
    days,
    basePricePerDay,
    baseTotalPrice,
    pricePerDay,
    totalPrice,
    discount: discountPercentage || undefined,
    discountAmount:
      discountPercentage > 0 ? baseTotalPrice - totalPrice : undefined,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateRentalDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1; // Minimum 1 day
}
