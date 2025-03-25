import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiCheck, FiCode, FiFileText, FiInfo, FiServer, FiTag, FiTerminal } from 'react-icons/fi';
import { useScripts } from '../context/ScriptsContext';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-powershell';

// Form Components
import { ScriptMetadataForm } from '../components/forms/ScriptMetadataForm';
import { ScriptDetailsForm } from '../components/forms/ScriptDetailsForm';
import { ScriptTagsInput } from '../components/forms/ScriptTagsInput';
import { ScriptCodeEditor } from '../components/forms/ScriptCodeEditor';
import { ScriptPreview } from '../components/forms/ScriptPreview';

// Types
import { OSType, ScriptCategory } from '../mocks/scripts';

// Initial form state
const initialFormState = {
  title: '',
  description: '',
  os: 'linux' as OSType,
  category: 'system-admin' as ScriptCategory,
  tags: [] as string[],
  code: '#!/bin/bash\n\n# Add your script here\n\n',
  authorName: '',
  authorUsername: '',
};

export default function AddScript() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const { allScripts } = useScripts();
  const router = useRouter();

  // Apply syntax highlighting when code changes
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [formData.code, showPreview]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle OS selection
  const handleOSChange = (os: OSType) => {
    setFormData(prev => ({ ...prev, os }));
    
    // Update initial code based on OS
    if (os === 'windows' && formData.code === initialFormState.code) {
      setFormData(prev => ({ 
        ...prev, 
        code: '# PowerShell Script\n\n# Add your script here\n\n' 
      }));
    } else if (os !== 'windows' && formData.code === '# PowerShell Script\n\n# Add your script here\n\n') {
      setFormData(prev => ({ 
        ...prev, 
        code: initialFormState.code 
      }));
    }
  };

  // Handle category selection
  const handleCategoryChange = (category: ScriptCategory) => {
    setFormData(prev => ({ ...prev, category }));
  };

  // Handle tags changes
  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }));
  };

  // Handle code editor changes
  const handleCodeChange = (code: string) => {
    setFormData(prev => ({ ...prev, code }));
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }
    
    if (!formData.code.trim() || formData.code === initialFormState.code || 
        formData.code === '# PowerShell Script\n\n# Add your script here\n\n') {
      newErrors.code = 'Script content is required';
    }
    
    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Author name is required';
    }
    
    if (!formData.authorUsername.trim()) {
      newErrors.authorUsername = 'Author username is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call for script submission
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success state
      setIsSubmitted(true);
      
      // Redirect to home after a delay
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      console.error('Error submitting script:', error);
      setErrors({ submit: 'Failed to submit script. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle preview
  const togglePreview = () => {
    setShowPreview(prev => !prev);
  };

  return (
    <>
      <Head>
        <title>Add Script | Sp1sh</title>
        <meta name="description" content="Contribute a new script to the Sp1sh shell script repository." />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Contribute a Script
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Share your expertise with the community by adding a shell script to our repository.
            All scripts are reviewed for quality and security before being published.
          </p>
          
          {isSubmitted ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
              <div className="text-4xl text-green-500 dark:text-green-400 mb-4">
                <FiCheck className="mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Script Submitted Successfully!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Thank you for contributing to Sp1sh. Your script has been submitted for review.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You will be redirected to the homepage shortly...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Script Metadata Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex items-center">
                  <FiFileText className="text-primary mr-2" />
                  <h2 className="text-lg font-semibold">Script Metadata</h2>
                </div>
                <div className="p-6">
                  <ScriptMetadataForm 
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* Script Details Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex items-center">
                  <FiInfo className="text-primary mr-2" />
                  <h2 className="text-lg font-semibold">Script Details</h2>
                </div>
                <div className="p-6">
                  <ScriptDetailsForm 
                    formData={formData}
                    errors={errors}
                    onOSChange={handleOSChange}
                    onCategoryChange={handleCategoryChange}
                  />
                </div>
              </div>
              
              {/* Tags Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex items-center">
                  <FiTag className="text-primary mr-2" />
                  <h2 className="text-lg font-semibold">Tags</h2>
                </div>
                <div className="p-6">
                  <ScriptTagsInput 
                    tags={formData.tags}
                    onChange={handleTagsChange}
                    error={errors.tags}
                  />
                </div>
              </div>
              
              {/* Code Editor Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex items-center">
                  <FiCode className="text-primary mr-2" />
                  <h2 className="text-lg font-semibold">Script Code</h2>
                </div>
                <div className="p-6">
                  <ScriptCodeEditor 
                    code={formData.code}
                    onChange={handleCodeChange}
                    error={errors.code}
                    os={formData.os}
                  />
                </div>
              </div>
              
              {/* Preview Toggle */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={togglePreview}
                  className="flex items-center gap-2 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  <FiTerminal />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
              
              {/* Preview Section */}
              {showPreview && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex items-center">
                    <FiServer className="text-primary mr-2" />
                    <h2 className="text-lg font-semibold">Preview</h2>
                  </div>
                  <div className="p-6">
                    <ScriptPreview 
                      script={formData}
                      codeRef={codeRef}
                    />
                  </div>
                </div>
              )}
              
              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400 text-center">
                  {errors.submit}
                </div>
              )}
              
              {/* Submit Button */}
              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  * All scripts are reviewed before publishing
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center justify-center gap-2 py-3 px-6 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary-dark'
                  } text-white rounded-lg font-medium transition-colors`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></span>
                      Submitting...
                    </>
                  ) : (
                    <>Submit Script</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}