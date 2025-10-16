'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard, InfoCard } from '@/components/ui/enhanced-card';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Download,
  Info
} from 'lucide-react';
import { costumes as mockCostumes, bookings as mockBookings } from '@/data/costumes';
import { formatDisplayDate } from '@/lib/utils';
import { OrderDetailModal } from '@/components/admin/order-detail-modal';
import { CostumeFormModal } from '@/components/admin/costume-form-modal';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Costume, Booking } from '@/types';
import { EnhancedCard } from '@/components/ui/enhanced-card';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Booking | null>(null);
  const [selectedCostume, setSelectedCostume] = useState<Costume | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCostumeModalOpen, setIsCostumeModalOpen] = useState(false);
  const [costumes, setCostumes] = useState<Costume[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const costumesResponse = await fetch('/api/costumes');
        if (costumesResponse.ok) {
          const costumesData = await costumesResponse.json();
          setCostumes(costumesData.costumes || []);
        } else {
          setCostumes(mockCostumes);
        }

        const bookingsResponse = await fetch('/api/bookings');
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData.bookings || []);
        } else {
          setBookings(mockBookings);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setCostumes(mockCostumes);
        setBookings(mockBookings);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Calculate dashboard stats
  const totalOrders = bookings.length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  const pendingOrders = bookings.filter(b => b.status === 'pending').length;
  const totalCostumes = costumes.length;

  // Filter orders
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

      window.location.reload();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
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

      setIsCostumeModalOpen(false);
      window.location.reload();
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
      <div className="p-6 space-y-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">Manage your costume rental business</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="rounded-xl">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button size="sm" onClick={handleAddCostume} className="rounded-xl shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Costume
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <InfoCard
          variant="info"
          icon={Info}
          title="Welcome to your dashboard"
          description="Track your orders, manage inventory, and view analytics all in one place."
        />

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-2">
          <nav className="flex space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'analytics', label: 'Analytics', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'orders' | 'inventory' | 'analytics')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
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
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={ShoppingCart}
                value={totalOrders}
                label="Total Orders"
                trend={{ value: "+12.5%", positive: true }}
                color="blue"
              />

              <StatCard
                icon={DollarSign}
                value={`₱${totalRevenue.toLocaleString()}`}
                label="Total Revenue"
                trend={{ value: "+18.2%", positive: true }}
                color="green"
              />

              <StatCard
                icon={Calendar}
                value={pendingOrders}
                label="Pending Orders"
                trend={{ value: "3 new", positive: true }}
                color="yellow"
              />

              <StatCard
                icon={Package}
                value={totalCostumes}
                label="Total Costumes"
                trend={{ value: "+5", positive: true }}
                color="purple"
              />
            </div>

            {/* Recent Orders */}
            <EnhancedCard>
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                    <p className="text-gray-600 text-sm mt-1">Latest booking requests from customers</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    View All
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => {
                    const costume = costumes.find(c => c.id === booking.costumeId);
                    return (
                      <div 
                        key={booking.id} 
                        className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleOrderClick(booking)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{getStatusIcon(booking.status)}</div>
                          <div>
                            <p className="font-semibold text-gray-900">{booking.customerName}</p>
                            <p className="text-sm text-gray-600">{costume?.name}</p>
                            <p className="text-xs text-gray-500">{formatDisplayDate(booking.startDate)} - {formatDisplayDate(booking.endDate)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(booking.status)} mb-2`}>
                            {booking.status}
                          </Badge>
                          <p className="text-sm font-bold text-gray-900">₱{booking.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </EnhancedCard>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filters */}
            <EnhancedCard className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </EnhancedCard>

            {/* Orders List */}
            <EnhancedCard>
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">All Orders</h2>
                <p className="text-gray-600 text-sm mt-1">Manage and track all customer bookings</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Order ID</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Customer</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Costume</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Dates</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Amount</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => {
                      const costume = costumes.find(c => c.id === booking.costumeId);
                      return (
                        <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6 text-sm font-mono text-gray-600">#{booking.id.slice(0, 8)}</td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-gray-900">{booking.customerName}</p>
                              <p className="text-sm text-gray-600">{booking.customerEmail}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-medium text-gray-900">{costume?.name}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-sm text-gray-900">{formatDisplayDate(booking.startDate)}</p>
                            <p className="text-sm text-gray-600">to {formatDisplayDate(booking.endDate)}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-semibold text-gray-900">₱{booking.totalPrice.toLocaleString()}</p>
                          </td>
                          <td className="py-4 px-6">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="rounded-lg"
                                onClick={() => handleOrderClick(booking)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </EnhancedCard>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <EnhancedCard>
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Costume Inventory</h2>
                    <p className="text-gray-600 text-sm mt-1">Manage your costume collection</p>
                  </div>
                  <Button onClick={handleAddCostume} className="rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Costume
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {costumes.map((costume) => (
                    <EnhancedCard key={costume.id} className="hover:scale-[1.02]">
                      <div className="p-5 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                            <span className="text-2xl">🎭</span>
                          </div>
                          <Badge className={costume.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {costume.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1 text-gray-900">{costume.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{costume.description}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Size:</span>
                            <span className="font-medium text-gray-900">{costume.size}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Daily Rate:</span>
                            <span className="font-bold text-primary">₱{costume.pricePerDay.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 rounded-lg"
                            onClick={() => handleCostumeClick(costume)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg"
                            onClick={() => window.location.href = `/admin/costumes/${costume.id}`}
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </EnhancedCard>
                  ))}
                </div>
              </div>
            </EnhancedCard>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EnhancedCard className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <span className="text-gray-700 font-medium">This Month</span>
                    <span className="font-bold text-2xl text-green-600">₱{totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Last Month</span>
                    <span className="font-semibold text-gray-900">₱{(totalRevenue * 0.8).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <span className="text-gray-700 font-medium">Growth</span>
                    <span className="font-bold text-green-600 text-lg">+25%</span>
                  </div>
                </div>
              </EnhancedCard>

              <EnhancedCard className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Popular Costumes</h3>
                <div className="space-y-3">
                  {costumes.slice(0, 5).map((costume, index) => (
                    <div key={costume.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900">{costume.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{Math.floor(Math.random() * 20) + 5} rentals</span>
                    </div>
                  ))}
                </div>
              </EnhancedCard>
            </div>

            <EnhancedCard className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Customer Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-primary/5 rounded-2xl">
                  <div className="text-4xl font-bold text-primary mb-2">85%</div>
                  <div className="text-sm text-gray-600 font-medium">Repeat Customers</div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-2xl">
                  <div className="text-4xl font-bold text-blue-600 mb-2">2.3 days</div>
                  <div className="text-sm text-gray-600 font-medium">Average Rental Duration</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-2xl">
                  <div className="text-4xl font-bold text-green-600 mb-2">₱2,400</div>
                  <div className="text-sm text-gray-600 font-medium">Average Order Value</div>
                </div>
              </div>
            </EnhancedCard>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedOrder && (
        <OrderDetailModal
          booking={selectedOrder}
          costume={costumes.find(c => c.id === selectedOrder.costumeId)!}
          isOpen={isOrderModalOpen}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={handleOrderStatusUpdate}
        />
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

