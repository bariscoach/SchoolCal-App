
import styles from './Features.module.css';

export default function Features() {
    const features = [
        {
            icon: "📅",
            title: "Auto-Sync Calendar",
            description: "One-click connection to Google Calendar, Outlook, and iPhone. Dates update automatically."
        },
        {
            icon: "❄️",
            title: "Snow Day Predictor",
            description: "Check the odds of bus cancellations and school closures based on real-time weather data."
        },
        {
            icon: "🎒",
            title: "Audience Filtering",
            description: "Only see what matters. Filter for Elementary or Secondary school events instantly."
        }
    ];

    return (
        <section id="features" className={styles.features}>
            <h2 className={styles.heading}>Why Parents Love SchoolCal</h2>
            <div className={styles.grid}>
                {features.map((f, i) => (
                    <div key={i} className={`glass-panel ${styles.card}`}>
                        <div className={styles.icon}>{f.icon}</div>
                        <h3 className={styles.title}>{f.title}</h3>
                        <p className={styles.description}>{f.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
