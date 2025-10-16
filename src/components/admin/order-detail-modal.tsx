'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Package, 
  DollarSign,
  MessageCircle,
  Edit,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Booking, Costume } from '@/types';
import { formatDisplayDate, getDurationLabel } from '@/lib/utils';

interface OrderDetailModalProps {
  booking: Booking;
  costume: Costume;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (bookingId: string, newStatus: Booking['status']) => void;
}

export function OrderDetailModal({ 
  booking, 
  costume, 
  isOpen, 
  onClose, 
  onStatusUpdate 
}: OrderDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  const durationLabel = getDurationLabel(booking.startDate, booking.endDate);

  const handleStatusUpdate = async (newStatus: Booking['status']) => {
    setIsUpdating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onStatusUpdate(booking.id, newStatus);
    setIsUpdating(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-gray-600">Order ID: #{booking.id}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(booking.status)}>
                {getStatusIcon(booking.status)}
                <span className="ml-1">{booking.status}</span>
              </Badge>
              <span className="text-sm text-gray-500">
                Created: {formatDisplayDate(booking.createdAt)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {booking.status === 'pending' && (
                <>
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusUpdate('confirmed')}
                    disabled={isUpdating}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Confirm
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStatusUpdate('cancelled')}
                    disabled={isUpdating}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </>
              )}
              {booking.status === 'confirmed' && (
                <Button 
                  size="sm" 
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={isUpdating}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Complete
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">{booking.customerName}</p>
                    <p className="text-sm text-gray-600">Full Name</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">{booking.customerEmail}</p>
                    <p className="text-sm text-gray-600">Email Address</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">{booking.customerPhone}</p>
                    <p className="text-sm text-gray-600">Phone Number</p>
                  </div>
                </div>
                {booking.specialRequests && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Special Requests</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {booking.specialRequests}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">{formatDisplayDate(booking.startDate)}</p>
                    <p className="text-sm text-gray-600">Start Date</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">{formatDisplayDate(booking.endDate)}</p>
                    <p className="text-sm text-gray-600">End Date</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">{durationLabel}</p>
                    <p className="text-sm text-gray-600">Duration</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-lg text-primary">₱{booking.totalPrice}</p>
                    <p className="text-sm text-gray-600">Total Amount</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Costume Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Costume Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">🎭</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{costume.name}</h3>
                  <p className="text-gray-600 mb-4">{costume.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Size:</span>
                      <p className="font-medium">{costume.size}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Difficulty:</span>
                      <p className="font-medium">{costume.difficulty}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Setup Time:</span>
                      <p className="font-medium">{costume.setupTime} min</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Daily Rate:</span>
                      <p className="font-medium text-primary">₱{costume.pricePerDay}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-gray-500 text-sm">Features:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {costume.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Customer
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Order
              </Button>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
