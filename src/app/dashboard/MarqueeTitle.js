'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './Dashboard.module.css';

export default function MarqueeTitle({ text }) {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current && textRef.current) {
                // If text width > container width, enable marquee
                setIsOverflowing(textRef.current.scrollWidth > containerRef.current.clientWidth);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [text]);

    return (
        <div
            ref={containerRef}
            className={styles.marqueeContainer}
            title={text}
        >
            <div
                ref={textRef}
                className={isOverflowing ? styles.marqueeContent : ''}
                style={isOverflowing ? { minWidth: '100%', display: 'flex', gap: '2rem' } : {}}
            >
                {/* Primary Text */}
                <span>{text}</span>

                {/* Duplicate for seamless loop if overflowing */}
                {isOverflowing && <span aria-hidden="true">{text}</span>}
            </div>
        </div>
    );
}
