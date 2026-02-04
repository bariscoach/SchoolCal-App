const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
    try {
        // 1. Find all boards
        const boards = await prisma.schoolBoard.findMany({
            include: {
                _count: { select: { events: true, subscribers: true } }
            }
        });

        // 2. Group by name
        const groups = {};
        boards.forEach(b => {
            if (!groups[b.name]) groups[b.name] = [];
            groups[b.name].push(b);
        });

        const duplicateGroups = Object.entries(groups).filter(([name, list]) => list.length > 1);
        console.log(`Found ${duplicateGroups.length} sets of duplicates.`);

        for (const [name, list] of duplicateGroups) {
            console.log(`\nProcessing ${name}...`);

            // Prefer the one with location data
            let keep = list.find(b => b.latitude !== null);
            if (!keep) keep = list[0]; // Logic fallback

            const discards = list.filter(b => b.id !== keep.id);

            console.log(` - Keeping ID: ${keep.id} (Lat: ${keep.latitude}, Subs: ${keep._count.subscribers})`);

            for (const discard of discards) {
                console.log(`   - Merging Discard ID: ${discard.id} (Lat: ${discard.latitude}, Subs: ${discard._count.subscribers})...`);

                // A. Move Custom Events
                // Update events from discard -> keep
                const { count: eventCount } = await prisma.event.updateMany({
                    where: { schoolBoardId: discard.id },
                    data: { schoolBoardId: keep.id }
                });
                console.log(`     > Moved ${eventCount} events.`);

                // B. Move Subscriptions
                // Iterate subs to avoid unique constraint violations
                const subs = await prisma.schoolBoardSubscription.findMany({
                    where: { schoolBoardId: discard.id }
                });

                for (const sub of subs) {
                    // Check if target already has sub
                    const existing = await prisma.schoolBoardSubscription.findUnique({
                        where: {
                            userId_schoolBoardId: {
                                userId: sub.userId,
                                schoolBoardId: keep.id
                            }
                        }
                    });

                    if (existing) {
                        // User already subbed to 'keep', just delete 'discard' sub
                        await prisma.schoolBoardSubscription.delete({ where: { id: sub.id } });
                        console.log(`     > Deleted redundant sub for user ${sub.userId}`);
                    } else {
                        // Move sub to 'keep'
                        await prisma.schoolBoardSubscription.update({
                            where: { id: sub.id },
                            data: { schoolBoardId: keep.id }
                        });
                        console.log(`     > Migrated sub for user ${sub.userId}`);
                    }
                }

                // C. Delete Discard Board
                await prisma.schoolBoard.delete({ where: { id: discard.id } });
                console.log(`     > Deleted board ${discard.id}`);
            }
        }

        console.log("\n✨ Cleanup Complete.");

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

cleanup();
