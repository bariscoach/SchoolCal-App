const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deduplicateEvents() {
    try {
        const events = await prisma.event.findMany({});

        const seen = new Set();
        let deletedCount = 0;

        for (const evt of events) {
            // Unique key: BoardID + Date + Title + Audience
            const key = `${evt.schoolBoardId}-${evt.date}-${evt.title}-${evt.audience}`;

            if (seen.has(key)) {
                // Duplicate! Delete it.
                await prisma.event.delete({ where: { id: evt.id } });
                deletedCount++;
                process.stdout.write('.'); // Progress indicator
            } else {
                seen.add(key);
            }
        }

        console.log(`\n✅ Deleted ${deletedCount} duplicate events.`);

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

deduplicateEvents();
