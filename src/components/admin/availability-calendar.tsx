'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  X,
  AlertCircle
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isPast, parseISO } from 'date-fns';

interface AvailabilityBlock {
  id: string;
  costume_id: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  created_by: string;
}

interface BlockedDate {
  blocked_date: string;
  reason: string | null;
  block_type: 'manual_block' | 'booking';
}

interface AvailabilityCalendarProps {
  costumeId: string;
  costumeName: string;
}

export function AvailabilityCalendar({ costumeId, costumeName }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [availabilityBlocks, setAvailabilityBlocks] = useState<AvailabilityBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [showReasonInput, setShowReasonInput] = useState(false);

  // Fetch blocked dates for current month
  useEffect(() => {
    fetchBlockedDates();
    fetchAvailabilityBlocks();
  }, [costumeId, currentMonth]);

  const fetchBlockedDates = async () => {
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      
      const response = await fetch(
        `/api/availability?costumeId=${costumeId}&year=${year}&month=${month}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setBlockedDates(data.blockedDates || []);
      }
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
    }
  };

  const fetchAvailabilityBlocks = async () => {
    try {
      const response = await fetch(`/api/availability?costumeId=${costumeId}`);
      if (response.ok) {
        const data = await response.json();
        setAvailabilityBlocks(data.blocks || []);
      }
    } catch (error) {
      console.error('Error fetching availability blocks:', error);
    }
  };

  const isDateBlocked = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return blockedDates.some(bd => bd.blocked_date === dateStr);
  };

  const getBlockInfo = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return blockedDates.find(bd => bd.blocked_date === dateStr);
  };

  const handleDateClick = (date: Date) => {
    if (isPast(date) && !isToday(date)) return; // Can't select past dates
    
    const isSelected = selectedDates.some(d => isSameDay(d, date));
    
    if (isSelected) {
      setSelectedDates(selectedDates.filter(d => !isSameDay(d, date)));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleBlockDates = async () => {
    if (selectedDates.length === 0) return;
    
    setIsLoading(true);
    try {
      // Sort dates
      const sortedDates = selectedDates.sort((a, b) => a.getTime() - b.getTime());
      const startDate = format(sortedDates[0], 'yyyy-MM-dd');
      const endDate = format(sortedDates[sortedDates.length - 1], 'yyyy-MM-dd');

      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          costumeId,
          startDate,
          endDate,
          reason: blockReason || 'Blocked by admin'
        })
      });

      if (response.ok) {
        setSelectedDates([]);
        setBlockReason('');
        setShowReasonInput(false);
        await fetchBlockedDates();
        await fetchAvailabilityBlocks();
      }
    } catch (error) {
      console.error('Error blocking dates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockDate = async (blockId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/availability?id=${blockId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchBlockedDates();
        await fetchAvailabilityBlocks();
      }
    } catch (error) {
      console.error('Error unblocking dates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add padding for days before month starts
    const startDay = monthStart.getDay();
    const paddingDays = Array(startDay).fill(null);
    
    return [...paddingDays, ...days];
  };

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const days = generateCalendarDays();

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Manage Availability - {costumeName}
              </CardTitle>
              <CardDescription>
                Click dates to block them from booking. Selected dates will be unavailable to customers.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-semibold min-w-[150px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </div>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 rounded mr-2"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-100 border border-red-300 rounded mr-2"></div>
              <span>Manually Blocked</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded mr-2"></div>
              <span>Past/Unavailable</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-sm text-gray-600 py-2">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const isBlocked = isDateBlocked(day);
              const blockInfo = getBlockInfo(day);
              const isSelected = selectedDates.some(d => isSameDay(d, day));
              const isPastDate = isPast(day) && !isToday(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isTodayDate = isToday(day);

              let bgColor = 'bg-white hover:bg-gray-50';
              let borderColor = 'border-gray-200';
              let textColor = 'text-gray-900';
              let cursor = 'cursor-pointer';

              if (!isCurrentMonth) {
                bgColor = 'bg-gray-50';
                textColor = 'text-gray-400';
              } else if (isPastDate) {
                bgColor = 'bg-gray-100';
                borderColor = 'border-gray-300';
                textColor = 'text-gray-400';
                cursor = 'cursor-not-allowed';
              } else if (isSelected) {
                bgColor = 'bg-blue-500';
                borderColor = 'border-blue-600';
                textColor = 'text-white';
              } else if (isBlocked) {
                if (blockInfo?.block_type === 'booking') {
                  bgColor = 'bg-yellow-100';
                  borderColor = 'border-yellow-300';
                } else {
                  bgColor = 'bg-red-100';
                  borderColor = 'border-red-300';
                }
              }

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  disabled={isPastDate || !isCurrentMonth}
                  className={`
                    aspect-square border-2 rounded-lg p-2 text-sm font-medium
                    transition-all relative group
                    ${bgColor} ${borderColor} ${textColor} ${cursor}
                    ${isTodayDate ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}
                  title={blockInfo?.reason || undefined}
                >
                  {format(day, 'd')}
                  {isBlocked && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  )}
                  {blockInfo && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected dates info */}
          {selectedDates.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-2">
                    {selectedDates.length} date(s) selected
                  </h4>
                  {!showReasonInput && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReasonInput(true)}
                    >
                      Add Reason (Optional)
                    </Button>
                  )}
                  {showReasonInput && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={blockReason}
                        onChange={(e) => setBlockReason(e.target.value)}
                        placeholder="Reason for blocking (e.g., Maintenance, Reserved)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleBlockDates}
                    disabled={isLoading}
                    size="sm"
                  >
                    {isLoading ? 'Blocking...' : 'Block Dates'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedDates([]);
                      setBlockReason('');
                      setShowReasonInput(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Blocks List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Availability Blocks</CardTitle>
          <CardDescription>Manually blocked date ranges for this costume</CardDescription>
        </CardHeader>
        <CardContent>
          {availabilityBlocks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No availability blocks set</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availabilityBlocks.map((block) => (
                <div
                  key={block.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="secondary">
                        {format(parseISO(block.start_date), 'MMM dd, yyyy')} - {format(parseISO(block.end_date), 'MMM dd, yyyy')}
                      </Badge>
                    </div>
                    {block.reason && (
                      <p className="text-sm text-gray-600">Reason: {block.reason}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Created by {block.created_by}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnblockDate(block.id)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

