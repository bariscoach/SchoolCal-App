
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Clear existing data (optional, be careful)
    // await prisma.event.deleteMany()
    // await prisma.schoolBoard.deleteMany()

    const tdsb = await prisma.schoolBoard.create({
        data: {
            name: 'Toronto District School Board',
            region: 'Toronto',
            themeColor: '#e11d48', // Rose 600
            events: {
                create: [
                    { title: 'First Day of School', date: '2025-09-02', description: 'School year begins' },
                    { title: 'PA Day', date: '2025-09-26', isPaDay: true },
                    { title: 'Thanksgiving', date: '2025-10-13', isHoliday: true },
                    { title: 'PA Day', date: '2025-11-14', isPaDay: true },
                    { title: 'Winter Break Start', date: '2025-12-22', isHoliday: true },
                    { title: 'PA Day', date: '2026-01-16', isPaDay: true },
                ]
            }
        }
    })

    const yrdsb = await prisma.schoolBoard.create({
        data: {
            name: 'York Region District School Board',
            region: 'York Region',
            themeColor: '#7c3aed', // Violet 600
            events: {
                create: [
                    { title: 'First Day of School', date: '2025-09-03', description: 'Classes start' },
                    { title: 'PA Day', date: '2025-09-22', isPaDay: true },
                    { title: 'Thanksgiving', date: '2025-10-13', isHoliday: true },
                    { title: 'PA Day', date: '2025-10-24', isPaDay: true },
                    { title: 'Winter Break Start', date: '2025-12-22', isHoliday: true },
                ]
            }
        }
    })

    const pdsb = await prisma.schoolBoard.create({
        data: {
            name: 'Peel District School Board',
            region: 'Peel Region',
            themeColor: '#eab308', // Yellow 500
            events: {
                create: [
                    { title: 'First Day of School', date: '2025-09-02' },
                    { title: 'PA Day', date: '2025-09-19', isPaDay: true },
                    { title: 'PA Day', date: '2025-10-06', isPaDay: true }
                ]
            }
        }
    })

    console.log({ tdsb, yrdsb, pdsb })
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
