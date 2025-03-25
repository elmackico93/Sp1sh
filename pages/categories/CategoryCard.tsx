import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiFolder, FiExternalLink } from 'react-icons/fi';

interface CategoryCardProps {
  title: string;
  path: string;
  description?: string;
  icon?: string;
  count?: number;
  tags?: string[];
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  path,
  description = '',
  icon,
  count = 0,
  tags = [],
  variant = 'default',
  className = '',
}) => {
  // Generate dynamic styling based on variant
  const getContainerStyle = () => {
    switch (variant) {
      case 'compact':
        return 'flex flex-row items-center p-4';
      case 'featured':
        return 'flex flex-col p-6 border-2';
      default:
        return 'flex flex-col p-5';
    }
  };
  
  return (
    <motion.div
      className={`${getContainerStyle()} bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 ${className}`}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link href={path} className="group flex flex-col h-full w-full">
        <div className={`${variant === 'compact' ? 'flex items-start flex-1' : 'mb-4'}`}>
          {icon ? (
            <span className={`text-2xl ${variant === 'compact' ? 'mr-3' : 'mb-3'}`}>{icon}</span>
          ) : (
            <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary dark:text-primary-light ${variant === 'compact' ? 'mr-3' : 'mb-3'}`}>
              <FiFolder className="w-5 h-5" />
            </div>
          )}
          
          {variant === 'compact' && (
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        
        {variant !== 'compact' && (
          <>
            <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                {description}
              </p>
            )}
          </>
        )}
        
        {variant === 'featured' && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {variant !== 'compact' && (
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            {count > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {count} script{count !== 1 ? 's' : ''}
              </span>
            )}
            <span className="text-sm font-medium text-primary dark:text-primary-light flex items-center group-hover:underline">
              Browse
              <FiExternalLink className="ml-1 w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        )}
        
        {variant === 'compact' && (
          <div className="flex ml-auto">
            <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">
              {count > 0 ? `${count} scripts` : 'Browse'}
            </span>
          </div>
        )}
      </Link>
    </motion.div>
  );
};

export default CategoryCard;