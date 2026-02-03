'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../boards/Boards.module.css';
import BoardCard from './BoardCard';

export default function BoardSelector({ boards, initialSelectedIds }) {
    const [selectedIds, setSelectedIds] = useState(new Set(initialSelectedIds));
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Filter boards based on search
    const filteredBoards = useMemo(() => {
        if (!searchQuery) return boards;
        const lowerQ = searchQuery.toLowerCase();
        return boards.filter(board =>
            board.name.toLowerCase().includes(lowerQ) ||
            board.region.toLowerCase().includes(lowerQ)
        );
    }, [boards, searchQuery]);

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
                method: 'PUT',
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
        <div style={{ position: 'relative' }}>
            {/* Search Filter */}
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search your school board..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* List */}
            <div className={styles.list}>
                {filteredBoards.length > 0 ? (
                    filteredBoards.map(board => (
                        <BoardCard
                            key={board.id}
                            board={board}
                            isSelected={selectedIds.has(board.id)}
                            onToggle={handleToggle}
                        />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        No boards found matching "{searchQuery}"
                    </div>
                )}
            </div>

            {/* Floating Save Bar */}
            {selectedIds.size > 0 && (
                <div className={styles.floatingBar}>
                    <span className={styles.count}>
                        {selectedIds.size} selected
                    </span>
                    <button
                        onClick={handleSave}
                        className={styles.saveBtn}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    );
}
