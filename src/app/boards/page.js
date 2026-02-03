
import { PrismaClient } from '@prisma/client';
import Navbar from '../components/Navbar';
import styles from './Boards.module.css';
import BoardCard from '../components/BoardCard';
import { auth } from '../../auth';

const prisma = new PrismaClient();

export default async function BoardsPage() {
    const session = await auth();
    const userId = session?.user?.id;

    const boards = await prisma.schoolBoard.findMany();

    // Fetch user subscriptions if logged in
    let subscribedBoardIds = new Set();
    if (userId) {
        const subs = await prisma.schoolBoardSubscription.findMany({
            where: { userId: userId },
            select: { schoolBoardId: true }
        });
        subscribedBoardIds = new Set(subs.map(s => s.schoolBoardId));
    }

    return (
        <div className={styles.wrapper}>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>Select Your School Board</h1>
                <p className={styles.subtitle}>Follow the boards you want to see on your dashboard.</p>

                <div className={styles.grid}>
                    {boards.map(board => (
                        <BoardCard
                            key={board.id}
                            board={board}
                            isSubscribed={subscribedBoardIds.has(board.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
