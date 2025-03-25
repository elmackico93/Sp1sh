import React from 'react';

interface ScriptMetadataFormProps {
  formData: {
    title: string;
    description: string;
    authorName: string;
    authorUsername: string;
  };
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ScriptMetadataForm: React.FC<ScriptMetadataFormProps> = ({
  formData,
  errors,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Script Title*
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={onChange}
          className={`w-full px-4 py-2 rounded-md border ${
            errors.title 
              ? 'border-red-500 dark:border-red-500' 
              : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
          placeholder="e.g., Comprehensive System Health Monitor"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description*
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={4}
          className={`w-full px-4 py-2 rounded-md border ${
            errors.description 
              ? 'border-red-500 dark:border-red-500' 
              : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
          placeholder="Provide a clear description of what your script does and how it helps users..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Name*
          </label>
          <input
            type="text"
            id="authorName"
            name="authorName"
            value={formData.authorName}
            onChange={onChange}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.authorName 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
            placeholder="Your full name"
          />
          {errors.authorName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.authorName}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="authorUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username*
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              @
            </span>
            <input
              type="text"
              id="authorUsername"
              name="authorUsername"
              value={formData.authorUsername}
              onChange={onChange}
              className={`w-full pl-8 pr-4 py-2 rounded-md border ${
                errors.authorUsername 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="username"
            />
          </div>
          {errors.authorUsername && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.authorUsername}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptMetadataForm;