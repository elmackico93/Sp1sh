#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const checkFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      console.log(`✅ ${filePath} exists`);
      return { exists: true, content };
    } else {
      console.log(`❌ ${filePath} does not exist`);
      return { exists: false, content: null };
    }
  } catch (error) {
    console.log(`❌ Error checking ${filePath}: ${error.message}`);
    return { exists: false, content: null };
  }
};

const main = () => {
  console.log('Running Search Components Diagnostic...');
  console.log('======================================');
  
  // Check error components
  const errorFiles = [
    'components/search/errors/SearchError.tsx',
    'components/search/errors/SearchFallback.tsx',
    'components/search/errors/SearchErrorBoundary.tsx',
    'components/search/errors/index.ts'
  ];
  
  errorFiles.forEach(checkFile);
  
  // Check searchUtils.ts
  const searchUtils = checkFile('utils/searchUtils.ts');
  if (searchUtils.exists && searchUtils.content) {
    if (searchUtils.content.includes('JSX.Element')) {
      console.log('⚠️ Warning: searchUtils.ts contains JSX.Element which may cause errors');
    }
    
    if (searchUtils.content.includes('<') && searchUtils.content.includes('>')) {
      console.log('⚠️ Warning: searchUtils.ts may contain JSX syntax which can cause errors');
    }
  }
  
  // Check EnhancedSearch component
  const enhancedSearch = checkFile('components/search/EnhancedSearch.tsx');
  if (enhancedSearch.exists && enhancedSearch.content) {
    if (!enhancedSearch.content.includes('SearchError')) {
      console.log('⚠️ Warning: EnhancedSearch does not import or use SearchError');
    }
  }
  
  // Check Header component
  const header = checkFile('components/layout/Header.tsx');
  if (header.exists && header.content) {
    if (!header.content.includes('SearchErrorBoundary')) {
      console.log('⚠️ Warning: Header does not import SearchErrorBoundary');
    }
    
    if (!header.content.includes('</SearchErrorBoundary>')) {
      console.log('⚠️ Warning: EnhancedSearch is not wrapped with SearchErrorBoundary in the Header');
    }
  }
  
  console.log('======================================');
  console.log('Diagnostic complete.');
  console.log('If all files exist and no warnings are shown, your setup should be correct.');
  console.log('Try restarting your development server to apply changes.');
};

main();
