import React from 'react';
import Link from 'next/link';

type ScriptTagsProps = {
  tags: string[];
};

export const ScriptTags = ({ tags }: ScriptTagsProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">Tags</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Link 
            key={tag}
            href={`/tags/${tag}`}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};
