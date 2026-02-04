'use client';

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import styles from './Checkout.module.css';

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return to dashboard with success query param
                return_url: `${window.location.origin}/dashboard?success=true`,
            },
        });

        // This only happens on error (otherwise redirect occurs)
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />

            <button
                disabled={isLoading || !stripe || !elements}
                className={`glass-button ${styles.button}`}
                id="submit"
            >
                {isLoading ? "Processing..." : "Pay $5.99 CAD"}
            </button>

            {message && <div id="payment-message" className={styles.message}>{message}</div>}
        </form>
    );
}
