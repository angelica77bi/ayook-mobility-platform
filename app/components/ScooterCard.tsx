import { useState } from 'react';
import type { Scooter, ScooterColor } from '~/types/booking';
import { COLOR_HEX } from '~/data/scooters';

interface ScooterCardProps {
  scooter: Scooter;
}

export default function ScooterCard({ scooter }: ScooterCardProps) {
  const [selectedColor, setSelectedColor] = useState<ScooterColor>(scooter.colors[0]);

  // Determine which image to show
  // Fallback to the default image if no specific color image is found
  const displayImage = scooter.colorImages?.[selectedColor] || scooter.image;

  return (
    <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border-2 border-gray-200 transition-all">
      <div className="mb-6 h-48 flex items-center justify-center overflow-hidden rounded-xl bg-white p-3 sm:p-4">
        <img
          src={displayImage}
          alt={`${scooter.name} - ${selectedColor}`}
          className="h-full w-auto object-contain transition-transform duration-500"
        />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{scooter.name}</h3>
      <p className="text-gray-600 mb-6">{scooter.description}</p>

      <div className="space-y-2 mb-6">
        {scooter.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-gray-700">
            <svg className="w-4 h-4 text-[#2259A7] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-300">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-[#2259A7]">{scooter.basePrice.toLocaleString('id-ID')} IDR</span>
          <span className="text-gray-600">/day</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Available colors:</span>
          <div className="flex gap-2">
            {scooter.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${selectedColor === color ? 'border-[#2259A7] scale-125 p-0.5 bg-clip-content' : 'border-gray-400 hover:scale-110'
                  }`}
                style={{ backgroundColor: COLOR_HEX[color] }}
                title={color}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
