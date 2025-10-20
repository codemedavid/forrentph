'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { bookings, pricingTiers } from '@/data/costumes';
import { Calendar, Star, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { formatDisplayDate, calculatePrice, getDurationLabel, checkAvailability, getAvailableDates, getSeasonalRentalRules, isRentalDurationAllowed } from '@/lib/utils';
import { Costume, Category, DateAvailability } from '@/types';

interface CostumeDetailClientProps {
  costume: Costume;
  category: Category | null;
}

export function CostumeDetailClient({ costume, category }: CostumeDetailClientProps) {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>('1d');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<DateAvailability[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [seasonalRules, setSeasonalRules] = useState<ReturnType<typeof getSeasonalRentalRules> | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (costume) {
      const availableDates = getAvailableDates(costume.id, bookings, 3);
      setAvailability(availableDates);
      fetchBlockedDates();
    }
  }, [costume, currentMonth]);

  const fetchBlockedDates = async () => {
    if (!costume) return;
    
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      
      const response = await fetch(
        `/api/availability?costumeId=${costume.id}&year=${year}&month=${month}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const blocked = data.blockedDates?.map((bd: { blocked_date: string }) => bd.blocked_date) || [];
        setBlockedDates(blocked);
      }
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
    }
  };

  // Update seasonal rules when start date changes
  useEffect(() => {
    if (selectedStartDate) {
      const rules = getSeasonalRentalRules(selectedStartDate);
      setSeasonalRules(rules);
      
      if (!rules.allowedDurations.includes(selectedDuration)) {
        setSelectedDuration(rules.allowedDurations[0]);
      }
    }
  }, [selectedStartDate]);

  useEffect(() => {
    if (selectedStartDate && selectedDuration) {
      const endDate = new Date(selectedStartDate);
      const duration = selectedDuration;
      
      switch (duration) {
        case '12h':
          endDate.setHours(endDate.getHours() + 12);
          break;
        case '1d':
          endDate.setDate(endDate.getDate() + 1);
          break;
        case '3d':
          endDate.setDate(endDate.getDate() + 3);
          break;
        case '1w':
          endDate.setDate(endDate.getDate() + 7);
          break;
      }
      
      setSelectedEndDate(endDate);
    }
  }, [selectedStartDate, selectedDuration]);

  const totalPrice = selectedStartDate && selectedEndDate ? calculatePrice(costume, selectedStartDate, selectedEndDate, selectedDuration) : 0;
  const durationLabel = selectedStartDate && selectedEndDate ? getDurationLabel(selectedStartDate, selectedEndDate, selectedDuration) : '';
  
  // Check both booking availability and admin blocks
  const isAvailable = selectedStartDate && selectedEndDate ? (() => {
    const bookingAvailable = checkAvailability(costume.id, selectedStartDate, selectedEndDate, bookings).isAvailable;
    if (!bookingAvailable) return false;
    
    const startDate = new Date(selectedStartDate);
    const endDate = new Date(selectedEndDate);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (blockedDates.includes(dateStr)) {
        return false;
      }
    }
    
    return true;
  })() : false;

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const dayAvailability = availability.find(a => a.date === dateStr);
      const isBlockedByAdmin = blockedDates.includes(dateStr);
      
      days.push({
        date,
        day,
        isAvailable: (dayAvailability?.isAvailable ?? true) && !isBlockedByAdmin,
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0)),
        isSelected: selectedStartDate && date.toDateString() === selectedStartDate.toDateString()
      });
    }
    
    return days;
  };

  const handleDateSelect = (date: Date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return;
    
    const dateStr = date.toISOString().split('T')[0];
    const dayAvailability = availability.find(a => a.date === dateStr);
    const isBlockedByAdmin = blockedDates.includes(dateStr);
    
    if (dayAvailability?.isAvailable && !isBlockedByAdmin) {
      setSelectedStartDate(date);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Images and Details */}
      <div className="space-y-6">
        {/* Main Image */}
        <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden relative">
          {costume.images && costume.images.length > 0 && costume.images[0] !== '/images/costumes/placeholder.jpg' ? (
            <Image
              src={costume.images[selectedImageIndex]}
              alt={`${costume.name} - Image ${selectedImageIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              quality={90}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-6xl">🎭</span>
                </div>
                <p className="text-gray-500">Costume Image</p>
              </div>
            </div>
          )}
        </div>

        {/* Image Thumbnails */}
        {costume.images && costume.images.length > 1 && costume.images[0] !== '/images/costumes/placeholder.jpg' && (
          <div className="grid grid-cols-4 gap-2">
            {costume.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                  selectedImageIndex === index 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <Image
                  src={image}
                  alt={`${costume.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                  quality={75}
                />
              </button>
            ))}
          </div>
        )}

        {/* Costume Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{costume.name}</CardTitle>
                <CardDescription className="text-lg">
                  {category?.name}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-lg font-semibold">4.8</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 whitespace-pre-line">{costume.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Size:</span>
                <p className="text-gray-600">{costume.size}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Difficulty:</span>
                <p className="text-gray-600">{costume.difficulty}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Setup Time:</span>
                <p className="text-gray-600">{costume.setupTime} minutes</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Availability:</span>
                <p className="text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Available
                </p>
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-700">Features:</span>
              <ul className="list-disc list-inside text-gray-600 mt-1">
                {costume.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Booking Section */}
      <div className="space-y-6">
        {/* Seasonal Information Banner */}
        {seasonalRules && (
          <Card className={seasonalRules.season === 'peak' ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  {seasonalRules.season === 'peak' ? '🎃' : '📅'}
                </div>
                <div>
                  <h4 className={`font-semibold ${seasonalRules.season === 'peak' ? 'text-orange-900' : 'text-blue-900'}`}>
                    {seasonalRules.season === 'peak' ? 'Peak Season Rental' : 'Regular Season Rental'}
                  </h4>
                  <p className={`text-sm ${seasonalRules.season === 'peak' ? 'text-orange-800' : 'text-blue-800'}`}>
                    {seasonalRules.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Select Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  ←
                </Button>
                <h3 className="text-lg font-semibold">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  →
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                {generateCalendarDays().map((day, index) => (
                  <div
                    key={index}
                    className={`p-2 text-center text-sm cursor-pointer rounded ${
                      !day
                        ? ''
                        : day.isPast
                        ? 'text-gray-300 cursor-not-allowed'
                        : !day.isAvailable
                        ? 'text-red-400 cursor-not-allowed bg-red-50'
                        : day.isSelected
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => day && handleDateSelect(day.date)}
                  >
                    {day?.day}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded mr-1"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-50 border border-red-200 rounded mr-1"></div>
                  <span>Unavailable</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Tiers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Pricing Options
            </CardTitle>
            <CardDescription>
              {selectedStartDate && seasonalRules 
                ? `Available for ${seasonalRules.season === 'peak' ? 'peak' : 'regular'} season`
                : 'Select a date to see available options'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {pricingTiers.map((tier) => {
                const isAllowed = selectedStartDate ? isRentalDurationAllowed(selectedStartDate, tier.duration) : true;
                const isDisabled = selectedStartDate && !isAllowed;
                
                const getActualPrice = () => {
                  switch (tier.duration) {
                    case '12h':
                      return costume.pricePer12Hours || costume.pricePerDay * 0.6;
                    case '1d':
                      return costume.pricePerDay;
                    case '3d':
                      return costume.pricePerDay * 3 * 0.9;
                    case '1w':
                      return costume.pricePerWeek;
                    default:
                      return costume.pricePerDay;
                  }
                };
                
                return (
                  <div
                    key={tier.duration}
                    className={`p-4 border rounded-lg transition-colors ${
                      isDisabled
                        ? 'opacity-40 cursor-not-allowed border-gray-200 bg-gray-50'
                        : selectedDuration === tier.duration
                        ? 'border-primary bg-primary/5 cursor-pointer'
                        : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                    }`}
                    onClick={() => !isDisabled && setSelectedDuration(tier.duration)}
                    title={isDisabled ? 'Not available for selected date' : ''}
                  >
                    <div className="text-center">
                      <div className="font-semibold">{tier.label}</div>
                      <div className="text-2xl font-bold text-primary">
                        ₱{Math.round(getActualPrice())}
                      </div>
                      {isDisabled && (
                        <div className="text-xs text-gray-500 mt-1">Not available</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {!selectedStartDate && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Please select a start date to see available rental durations
              </p>
            )}
          </CardContent>
        </Card>

        {/* Booking Summary */}
        {selectedStartDate && selectedEndDate && (
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Costume:</span>
                <span className="font-medium">{costume.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Duration:</span>
                <span className="font-medium">{durationLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Start Date:</span>
                <span className="font-medium">{formatDisplayDate(selectedStartDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>End Date:</span>
                <span className="font-medium">{formatDisplayDate(selectedEndDate)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">₱{totalPrice}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                {isAvailable ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Available for selected dates</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-2" />
                    <span>Not available for selected dates</span>
                  </div>
                )}
              </div>

              <Button 
                className="w-full" 
                size="lg"
                disabled={!isAvailable}
                asChild={isAvailable}
              >
                {isAvailable ? (
                  <Link href={`/booking?costumeId=${costume.id}&startDate=${selectedStartDate.toISOString()}&endDate=${selectedEndDate.toISOString()}`}>
                    Book Now
                  </Link>
                ) : (
                  <span>Select Available Dates</span>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

