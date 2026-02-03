'use client';

import styles from '../boards/Boards.module.css';

export default function BoardCard({ board, isSelected, onToggle }) {

    return (
        <div
            className={`${styles.row} ${isSelected ? styles.selected : ''}`}
            onClick={() => onToggle(board.id)}
        >
            <div
                className={styles.colorDot}
                style={{ background: board.themeColor || '#ccc', boxShadow: `0 0 8px ${board.themeColor}66` }}
            />

            <div className={styles.rowContent}>
                <span className={styles.boardName}>{board.name}</span>
                <span className={styles.region}>{board.region}</span>
            </div>

            <div className={styles.checkbox}>
                <span className={styles.checkmark}>✓</span>
            </div>
        </div>
    );
}
