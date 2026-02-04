
import styles from './Pricing.module.css';
import Link from 'next/link';

export default function Pricing() {
    return (
        <section id="pricing" className={styles.pricing}>
            <div className={styles.glow}></div>
            <div className={styles.content}>
                <h2 className={styles.heading}>Simple Pricing</h2>
                <p className={styles.subheading}>Less than the price of one coffee a year.</p>

                <div className={`glass-panel ${styles.card}`}>
                    <div className={styles.header}>
                        <h3 className={styles.planName}>Yearly Pass</h3>
                        <div className={styles.price}>
                            <span className={styles.currency}>$</span>
                            5.99
                            <span className={styles.period}>/year</span>
                        </div>
                    </div>

                    <ul className={styles.list}>
                        <li>✅ Unlimited School Boards</li>
                        <li>✅ Auto-Sync to iPhone & Google Cal</li>
                        <li>✅ Snow Day & Bus Predictions</li>
                        <li>✅ Elementary/Secondary Filters</li>
                    </ul>

                    <Link href="/signup" className={`glass-button ${styles.button}`}>
                        Start Subscription
                    </Link>
                    <p className={styles.guarantee}>30-day money-back guarantee</p>
                </div>
            </div>
        </section>
    );
}
