import { PrismaClient } from '@prisma/client';
import DashboardClient from './DashboardClient';
import SubscriptionWall from './SubscriptionWall';
import { auth } from '../../auth';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import styles from './Dashboard.module.css';

const prisma = new PrismaClient();

export default async function DashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return (
            <div className={styles.wrapper}>
                <Navbar />
                <div style={{ display: 'flex', height: '80vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <h2>Please Sign In</h2>
                    <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>You need an account to view your dashboard.</p>
                    <Link href="/login" className="glass-button" style={{ marginTop: '1.5rem' }}>Go to Login</Link>
                </div>
            </div>
        )
    }

    // Fetch fresh user data (session might be stale)
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionStatus: true, role: true }
    });

    const isSubscribed = user?.subscriptionStatus === 'active' || user?.role === 'ADMIN';

    if (!isSubscribed) {
        return (
            <div className={styles.wrapper}>
                <Navbar />
                <SubscriptionWall />
            </div>
        );
    }

    const subscriptions = await prisma.schoolBoardSubscription.findMany({
        where: { userId: userId },
        include: {
            schoolBoard: {
                include: { events: true }
            }
        }
    });

    const subscribedBoards = subscriptions.map(sub => sub.schoolBoard);

    return (
        <div className={styles.wrapper}>
            <Navbar />
            <DashboardClient subscribedBoards={subscribedBoards} userId={userId} />
        </div>
    );
}
