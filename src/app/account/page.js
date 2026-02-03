import styles from '../dashboard/Dashboard.module.css';
import Navbar from '../components/Navbar';
import DeleteAccount from '../components/DeleteAccount';
import { auth } from '../../auth'; // Assuming we want to show user details, else not strictly needed

export default async function AccountPage() {
    const session = await auth();
    const user = session?.user;

    return (
        <div className={styles.wrapper}>
            <Navbar />
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Account Settings</h1>
                </header>

                <div className={`glass-panel ${styles.card}`} style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Profile</h2>

                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '2rem' }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>ACCOUNT TYPE</p>
                        <p style={{ margin: 0, fontWeight: '500' }}>Google Account</p>
                        {user && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>{user.email}</p>}
                    </div>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ff4d4d' }}>Danger Zone</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
                        Deleting your account is irreversible. All your data and subscriptions will be removed immediately.
                    </p>

                    <DeleteAccount />
                </div>
            </div>
        </div>
    );
}
