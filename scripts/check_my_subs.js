const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSubs() {
    try {
        // Find the admin user (Baris)
        const user = await prisma.user.findFirst({
            where: { role: 'ADMIN' },
            include: {
                subscriptions: {
                    include: { schoolBoard: true }
                }
            }
        });

        if (!user) {
            console.log("❌ Admin user not found.");
            return;
        }

        console.log(`User: ${user.name} (${user.email})`);
        console.log(`Role: ${user.role}`);
        console.log(`Subscriptions: ${user.subscriptions.length}`);

        user.subscriptions.forEach(sub => {
            const b = sub.schoolBoard;
            console.log(` - Board: ${b.name} (ID: ${b.id})`);
            console.log(`   Location: ${b.latitude}, ${b.longitude}`);
            if (!b.latitude) console.log("   ⚠️ MISSING LOCATION DATA");
        });

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkSubs();
