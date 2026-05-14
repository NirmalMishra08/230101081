# Stage 1 - Notification_System_Design

## Approach

**Priority Calculation Logic:**
1. Type weights
   - Placement = 3 (Highest)
   - Result = 2
   - Event = 1 (Lowest)

2. Recency Score: 
   - Convert timestamp to minutes ago
   - Newer notifications get higher score

3. Final Priority Score** = (Type Weight × 1000) + Recency Score

This ensures:
- All Placements appear before Results
- All Results appear before Events
- Within same type → most recent first

## Tech Stack
- Next.js 14 + TypeScript + Tailwind CSS
- Reusable Logging Middleware integrated

## Implementation
- Fetched notifications from the provided API using Bearer Token
- Implemented custom sorting logic (no external libs)
- Efficient in-memory solution (suitable as data volume is moderate)
- Maintains top N efficiently using JavaScript sort (O(n log n))

## Screenshots
