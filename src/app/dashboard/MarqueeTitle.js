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
            >
                {text}
                {/* Duplicate text for seamless loop if using infinite scroll, 
                    OR just standard scroll. For "Back and Forth" or simple scroll, 
                    single text is usually enough with specific CSS. 
                    Let's use a simple CSS animation that translates X. */}
            </div>
        </div>
    );
}
