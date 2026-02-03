
import { PrismaClient } from '@prisma/client';
import Navbar from '../components/Navbar';
import styles from './Boards.module.css';
import BoardSelector from '../components/BoardSelector';
import { auth } from '../../auth';

const prisma = new PrismaClient();

export default async function BoardsPage() {
    const session = await auth();
    const userId = session?.user?.id;

    const boards = await prisma.schoolBoard.findMany({
        orderBy: { name: 'asc' }
    });

    // Fetch user subscriptions if logged in
    let initialSelectedIds = [];
    if (userId) {
        const subs = await prisma.schoolBoardSubscription.findMany({
            where: { userId: userId },
            select: { schoolBoardId: true }
        });
        initialSelectedIds = subs.map(s => s.schoolBoardId);
    }

    return (
        <div className={styles.wrapper}>
            <Navbar />
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Select Your School Boards</h1>
                    <p className={styles.subtitle}>Follow the boards you want to see on your dashboard.</p>
                </header>

                <BoardSelector
                    boards={boards}
                    initialSelectedIds={initialSelectedIds}
                />
            </div>
        </div>
    );
}
