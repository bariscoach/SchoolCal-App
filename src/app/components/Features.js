
import styles from './Features.module.css';

export default function Features() {
    const features = [
        {
            icon: "📅",
            title: "Auto-Sync Calendar",
            description: "One-click integration with Google Calendar, Outlook, and Apple Calendar (iCal). Updates automatically."
        },
        {
            icon: "🔔",
            title: "Smart Notifications",
            description: "Get reminded 1 day before every PA Day, school holiday, or early dismissal."
        },
        {
            icon: "🏫",
            title: "Multi-Board Support",
            description: "We track all school boards in Ontario. Multiple kids in different boards? No problem."
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
