'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import styles from './Navbar.module.css'; // We'll reuse/extend Navbar styles or add inline for simplicity

export default function ProfileDropdown({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className={styles.profileWrapper} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={styles.profileButton}
            >
                {user.image ? (
                    <img src={user.image} alt="Profile" className={styles.avatar} />
                ) : (
                    <div className={styles.initials}>{getInitials(user.name)}</div>
                )}
            </button>

            {isOpen && (
                <div className={`glass-panel ${styles.dropdown}`}>
                    <div className={styles.userInfo}>
                        <p className={styles.userName}>{user.name}</p>
                        <p className={styles.userEmail}>{user.email}</p>
                    </div>
                    <hr className={styles.divider} />
                    <Link href="/dashboard" className={styles.menuItem} onClick={() => setIsOpen(false)}>
                        Dashboard
                    </Link>
                    <Link href="/subscription" className={styles.menuItem} onClick={() => setIsOpen(false)}>
                        Subscription
                    </Link>
                    <Link href="/account" className={styles.menuItem} onClick={() => setIsOpen(false)}>
                        Account Settings
                    </Link>
                    <hr className={styles.divider} />
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className={`${styles.menuItem} ${styles.signOut}`}
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}
