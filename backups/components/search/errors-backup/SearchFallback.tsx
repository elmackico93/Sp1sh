import React from 'react';
import { useRouter } from 'next/router';
import { FiSearch } from 'react-icons/fi';

const SearchFallback: React.FC = () => {
  const router = useRouter();

  const handleBasicSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const searchTerm = formData.get('search') as string;
    
    if (searchTerm) {
      router.push({
        pathname: '/',
        query: { search: searchTerm }
      });
    }
  };

  return (
    <form onSubmit={handleBasicSearch} className="w-full">
      <div className="relative">
        <input
          type="text"
          name="search"
          placeholder="Search for scripts..."
          className="w-full py-2 pl-10 pr-4 text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          aria-label="Search"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
          <FiSearch />
        </span>
      </div>
    </form>
  );
};

export default SearchFallback;
