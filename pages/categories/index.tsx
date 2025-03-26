import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FiGrid, FiList, FiSearch, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { categories } from '../../mocks/scripts';
import { useScripts } from '../../context/ScriptsContext';
import { CategoryCard } from '../../components/categories/CategoryCard';

export default function CategoriesPage() {
  const router = useRouter();
  const { isLoading } = useScripts();
  
  return (
    <>
      <Head>
        <title>Browse Categories | Sp1sh</title>
        <meta name="description" content="Explore script categories organized by functionality, purpose, and use cases." />
        <meta name="keywords" content="shell scripts, categories, system administration, security, networking, monitoring" />
      </Head>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Script Categories
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Browse our organized collection of shell scripts for different use cases and scenarios.
              Find exactly what you need for your system administration tasks.
            </p>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        {/* Categories Grid */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            All Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CategoryCard
                  title={category.name}
                  path={`/categories/${category.id}`}
                  description={category.description}
                  icon={category.icon}
                  count={category.count}
                  tags={category.popularTags}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
