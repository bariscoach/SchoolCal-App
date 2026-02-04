const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function validate() {
    try {
        console.log("🔍 Finding TDSB...");
        const tdsb = await prisma.schoolBoard.findFirst({
            where: { name: 'Toronto District School Board' }
        });

        if (!tdsb) {
            console.error("❌ TDSB not found in database.");
            return;
        }
        console.log(`✅ Found TDSB (ID: ${tdsb.id})`);

        // DEBUG: Check DB events
        const dbEvents = await prisma.event.findMany({
            where: { schoolBoardId: tdsb.id },
            orderBy: { date: 'asc' }
        });
        console.log("📊 Total DB Events for TDSB:", dbEvents.length);
        const jan16 = dbEvents.find(e => e.date === '2025-01-16' || e.date === '2026-01-16');
        const jan29 = dbEvents.find(e => e.date === '2025-01-29' || e.date === '2026-01-29');
        console.log(" - DB Entry Jan 16:", jan16 ? `${jan16.date} (${jan16.audience})` : "MISSING");
        console.log(" - DB Entry Jan 29:", jan29 ? `${jan29.date} (${jan29.audience})` : "MISSING");

        // Test Data Points from Seed:
        // Jan 16, 2026 = Elementary Only
        // Jan 29, 2026 = Secondary Only

        // Validate against Production to avoid stale local server issues
        const baseUrl = `https://school-cal-app.vercel.app/api/calendar/${tdsb.id}`;

        console.log("\n🧪 Testing ELEMENTARY Feed...");
        const elemRes = await fetch(`${baseUrl}?audience=ELEMENTARY`);
        const elemIcal = await elemRes.text();

        const hasJan16 = elemIcal.includes('20260116');
        const hasJan29 = elemIcal.includes('20260129');

        console.log(`- Contains Jan 16 (Elem Date)? ${hasJan16 ? '✅ YES' : '❌ NO'}`);
        console.log(`- Contains Jan 29 (Sec Date)?  ${!hasJan29 ? '✅ NO' : '❌ YES (Should replace/hide)'}`);

        console.log("\n🧪 Testing SECONDARY Feed...");
        const secRes = await fetch(`${baseUrl}?audience=SECONDARY`);
        const secIcal = await secRes.text();

        const secHasJan16 = secIcal.includes('20260116');
        const secHasJan29 = secIcal.includes('20260129');

        console.log(`- Contains Jan 16 (Elem Date)? ${!secHasJan16 ? '✅ NO' : '❌ YES (Should replace/hide)'}`);
        console.log(`- Contains Jan 29 (Sec Date)?  ${secHasJan29 ? '✅ YES' : '❌ NO'}`);

        if (hasJan16 && !hasJan29 && !secHasJan16 && secHasJan29) {
            console.log("\n✨ SUCCESS: Filtering logic is working correctly!");
        } else {
            console.log("\n⚠️ FAILURE: Filtering logic is not behaving as expected.");
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

validate();
