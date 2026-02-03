
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

        return `BEGIN:VEVENT
UID:${dateStr}-${boardId}-${event.id}@schoolcal.app
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART;VALUE=DATE:${dateStr}
DTEND;VALUE=DATE:${dateStr}
SUMMARY:${event.title} - ${board.name}
DESCRIPTION:School Calendar Event: ${event.title}. PA Day: ${event.isPaDay}. Holiday: ${event.isHoliday}
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
            'Content-Disposition': `attachment; filename="${board.name.replace(/\s+/g, '_')}.ics"`,
        },
    });
}
