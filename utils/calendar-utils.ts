/**
 * Utility functions for generating calendar invites
 */

// Format date to iCalendar format (YYYYMMDDTHHmmssZ)
export function formatDateForCalendar(date: Date): string {
  return date.toISOString().replace(/-|:|\.\d+/g, "")
}

// Generate iCalendar (.ics) file content
export function generateCalendarInvite({
  title,
  description,
  location,
  startDate,
  endDate,
  url,
}: {
  title: string
  description: string
  location: string
  startDate: Date
  endDate: Date
  url?: string
}): string {
  const now = formatDateForCalendar(new Date())
  const start = formatDateForCalendar(startDate)
  const end = formatDateForCalendar(endDate)

  // Create unique identifier for the event
  const uid = `${now}-${Math.floor(Math.random() * 100000)}@cusehacks.com`

  // Format description with line breaks
  const formattedDescription = description.replace(/\n/g, "\\n")

  let icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${formattedDescription}`,
    `LOCATION:${location}`,
  ]

  // Add URL if provided
  if (url) {
    icsContent.push(`URL:${url}`)
  }

  // Add reminder alerts (24 hours and 1 hour before)
  icsContent = [
    ...icsContent,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "TRIGGER:-P1D", // 1 day before
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "TRIGGER:-PT1H", // 1 hour before
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]

  return icsContent.join("\r\n")
}

// Download calendar invite
export function downloadCalendarInvite(icsContent: string, filename = "event.ics"): void {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })

  // Create download link
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename

  // Trigger download
  document.body.appendChild(link)
  link.click()

  // Clean up
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(link.href), 100)
}
