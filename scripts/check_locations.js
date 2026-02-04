const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLocations() {
    try {
        const boards = await prisma.schoolBoard.findMany({
            select: { id: true, name: true, latitude: true, longitude: true }
        });

        console.log(`Found ${boards.length} boards.`);

        const boardsWithLoc = boards.filter(b => b.latitude !== null);
        console.log(`Boards with location data: ${boardsWithLoc.length}`);

        // Check for duplicates
        const nameCounts = {};
        boards.forEach(b => {
            nameCounts[b.name] = (nameCounts[b.name] || 0) + 1;
        });

        const duplicates = Object.entries(nameCounts).filter(([name, count]) => count > 1);

        if (duplicates.length > 0) {
            console.log("\n⚠️ DUPLICATE BOARDS FOUND:");
            duplicates.forEach(([name, count]) => {
                console.log(` - ${name}: ${count} entries`);
                const entries = boards.filter(b => b.name === name);
                entries.forEach(e => {
                    console.log(`   > ID: ${e.id} | Lat/Lon: ${e.latitude ?? 'NULL'}/${e.longitude ?? 'NULL'}`);
                });
            });
        } else {
            console.log("\n✅ No duplicate boards found.");
        }

        // Specifically check TDSB as it's the likely test case
        const tdsb = boards.find(b => b.name === 'Toronto District School Board');
        if (tdsb) {
            console.log(`\n🔍 TDSB Location: ${tdsb.latitude}, ${tdsb.longitude}`);
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkLocations();
