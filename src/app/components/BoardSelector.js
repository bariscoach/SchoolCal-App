'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../boards/Boards.module.css';
import BoardCard from './BoardCard';

export default function BoardSelector({ boards, initialSelectedIds }) {
    const [selectedIds, setSelectedIds] = useState(new Set(initialSelectedIds));
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggle = (boardId) => {
        const next = new Set(selectedIds);
        if (next.has(boardId)) {
            next.delete(boardId);
        } else {
            next.add(boardId);
        }
        setSelectedIds(next);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/subscriptions', {
                method: 'PUT', // Batch replace
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ boardIds: Array.from(selectedIds) })
            });

            if (res.ok) {
                router.push('/dashboard');
                router.refresh();
            } else if (res.status === 401) {
                alert("Please sign in to save subscriptions.");
                router.push('/login');
            } else {
                alert("Failed to save. Please try again.");
            }
        } catch (e) {
            console.error(e);
            alert("Network error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className={styles.grid} style={{ marginBottom: '5rem' }}>
                {boards.map(board => (
                    <BoardCard
                        key={board.id}
                        board={board}
                        isSelected={selectedIds.has(board.id)}
                        onToggle={handleToggle}
                    />
                ))}
            </div>

            {/* Floating Save Bar */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1.5rem',
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                zIndex: 100
            }}>
                <span style={{ color: 'white', marginRight: '1rem' }}>
                    {selectedIds.size} boards selected
                </span>
                <button
                    onClick={handleSave}
                    className="glass-button"
                    disabled={loading}
                    style={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        border: 'none',
                        color: 'white',
                        fontWeight: '600',
                        padding: '0.8rem 2rem'
                    }}
                >
                    {loading ? 'Saving...' : 'Save & Continue'}
                </button>
            </div>
        </div>
    );
}
