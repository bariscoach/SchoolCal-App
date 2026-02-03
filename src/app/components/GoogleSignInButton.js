
'use client';

import { signIn } from 'next-auth/react';

export default function GoogleSignInButton({ text = "Sign in with Google" }) {
    return (
        <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="glass-button"
            style={{
                width: '100%',
                marginTop: '1rem',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem'
            }}
        >
            <span>🇬</span> {text}
        </button>
    );
}
