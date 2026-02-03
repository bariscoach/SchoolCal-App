
import { PrismaClient } from '@prisma/client';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import styles from './Boards.module.css';

const prisma = new PrismaClient();

export default async function BoardsPage() {
    const boards = await prisma.schoolBoard.findMany();

    return (
        <div className={styles.wrapper}>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>Select Your School Board</h1>
                <p className={styles.subtitle}>Choose a board to view its calendar</p>

                <div className={styles.grid}>
                    {boards.map(board => (
                        <Link key={board.id} href={`/dashboard?boardId=${board.id}`} className={`glass-panel ${styles.card}`}>
                            <div
                                className={styles.colorStrip}
                                style={{ background: board.themeColor || '#ccc' }}
                            />
                            <div className={styles.cardContent}>
                                <h3 className={styles.boardName}>{board.name}</h3>
                                <span className={styles.region}>{board.region}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
