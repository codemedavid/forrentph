'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { costumes as mockCostumes, bookings as mockBookings } from '@/data/costumes';
import { formatDisplayDate } from '@/lib/utils';
import { OrderDetailModal } from '@/components/admin/order-detail-modal';
import { CostumeFormModal } from '@/components/admin/costume-form-modal';
import { BookingEditModal } from '@/components/admin/booking-edit-modal';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Costume, Booking } from '@/types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Booking | null>(null);
  const [selectedCostume, setSelectedCostume] = useState<Costume | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isOrderEditModalOpen, setIsOrderEditModalOpen] = useState(false);
  const [isCostumeModalOpen, setIsCostumeModalOpen] = useState(false);
  const [costumes, setCostumes] = useState<Costume[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data function (can be called to refresh)
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch costumes
      const costumesResponse = await fetch('/api/costumes');
      if (costumesResponse.ok) {
        const costumesData = await costumesResponse.json();
        setCostumes(costumesData.costumes || []);
      } else {
        console.warn('Failed to fetch costumes, using mock data');
        setCostumes(mockCostumes);
      }

      // Fetch bookings
      const bookingsResponse = await fetch('/api/bookings');
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.bookings || []);
      } else {
        console.warn('Failed to fetch bookings, using mock data');
        setBookings(mockBookings);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mock data
      setCostumes(mockCostumes);
      setBookings(mockBookings);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Calculate dashboard stats
  const totalOrders = bookings.length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  const pendingOrders = bookings.filter(b => b.status === 'pending').length;
  const totalCostumes = costumes.length;
  const totalSecurityDeposits = bookings.reduce((sum, booking) => sum + (booking.securityDeposit || 0), 0);
  const heldDeposits = bookings.filter(b => !b.securityDepositRefunded && b.securityDeposit).length;
  const totalLateFees = bookings.reduce((sum, booking) => sum + (booking.lateFeeAmount || 0), 0);

  // Filter orders based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      case 'confirmed': return '✅';
      case 'pending': return '⏳';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const handleOrderClick = (booking: Booking) => {
    setSelectedOrder(booking);
    setIsOrderModalOpen(true);
  };

  const handleOrderEdit = (booking: Booking) => {
    setSelectedOrder(booking);
    setIsOrderEditModalOpen(true);
  };

  const handleCostumeClick = (costume: Costume) => {
    setSelectedCostume(costume);
    setIsCostumeModalOpen(true);
  };

  const handleAddCostume = () => {
    setSelectedCostume(null);
    setIsCostumeModalOpen(true);
  };

  const handleOrderStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh data without page reload
      await fetchData();
      
      // Update selected order if it's still open
      if (selectedOrder && selectedOrder.id === bookingId) {
        const updatedBooking = bookings.find(b => b.id === bookingId);
        if (updatedBooking) {
          setSelectedOrder(updatedBooking);
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const handleBookingSave = async (bookingId: string, updatedData: Partial<Booking>) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update booking');
      }

      // Refresh data without page reload
      await fetchData();
      
      // Close modal
      setIsOrderEditModalOpen(false);
      setSelectedOrder(null);
      
      alert('Booking updated successfully!');
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error; // Re-throw to let the modal handle it
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }

      // Refresh data without page reload
      await fetchData();
      
      alert('Booking deleted successfully!');
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking. Please try again.');
    }
  };

  const handleDeleteCostume = async (costumeId: string, costumeName: string) => {
    try {
      // Check for active bookings
      const activeBookings = bookings.filter(
        b => b.costumeId === costumeId && 
        (b.status === 'pending' || b.status === 'confirmed')
      );
      
      if (activeBookings.length > 0) {
        const confirmMessage = `⚠️ WARNING: "${costumeName}" has ${activeBookings.length} active booking(s).\n\nDeleting this costume will also delete these bookings.\n\nAre you sure you want to proceed?`;
        if (!confirm(confirmMessage)) {
          return;
        }
      }

      const response = await fetch(`/api/costumes/${costumeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete costume');
      }

      // Refresh data without page reload
      await fetchData();
      
      alert('Costume deleted successfully!');
    } catch (error) {
      console.error('Error deleting costume:', error);
      alert('Failed to delete costume. Please try again.');
    }
  };

  const handleCostumeSave = async (costumeData: Omit<Costume, 'id'>) => {
    try {
      const url = selectedCostume 
        ? `/api/costumes/${selectedCostume.id}` 
        : '/api/costumes';
      
      const method = selectedCostume ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(costumeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save costume');
      }

      // Refresh data without page reload
      await fetchData();
      
      // Close modal
      setIsCostumeModalOpen(false);
      setSelectedCostume(null);
      
      alert('Costume saved successfully!');
    } catch (error) {
      console.error('Error saving costume:', error);
      alert(`Failed to save costume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Manage your costume rental business</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button size="sm" onClick={handleAddCostume}>
              <Plus className="h-4 w-4 mr-2" />
              Add Costume
            </Button>
          </div>
        </div>
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'analytics', label: 'Analytics', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'orders' | 'inventory' | 'analytics')}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">₱{totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Costumes</p>
                      <p className="text-2xl font-bold text-gray-900">{totalCostumes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card className="border-2 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Held Deposits</p>
                      <p className="text-xl font-bold text-gray-900">{heldDeposits}</p>
                      <p className="text-xs text-gray-500">₱{(heldDeposits * 1000).toLocaleString()} total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Late Fees Collected</p>
                      <p className="text-xl font-bold text-gray-900">₱{totalLateFees.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">All time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total + Deposits</p>
                      <p className="text-xl font-bold text-gray-900">₱{(totalRevenue + totalSecurityDeposits).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Including security deposits</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest booking requests from customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => {
                    const costume = costumes.find(c => c.id === booking.costumeId);
                    return (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{getStatusIcon(booking.status)}</div>
                          <div>
                            <p className="font-medium">{booking.customerName}</p>
                            <p className="text-sm text-gray-600">{costume?.name}</p>
                            <p className="text-xs text-gray-500">{formatDisplayDate(booking.startDate)} - {formatDisplayDate(booking.endDate)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          <p className="text-sm font-medium mt-1">₱{booking.totalPrice}</p>
                          {booking.securityDeposit && (
                            <p className="text-xs text-green-600 mt-1">
                              +₱{booking.securityDeposit} deposit
                            </p>
                          )}
                          {booking.lateFeeAmount > 0 && (
                            <p className="text-xs text-red-600">
                              +₱{booking.lateFeeAmount} late fee
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>Manage and track all customer bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Costume</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Dates</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Deposit</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking) => {
                        const costume = costumes.find(c => c.id === booking.costumeId);
                        return (
                          <tr key={booking.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm font-mono">#{booking.id}</td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{booking.customerName}</p>
                                <p className="text-sm text-gray-600">{booking.customerEmail}</p>
                                <p className="text-xs text-gray-500">{booking.customerPhone}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-medium">{costume?.name}</p>
                              <p className="text-sm text-gray-600">{costume?.size} • {costume?.difficulty}</p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-sm">{formatDisplayDate(booking.startDate)}</p>
                              <p className="text-sm text-gray-600">to {formatDisplayDate(booking.endDate)}</p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-medium">₱{booking.totalPrice}</p>
                              {booking.lateFeeAmount > 0 && (
                                <p className="text-xs text-red-600">+₱{booking.lateFeeAmount} late fee</p>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-medium text-green-700">₱{booking.securityDeposit || 1000}</p>
                              <Badge className={`text-xs ${booking.securityDepositRefunded ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {booking.securityDepositRefunded ? 'Refunded' : 'Held'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleOrderClick(booking)}
                                  title="View details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleOrderEdit(booking)}
                                  title="Edit booking"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete booking #${booking.id}?`)) {
                                      handleDeleteBooking(booking.id);
                                    }
                                  }}
                                  title="Delete booking"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Costume Inventory</CardTitle>
                    <CardDescription>Manage your costume collection</CardDescription>
                  </div>
                  <Button onClick={handleAddCostume}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Costume
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {costumes.map((costume) => (
                    <Card key={costume.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🎭</span>
                          </div>
                          <Badge className={costume.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {costume.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{costume.name}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{costume.description}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Size:</span>
                            <span className="font-medium">{costume.size}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Difficulty:</span>
                            <span className="font-medium">{costume.difficulty}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Setup Time:</span>
                            <span className="font-medium">{costume.setupTime} min</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Daily Rate:</span>
                            <span className="font-medium text-primary">₱{costume.pricePerDay}</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.location.href = `/admin/costumes/${costume.id}`}
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Manage Availability
                          </Button>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleCostumeClick(costume)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${costume.name}"?`)) {
                                  handleDeleteCostume(costume.id, costume.name);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-bold text-lg">₱{totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Month</span>
                      <span className="font-medium">₱{(totalRevenue * 0.8).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Growth</span>
                      <span className="font-medium text-green-600">+25%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Costumes</CardTitle>
                  <CardDescription>Most rented costumes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {costumes.slice(0, 5).map((costume, index) => (
                      <div key={costume.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{index + 1}</span>
                          </div>
                          <span className="text-sm font-medium">{costume.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{Math.floor(Math.random() * 20) + 5} rentals</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
                <CardDescription>Customer behavior and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">85%</p>
                    <p className="text-sm text-gray-600">Repeat Customers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">2.3 days</p>
                    <p className="text-sm text-gray-600">Average Rental Duration</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">₱2,400</p>
                    <p className="text-sm text-gray-600">Average Order Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedOrder && (
        <>
          <OrderDetailModal
            booking={selectedOrder}
            costume={costumes.find(c => c.id === selectedOrder.costumeId)!}
            isOpen={isOrderModalOpen}
            onClose={() => {
              setIsOrderModalOpen(false);
              setSelectedOrder(null);
            }}
            onStatusUpdate={handleOrderStatusUpdate}
            onEdit={() => {
              setIsOrderModalOpen(false);
              setIsOrderEditModalOpen(true);
            }}
            onRefresh={fetchData}
          />

          <BookingEditModal
            booking={selectedOrder}
            costumes={costumes}
            isOpen={isOrderEditModalOpen}
            onClose={() => {
              setIsOrderEditModalOpen(false);
              setSelectedOrder(null);
            }}
            onSave={handleBookingSave}
          />
        </>
      )}

      <CostumeFormModal
        costume={selectedCostume || undefined}
        isOpen={isCostumeModalOpen}
        onClose={() => {
          setIsCostumeModalOpen(false);
          setSelectedCostume(null);
        }}
        onSave={handleCostumeSave}
      />
      </AdminLayout>
  );
}
