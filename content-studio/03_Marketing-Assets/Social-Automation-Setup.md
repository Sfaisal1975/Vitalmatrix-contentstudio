# Social Media Automation Setup Guide
**Section:** 03_Marketing-Assets
**Status:** ACTIVE — technical setup and operational reference
**Owner:** W08 + Technical Lead
**Applies to:** VitalMatrix API social scheduler, all 4 platforms

---

## Architecture Overview

The social media scheduler is a cron-based background job built into the VitalMatrix API server, following the same pattern as the nurture email processor. It:

1. Stores scheduled posts in the `social_queue` database table
2. Runs every 10 minutes to check for posts due to be published
3. Dispatches to the correct platform adapter (LinkedIn, Facebook, Instagram, X)
4. Records success, failure, and retry state in the database
5. Exposes admin API endpoints for scheduling, viewing, and cancelling posts

---

## Platform Credentials Required

Before the scheduler can post, the following secrets must be added in Replit (Settings → Secrets):

### LinkedIn
| Secret name | Where to get it |
|-------------|----------------|
| `LINKEDIN_ACCESS_TOKEN` | LinkedIn Developer Portal → App → Auth → Access Token (must have `w_member_social` scope) |
| `LINKEDIN_PERSON_URN` | Your LinkedIn profile URN — format: `urn:li:person:XXXXXXXX` |
| `LINKEDIN_ORG_URN` | VitalMatrix LinkedIn Company Page URN — format: `urn:li:organization:XXXXXXXX` (for page posts) |

**LinkedIn scopes required:** `w_member_social`, `r_liteprofile`

**Note:** LinkedIn access tokens expire every 60 days. Set a calendar reminder to refresh. The scheduler will log `LINKEDIN_TOKEN_EXPIRED` errors when this happens.

### Facebook / Instagram (Meta Graph API — same credentials)
| Secret name | Where to get it |
|-------------|----------------|
| `META_ACCESS_TOKEN` | Meta Developer Portal → App → Graph API Explorer → Generate User Access Token (long-lived) |
| `FACEBOOK_PAGE_ID` | Facebook Page → About → Page ID |
| `INSTAGRAM_ACCOUNT_ID` | Facebook Business Suite → Instagram Account → Account ID |

**Meta scopes required:** `pages_manage_posts`, `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`

**Note:** Long-lived Meta tokens last ~60 days. Use the Token Debugger at developers.facebook.com to extend. The scheduler checks for `OAuthException` errors and logs `META_TOKEN_EXPIRED`.

### X (Twitter)
| Secret name | Where to get it |
|-------------|----------------|
| `X_API_KEY` | X Developer Portal → Project → App → Keys and Tokens |
| `X_API_SECRET` | Same location |
| `X_ACCESS_TOKEN` | Same location — generated for your account |
| `X_ACCESS_TOKEN_SECRET` | Same location |

**X API tier required:** Basic ($100/month) for posting. Free tier is read-only.

---

## API Endpoints

All endpoints require the `x-admin-key` header (value: `ADMIN_API_KEY` secret).

### Schedule a post
```
POST /social/schedule
Content-Type: application/json
x-admin-key: [ADMIN_API_KEY]

{
  "platform": "linkedin" | "facebook" | "instagram" | "x",
  "content": "Post text here",
  "imageUrl": "https://..." (optional),
  "hashtags": "#FunctionalMedicine #VitalMatrix" (optional),
  "scheduledFor": "2026-06-03T08:00:00.000Z"
}
```

**Response:**
```json
{ "id": 42, "status": "pending", "scheduledFor": "2026-06-03T08:00:00.000Z" }
```

### View queue
```
GET /social/queue?platform=linkedin&status=pending
x-admin-key: [ADMIN_API_KEY]
```

Returns all pending, posted, and failed posts. Filter by platform and status.

### Cancel a scheduled post
```
DELETE /social/queue/:id
x-admin-key: [ADMIN_API_KEY]
```

Only works if `status = "pending"`. Returns 409 if post already sent.

### View post history
```
GET /social/history?platform=linkedin&limit=20
x-admin-key: [ADMIN_API_KEY]
```

Returns last N posted items with timestamps and any error messages.

---

## Retry Logic

| Scenario | Behaviour |
|----------|-----------|
| Platform API error (5xx) | Retry after 30 minutes, up to 3 attempts |
| Auth error (token expired) | Mark as `failed`, log `TOKEN_EXPIRED` — do not retry |
| Rate limit hit | Retry after 60 minutes |
| After 3 failed retries | Mark as `failed`, no further attempts |
| Network timeout | Retry after 15 minutes, up to 3 attempts |

All failures are logged to the `social_queue` table with `error_message`. The admin `/social/queue` endpoint surfaces these.

---

## Image Handling

Instagram requires an image for every post. LinkedIn and Facebook posts with images get significantly higher reach.

**Image URL rules:**
- Must be a publicly accessible HTTPS URL (not a Replit localhost URL)
- Upload images to object storage first, then pass the public URL to `/social/schedule`
- Instagram minimum: 1080×1080px (square) or 1080×1350px (portrait)
- LinkedIn recommended: 1200×627px
- Facebook recommended: 1200×630px
- X recommended: 1600×900px

**Brand image assets** live in `35_Screenshot-Library/` and should be uploaded to object storage before scheduling.

---

## Content Length Limits

The scheduler enforces these limits before accepting a post:

| Platform | Limit | Notes |
|----------|-------|-------|
| LinkedIn | 3,000 characters | First 220 chars shown before "see more" |
| Facebook | 63,206 characters | Practical limit: keep under 500 for engagement |
| Instagram | 2,200 characters | Hashtags count toward limit |
| X | 280 characters | URLs count as 23 chars regardless of length |

Posts exceeding limits are rejected with a `400` error and a clear message.

---

## Monitoring

The scheduler logs every run to the console with:
- `[SOCIAL] Checked queue — N posts dispatched, N pending, N failed`
- Per-post: `[SOCIAL] Posted to linkedin — post ID: XXXXX`
- Per-failure: `[SOCIAL] Failed linkedin — error: [message]`

Check logs via Replit console (API Server workflow) or via the admin endpoint `GET /social/history`.

---

## Token Refresh Reminder

Add these to your calendar immediately after setup:

| Platform | Token lifespan | Reminder |
|----------|---------------|---------|
| LinkedIn | 60 days | Set 50-day calendar reminder |
| Meta (Facebook/Instagram) | 60 days (long-lived) | Set 50-day calendar reminder |
| X | Never expires | No reminder needed |

When a token expires: update the secret in Replit → restart the API server workflow → confirm via `GET /social/queue`.
