'use client';

import Link from 'next/link';
import { useState } from 'react';
import getStripe from '../lib/stripe';
import styles from './Auth.module.css';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function SignupPage() {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Create a Checkout Session
        const response = await fetch('/api/checkout_sessions', {
            method: 'POST',
        });

        if (response.status === 500) {
            console.error('Stripe error', await response.text());
            setLoading(false);
            return;
        }

        const { id } = await response.json();
        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({ sessionId: id });

        if (error) {
            console.warn(error.message);
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={`glass-panel ${styles.authCard}`}>
                <h1 className={styles.title}>Get Started</h1>
                <p className={styles.subtitle}>Subscribe to your child's school calendar</p>

                <form className={styles.form} onSubmit={handleCheckout}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" placeholder="Jane Doe" className={styles.input} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="you@example.com" className={styles.input} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="••••••••" className={styles.input} required />
                    </div>

                    <button type="submit" className={`glass-button ${styles.submitBtn}`} disabled={loading}>
                        {loading ? 'Processing...' : 'Create Account & Subscribe'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Or</span>
                    <GoogleSignInButton text="Sign up with Google" />
                </div>

                <p className={styles.footer}>
                    Already have an account? <Link href="/login">Log In</Link>
                </p>
            </div>
        </div>
    );
}
