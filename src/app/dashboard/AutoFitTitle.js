'use client';

import { useState, useRef, useEffect } from 'react';

export default function AutoFitTitle({ text, baseSize = 1.25, minSize = 0.85 }) {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const checkFit = () => {
            if (containerRef.current && textRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const textWidth = textRef.current.scrollWidth;

                if (textWidth > containerWidth) {
                    const newScale = containerWidth / textWidth;
                    // Limit shrinking to minSize relative to baseSize
                    // e.g. minSize 0.8 / baseSize 1.25 = 0.64 scale
                    const minScale = minSize / baseSize;
                    setScale(Math.max(newScale, minScale));
                } else {
                    setScale(1);
                }
            }
        };

        checkFit();
        window.addEventListener('resize', checkFit);
        return () => window.removeEventListener('resize', checkFit);
    }, [text, baseSize, minSize]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center'
            }}
            title={text}
        >
            <h3
                ref={textRef}
                style={{
                    fontSize: `${baseSize}rem`,
                    margin: '0 0 0.25rem 0',
                    transform: `scale(${scale})`,
                    transformOrigin: 'left center',
                    width: 'max-content',
                    transition: 'transform 0.1s ease-out'
                }}
            >
                {text}
            </h3>
        </div>
    );
}
