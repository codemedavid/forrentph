'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Save, AlertCircle } from 'lucide-react';
import { Booking, Costume } from '@/types';
import { formatDate } from '@/lib/utils';

interface BookingEditModalProps {
  booking: Booking;
  costumes: Costume[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookingId: string, updatedData: Partial<Booking>) => Promise<void>;
}

export function BookingEditModal({ 
  booking, 
  costumes,
  isOpen, 
  onClose,
  onSave
}: BookingEditModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [costumeId, setCostumeId] = useState(booking.costumeId);
  const [customerName, setCustomerName] = useState(booking.customerName);
  const [customerEmail, setCustomerEmail] = useState(booking.customerEmail);
  const [customerPhone, setCustomerPhone] = useState(booking.customerPhone);
  const [startDate, setStartDate] = useState(formatDate(booking.startDate));
  const [endDate, setEndDate] = useState(formatDate(booking.endDate));
  const [totalPrice, setTotalPrice] = useState(booking.totalPrice.toString());
  const [status, setStatus] = useState(booking.status);
  const [specialRequests, setSpecialRequests] = useState(booking.specialRequests || '');

  // Reset form when booking changes
  useEffect(() => {
    setCostumeId(booking.costumeId);
    setCustomerName(booking.customerName);
    setCustomerEmail(booking.customerEmail);
    setCustomerPhone(booking.customerPhone);
    setStartDate(formatDate(booking.startDate));
    setEndDate(formatDate(booking.endDate));
    setTotalPrice(booking.totalPrice.toString());
    setStatus(booking.status);
    setSpecialRequests(booking.specialRequests || '');
    setError(null);
  }, [booking]);

  if (!isOpen) return null;

  const selectedCostume = costumes.find(c => c.id === costumeId);

  const validateForm = (): string | null => {
    if (!customerName.trim()) return 'Customer name is required';
    if (!customerEmail.trim()) return 'Customer email is required';
    if (!customerEmail.includes('@')) return 'Invalid email address';
    if (!customerPhone.trim()) return 'Customer phone is required';
    if (!startDate) return 'Start date is required';
    if (!endDate) return 'End date is required';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime())) return 'Invalid start date';
    if (isNaN(end.getTime())) return 'Invalid end date';
    if (end <= start) return 'End date must be after start date';
    
    const price = parseFloat(totalPrice);
    if (isNaN(price) || price <= 0) return 'Invalid total price';
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updatedData: Partial<Booking> = {
        costumeId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: parseFloat(totalPrice),
        status,
        specialRequests: specialRequests.trim() || undefined,
      };

      await onSave(booking.id, updatedData);
      onClose();
    } catch (error) {
      console.error('Error saving booking:', error);
      setError(error instanceof Error ? error.message : 'Failed to save booking');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Booking</h2>
            <p className="text-gray-600">Order ID: #{booking.id}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isSaving}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Error</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Costume Selection */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Costume</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Costume
                </label>
                <select
                  value={costumeId}
                  onChange={(e) => setCostumeId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isSaving}
                >
                  {costumes.map((costume) => (
                    <option key={costume.id} value={costume.id}>
                      {costume.name} - {costume.size} - ₱{costume.pricePerDay}/day
                    </option>
                  ))}
                </select>
              </div>

              {selectedCostume && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">{selectedCostume.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span>Size: <strong>{selectedCostume.size}</strong></span>
                    <span>Difficulty: <strong>{selectedCostume.difficulty}</strong></span>
                    <span>Rate: <strong>₱{selectedCostume.pricePerDay}/day</strong></span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Customer Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Doe"
                  disabled={isSaving}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="john@example.com"
                  disabled={isSaving}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+63912345678"
                  disabled={isSaving}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Booking Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isSaving}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isSaving}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Price (₱) *
                </label>
                <input
                  type="number"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="1500"
                  min="0"
                  step="0.01"
                  disabled={isSaving}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Booking['status'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isSaving}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="mt-2">
                  <Badge className={getStatusColor(status)}>
                    {status}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Any special requests or notes..."
                  rows={3}
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>

          {/* Financial Info (Read-only) */}
          <Card className="bg-gray-50">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold text-lg text-gray-700">Financial Information (Read-only)</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Security Deposit:</span>
                  <p className="font-medium text-gray-900">₱{booking.securityDeposit}</p>
                </div>
                <div>
                  <span className="text-gray-600">Deposit Status:</span>
                  <p>
                    <Badge className={booking.securityDepositRefunded ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
                      {booking.securityDepositRefunded ? 'Refunded' : 'Held'}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Late Fee Amount:</span>
                  <p className="font-medium text-gray-900">₱{booking.lateFeeAmount}</p>
                </div>
                <div>
                  <span className="text-gray-600">Late Fee Rate:</span>
                  <p className="font-medium text-gray-900">₱{booking.lateReturnFeePerHour}/hour</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                💡 To modify deposit refunds or late fees, use the Process Return and Process Refund features in the order detail view.
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

