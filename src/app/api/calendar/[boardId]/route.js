
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const { boardId } = await params;

    const board = await prisma.schoolBoard.findUnique({
        where: { id: boardId },
        include: { events: true }
    });

    if (!board) {
        return new Response('Board not found', { status: 404 });
    }

    const events = board.events.map(event => {
        // Format date from YYYY-MM-DD to YYYYMMDD
        const dateStr = event.date.replace(/-/g, '');

        return `BEGIN:VEVENT\r
UID:${dateStr}-${boardId}-${event.id}@schoolcal.app\r
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\r
DTSTART;VALUE=DATE:${dateStr}\r
DTEND;VALUE=DATE:${dateStr}\r
SUMMARY:${event.title} - ${board.name}\r
DESCRIPTION:School Calendar Event: ${event.title}. PA Day: ${event.isPaDay}. Holiday: ${event.isHoliday}\r
END:VEVENT`;
    }).join('\r\n');

    const icsContent = `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//SchoolCal//Ontario Boards//EN\r
NAME:${board.name}\r
X-WR-CALNAME:${board.name}\r
CALSCALE:GREGORIAN\r
${events}\r
END:VCALENDAR`;

    return new Response(icsContent, {
        headers: {
            'Content-Type': 'text/calendar',
            'Content-Disposition': `attachment; filename="${board.name.replace(/\s+/g, '_')}.ics"`,
        },
    });
}
