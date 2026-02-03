'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';

export default function DeleteAccount() {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure? This will delete your account and all subscriptions permanently.")) return;

        setIsDeleting(true);
        try {
            const res = await fetch('/api/user', { method: 'DELETE' });
            if (res.ok) {
                await signOut({ callbackUrl: '/' });
            } else {
                alert("Failed to delete account. Please try again.");
                setIsDeleting(false);
            }
        } catch (e) {
            console.error(e);
            alert("An error occurred.");
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDeleteAccount}
            style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(220, 38, 38, 0.2)',
                border: '1px solid rgba(220, 38, 38, 0.5)',
                color: '#fca5a5',
                borderRadius: '8px',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s'
            }}
            disabled={isDeleting}
        >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
        </button>
    );
}
