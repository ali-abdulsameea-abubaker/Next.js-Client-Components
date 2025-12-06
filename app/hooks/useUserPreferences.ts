// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

'use client';

import { useState, useEffect } from 'react';

interface UserPreferences {
  theme: 'dark' | 'light';
  itemsPerPage: number;
  autoRefresh: boolean;
  defaultCategory: string;
}

/**
 * Personalized hook for controlling user preferences
 */
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'dark',
    itemsPerPage: 10,
    autoRefresh: true,
    defaultCategory: 'all'
  });

  useEffect(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    localStorage.setItem('userPreferences', JSON.stringify(updated));
  };

  return { preferences, updatePreferences };
};