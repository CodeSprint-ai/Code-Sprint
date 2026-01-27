# Contest Aggregator Feature

A live contest aggregator UI that displays **ongoing** and **upcoming** programming contests from [CLIST.by](https://clist.by) and [Kontests.net](https://kontests.net) (fallback).

## Features

- **Live Contest Tracking**: View ongoing, next 24h, and upcoming contests
- **Multi-Platform Support**: Codeforces, LeetCode, AtCoder, CodeChef, HackerRank, etc.
- **Smart Caching**: 5-minute LRU cache with stale-while-revalidate pattern
- **Rate Limit Handling**: Respects CLIST's 10 req/min limit with exponential backoff
- **Calendar Integration**: Export to ICS or Google Calendar with one click
- **Browser Notifications**: Set reminders for upcoming contests
- **Responsive Design**: Mobile-first with card and table view options
- **Fallback Support**: Auto-fallback to Kontests.net when CLIST is unavailable

## Quick Start

### 1. Get CLIST API Credentials

1. Register at [clist.by](https://clist.by/api/v4/doc/)
2. Get your API key from your profile
3. Add credentials to backend `.env`

### 2. Configure Backend

```bash
cd backend

# Add to .env
CLIST_API_USERNAME=your_username
CLIST_API_KEY=your_api_key
CLIST_CACHE_TTL_SECONDS=300
CLIST_RATE_LIMIT_PER_MINUTE=10
```

### 3. Start Development

```bash
# Backend
cd backend && npm run start:dev

# Frontend (separate terminal)
cd frontend && npm run dev
```

### 4. Access the UI

Navigate to `http://localhost:3000/contests`

## API Endpoints

### GET `/api/contests`

Fetch contests with optional filters.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `tab` | `ongoing` \| `upcoming` \| `next24h` | `upcoming` | Filter by status |
| `platforms` | string | - | Comma-separated platforms |
| `limit` | number | 50 | Max results (1-200) |
| `from` | ISO date | - | Start date filter |
| `to` | ISO date | - | End date filter |
| `search` | string | - | Search in contest name |
| `orderBy` | string | `start` | Sort field |
| `format` | `json` \| `atom` \| `rss` | `json` | Response format |

**Example Requests:**

```bash
# Upcoming contests
curl "http://localhost:5000/api/contests?tab=upcoming&limit=20"

# Filter by platform
curl "http://localhost:5000/api/contests?platforms=codeforces.com,leetcode.com"

# Ongoing contests
curl "http://localhost:5000/api/contests?tab=ongoing"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 12345,
      "event": "Codeforces Round #999",
      "host": "codeforces.com",
      "href": "https://codeforces.com/contest/1234",
      "start": "2026-01-30T12:00:00Z",
      "end": "2026-01-30T14:00:00Z",
      "duration": 7200,
      "status": "upcoming",
      "platform": {
        "name": "codeforces.com",
        "icon": "https://codeforces.com/favicon.ico",
        "url": "https://codeforces.com"
      }
    }
  ],
  "meta": {
    "total": 42,
    "cached": true,
    "cacheAge": 120,
    "source": "clist"
  }
}
```

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Next.js UI     │────▶│  NestJS Proxy   │────▶│  CLIST API   │
│  /contests      │     │  /api/contests  │     └──────────────┘
└─────────────────┘     │                 │            │
                        │  LRU Cache      │            ▼ (fallback)
                        │  Rate Limiter   │     ┌──────────────┐
                        └─────────────────┘     │ Kontests.net │
                                                └──────────────┘
```

## Security Checklist

| ✅ | Item | Details |
|----|------|---------|
| ✅ | API Key Storage | `process.env` only, never in frontend |
| ✅ | No Frontend Exposure | Proxy architecture hides credentials |
| ✅ | CORS Configured | Restricted to frontend origin |
| ✅ | Rate Limiting | 429 responses with Retry-After header |
| ✅ | Input Validation | class-validator on all query params |

### Rotating Credentials

1. Get new API key from CLIST
2. Update `CLIST_API_KEY` in backend `.env`
3. Restart backend server
4. Old key is immediately invalidated

## Scalability Notes

For production scaling:

1. **Redis Cache**: Replace in-memory LRU with Redis
   ```typescript
   // contest.service.ts - swap cache implementation
   import { Redis } from 'ioredis';
   private cache = new Redis(process.env.REDIS_URL);
   ```

2. **Database Storage**: Add PostgreSQL for user subscriptions
   ```sql
   CREATE TABLE contest_subscriptions (
     user_id UUID REFERENCES users(id),
     platform_filter TEXT[],
     notification_time INTEGER, -- minutes before start
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Scheduled Notifications**: Use existing Bull queue
   ```typescript
   // Add to submission processor or create new queue
   @Processor('contest-reminders')
   ```

4. **CLIST OAuth**: Register for higher rate limits (30/min)

## File Structure

```
backend/src/contest/
├── contest.module.ts      # NestJS module
├── contest.controller.ts  # API endpoints
├── contest.service.ts     # CLIST integration
├── contest.controller.spec.ts  # Tests
├── dto/
│   ├── contest-query.dto.ts     # Request validation
│   └── contest-response.dto.ts  # Response types
└── utils/
    └── lru-cache.ts       # In-memory cache

frontend/
├── types/contest.ts       # TypeScript interfaces
├── services/contestApi.ts # API client + calendar
├── hooks/
│   ├── useContests.ts     # React Query hooks
│   └── useCountdown.ts    # Countdown timer
├── components/contests/
│   ├── ContestCard.tsx    # Card component
│   ├── ContestTable.tsx   # Table view
│   ├── ContestTabs.tsx    # Tab navigation
│   ├── ContestFilters.tsx # Filter panel
│   └── CountdownTimer.tsx # Live countdown
└── app/(user)/contests/
    └── page.tsx           # Main page
```

## Deployment

### Backend (Railway/Render/Fly.io)

```bash
# Set environment variables in dashboard
CLIST_API_USERNAME=xxx
CLIST_API_KEY=xxx
CLIST_CACHE_TTL_SECONDS=300
```

### Frontend (Vercel)

```bash
# Deploy via Vercel CLI or GitHub integration
vercel --prod
```

Ensure `NEXT_PUBLIC_API_URL` points to your backend.

## PR Checklist

- [ ] CLIST credentials configured in `.env`
- [ ] Backend tests pass (`npm run test`)
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Contests page accessible at `/contests`
- [ ] Countdown timers update in real-time
- [ ] Calendar export works (ICS download)
- [ ] Mobile responsive layout verified
- [ ] Rate limiting tested (429 response after 10 rapid requests)
