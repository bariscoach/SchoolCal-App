'use client';

import { useState } from 'react';
import getStripe from '../lib/stripe';

export default function SubscriptionWall() {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/checkout_sessions', { method: 'POST' });
            if (!res.ok) throw new Error('Checkout failed');

            const { id } = await res.json();
            const stripe = await getStripe();
            await stripe.redirectToCheckout({ sessionId: id });
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', width: '100%' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Complete Subscription 🔒</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', lineHeight: '1.6' }}>
                    You're almost there! To access your school calendars and snow day predictions,
                    please activate your yearly pass.
                </p>

                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    marginBottom: '2rem'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24' }}>$5.99 <span style={{ fontSize: '1rem', opacity: 0.8 }}>/ year</span></div>
                    <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Less than a coffee ☕</p>
                </div>

                <button
                    onClick={handleCheckout}
                    className="glass-button"
                    style={{ width: '100%', fontSize: '1.1rem', justifyContent: 'center' }}
                    disabled={loading}
                >
                    {loading ? 'Redirecting to Stripe...' : 'Activate Now →'}
                </button>
            </div>
        </div>
    );
}
