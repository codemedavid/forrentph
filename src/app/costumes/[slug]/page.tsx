'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { costumes, categories, bookings, pricingTiers } from '@/data/costumes';
import { Calendar, Clock, Star, Users, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { formatDisplayDate, calculatePrice, getDurationLabel, checkAvailability, getAvailableDates } from '@/lib/utils';
import { Costume, DateAvailability } from '@/types';

export default function CostumeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>('1d');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<DateAvailability[]>([]);

  const costume = costumes.find(c => c.slug === slug);
  const category = costume ? categories.find(cat => cat.id === costume.categoryId) : null;

  useEffect(() => {
    if (costume) {
      const availableDates = getAvailableDates(costume.id, bookings, 3);
      setAvailability(availableDates);
    }
  }, [costume]);

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

  if (!costume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Costume Not Found</h1>
          <p className="text-gray-600 mb-8">The costume you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/costumes">Browse All Costumes</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = selectedStartDate && selectedEndDate ? calculatePrice(costume, selectedStartDate, selectedEndDate) : 0;
  const durationLabel = selectedStartDate && selectedEndDate ? getDurationLabel(selectedStartDate, selectedEndDate) : '';
  const isAvailable = selectedStartDate && selectedEndDate ? checkAvailability(costume.id, selectedStartDate, selectedEndDate, bookings).isAvailable : false;

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const dayAvailability = availability.find(a => a.date === dateStr);
      
      days.push({
        date,
        day,
        isAvailable: dayAvailability?.isAvailable ?? true,
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
    
    if (dayAvailability?.isAvailable) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/costumes" className="hover:text-primary">Costumes</Link>
            <span>/</span>
            <span className="text-gray-900">{costume.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Costume Details */}
          <div className="space-y-6">
            {/* Image Placeholder */}
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-6xl">🎭</span>
                </div>
                <p className="text-gray-500">Costume Image</p>
              </div>
            </div>

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
                <p className="text-gray-600">{costume.description}</p>
                
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

          {/* Booking Section */}
          <div className="space-y-6">
            {/* Pricing Tiers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {pricingTiers.map((tier) => (
                    <div
                      key={tier.duration}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedDuration === tier.duration
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedDuration(tier.duration)}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{tier.label}</div>
                        <div className="text-2xl font-bold text-primary">
                          ₱{Math.round(costume.pricePerDay * tier.multiplier)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
      </div>
    </div>
  );
}
