'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { searchExperts, getExpertsBySpecialty } from '../lib/auth-options';
import styles from '../styles/ExpertSearch.module.css';
import Link from 'next/link';

export default function ExpertSearch() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [experts, setExperts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const specialties = [
    'Cardiology',
    'Mental Health',
    'Nutrition',
    'Neurology',
    'Dermatology',
    'Pain Management',
    'Health',
    'Anxiety Management',
    'Physical Therapy',
    'Weight Management'
  ];

  useEffect(() => {
    if (selectedSpecialty) {
      setExperts(getExpertsBySpecialty(selectedSpecialty));
    } else if (searchTerm.trim()) {
      setExperts(searchExperts(searchTerm));
    } else {
      // Show some default experts
      setExperts(getExpertsBySpecialty(''));
    }
  }, [searchTerm, selectedSpecialty]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // If we're searching by text, clear specialty filter
    if (e.target.value.trim()) {
      setSelectedSpecialty('');
    }
  };

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialty(specialty);
    // If we're selecting a specialty, clear search text
    setSearchTerm('');
  };

  const startChat = (expertId) => {
    // This would normally navigate to the chat or open a chat window
    console.log(`Starting chat with expert ID: ${expertId}`);
  };

  return (
    <div className={styles.expertSearchContainer}>
      <div className={styles.searchHeader}>
        <h2>Find an Expert</h2>
        <p className={styles.searchDescription}>
          Connect with specialists in various fields to get the help you need
        </p>
      </div>

      <div className={styles.searchControls}>
        <div className={styles.searchInputContainer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.searchIcon}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search experts by name or specialty..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.specialtyFilter}>
          <div className={styles.specialtyLabel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.filterIcon}
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span>Filter by specialty:</span>
          </div>
          <div className={styles.specialtyTags}>
            {specialties.map(specialty => (
              <button
                key={specialty}
                className={`${styles.specialtyTag} ${
                  selectedSpecialty === specialty ? styles.active : ''
                }`}
                onClick={() => handleSpecialtyChange(specialty)}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.expertsGrid}>
        {experts.length > 0 ? (
          experts.map(expert => (
            <div key={expert.id} className={styles.expertCard}>
              <div className={styles.expertAvatar}>
                {expert.name ? expert.name[0].toUpperCase() : 'E'}
              </div>
              <h3 className={styles.expertName}>{expert.name}</h3>
              <div className={styles.expertSpecialties}>
                {expert.specialties.map(specialty => (
                  <span key={specialty} className={styles.expertSpecialty}>
                    {specialty}
                  </span>
                ))}
              </div>
              <p className={styles.expertEmail}>{expert.email}</p>

              {session ? (
                <button
                  className={styles.chatButton}
                  onClick={() => startChat(expert.id)}
                >
                  Start Consultation
                </button>
              ) : (
                <Link href="/login" className={styles.loginButton}>
                  Log in to consult
                </Link>
              )}
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            <p>No experts found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
