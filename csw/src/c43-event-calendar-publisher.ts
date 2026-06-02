/**
 * Component 43: Event Calendar Publisher
 *
 * Public-facing event calendar with ICS generation for calendar
 * import. Supports webinars, Q&A sessions, cohort deadlines,
 * office hours, and launch events. Generates VM-styled HTML
 * calendar pages and reminder emails.
 *
 * VitalMatrix Content Studio — Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Supported event types */
export type EventType = 'webinar' | 'qa-session' | 'cohort-deadline' | 'office-hours' | 'launch-event';

/** A single calendar event */
export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  description: string;
  registrationLink?: string;
  maxAttendees?: number;
  currentRegistrations?: number;
}

/** Full event calendar */
export interface EventCalendar {
  events: CalendarEvent[];
  lastUpdated: string;
}

// --- Store ---

/** In-memory event store */
const calendarStore: EventCalendar = {
  events: [],
  lastUpdated: new Date().toISOString(),
};

// --- Helper Functions ---

/**
 * Parses a date string (YYYY-MM-DD) and time (HH:MM) into a Date object.
 *
 * @param dateStr - Date in YYYY-MM-DD format
 * @param timeStr - Time in HH:MM format
 * @returns Date object
 */
function parseDateTime(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr}T${timeStr}:00`);
}

/**
 * Formats a Date as ICS timestamp (YYYYMMDDTHHMMSSZ).
 *
 * @param dateStr - Date in YYYY-MM-DD
 * @param timeStr - Time in HH:MM
 * @returns ICS-formatted timestamp
 */
function toIcsTimestamp(dateStr: string, timeStr: string): string {
  const clean = dateStr.replace(/-/g, '');
  const timeParts = timeStr.replace(':', '');
  return `${clean}T${timeParts}00Z`;
}

/**
 * Generates a unique ID for ICS events.
 *
 * @param eventId - Event identifier
 * @returns ICS UID
 */
function generateUid(eventId: string): string {
  return `${eventId}@${VM_BRAND.platform.domain}`;
}

/**
 * Returns display label for event type.
 *
 * @param type - Event type
 * @returns Human-readable label
 */
function eventTypeLabel(type: EventType): string {
  const labels: Record<EventType, string> = {
    'webinar': 'Webinar',
    'qa-session': 'Q&A Session',
    'cohort-deadline': 'Cohort Deadline',
    'office-hours': 'Office Hours',
    'launch-event': 'Launch Event',
  };
  return labels[type];
}

/**
 * Returns the accent colour for an event type.
 *
 * @param type - Event type
 * @returns Hex colour code
 */
function eventTypeColour(type: EventType): string {
  const colours: Record<EventType, string> = {
    'webinar': VM_BRAND.colours.teal,
    'qa-session': VM_BRAND.colours.sage,
    'cohort-deadline': VM_BRAND.colours.gold,
    'office-hours': VM_BRAND.colours.purple,
    'launch-event': VM_BRAND.colours.gold,
  };
  return colours[type];
}

// --- Public Functions ---

/**
 * Adds an event to the calendar store.
 *
 * @param event - Calendar event to add
 * @returns Updated event calendar
 */
export function addEvent(event: CalendarEvent): EventCalendar {
  calendarStore.events.push(event);
  calendarStore.lastUpdated = new Date().toISOString();
  return { ...calendarStore };
}

/**
 * Returns upcoming events within the specified number of days.
 *
 * @param days - Number of days to look ahead
 * @returns Array of upcoming events, sorted by date
 */
export function getUpcoming(days: number): CalendarEvent[] {
  const now = new Date();
  const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return calendarStore.events
    .filter(e => {
      const eventDate = new Date(e.date);
      return eventDate >= now && eventDate <= cutoff;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Returns past events, sorted by most recent first.
 *
 * @returns Array of past events
 */
export function getPast(): CalendarEvent[] {
  const now = new Date();
  return calendarStore.events
    .filter(e => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Generates an ICS file string for a single event.
 * Compatible with Google Calendar, Outlook, Apple Calendar.
 *
 * @param event - Calendar event
 * @returns ICS-formatted string
 */
export function generateIcsFile(event: CalendarEvent): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${VM_BRAND.credentials.company}//VitalMatrix CSW//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${generateUid(event.id)}`,
    `DTSTART:${toIcsTimestamp(event.date, event.startTime)}`,
    `DTEND:${toIcsTimestamp(event.date, event.endTime)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `ORGANIZER;CN=${VM_BRAND.credentials.name}:mailto:events@${VM_BRAND.platform.domain}`,
    `URL:${event.registrationLink ?? `https://${VM_BRAND.platform.domain}/events`}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

/**
 * Generates a combined ICS calendar file for multiple events.
 *
 * @param events - Array of calendar events
 * @returns ICS-formatted string with all events
 */
export function generateIcsCalendar(events: CalendarEvent[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${VM_BRAND.credentials.company}//VitalMatrix CSW//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:VitalMatrix Events`,
  ];

  for (const event of events) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${generateUid(event.id)}`);
    lines.push(`DTSTART:${toIcsTimestamp(event.date, event.startTime)}`);
    lines.push(`DTEND:${toIcsTimestamp(event.date, event.endTime)}`);
    lines.push(`SUMMARY:${event.title}`);
    lines.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`);
    lines.push(`ORGANIZER;CN=${VM_BRAND.credentials.name}:mailto:events@${VM_BRAND.platform.domain}`);
    if (event.registrationLink) {
      lines.push(`URL:${event.registrationLink}`);
    }
    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Generates a VM-styled HTML calendar page with event cards,
 * type badges, registration links, and ICS download prompts.
 *
 * @returns Complete HTML page string
 */
export function generateCalendarHtml(): string {
  const upcoming = getUpcoming(90);
  const past = getPast().slice(0, 10);

  const eventCardHtml = (event: CalendarEvent): string => {
    const colour = eventTypeColour(event.type);
    const label = eventTypeLabel(event.type);
    const spotsText = event.maxAttendees
      ? `${(event.maxAttendees - (event.currentRegistrations ?? 0))} of ${event.maxAttendees} spots remaining`
      : '';
    const regButton = event.registrationLink
      ? `<a href="${event.registrationLink}" style="display:inline-block;margin-top:12px;padding:8px 20px;background:${VM_BRAND.colours.gold};color:${VM_BRAND.colours.prussianBlue};text-decoration:none;border-radius:4px;font-family:'${VM_BRAND.fonts.body}',sans-serif;font-weight:600;">Register</a>`
      : '';

    return `
      <div style="background:${VM_BRAND.colours.charcoal};border-left:4px solid ${colour};border-radius:6px;padding:20px;margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
          <div>
            <span style="display:inline-block;background:${colour};color:${VM_BRAND.colours.white};padding:2px 10px;border-radius:3px;font-size:12px;font-family:'${VM_BRAND.fonts.body}',sans-serif;text-transform:uppercase;letter-spacing:0.5px;">${label}</span>
            <h3 style="margin:8px 0 4px;color:${VM_BRAND.colours.white};font-family:'${VM_BRAND.fonts.heading}',serif;font-size:20px;">${event.title}</h3>
          </div>
          <div style="text-align:right;font-family:'${VM_BRAND.fonts.data}',monospace;color:${VM_BRAND.colours.gold};font-size:14px;">
            <div>${event.date}</div>
            <div>${event.startTime} - ${event.endTime} ${event.timezone}</div>
          </div>
        </div>
        <p style="color:${VM_BRAND.colours.white};opacity:0.85;font-family:'${VM_BRAND.fonts.body}',sans-serif;font-size:14px;margin:8px 0;">${event.description}</p>
        ${spotsText ? `<p style="color:${VM_BRAND.colours.gold};font-family:'${VM_BRAND.fonts.data}',monospace;font-size:13px;margin:4px 0;">${spotsText}</p>` : ''}
        ${regButton}
      </div>`;
  };

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Events | VitalMatrix</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: ${VM_BRAND.colours.prussianBlue}; color: ${VM_BRAND.colours.white}; font-family: '${VM_BRAND.fonts.body}', sans-serif; }
  </style>
</head>
<body>
  <div style="max-width:800px;margin:0 auto;padding:40px 20px;">
    <header style="text-align:center;margin-bottom:40px;">
      <h1 style="font-family:'${VM_BRAND.fonts.heading}',serif;font-size:32px;color:${VM_BRAND.colours.gold};margin-bottom:8px;">VitalMatrix Events</h1>
      <p style="font-size:16px;opacity:0.8;">Webinars, Q&A sessions, and cohort milestones for functional medicine practitioners.</p>
    </header>

    <section style="margin-bottom:48px;">
      <h2 style="font-family:'${VM_BRAND.fonts.heading}',serif;font-size:24px;color:${VM_BRAND.colours.teal};margin-bottom:20px;">Upcoming Events</h2>
      ${upcoming.length > 0 ? upcoming.map(eventCardHtml).join('') : '<p style="opacity:0.6;">No upcoming events scheduled. Check back soon.</p>'}
    </section>

    ${past.length > 0 ? `
    <section style="margin-bottom:48px;">
      <h2 style="font-family:'${VM_BRAND.fonts.heading}',serif;font-size:24px;color:${VM_BRAND.colours.sage};margin-bottom:20px;">Past Events</h2>
      ${past.map(e => `
        <div style="background:${VM_BRAND.colours.charcoal};opacity:0.6;border-radius:6px;padding:16px;margin-bottom:12px;">
          <span style="font-family:'${VM_BRAND.fonts.data}',monospace;font-size:13px;color:${VM_BRAND.colours.gold};">${e.date}</span>
          <h3 style="font-family:'${VM_BRAND.fonts.heading}',serif;font-size:18px;color:${VM_BRAND.colours.white};margin:4px 0;">${e.title}</h3>
          <span style="font-size:12px;text-transform:uppercase;color:${VM_BRAND.colours.white};">${eventTypeLabel(e.type)}</span>
        </div>`).join('')}
    </section>` : ''}

    <footer style="text-align:center;padding-top:32px;border-top:1px solid ${VM_BRAND.colours.deepTeal};font-size:12px;opacity:0.6;">
      <p>${VM_BRAND.regulatoryFooter}</p>
      <p style="margin-top:4px;">${VM_BRAND.tmFooter}</p>
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Generates an event reminder email for a specific event.
 *
 * @param event - The event to remind about
 * @param daysUntil - Number of days until the event
 * @returns HTML email string
 */
export function generateEventReminderEmail(event: CalendarEvent, daysUntil: number): string {
  const urgency = daysUntil <= 1 ? 'tomorrow' : `in ${daysUntil} days`;
  const label = eventTypeLabel(event.type);
  const spotsText = event.maxAttendees
    ? `Only ${event.maxAttendees - (event.currentRegistrations ?? 0)} spots remaining.`
    : '';

  return `<!DOCTYPE html>
<html lang="en-GB">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:${VM_BRAND.colours.prussianBlue};font-family:'${VM_BRAND.fonts.body}',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="font-family:'${VM_BRAND.fonts.heading}',serif;color:${VM_BRAND.colours.gold};font-size:24px;margin:0;">Event Reminder</h1>
    </div>

    <div style="background:${VM_BRAND.colours.charcoal};border-radius:8px;padding:24px;border-left:4px solid ${eventTypeColour(event.type)};">
      <span style="display:inline-block;background:${eventTypeColour(event.type)};color:${VM_BRAND.colours.white};padding:2px 10px;border-radius:3px;font-size:12px;text-transform:uppercase;">${label}</span>
      <h2 style="font-family:'${VM_BRAND.fonts.heading}',serif;color:${VM_BRAND.colours.white};font-size:22px;margin:12px 0 8px;">${event.title}</h2>
      <p style="color:${VM_BRAND.colours.gold};font-family:'${VM_BRAND.fonts.data}',monospace;font-size:14px;margin:0 0 12px;">
        ${event.date} | ${event.startTime} - ${event.endTime} ${event.timezone}
      </p>
      <p style="color:${VM_BRAND.colours.white};opacity:0.85;font-size:14px;margin:0 0 16px;">${event.description}</p>
      <p style="color:${VM_BRAND.colours.white};font-size:15px;font-weight:600;margin:0 0 8px;">This event is ${urgency}.</p>
      ${spotsText ? `<p style="color:${VM_BRAND.colours.gold};font-size:14px;margin:0 0 16px;">${spotsText}</p>` : ''}
      ${event.registrationLink ? `<a href="${event.registrationLink}" style="display:inline-block;padding:10px 24px;background:${VM_BRAND.colours.gold};color:${VM_BRAND.colours.prussianBlue};text-decoration:none;border-radius:4px;font-weight:600;">Confirm Attendance</a>` : ''}
    </div>

    <div style="text-align:center;margin-top:32px;font-size:11px;color:${VM_BRAND.colours.white};opacity:0.5;">
      <p>${VM_BRAND.regulatoryFooter}</p>
      <p>${VM_BRAND.credentials.company} | ${VM_BRAND.platform.domain}</p>
    </div>
  </div>
</body>
</html>`;
}
