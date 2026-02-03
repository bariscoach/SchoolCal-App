
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={`glass-panel ${styles.nav}`}>
            <div className={styles.logo}>
                <span className={styles.logoIcon}>📅</span>
                SchoolCal
            </div>
            <div className={styles.links}>
                <a href="#features">Features</a>
                <a href="#how-it-works">How it Works</a>
                <a href="#pricing">Pricing</a>
            </div>
            <div className={styles.actions}>
                <Link href="/login" className={styles.loginBtn}>Login</Link>
                <Link href="/signup" className="glass-button">Get Started</Link>
            </div>
        </nav>
    );
}
