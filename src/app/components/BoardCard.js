'use client';

import styles from '../boards/Boards.module.css';

export default function BoardCard({ board, isSelected, onToggle }) {

    return (
        <div
            className={`glass-panel ${styles.card} ${isSelected ? styles.subscribed : ''}`}
            onClick={() => onToggle(board.id)}
            style={{ cursor: 'pointer', transition: 'all 0.2s', transform: isSelected ? 'scale(1.02)' : 'scale(1)' }}
        >
            <div
                className={styles.colorStrip}
                style={{ background: board.themeColor || '#ccc' }}
            />
            <div className={styles.cardContent}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        <h3 className={styles.boardName}>{board.name}</h3>
                        <span className={styles.region}>{board.region}</span>
                    </div>
                </div>

                <div
                    className="glass-button"
                    style={{
                        marginTop: '1rem',
                        width: '100%',
                        justifyContent: 'center',
                        background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)',
                        border: isSelected ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255,255,255,0.2)',
                        pointerEvents: 'none' // Click handled by parent card
                    }}
                >
                    {isSelected ? 'Selected ✓' : 'Select'}
                </div>
            </div>
        </div>
    );
}
