'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Costume } from '@/types';
import { formatDisplayDate, getDurationLabel, generateMessengerBookingMessage, createMessengerURL, getSeasonalRentalRules, calculateSecurityDeposit, calculateTotalBookingAmount } from '@/lib/utils';
import { User, Mail, Phone, CheckCircle, MessageCircle, AlertCircle } from 'lucide-react';

interface BookingFormProps {
  costume: Costume;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  onBookingComplete: (bookingData: {
    id: string;
    costumeId: string;
    startDate: string;
    endDate: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    bookingReference: string;
  }) => void;
}
export function BookingForm({ costume, startDate, endDate, totalPrice, onBookingComplete }: BookingFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Get seasonal rules for the start date
  const seasonalRules = getSeasonalRentalRules(startDate);
  
  // Calculate security deposit and total amount
  const securityDeposit = calculateSecurityDeposit();
  const totalAmount = calculateTotalBookingAmount(totalPrice, securityDeposit);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Create booking in database with 10-minute block
      console.log('🔒 Creating temporary reservation...');
      
      const bookingData = {
        costumeId: costume.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice: totalPrice,
        specialRequests: formData.specialRequests,
        status: 'pending'
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create booking');
      }

      const { booking, bookingReference } = await response.json();
      console.log(`✅ Booking created: ${bookingReference}`);
      console.log(`⏰ Reserved for 10 minutes until: ${new Date(booking.blocked_until).toLocaleTimeString()}`);

      // Step 2: Generate the booking message for Messenger with reference
      const bookingMessage = generateMessengerBookingMessage(
        costume,
        formData.customerName,
        formData.customerEmail,
        formData.customerPhone,
        startDate,
        endDate,
        totalPrice,
        formData.specialRequests,
        bookingReference
      );

      // Step 3: Create the Messenger URL with pre-filled message
      const messengerURL = createMessengerURL(bookingMessage);

      // Step 4: Mark that messenger is about to be opened
      await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messenger_opened: true }),
      });

      // Step 5: Open Messenger
      console.log('📱 Opening Messenger...');
      window.open(messengerURL, '_blank');

      setIsSubmitting(false);
      setIsComplete(true);
      
      // Call the completion handler
      onBookingComplete({
        ...booking,
        bookingReference
      });

    } catch (error) {
      console.error('❌ Booking failed:', error);
      alert(`Booking failed: ${error instanceof Error ? error.message : 'Please try again'}`);
      setIsSubmitting(false);
    }
  };

  const durationLabel = getDurationLabel(startDate, endDate);

  if (isComplete) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to Messenger!</h2>
          <p className="text-gray-600 mb-6">
            Your booking details have been prepared and you&apos;re being redirected to Messenger to complete your rental request.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Booking ID:</strong> #{Date.now().toString().slice(-6)}</p>
            <p><strong>Costume:</strong> {costume.name}</p>
            <p><strong>Duration:</strong> {durationLabel}</p>
            <p><strong>Rental Fee:</strong> ₱{totalPrice}</p>
            <p><strong>Security Deposit:</strong> ₱{securityDeposit}</p>
            <p><strong>Total Amount:</strong> ₱{totalAmount}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Send Booking via Messenger
          </CardTitle>
          <CardDescription>
            Fill in your details and we&apos;ll send your booking request directly to our Messenger for quick processing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Seasonal Information */}
          <div className={`rounded-lg p-4 mb-4 ${seasonalRules.season === 'peak' ? 'bg-orange-50 border border-orange-200' : 'bg-blue-50 border border-blue-200'}`}>
            <h4 className={`font-medium mb-2 flex items-center ${seasonalRules.season === 'peak' ? 'text-orange-900' : 'text-blue-900'}`}>
              <AlertCircle className="h-4 w-4 mr-2" />
              {seasonalRules.season === 'peak' ? 'Peak Season Rental' : 'Regular Season Rental'}
            </h4>
            <p className={`text-sm ${seasonalRules.season === 'peak' ? 'text-orange-800' : 'text-blue-800'}`}>
              {seasonalRules.description}
            </p>
          </div>

          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Costume:</span>
                <span className="font-medium">{costume.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium">{durationLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>Start Date:</span>
                <span className="font-medium">{formatDisplayDate(startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>End Date:</span>
                <span className="font-medium">{formatDisplayDate(endDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Rental Fee:</span>
                <span className="font-medium">₱{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit:</span>
                <span className="font-medium text-green-600">₱{securityDeposit}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-primary">₱{totalAmount}</span>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-md mt-3">
                <div className="text-xs text-blue-800">
                  <p><strong>📋 Terms & Conditions:</strong></p>
                  <ul className="mt-1 space-y-1">
                    <li>• Security deposit refundable after return</li>
                    <li>• Pickup: 8:00 AM - 10:00 AM</li>
                    <li>• Late return: ₱30-50/hour after pickup window</li>
                    <li>• Return anytime during business hours</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  required
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                required
                value={formData.customerPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                rows={3}
                value={formData.specialRequests}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Any special requests or notes (optional)"
              />
            </div>

            {/* Messenger Integration Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2 flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messenger Booking
              </h4>
              <p className="text-sm text-green-800 mb-2">
                Your booking details will be sent directly to our Facebook Messenger page where we can quickly confirm availability and provide payment instructions.
              </p>
              <p className="text-xs text-green-700">
                You&apos;ll be redirected to Messenger after clicking &quot;Send to Messenger&quot;
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Terms & Conditions</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Costumes must be returned in the same condition as received</li>
                <li>• Late returns will incur additional charges</li>
                <li>• Damage or loss will result in replacement fees</li>
                <li>• Cancellations must be made 24 hours before rental start</li>
                <li>• Booking confirmation subject to availability</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting || !formData.customerName || !formData.customerEmail || !formData.customerPhone}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Opening Messenger...
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send to Messenger - ₱{totalAmount}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
