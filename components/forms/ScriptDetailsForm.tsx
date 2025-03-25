import React from 'react';
import { OSType, ScriptCategory } from '../../mocks/scripts';

interface ScriptDetailsFormProps {
  formData: {
    os: OSType;
    category: ScriptCategory;
  };
  errors: Record<string, string>;
  onOSChange: (os: OSType) => void;
  onCategoryChange: (category: ScriptCategory) => void;
}

export const ScriptDetailsForm: React.FC<ScriptDetailsFormProps> = ({
  formData,
  errors,
  onOSChange,
  onCategoryChange
}) => {
  const osOptions: { id: OSType; name: string; icon: string }[] = [
    { id: 'linux', name: 'Linux', icon: '🐧' },
    { id: 'windows', name: 'Windows', icon: '🪟' },
    { id: 'macos', name: 'macOS', icon: '🍎' },
    { id: 'cross-platform', name: 'Cross-Platform', icon: '🔄' }
  ];
  
  const categoryOptions: { id: ScriptCategory; name: string; icon: string }[] = [
    { id: 'system-admin', name: 'System Admin', icon: '🔧' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'networking', name: 'Networking', icon: '🌐' },
    { id: 'backup', name: 'Backup & Recovery', icon: '💾' },
    { id: 'monitoring', name: 'Monitoring', icon: '📊' },
    { id: 'maintenance', name: 'Maintenance', icon: '🧹' },
    { id: 'performance', name: 'Performance', icon: '⚡' },
    { id: 'emergency', name: 'Emergency', icon: '🚨' }
  ];

  return (
    <div className="space-y-6">
      {/* OS Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Operating System*
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {osOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onOSChange(option.id)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md border text-sm transition-colors ${
                formData.os === option.id
                  ? 'bg-primary/10 border-primary text-primary font-medium'
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650'
              }`}
            >
              <span className="text-lg">{option.icon}</span>
              <span>{option.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Script Category*
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categoryOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onCategoryChange(option.id)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md border text-sm transition-colors ${
                formData.category === option.id
                  ? 'bg-primary/10 border-primary text-primary font-medium'
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650'
              }`}
            >
              <span className="text-lg">{option.icon}</span>
              <span>{option.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Emergency Level Selection - Only shown if category is 'emergency' */}
      {formData.category === 'emergency' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Emergency Level
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-md border bg-emergency-red/10 border-emergency-red text-emergency-red font-medium"
            >
              <span className="text-lg">🔥</span>
              <span>Critical</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-md border bg-emergency-orange/10 border-emergency-orange text-emergency-orange font-medium"
            >
              <span className="text-lg">⚠️</span>
              <span>High</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-md border bg-emergency-yellow/10 border-emergency-yellow text-emergency-yellow font-medium"
            >
              <span className="text-lg">⚠️</span>
              <span>Medium</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-md border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              <span className="text-lg">ℹ️</span>
              <span>Low</span>
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Emergency scripts will be featured in the emergency section and get priority review.
          </p>
        </div>
      )}
    </div>
  );
};

export default ScriptDetailsForm;