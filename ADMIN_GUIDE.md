# Admin Panel Guide

## Overview
The admin panel provides comprehensive management tools for your costume rental business. Access it by clicking the "Admin" button in the navigation or visiting `/admin`.

## Features

### 📊 Dashboard Overview
- **Real-time Statistics**: View total orders, revenue, pending orders, and inventory count
- **Recent Orders**: Quick view of the latest booking requests
- **Key Metrics**: Track business performance at a glance

### 📦 Order Management
- **Order Tracking**: View all customer bookings with detailed information
- **Status Management**: Update order status (pending → confirmed → completed)
- **Search & Filter**: Find orders by customer name, email, or status
- **Order Details**: Comprehensive view of each booking including:
  - Customer information
  - Costume details
  - Rental dates and pricing
  - Special requests
  - Order history

### 🎭 Inventory Management
- **Costume Catalog**: View all available costumes with details
- **Add/Edit Costumes**: Create new costumes or update existing ones
- **Pricing Management**: Set different rates for 12h, daily, and weekly rentals
- **Availability Control**: Mark costumes as available/unavailable
- **Feature Management**: Add and manage costume features

### 📈 Analytics
- **Revenue Tracking**: Monthly revenue breakdown and growth metrics
- **Popular Costumes**: See which costumes are rented most frequently
- **Customer Insights**: Track repeat customers, average rental duration, and order values

## How to Use

### Managing Orders
1. Navigate to the "Orders" tab
2. Use search to find specific orders
3. Filter by status (pending, confirmed, completed, cancelled)
4. Click the eye icon to view detailed order information
5. Update order status using the action buttons in the detail modal

### Managing Inventory
1. Go to the "Inventory" tab
2. Click "Add New Costume" to create a new costume
3. Fill in all required information:
   - Basic details (name, description, category)
   - Pricing (12h, daily, weekly rates)
   - Specifications (size, difficulty, setup time)
   - Features (key selling points)
4. Click "Edit" on existing costumes to modify them

### Viewing Analytics
1. Access the "Analytics" tab
2. Review revenue trends and popular items
3. Monitor customer behavior patterns
4. Use insights to make business decisions

## Navigation
- **Sidebar**: Quick access to all admin sections
- **Top Bar**: Current page title and user info
- **Mobile**: Collapsible sidebar for mobile devices
- **Back to Site**: Return to the customer-facing website

## Data Management
- All data is currently stored in memory (for demo purposes)
- In production, this would connect to a real database
- Export functionality available for data backup
- Real-time updates when orders are placed via Messenger

## Security Notes
- Admin panel should be protected with authentication in production
- Consider role-based access control for different admin levels
- Implement audit logging for sensitive operations
- Regular data backups recommended

## Integration with Messenger
- Orders placed through the website are sent to Facebook Messenger
- Admin can track these orders in the dashboard
- Status updates can be communicated back to customers via Messenger
- All booking details are automatically captured and displayed

## Future Enhancements
- Email notifications for new orders
- Automated status updates to customers
- Advanced reporting and analytics
- Bulk operations for inventory management
- Customer communication tools
- Payment processing integration
- Calendar view for availability management
