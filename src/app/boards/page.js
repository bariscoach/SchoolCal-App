
import { PrismaClient } from '@prisma/client';
import Navbar from '../components/Navbar';
import styles from './Boards.module.css';
import BoardSelector from '../components/BoardSelector';
import { auth } from '../../auth';

const prisma = new PrismaClient();

export default async function BoardsPage() {
    const session = await auth();
    const userId = session?.user?.id;

    const boards = await prisma.schoolBoard.findMany();

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
                <h1 className={styles.title}>Select Your School Boards</h1>
                <p className={styles.subtitle}>Click to select the boards you want to follow, then click <strong>Save</strong>.</p>

                <BoardSelector
                    boards={boards}
                    initialSelectedIds={initialSelectedIds}
                />
            </div>
        </div>
    );
}
