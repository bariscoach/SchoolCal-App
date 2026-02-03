import styles from '../dashboard/Dashboard.module.css'; // Reusing dashboard styles for consistency
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function SubscriptionPage() {
    return (
        <div className={styles.wrapper}>
            <Navbar />
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Subscription Management</h1>
                </header>

                <div className={`glass-panel ${styles.card}`} style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Current Plan</h2>
                            <span className={styles.statusValue} style={{ fontSize: '1rem' }}>Active (Yearly)</span>
                        </div>
                        <div style={{ fontSize: '2rem' }}>📅</div>
                    </div>

                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '2rem' }}>
                        You have full access to all school calendars and events. Your subscription helps support independent development!
                    </p>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <button className="glass-button" style={{ width: '100%', justifyContent: 'center' }} disabled>
                            Manage on Stripe (Coming Soon)
                        </button>
                        <Link href="/dashboard" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
