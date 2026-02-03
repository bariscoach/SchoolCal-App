
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

    // Sort and find next event
    subscribedBoards.forEach(board => {
        // Sort by date ascending
        board.events.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Find next event (Today is Feb 3, 2026)
        const today = new Date();
        // Optional: Manual override for testing if needed
        // const today = new Date('2026-02-03');

        const nextEvent = board.events.find(e => {
            const eventDate = new Date(e.date);
            // Compare YYYY-MM-DD to avoid time issues
            return eventDate.toISOString().split('T')[0] >= today.toISOString().split('T')[0];
        });

        board.nextEvent = nextEvent;
    });

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
                                    {board.nextEvent ? (
                                        <div className={styles.nextEvent}>
                                            <span style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Up Next</span>
                                            <div style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '0.2rem' }}>
                                                {board.nextEvent.title}
                                            </div>
                                            <div style={{ color: board.themeColor, marginTop: '0.2rem' }}>
                                                {new Date(board.nextEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            {board.nextEvent.isPaDay && <span style={{ display: 'inline-block', marginTop: '0.5rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', fontSize: '0.75rem' }}>PA Day</span>}
                                        </div>
                                    ) : (
                                        <p>No upcoming events.</p>
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
