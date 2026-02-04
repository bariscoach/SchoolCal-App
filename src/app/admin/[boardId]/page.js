import { auth } from '../../../auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { addEvent, deleteEvent } from '../actions';
import styles from './styles.module.css'; // We'll make a quick style file or use inline for speed

const prisma = new PrismaClient();

export default async function BoardAdminPage({ params }) {
    const { boardId } = await params;
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/');
    }

    const board = await prisma.schoolBoard.findUnique({
        where: { id: boardId },
        include: { events: { orderBy: { date: 'asc' } } }
    });

    if (!board) return <div>Board not found</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link href="/admin" className="glass-button" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>← Back</Link>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{board.name}</h1>
            </div>

            <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px' }}>
                <h2>Add New Event</h2>
                <form action={addEvent.bind(null, board.id)} style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input name="title" placeholder="Event Title (e.g. PA Day)" required style={{ padding: '8px', color: 'black' }} />
                        <input name="date" type="date" required style={{ padding: '8px', color: 'black' }} />
                    </div>
                    <textarea name="description" placeholder="Description" style={{ padding: '8px', color: 'black' }} />

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <select name="audience" style={{ padding: '8px', color: 'black' }}>
                            <option value="ALL">Audience: ALL</option>
                            <option value="ELEMENTARY">Elementary Only</option>
                            <option value="SECONDARY">Secondary Only</option>
                        </select>
                        <label><input type="checkbox" name="isPaDay" defaultChecked /> PA Day</label>
                        <label><input type="checkbox" name="isHoliday" /> Holiday (Closed)</label>
                    </div>

                    <button type="submit" className="glass-button" style={{ width: 'fit-content', marginTop: '10px' }}>Add Event</button>
                </form>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
                <h2>Events ({board.events.length})</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                    {board.events.map(event => (
                        <div key={event.id} className="glass-card" style={{
                            padding: '15px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.05)'
                        }}>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{event.date} - {event.title} <span style={{ fontSize: '0.7rem', background: '#333', padding: '2px 6px', borderRadius: '4px' }}>{event.audience}</span></div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{event.description}</div>
                            </div>
                            <form action={deleteEvent.bind(null, event.id, board.id)}>
                                <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
                            </form>
                        </div>
                    ))}
                </div>
            </div>
            {/* Added extra padding for visual spacing */}
            <div style={{ height: '100px' }}></div>
        </div>
    );
}
