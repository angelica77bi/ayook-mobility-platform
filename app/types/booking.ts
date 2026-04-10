export type ScooterModel = 'vision1' | 'vision-pro';

export type ScooterColor = 'red' | 'green' | 'blue' | 'gray';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Scooter {
  model: ScooterModel;
  name: string;
  description: string;
  colors: ScooterColor[];
  basePrice: number; // 1-day package price in IDR
  specs: {
    range: number; // km
    maxSpeed: number; // km/h
    chargingTime: number; // hours
  };
  features: string[];
  image: string;
  colorImages?: Partial<Record<ScooterColor, string>>;
}

export interface BookingFormData {
  model: ScooterModel;
  color: ScooterColor;
  startDate: string;
  endDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes?: string;
}

export interface Booking extends BookingFormData {
  id: number;
  bookingNumber: string;
  rentalDays: number;
  pricePerDay: number;
  totalPrice: number;
  originalTotalPrice?: number;
  discountAmount?: number;
  appliedDiscountPercentage?: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PriceCalculation {
  days: number;
  pricePerDay: number;
  basePricePerDay: number;
  baseTotalPrice: number;
  totalPrice: number;
  discount?: number;
  discountAmount?: number;
}
