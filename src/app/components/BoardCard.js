'use client';

import { useState } from 'react';
import styles from '../boards/Boards.module.css';
import { useRouter } from 'next/navigation';

export default function BoardCard({ board, isSubscribed: initialSubscribed }) {
    const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const toggleSubscription = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const method = isSubscribed ? 'DELETE' : 'POST';
            const res = await fetch('/api/subscriptions', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ boardId: board.id })
            });

            if (res.ok) {
                setIsSubscribed(!isSubscribed);
                router.refresh(); // Refresh to update dashboard/data if needed
            } else if (res.status === 401) {
                alert("Please sign in to follow boards.");
                router.push('/login');
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`glass-panel ${styles.card} ${isSubscribed ? styles.subscribed : ''}`}>
            <div
                className={styles.colorStrip}
                style={{ background: board.themeColor || '#ccc' }}
            />
            <div className={styles.cardContent}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        <h3 className={styles.boardName}>{board.name}</h3>
                        <span className={styles.region}>{board.region}</span>
                    </div>
                </div>

                <button
                    onClick={toggleSubscription}
                    disabled={loading}
                    className="glass-button"
                    style={{
                        marginTop: '1rem',
                        width: '100%',
                        justifyContent: 'center',
                        background: isSubscribed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)',
                        border: isSubscribed ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255,255,255,0.2)'
                    }}
                >
                    {loading ? '...' : (isSubscribed ? 'Following ✓' : 'Follow +')}
                </button>
            </div>
        </div>
    );
}
