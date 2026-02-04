
import Link from 'next/link';
import { auth } from '../../auth';

export default async function Footer() {
    const session = await auth();
    const user = session?.user;

    return (
        <footer style={{
            padding: '2rem',
            textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            marginTop: '4rem',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.9rem'
        }}>
            <p>&copy; {new Date().getFullYear()} SchoolCal. All rights reserved.</p>

            {/* Subtle Admin Link */}
            {user?.role === 'ADMIN' && (
                <div style={{ marginTop: '1rem' }}>
                    <Link
                        href="/admin"
                        style={{
                            fontSize: '0.75rem',
                            color: 'rgba(255,255,255,0.1)', // Very faint
                            textDecoration: 'none',
                            cursor: 'default' // Doesn't look clickable
                        }}
                    >
                        Admin Panel
                    </Link>
                </div>
            )}
        </footer>
    );
}
