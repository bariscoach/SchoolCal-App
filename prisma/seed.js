const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Copy of data from src/app/lib/schoolBoardData.js 
// (Since we can't ES import nicely in seed script without type:module)

const ONTARIO_HOLIDAYS_2025_2026 = [
    { title: 'Labour Day', date: '2025-09-01', description: 'Statutory Holiday', isHoliday: true },
    { title: 'Thanksgiving', date: '2025-10-13', description: 'Statutory Holiday', isHoliday: true },
    { title: 'Winter Break', date: '2025-12-22', description: 'Schools Closed', isHoliday: true },
    { title: 'Winter Break', date: '2025-12-23', description: 'Schools Closed', isHoliday: true },
    { title: 'Winter Break', date: '2025-12-24', description: 'Schools Closed', isHoliday: true },
    { title: 'Christmas Day', date: '2025-12-25', description: 'Statutory Holiday', isHoliday: true },
    { title: 'Boxing Day', date: '2025-12-26', description: 'Statutory Holiday', isHoliday: true },
    { title: 'Winter Break', date: '2025-12-29', description: 'Schools Closed', isHoliday: true },
    { title: 'Winter Break', date: '2025-12-30', description: 'Schools Closed', isHoliday: true },
    { title: 'Winter Break', date: '2025-12-31', description: 'Schools Closed', isHoliday: true },
    { title: 'New Years Day', date: '2026-01-01', description: 'Statutory Holiday', isHoliday: true },
    { title: 'Winter Break', date: '2026-01-02', description: 'Schools Closed', isHoliday: true },
    { title: 'Family Day', date: '2026-02-16', description: 'Statutory Holiday', isHoliday: true },
    { title: 'March Break', date: '2026-03-16', description: 'Schools Closed', isHoliday: true },
    { title: 'March Break', date: '2026-03-17', description: 'Schools Closed', isHoliday: true },
    { title: 'March Break', date: '2026-03-18', description: 'Schools Closed', isHoliday: true },
    { title: 'March Break', date: '2026-03-19', description: 'Schools Closed', isHoliday: true },
    { title: 'March Break', date: '2026-03-20', description: 'Schools Closed', isHoliday: true },
    { title: 'Good Friday', date: '2026-04-03', description: 'Statutory Holiday', isHoliday: true },
    { title: 'Easter Monday', date: '2026-04-06', description: 'Holiday', isHoliday: true },
    { title: 'Victoria Day', date: '2026-05-18', description: 'Statutory Holiday', isHoliday: true },
];

const BOARD_SPECIFIC_DATA = {
    'Toronto District School Board': {
        firstDay: '2025-09-02',
        lastDay: '2026-06-26',
        // Elementary: Sep 26, Oct 10, Nov 14, Jan 16, Feb 13, Jun 5, Jun 26
        // Secondary: Sep 26, Oct 10, Nov 14, Jan 29, Feb 13, Jun 25, Jun 26
        events: [
            { date: '2025-09-26', audience: 'ALL' },
            { date: '2025-10-10', audience: 'ALL' },
            { date: '2025-11-14', audience: 'ALL' },
            { date: '2026-01-16', audience: 'ELEMENTARY' },
            { date: '2026-01-29', audience: 'SECONDARY' },
            { date: '2026-02-13', audience: 'ALL' },
            { date: '2026-06-05', audience: 'ELEMENTARY' },
            { date: '2026-06-25', audience: 'SECONDARY' },
            { date: '2026-06-26', audience: 'ALL' } // Elem PA, Sec PA/Exam
        ]
    },
    'Toronto Catholic District School Board': {
        // Assuming similar to TDSB for simplicity in this iteration, will update if specific data requested
        firstDay: '2025-09-02',
        lastDay: '2026-06-26',
        events: [
            { date: '2025-09-26', audience: 'ALL' },
            { date: '2025-10-10', audience: 'ALL' },
            { date: '2025-11-14', audience: 'ALL' },
            { date: '2026-01-16', audience: 'ELEMENTARY' },
            { date: '2026-01-29', audience: 'SECONDARY' },
            { date: '2026-02-13', audience: 'ALL' },
            { date: '2026-06-05', audience: 'ELEMENTARY' },
            { date: '2026-06-25', audience: 'SECONDARY' },
            { date: '2026-06-26', audience: 'ALL' }
        ]
    },
    'York Region District School Board': {
        firstDay: '2025-09-02',
        lastDay: '2026-06-26',
        // Common: Sep 26, Oct 24, Nov 21, Jan 30, Jun 26
        // Elem: Jan 16, Jun 5
        // Sec: May 4, Jun 25
        events: [
            { date: '2025-09-26', audience: 'ALL' },
            { date: '2025-10-24', audience: 'ALL' },
            { date: '2025-11-21', audience: 'ALL' },
            { date: '2026-01-16', audience: 'ELEMENTARY' },
            { date: '2026-01-30', audience: 'ALL' },
            { date: '2026-05-04', audience: 'SECONDARY' },
            { date: '2026-06-05', audience: 'ELEMENTARY' },
            { date: '2026-06-25', audience: 'SECONDARY' },
            { date: '2026-06-26', audience: 'ALL' }
        ]
    },
    // Leaving others generic with ALL for now to save space, user asked specifically about update data capability
}

const ALL_BOARDS_CONFIG = [
    { name: 'Toronto District School Board', region: 'Toronto', themeColor: '#e11d48' },
    { name: 'Toronto Catholic District School Board', region: 'Toronto', themeColor: '#be123c' },
    { name: 'York Region District School Board', region: 'York Region', themeColor: '#7c3aed' },
    { name: 'York Catholic District School Board', region: 'York Region', themeColor: '#6d28d9' },
    { name: 'Peel District School Board', region: 'Peel Region', themeColor: '#eab308' },
    { name: 'Dufferin-Peel Catholic District School Board', region: 'Peel Region', themeColor: '#ca8a04' },
    { name: 'Durham District School Board', region: 'Durham Region', themeColor: '#2563eb' },
    { name: 'Durham Catholic District School Board', region: 'Durham Region', themeColor: '#1d4ed8' },
    { name: 'Halton District School Board', region: 'Halton Region', themeColor: '#059669' },
    { name: 'Halton Catholic District School Board', region: 'Halton Region', themeColor: '#047857' },
    { name: 'Ottawa-Carleton District School Board', region: 'Ottawa', themeColor: '#db2777' },
    { name: 'Ottawa Catholic School Board', region: 'Ottawa', themeColor: '#be185d' },
    { name: 'Waterloo Region District School Board', region: 'Waterloo', themeColor: '#65a30d' },
    { name: 'Thames Valley District School Board', region: 'London', themeColor: '#0891b2' },
    { name: 'Simcoe County District School Board', region: 'Simcoe County', themeColor: '#0284c7' },
    { name: 'District School Board of Niagara', region: 'Niagara', themeColor: '#4f46e5' },

    // Boards using generic data
    { name: 'Upper Canada District School Board', region: 'Eastern Ontario', themeColor: '#dc2626' },
    { name: 'Renfrew County District School Board', region: 'Pembroke', themeColor: '#9ca3af' },
    { name: 'London District Catholic School Board', region: 'London', themeColor: '#0e7490' },
    { name: 'Greater Essex County District School Board', region: 'Windsor', themeColor: '#ea580c' },
    { name: 'Waterloo Catholic District School Board', region: 'Waterloo', themeColor: '#4d7c0f' },
    { name: 'Hamilton-Wentworth District School Board', region: 'Hamilton', themeColor: '#d97706' },
    { name: 'Hamilton-Wentworth Catholic District School Board', region: 'Hamilton', themeColor: '#b45309' },
    { name: 'Niagara Catholic District School Board', region: 'Niagara', themeColor: '#4338ca' },
    { name: 'Simcoe Muskoka Catholic District School Board', region: 'Simcoe County', themeColor: '#0369a1' },
    { name: 'Trillium Lakelands District School Board', region: 'Muskoka', themeColor: '#16a34a' },
    { name: 'Near North District School Board', region: 'North Bay', themeColor: '#15803d' },
    { name: 'Algoma District School Board', region: 'Sault Ste. Marie', themeColor: '#b91c1c' },
    { name: 'Rainbow District School Board', region: 'Sudbury', themeColor: '#c2410c' },
    { name: 'Lakehead District School Board', region: 'Thunder Bay', themeColor: '#1d4ed8' },
    { name: 'Conseil scolaire Viamonde', region: 'Ontario (French Public)', themeColor: '#8b5cf6' },
    { name: 'Conseil scolaire catholique MonAvenir', region: 'Ontario (French Catholic)', themeColor: '#7c3aed' },
];

async function main() {
    console.log('🌱 Seeding Ontario School Boards...')

    for (const boardConfig of ALL_BOARDS_CONFIG) {
        // Upsert to avoid duplication
        const board = await prisma.schoolBoard.findFirst({ where: { name: boardConfig.name } })

        let boardEvents = [...ONTARIO_HOLIDAYS_2025_2026];
        const specificData = BOARD_SPECIFIC_DATA[boardConfig.name];

        if (specificData) {
            // Add Start/End Dates
            boardEvents.unshift({ title: 'First Day of School', date: specificData.firstDay, description: 'Classes Begin', isHoliday: false, audience: 'ALL' });
            boardEvents.push({ title: 'Last Day of School', date: specificData.lastDay, description: 'Classes End', isHoliday: false, audience: 'ALL' });

            // Add PA Days (Check if using old array or new object format)
            if (specificData.events) {
                // New Format for TDSB/YRDSB
                specificData.events.forEach(evt => {
                    boardEvents.push({
                        title: 'PA Day',
                        date: evt.date,
                        description: `Professional Activity Day (${evt.audience === 'ALL' ? 'All' : evt.audience === 'ELEMENTARY' ? 'Elementary Only' : 'Secondary Only'})`,
                        isPaDay: true,
                        isHoliday: true,
                        audience: evt.audience
                    });
                });
            } else if (specificData.paDays) {
                // Backwards compat for old array format (assumes ALL)
                specificData.paDays.forEach(date => {
                    boardEvents.push({ title: 'PA Day', date: date, description: 'Professional Activity Day', isPaDay: true, isHoliday: true, audience: 'ALL' });
                });
            }
        } else {
            // Defaults for generic boards
            boardEvents.unshift({ title: 'First Day of School', date: '2025-09-02', description: 'Classes Begin (Estimated)', isHoliday: false, audience: 'ALL' });
            boardEvents.push({ title: 'Last Day of School', date: '2026-06-26', description: 'Classes End (Estimated)', isHoliday: false, audience: 'ALL' });
        }

        if (board) {
            // For existing boards, we might want to update events.
            // But simple create-only logic keeps this script safe.
            // We can delete events for this board and re-create them if we want to force update.
            console.log(`Updating ${boardConfig.name}...`);
            // Clear old events
            await prisma.event.deleteMany({ where: { schoolBoardId: board.id } });

            await prisma.schoolBoard.update({
                where: { id: board.id },
                data: {
                    themeColor: boardConfig.themeColor,
                    events: {
                        create: boardEvents
                    }
                }
            })
        } else {
            await prisma.schoolBoard.create({
                data: {
                    name: boardConfig.name,
                    region: boardConfig.region,
                    themeColor: boardConfig.themeColor,
                    events: {
                        create: boardEvents
                    }
                }
            })
            console.log(`Created ${boardConfig.name}`)
        }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
