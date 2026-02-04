
import styles from './Hero.module.css';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <div className={styles.badge}>For Ontario Parents 🇨🇦</div>
                <h1 className={styles.title}>
                    Never Miss a <span className={styles.gradientText}>PA Day</span> Again
                </h1>
                <p className={styles.subtitle}>
                    Automatically sync local school holidays to your personal calendar.
                    Plan ahead for PA days, early dismissals, and inclement weather.
                </p>
                <div className={styles.ctaGroup}>
                    <Link href="/signup" className="glass-button">
                        Subscribe for $5.99/yr
                    </Link>
                    <a href="#how-it-works" className={styles.secondaryLink}>
                        How it works →
                    </a>
                </div>

            </div>

            <div className={styles.visual}>
                <div className={`glass-panel ${styles.calendarCard} float-animation`}>
                    <div className={styles.cardHeader}>
                        <span className={styles.month}>September</span>
                        <span className={styles.year}>2025</span>
                    </div>
                    <div className={styles.calendarGrid}>
                        <div className={styles.dayName}>M</div>
                        <div className={styles.dayName}>T</div>
                        <div className={styles.dayName}>W</div>
                        <div className={styles.dayName}>T</div>
                        <div className={styles.dayName}>F</div>

                        <div className={styles.day}>1</div>
                        <div className={styles.day}>2</div>
                        <div className={styles.day}>3</div>
                        <div className={styles.day}>4</div>
                        <div className={`${styles.day} ${styles.paDay}`}>
                            5
                            <div className={styles.tooltip}>PA Day</div>
                        </div>

                        {/* Abstract filler days */}
                        <div className={styles.day}>8</div>
                        <div className={styles.day}>9</div>
                        <div className={styles.day}>10</div>
                        <div className={styles.day}>11</div>
                        <div className={styles.day}>12</div>
                    </div>
                </div>

                {/* Decorative blobs */}
                <div className={`${styles.blob} ${styles.blob1}`}></div>
                <div className={`${styles.blob} ${styles.blob2}`}></div>
            </div>
        </section>
    );
}
