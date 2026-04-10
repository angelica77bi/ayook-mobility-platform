
import { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { DayPicker, type DateRange } from 'react-day-picker';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    minDate?: Date;
    className?: string;
}

export function DatePicker({ date, setDate, minDate, className = '' }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Input Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
          w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-lg text-left 
          flex items-center justify-between transition-all duration-200
          hover:border-[#2259A7] focus:outline-none focus:ring-2 focus:ring-[#2259A7]/20
          ${isOpen ? 'border-[#2259A7] ring-2 ring-[#2259A7]/20 shadow-lg' : ''}
        `}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2 rounded-md ${isOpen ? 'bg-[#e7edf7] text-[#2259A7]' : 'bg-gray-100 text-gray-500'}`}>
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">
                            Rental Period
                        </span>
                        <span className={`text-sm font-semibold truncate ${date?.from ? 'text-gray-900' : 'text-gray-400'}`}>
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, 'MMM dd')} - {format(date.to, 'MMM dd, yyyy')}
                                    </>
                                ) : (
                                    format(date.from, 'MMM dd, yyyy')
                                )
                            ) : (
                                'Select trip dates'
                            )}
                        </span>
                    </div>
                </div>

                {/* Floating label/status or chevron could go here, but kept simple for clean UI */}
            </button>

            {/* Calendar Popover */}
            {isOpen && (
                <div className="absolute top-full left-0 z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-200 origin-top overflow-hidden w-[320px] sm:w-[350px]">
                    <style>{`
            .rdp {
              --rdp-cell-size: 40px;
              --rdp-accent-color: #2259A7;
              --rdp-background-color: #e7edf7;
              margin: 0;
            }
            .rdp-day_selected:not([disabled]), .rdp-day_selected:focus:not([disabled]), .rdp-day_selected:active:not([disabled]), .rdp-day_selected:hover:not([disabled]) {
                background-color: var(--rdp-accent-color);
                color: black;
            }
            .rdp-day_range_middle {
                background-color: var(--rdp-background-color) !important;
                color: black !important;
                border-radius: 0 !important;
            }
            .rdp-day_range_start {
                border-top-right-radius: 0 !important;
                border-bottom-right-radius: 0 !important;
            }
            .rdp-day_range_end {
                border-top-left-radius: 0 !important;
                border-bottom-left-radius: 0 !important;
            }
            .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                background-color: #f3f4f6;
                color: #374151;
            }
            .rdp-nav_button {
                color: #374151;
            }
            .rdp-caption_label {
                color: #111827;
                font-weight: 600;
                font-size: 0.95rem;
            }
            .rdp-head_cell {
                color: #6b7280;
                font-weight: 500;
                font-size: 0.8rem;
                text-transform: uppercase;
            }
            .rdp-day {
                color: #111827;
            }
          `}</style>

                    <div className="flex justify-between items-center mb-4 px-2">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Select Dates</p>
                            <p className="text-xs text-gray-500">
                                {date?.from && date?.to
                                    ? `${Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))} days selected`
                                    : 'Minimum 1 day'}
                            </p>
                        </div>
                    </div>

                    <DayPicker
                        mode="range"
                        defaultMonth={date?.from || new Date()}
                        selected={date}
                        onSelect={(range) => {
                            setDate(range);
                        }}
                        min={1}
                        disabled={{ before: minDate || new Date() }}
                        footer={
                            <div className="flex justify-end pt-4 mt-2 border-t border-gray-100">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors mr-2 whitespace-nowrap"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    disabled={!date?.from || !date?.to}
                                    className="px-4 py-2 bg-[#2259A7] hover:bg-[#1b4a8f] text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    Apply
                                </button>
                            </div>
                        }
                    />
                </div>
            )}
        </div>
    );
}
