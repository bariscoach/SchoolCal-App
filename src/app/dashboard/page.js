import { PrismaClient } from '@prisma/client';
import styles from './Dashboard.module.css';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { auth } from '../../auth';

const prisma = new PrismaClient();

export default async function DashboardPage() {
    // Authenticate user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return (
            <div className={styles.wrapper}>
                <Navbar />
                <div style={{ display: 'flex', height: '80vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <h2>Please Sign In</h2>
                    <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>You need an account to view your dashboard.</p>
                    <Link href="/login" className="glass-button" style={{ marginTop: '1.5rem' }}>Go to Login</Link>
                </div>
            </div>
        )
    }

    // Fetch subscriptions via database
    const subscriptions = await prisma.schoolBoardSubscription.findMany({
        where: { userId: userId },
        include: {
            schoolBoard: {
                include: { events: true }
            }
        }
    });

    let subscribedBoards = subscriptions.map(sub => sub.schoolBoard);

    // Sort and find next event
    subscribedBoards.forEach(board => {
        // Sort by date ascending
        board.events.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Find next event relative to "now"
        const today = new Date();
        const nextEvent = board.events.find(e => {
            const eventDate = new Date(e.date);
            // Compare YYYY-MM-DD
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
                            ✎ Manage Boards
                        </Link>
                    </div>

                    {subscribedBoards.length === 0 ? (
                        <div className={`glass-panel ${styles.card}`} style={{ textAlign: 'center', padding: '3rem' }}>
                            <p>You haven't subscribed to any boards yet.</p>
                            <Link href="/boards" className="glass-button" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                                Browse Schools
                            </Link>
                        </div>
                    ) : (
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
                                            href={`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(
                                                `${process.env.NEXT_PUBLIC_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://school-cal-app.vercel.app')}/api/calendar/${board.id}`
                                            )}`}
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
                    )}
                </section>
            </div>
        </div>
    );
}
