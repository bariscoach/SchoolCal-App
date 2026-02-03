
import { SCHOOL_BOARDS } from '@/app/lib/data';

export async function GET(request, { params }) {
    const { boardId } = params;
    const board = SCHOOL_BOARDS.find(b => b.id === boardId);

    if (!board) {
        return new Response('Board not found', { status: 404 });
    }

    const events = board.events.map(event => {
        // Format date to YYYYMMDD
        const dateStr = event.date.replace(/-/g, '');

        return `BEGIN:VEVENT
UID:${dateStr}-${boardId}@schoolcal.app
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART;VALUE=DATE:${dateStr}
DTEND;VALUE=DATE:${dateStr}
SUMMARY:${event.title} - ${board.name}
DESCRIPTION:School Calendar Event: ${event.title}
END:VEVENT`;
    }).join('\n');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SchoolCal//Ontario Boards//EN
NAME:${board.name}
X-WR-CALNAME:${board.name}
CALSCALE:GREGORIAN
${events}
END:VCALENDAR`;

    return new Response(icsContent, {
        headers: {
            'Content-Type': 'text/calendar',
            'Content-Disposition': `attachment; filename="${boardId}.ics"`,
        },
    });
}
