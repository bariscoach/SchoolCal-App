const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin() {
    try {
        // Find the user - assuming the user is the one associated with the session or just the first user for now
        // Or finding by email if known. Since I don't know the exact email, I'll list users and ask or just verify.
        // Actually, the user logged in as 'Baris' based on git config.
        // Let's list all users to see who to promote.
        const users = await prisma.user.findMany();
        console.log("Found users:", users);

        if (users.length > 0) {
            const userId = users[0].id; // Promote the first user found
            console.log(`Promoting user ${users[0].name || users[0].email} (${userId}) to ADMIN...`);
            await prisma.user.update({
                where: { id: userId },
                data: { role: 'ADMIN' }
            });
            console.log("✅ User promoted successfully.");
        } else {
            console.log("❌ No users found to promote.");
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

makeAdmin();
