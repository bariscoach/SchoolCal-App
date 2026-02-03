
import { PrismaClient } from '@prisma/client';
import styles from './Dashboard.module.css';
import Navbar from '../components/Navbar';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function DashboardPage({ searchParams }) {
    // Mock user ID for now as we don't have full auth session check without keys
    // In real app: const session = await auth(); const userId = session.user.id;

    // If ?boardId is present, subscribed flow (mock)
    const params = await searchParams;
    const { boardId } = params || {};

    let subscribedBoards = [];

    if (boardId) {
        const newBoard = await prisma.schoolBoard.findUnique({
            where: { id: boardId },
            include: { events: true }
        });
        if (newBoard) subscribedBoards.push(newBoard);
    } else {
        // Default: show all available boards for demo if none selected
        // In real app, fetch from User.subscriptions
        subscribedBoards = await prisma.schoolBoard.findMany({
            include: { events: true }
        });
    }

    return (
        <div className={styles.wrapper}>
            <Navbar />
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>My Dashboard</h1>
                    <div className={styles.status}>
                        <span className={styles.statusLabel}>Subscription:</span>
                        <span className={styles.statusValue}>Active (Yearly)</span>
                    </div>
                </header>

                <section className={styles.section}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2>My Calendars</h2>
                        <Link href="/boards" className="glass-button" style={{ fontSize: '0.9rem' }}>
                            + Add Board
                        </Link>
                    </div>

                    <div className={styles.grid}>
                        {subscribedBoards.map(board => (
                            <div key={board.id} className={`glass-panel ${styles.card}`}>
                                <div className={styles.cardHeader}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: board.themeColor }}></div>
                                        <h3>{board.name}</h3>
                                    </div>
                                    <span className={styles.region}>{board.region}</span>
                                </div>
                                <div className={styles.eventsPreview}>
                                    <p><strong>{board.events.length}</strong> events synced.</p>
                                    {board.events.length > 0 && (
                                        <div className={styles.nextEvent}>
                                            Next: {board.events[0].title} on {board.events[0].date}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.actions}>
                                    <a
                                        href={`https://calendar.google.com/calendar/r?cid=${process.env.NEXT_PUBLIC_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://school-cal-app.vercel.app')}/api/calendar/${board.id}`}
                                        target="_blank"
                                        className={`glass-button ${styles.btnPrimary}`}
                                    >
                                        Add to Google Calendar
                                    </a>
                                    <a href={`/api/calendar/${board.id}`} className={styles.btnSecondary}>
                                        Download .ics
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
