// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';

/**
 * Client-side search capability is provided via the SearchClientWrapper component.
 */
export default function SearchClientWrapper() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      router.push(`/?search=${encodeURIComponent(term)}`);
    } else {
      router.push('/');
    }
  };

  return (
    <SearchBar 
      onSearch={handleSearch}
      placeholder="Searching posts or users..."
    />
  );
}