'use client';

import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import getStripe from '../lib/stripe';
import CheckoutForm from './CheckoutForm';
import styles from './Checkout.module.css';
import Link from 'next/link';

export default function CheckoutPage() {
    const [clientSecret, setClientSecret] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Create SubscriptionIntent as soon as page loads
        fetch('/api/create-subscription', {
            method: 'POST',
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to initialize payment');
                setClientSecret(data.clientSecret);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
            });
    }, []);

    const appearance = {
        theme: 'night',
        variables: {
            colorPrimary: '#fbbf24',
            colorBackground: '#1e293b',
            colorText: '#ffffff',
        },
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div style={{ marginBottom: '1rem' }}>
                    <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.8rem' }}>
                        ← Cancel
                    </Link>
                </div>

                <h1 className={styles.title}>Secure Payment</h1>
                <p className={styles.subtitle}>Complete your yearly subscription ($5.99)</p>

                {error ? (
                    <div style={{ color: '#ef4444', textAlign: 'center' }}>
                        Error: {error}
                    </div>
                ) : (
                    clientSecret ? (
                        <Elements options={options} stripe={getStripe()}>
                            <CheckoutForm />
                        </Elements>
                    ) : (
                        <div style={{ textAlign: 'center', opacity: 0.6 }}>Preparing secure checkout...</div>
                    )
                )}

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', opacity: 0.5, gap: '10px' }}>
                    {/* Trust Badges / Icons could go here */}
                    <span style={{ fontSize: '0.75rem' }}>Powered by Stripe</span>
                </div>
            </div>
        </div>
    );
}
