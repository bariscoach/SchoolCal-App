
import Link from 'next/link';
import { auth } from '../../auth'; // Adjust import path based on file structure
import ProfileDropdown from './ProfileDropdown';
import styles from './Navbar.module.css';

export default async function Navbar() {
    const session = await auth();
    const user = session?.user;

    return (
        <nav className={`glass-panel ${styles.nav}`}>
            <div className={styles.logo}>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={styles.logoIcon}>📅</span>
                    SchoolCal
                </Link>
            </div>
            <div className={styles.links}>
                <a href="/#features">Features</a>
                <a href="/#how-it-works">How it Works</a>
                <a href="/#pricing">Pricing</a>
            </div>
            <div className={styles.actions}>
                {user ? (
                    <ProfileDropdown user={user} />
                ) : (
                    <>
                        <Link href="/login" className={styles.loginBtn}>Login</Link>
                        <Link href="/signup" className="glass-button">Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
