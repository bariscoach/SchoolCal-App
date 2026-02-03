
import Link from 'next/link';
import styles from './Auth.module.css';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function LoginPage() {
    return (
        <div className={styles.container}>
            <div className={`glass-panel ${styles.authCard}`}>
                <h1 className={styles.title}>Welcome Back</h1>
                <p className={styles.subtitle}>Manage your school calendars</p>

                <form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="you@example.com" className={styles.input} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="••••••••" className={styles.input} />
                    </div>

                    <button type="submit" className={`glass-button ${styles.submitBtn}`}>
                        Log In
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Or continue with</span>
                    <GoogleSignInButton />
                </div>

                <p className={styles.footer}>
                    Don't have an account? <Link href="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
