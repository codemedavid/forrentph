'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BookingForm } from '@/components/booking-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { costumes } from '@/data/costumes';
import { ArrowLeft, Calendar, DollarSign, Clock } from 'lucide-react';
import { formatDisplayDate, calculatePrice, getDurationLabel } from '@/lib/utils';
import { Costume } from '@/types';

function BookingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [costume, setCostume] = useState<Costume | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const costumeId = searchParams.get('costumeId');
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    if (costumeId && startDateStr && endDateStr) {
      fetchCostume(costumeId, startDateStr, endDateStr);
    } else {
      // Missing parameters, redirect to costumes page
      console.warn('❌ Missing booking parameters');
      router.push('/costumes');
    }
  }, [searchParams, router]);

  const fetchCostume = async (costumeId: string, startDateStr: string, endDateStr: string) => {
    try {
      setIsLoading(true);
      console.log('🔄 Fetching costume for booking:', costumeId);

      // Try to fetch from API first
      const response = await fetch(`/api/costumes/${costumeId}`);
      
      let foundCostume: Costume | null = null;

      if (response.ok) {
        const data = await response.json();
        foundCostume = data.costume;
        console.log('✅ Costume loaded from database');
      } else {
        console.warn('⚠️ Costume not in database, checking mock data');
        // Fallback to mock data
        foundCostume = costumes.find(c => c.id === costumeId) || null;
      }

      const start = new Date(startDateStr);
      const end = new Date(endDateStr);

      if (foundCostume && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
        setCostume(foundCostume);
        setStartDate(start);
        setEndDate(end);
        setTotalPrice(calculatePrice(foundCostume, start, end));
        console.log('✅ Booking page ready');
      } else {
        // Invalid parameters, redirect to costumes page
        console.error('❌ Invalid costume or dates');
        router.push('/costumes');
      }
    } catch (error) {
      console.error('❌ Error fetching costume:', error);
      // Try mock data as last resort
      const foundCostume = costumes.find(c => c.id === costumeId);
      if (foundCostume) {
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        setCostume(foundCostume);
        setStartDate(start);
        setEndDate(end);
        setTotalPrice(calculatePrice(foundCostume, start, end));
      } else {
        router.push('/costumes');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingComplete = (bookingData: { 
    id: string;
    costumeId: string;
    startDate: string;
    endDate: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    bookingReference: string;
  }) => {
    console.log('✅ Booking completed:', bookingData);
    console.log('📱 Customer has been redirected to Messenger');
    console.log(`🔒 Booking reference: ${bookingData.bookingReference}`);
    
    // You could redirect to a success page or show a success message
    // router.push(`/booking-success?reference=${bookingData.bookingReference}`);
  };

  if (isLoading || !costume || !startDate || !endDate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const durationLabel = getDurationLabel(startDate, endDate);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Complete Your Booking
            </h1>
            <p className="text-gray-600">
              Review your selection and provide your details to complete the rental.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <BookingForm
              costume={costume}
              startDate={startDate}
              endDate={endDate}
              totalPrice={totalPrice}
              onBookingComplete={handleBookingComplete}
            />
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Costume Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎭</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{costume.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{costume.description}</p>
                  </div>
                </div>

                {/* Rental Details */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Duration</span>
                    </div>
                    <span className="font-medium">{durationLabel}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Start Date</span>
                    </div>
                    <span className="font-medium">{formatDisplayDate(startDate)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>End Date</span>
                    </div>
                    <span className="font-medium">{formatDisplayDate(endDate)}</span>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span>Base Price ({durationLabel})</span>
                    <span>₱{costume.pricePerDay}</span>
                  </div>
                  
                  {durationLabel !== '1 Day' && (
                    <div className="flex items-center justify-between text-sm text-green-600">
                      <span>Multi-day Discount</span>
                      <span>-₱{costume.pricePerDay - totalPrice}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Taxes & Fees</span>
                    <span>₱0</span>
                  </div>
                  
                  <div className="border-t pt-2">
                    <div className="flex items-center justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">₱{totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Costume Details */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Costume Details</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{costume.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Difficulty:</span>
                      <span>{costume.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Setup Time:</span>
                      <span>{costume.setupTime} min</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {costume.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}
