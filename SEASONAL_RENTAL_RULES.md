# Seasonal Rental Duration Rules

## Overview

The costume rental system implements seasonal rental duration restrictions to optimize business operations during peak and regular seasons.

## Rules

### Peak Season (October - December)
- **Months**: October (10), November (11), December (12)
- **Allowed Durations**: 12 hours only
- **Minimum Rental**: 12 hours
- **Maximum Rental**: 12 hours
- **Rationale**: High demand during Halloween, Thanksgiving, and Christmas parties requires faster turnover

### Regular Season (January - September)
- **Months**: January (1) through September (9)
- **Allowed Durations**: 1 day, 3 days, 1 week
- **Minimum Rental**: 24 hours (1 day)
- **Maximum Rental**: No limit (but pricing tiers go up to 1 week)
- **Rationale**: Lower demand allows for longer rental periods

## Implementation

### Frontend Validation

The system validates rental durations on the costume detail page:

1. **Dynamic Pricing Options**: Pricing tier buttons are dynamically enabled/disabled based on the selected start date
2. **Visual Indicators**: 
   - Disabled options show with reduced opacity and "Not available" text
   - Seasonal banners display the current season and restrictions
3. **Auto-Selection**: If a user selects a date that changes the season, the system automatically selects the first available duration

### Backend Validation

The booking API enforces seasonal rules with the following validations:

```typescript
// Example validation in /api/bookings/route.ts
const seasonalValidation = validateSeasonalRental(startDate, endDate);

if (!seasonalValidation.valid) {
  return NextResponse.json(
    { 
      error: 'Invalid rental duration for season',
      message: seasonalValidation.error
    },
    { status: 400 }
  );
}
```

## Utility Functions

### `getSeasonalRentalRules(date: Date)`

Returns the seasonal rules for a given date:

```typescript
{
  season: 'peak' | 'regular',
  allowedDurations: string[],
  minHours: number,
  description: string
}
```

**Example Usage:**
```typescript
const rules = getSeasonalRentalRules(new Date('2024-10-31')); // Halloween
// Returns: { season: 'peak', allowedDurations: ['12h'], minHours: 12, ... }

const rules = getSeasonalRentalRules(new Date('2024-05-15')); // May
// Returns: { season: 'regular', allowedDurations: ['1d', '3d', '1w'], minHours: 24, ... }
```

### `isRentalDurationAllowed(startDate: Date, durationCode: string)`

Checks if a specific rental duration is allowed for the given date:

```typescript
const allowed = isRentalDurationAllowed(new Date('2024-12-25'), '1d');
// Returns: false (only 12h allowed in December)

const allowed = isRentalDurationAllowed(new Date('2024-07-04'), '12h');
// Returns: false (minimum 24h in July)
```

### `validateSeasonalRental(startDate: Date, endDate: Date)`

Validates a rental period against seasonal rules:

```typescript
const validation = validateSeasonalRental(
  new Date('2024-10-31T10:00:00'),
  new Date('2024-11-01T10:00:00')
);
// Returns: { valid: false, error: "During peak season..." }
```

## User Experience

### Costume Detail Page (`/costumes/[slug]`)

1. User selects a date from the calendar
2. System automatically:
   - Determines the season based on selected date
   - Shows/hides pricing options accordingly
   - Displays a seasonal information banner
   - Auto-selects appropriate duration if previous selection is invalid

### Booking Page (`/booking`)

1. Displays seasonal information banner at the top
2. Shows booking summary with selected duration
3. Validates on form submission before creating temporary reservation

### API Response

If a user attempts to book an invalid duration (e.g., by manipulating URL parameters):

```json
{
  "error": "Invalid rental duration for season",
  "message": "During peak season (October-December), only 12-hour rentals are available. Your selected rental is 24 hours."
}
```

## Error Messages

### Peak Season Violations
```
During peak season (October-December), only 12-hour rentals are available. 
Your selected rental is [X] hours.
```

### Regular Season Violations
```
During regular season (January-September), minimum rental duration is 24 hours. 
Your selected rental is [X] hours.
```

## Testing Scenarios

### Test Case 1: Peak Season - Valid 12h Rental
- **Date**: October 31, 2024
- **Duration**: 12 hours
- **Expected**: ✅ Booking allowed

### Test Case 2: Peak Season - Invalid 24h Rental
- **Date**: December 25, 2024
- **Duration**: 24 hours
- **Expected**: ❌ Booking rejected with error message

### Test Case 3: Regular Season - Valid 24h Rental
- **Date**: June 15, 2024
- **Duration**: 24 hours
- **Expected**: ✅ Booking allowed

### Test Case 4: Regular Season - Invalid 12h Rental
- **Date**: March 10, 2024
- **Duration**: 12 hours
- **Expected**: ❌ Booking rejected with error message

### Test Case 5: Season Transition
- **Initial Date**: September 30, 2024 (Regular season)
- **Action**: Change to October 1, 2024 (Peak season)
- **Expected**: UI updates, pricing options change, previously selected "1d" auto-changes to "12h"

## Customization

To modify the seasonal rules, edit the `getSeasonalRentalRules` function in `/src/lib/utils.ts`:

```typescript
export function getSeasonalRentalRules(date: Date): SeasonalRules {
  const month = date.getMonth() + 1;
  
  // Customize these conditions:
  if (month >= 10 && month <= 12) {
    return {
      season: 'peak',
      allowedDurations: ['12h'],  // Modify allowed durations
      minHours: 12,                // Modify minimum hours
      description: 'Your custom description'
    };
  }
  
  // Regular season...
}
```

## Visual Indicators

### Color Coding
- **Peak Season**: Orange/amber colors (🎃 emoji)
- **Regular Season**: Blue colors (📅 emoji)

### UI Elements
- Information banners on costume detail and booking pages
- Disabled pricing options with reduced opacity
- Tooltips on hover explaining restrictions
- Clear error messages in booking form

## Admin Considerations

1. **Booking Management**: Admins can still view and manage bookings regardless of season
2. **Manual Bookings**: If admins need to create exceptions, they would need direct database access or a separate admin override feature
3. **Reporting**: Consider seasonal metrics in analytics dashboard

## Future Enhancements

Potential improvements to the seasonal rental system:

1. **Admin Configuration Panel**: Allow admins to configure seasons and rules without code changes
2. **Dynamic Pricing**: Adjust pricing multipliers based on season (peak season surcharge)
3. **Multiple Peak Periods**: Support for multiple peak periods throughout the year
4. **Grace Periods**: Allow some flexibility around season boundaries
5. **Notification System**: Alert customers when approaching season changes
6. **Historical Data**: Track booking patterns by season for business insights

## Technical Notes

- All dates are processed in the user's local timezone
- Month validation uses JavaScript's `Date.getMonth()` (0-indexed) + 1
- Validation occurs at both presentation layer (UI) and business logic layer (API)
- Error responses use HTTP status codes: 400 for validation errors, 409 for conflicts

