'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <h1>ExpertChat System</h1>
        </Link>
        <div className={styles.rightSection}>
          {session ? (
            <>
              <div className={styles.userInfo} onClick={() => setShowMenu(!showMenu)}>
                <span className={styles.userRole}>{session.user.role}</span>
                <div className={styles.userName}>{session.user.name}</div>
                <div className={styles.userAvatar}>
                  {session.user.name ? session.user.name[0].toUpperCase() : 'U'}
                </div>
                {showMenu && (
                  <div className={styles.userMenu}>
                    <div className={styles.userMenuHeader}>
                      <div className={styles.userMenuName}>{session.user.name}</div>
                      <div className={styles.userMenuEmail}>{session.user.email}</div>
                    </div>
                    <Link href={`/${session.user.role}-dashboard`} className={styles.userMenuItem}>
                      Dashboard
                    </Link>
                    <Link href="/profile" className={styles.userMenuItem}>
                      Profile
                    </Link>
                    <button onClick={handleSignOut} className={styles.userMenuItem}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
              <div className={styles.notificationBell}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
            </>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
