'use client';

import { useState } from 'react';
import Link from 'next/link';
import WeatherWidget from './WeatherWidget';
import styles from './Dashboard.module.css';

export default function DashboardClient({ subscribedBoards, userId }) {
    const [level, setLevel] = useState('ALL'); // ALL, ELEMENTARY, SECONDARY

    // Filter events based on level
    const filteredBoards = subscribedBoards.map(board => {
        const filteredEvents = board.events.filter(e =>
            e.audience === 'ALL' || e.audience === level || level === 'ALL'
        );

        // Recalculate next event based on filter
        filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

        const today = new Date();
        const nextEvent = filteredEvents.find(e => {
            const eventDate = new Date(e.date);
            return eventDate.toISOString().split('T')[0] >= today.toISOString().split('T')[0];
        });

        return { ...board, events: filteredEvents, nextEvent };
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>My Dashboard</h1>
                    <div className={styles.status}>
                        <span className={styles.statusLabel}>Subscription:</span>
                        <span className={styles.statusValue}>Active (Yearly)</span>
                    </div>

                    {/* Level Toggle */}
                    <div style={{ marginTop: '1.5rem', display: 'inline-flex', background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '50px' }}>
                        {['ALL', 'ELEMENTARY', 'SECONDARY'].map(l => (
                            <button
                                key={l}
                                onClick={() => setLevel(l)}
                                style={{
                                    padding: '0.5rem 1.2rem',
                                    borderRadius: '40px',
                                    border: 'none',
                                    background: level === l ? 'white' : 'transparent',
                                    color: level === l ? '#0f172a' : 'rgba(255,255,255,0.6)',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {l.charAt(0) + l.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </header>

                <section className={styles.section}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2>My Calendars</h2>
                        <Link href="/boards" className="glass-button" style={{ fontSize: '0.9rem' }}>
                            ✎ Manage Boards
                        </Link>
                    </div>

                    {filteredBoards.length === 0 ? (
                        <div className={`glass-panel ${styles.card}`} style={{ textAlign: 'center', padding: '3rem' }}>
                            <p>You haven't subscribed to any boards yet.</p>
                            <Link href="/boards" className="glass-button" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                                Browse Schools
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {filteredBoards.map(board => (
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
                                                {board.nextEvent.audience !== 'ALL' && <span style={{ display: 'inline-block', marginTop: '0.5rem', marginLeft: '0.5rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', fontSize: '0.75rem' }}>{board.nextEvent.audience.charAt(0) + board.nextEvent.audience.slice(1).toLowerCase()} Only</span>}
                                            </div>
                                        ) : (
                                            <p>No upcoming events.</p>
                                        )}
                                    </div>
                                    <div className={styles.actions}>
                                        <a
                                            href={`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(
                                                `https://school-cal-app.vercel.app/api/calendar/${board.id}?audience=${level}`
                                            )}`}
                                            target="_blank"
                                            className={`glass-button ${styles.btnPrimary}`}
                                        >
                                            Add to Google Calendar
                                        </a>
                                        <a href={`/api/calendar/${board.id}?audience=${level}`} className={styles.btnSecondary}>
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
