import { useState, useEffect } from 'react';
import type { BookingFormData, ScooterModel } from '~/types/booking';
import { SCOOTERS, COLOR_NAMES, COLOR_HEX } from '~/data/scooters';
import { calculatePrice, formatCurrency, calculateRentalDays } from '~/utils/pricing';
import { DatePicker } from '~/components/ui/DatePicker';
import type { DateRange } from 'react-day-picker';
import { format, parseISO } from 'date-fns';

interface BookingFormProps {
  initialModel?: ScooterModel;
  onSubmit: (data: BookingFormData) => void;
  isSubmitting: boolean;
  discountPercentage?: number;
}

type BookingFormState = BookingFormData & {
  customerPhoneCountryCode: string;
};

export default function BookingForm({
  initialModel = 'vision1',
  onSubmit,
  isSubmitting,
  discountPercentage = 0,
}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormState>({
    model: initialModel,
    color: 'red',
    startDate: '',
    endDate: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerPhoneCountryCode: '+62',
    customerNotes: '',
  });

  // Derived date range state for the DatePicker component
  const dateRange: DateRange | undefined = {
    from: formData.startDate ? parseISO(formData.startDate) : undefined,
    to: formData.endDate ? parseISO(formData.endDate) : undefined,
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setFormData(prev => ({
      ...prev,
      startDate: range?.from ? format(range.from, 'yyyy-MM-dd') : '',
      endDate: range?.to ? format(range.to, 'yyyy-MM-dd') : '',
    }));
  };

  const selectedScooter = SCOOTERS.find((s) => s.model === formData.model);
  const availableColors = selectedScooter?.colors || [];

  // Update color when model changes
  useEffect(() => {
    if (selectedScooter && !availableColors.includes(formData.color)) {
      setFormData((prev) => ({ ...prev, color: availableColors[0] }));
    }
  }, [formData.model, availableColors, selectedScooter]);

  // Calculate pricing
  const pricing =
    formData.startDate && formData.endDate
      ? (() => {
        try {
          const days = calculateRentalDays(formData.startDate, formData.endDate);
          return calculatePrice(formData.model, days, {
            discountPercentage,
          });
        } catch {
          return null;
        }
      })()
      : null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const customerPhone = `${formData.customerPhoneCountryCode}${formData.customerPhone}`;
		const { customerPhoneCountryCode, ...payload } = formData;
		onSubmit({ ...payload, customerPhone });
	};

  const today = new Date(); // Use Date object for DatePicker min date

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Scooter Model Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose your scooter
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SCOOTERS.map((scooter) => {
            const isSelected = formData.model === scooter.model;
            return (
              <button
                key={scooter.model}
                type="button"
                onClick={() => setFormData({ ...formData, model: scooter.model })}
                className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all text-left ${isSelected
                  ? 'border-[#2259A7] bg-[#e7edf7] shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900">{scooter.name}</h3>
                  <p className="text-sm font-bold text-[#2259A7]">
                    {formatCurrency(scooter.basePrice)}<span className="text-[10px] text-gray-500">/day</span>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs text-gray-700">
                    Up to {scooter.specs.range}km on a single charge
                  </div>
                  <div className="text-xs text-gray-700">
                    Travel at speeds up to {scooter.specs.maxSpeed}km/h
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose your color
        </label>
        <div className="flex gap-2">
          {availableColors.map((color) => {
            const isSelected = formData.color === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`group relative flex flex-col items-center gap-1.5 p-1.5 sm:p-2 rounded-lg transition-all ${isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
                  }`}
                title={COLOR_NAMES[color]}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 transition-all ${isSelected
                    ? 'border-[#2259A7] shadow-md scale-105 p-0.5 bg-clip-content'
                    : 'border-gray-200 group-hover:border-gray-300'
                    }`}
                  style={{ backgroundColor: COLOR_HEX[color] }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Rental Period - Date Range Picker */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Rental Period
        </label>
        <DatePicker
          date={dateRange}
          setDate={handleDateRangeChange}
          minDate={today}
          className="w-full"
        />
        {!formData.startDate && (
          <p className="text-xs text-gray-500 mt-2">Please select your trip dates</p>
        )}
      </div>

      {/* Price Display */}
      {discountPercentage > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-[linear-gradient(135deg,#f1fbf6_0%,#f8fbff_100%)] p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Offer Saved
              </p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">
                {discountPercentage}% off is active in this browser
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Your booking total below already uses the discounted price.
              </p>
            </div>
            <div className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-bold text-white">
              -{discountPercentage}%
            </div>
          </div>
        </div>
      )}

      {pricing && (
        <div className="bg-[#e7edf7] border border-[#c8d8ff] rounded-lg p-3 sm:p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Rental Duration:</span>
            <span className="font-semibold text-gray-900">{pricing.days} days</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Price per Day:</span>
            <div className="text-right">
              {pricing.discount && (
                <span className="mr-2 text-sm text-gray-400 line-through">
                  {formatCurrency(pricing.basePricePerDay)}
                </span>
              )}
              <span className="font-semibold text-gray-900">
                {formatCurrency(pricing.pricePerDay)}
              </span>
            </div>
          </div>
          {pricing.discount && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#2259A7]">Promo Discount:</span>
              <span className="font-semibold text-[#2259A7]">-{pricing.discount}%</span>
            </div>
          )}
          {pricing.discountAmount && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-emerald-700">You Save:</span>
              <span className="font-semibold text-emerald-700">
                {formatCurrency(pricing.discountAmount)}
              </span>
            </div>
          )}
          <div className="border-t border-[#c8d8ff] pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total Price:</span>
              <div className="text-right">
                {pricing.discount && (
                  <span className="block text-sm text-gray-400 line-through">
                    {formatCurrency(pricing.baseTotalPrice)}
                  </span>
                )}
                <span className="text-2xl font-bold text-[#2259A7]">
                  {formatCurrency(pricing.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Full Name
						</label>
						<input
							type="text"
							required
							value={formData.customerName}
							onChange={(e) =>
								setFormData({ ...formData, customerName: e.target.value })
							}
							className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2259A7]/30 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
							placeholder="John Doe"
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Email
            </label>
            <input
              type="email"
              required
              value={formData.customerEmail}
              onChange={(e) =>
                setFormData({ ...formData, customerEmail: e.target.value })
              }
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2259A7]/30 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
              placeholder="john@example.com"
            />
					</div>
				</div>

				<div>
					<label className="block text-sm font-semibold text-gray-700 mb-2">
						Phone Number
					</label>
					<div className="flex gap-2">
						<input
							type="tel"
							inputMode="tel"
							value={formData.customerPhoneCountryCode}
							onChange={(e) =>
								setFormData({ ...formData, customerPhoneCountryCode: e.target.value })
							}
							className="w-[80px] sm:w-[88px] md:w-[96px] lg:w-[100px] px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2259A7]/30 focus:border-transparent text-gray-900 bg-white"
							aria-label="Country code"
							placeholder="+62"
						/>
						<input
							type="tel"
							required
							value={formData.customerPhone}
							onChange={(e) =>
								setFormData({ ...formData, customerPhone: e.target.value })
							}
							className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2259A7]/30 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
							placeholder="81234567890"
						/>
					</div>
				</div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            value={formData.customerNotes}
            onChange={(e) =>
              setFormData({ ...formData, customerNotes: e.target.value })
            }
            rows={3}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2259A7]/30 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
            placeholder="Any special requests or questions..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !pricing}
        className="w-full bg-[#2259A7] text-white py-3 sm:py-4 rounded-lg font-bold text-lg hover:bg-[#1b4a8f] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {isSubmitting ? 'Processing...' : 'Confirm Booking'}
      </button>
    </form>
  );
}
