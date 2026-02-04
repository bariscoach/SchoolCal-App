import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function AdminPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/'); // Or 403 page
    }

    const boards = await prisma.schoolBoard.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { events: true } } }
    });

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', color: 'white' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: 'bold' }}>Admin Dashboard</h1>

            <div className="glass-panel" style={{ padding: '20px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>School Boards ({boards.length})</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                    {boards.map(board => (
                        <Link key={board.id} href={`/admin/${board.id}`} style={{ textDecoration: 'none' }}>
                            <div className="glass-card" style={{
                                padding: '15px',
                                borderLeft: `4px solid ${board.themeColor || '#ccc'}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', color: 'white' }}>{board.name}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7, color: '#ccc' }}>{board.region}</div>
                                </div>
                                <div style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    padding: '5px 10px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem'
                                }}>
                                    {board._count.events} Events
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
