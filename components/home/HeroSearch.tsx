import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useScripts } from '../../context/ScriptsContext';
import { FiSearch } from 'react-icons/fi';

export const HeroSearch = () => {
  const { setSearchTerm } = useScripts();
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchValue);
    
    // Update URL with search query
    router.push({
      pathname: '/',
      query: { search: searchValue }
    }, undefined, { shallow: true });
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for scripts, system tasks, or troubleshooting..."
          className="w-full py-3 md:py-4 px-6 md:px-8 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          aria-label="Search scripts"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 md:px-6 rounded-full text-sm md:text-base transition-colors"
        >
          <FiSearch className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default HeroSearch;