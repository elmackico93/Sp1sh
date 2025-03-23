import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Script, 
  OSType, 
  ScriptCategory, 
  EmergencyLevel,
  mockScripts,
  getScriptsByCategory,
  getScriptsByOS,
  getEmergencyScripts,
  getFeaturedScript,
  getScriptById
} from '../mocks/scripts';

type ScriptsContextType = {
  allScripts: Script[];
  featuredScript: Script | undefined;
  emergencyScripts: Script[];
  filteredScripts: Script[];
  currentOS: OSType | 'all';
  setCurrentOS: (os: OSType | 'all') => void;
  currentCategory: ScriptCategory | 'all';
  setCurrentCategory: (category: ScriptCategory | 'all') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  getScriptById: (id: string) => Script | undefined;
  isLoading: boolean;
};

const ScriptsContext = createContext<ScriptsContextType | undefined>(undefined);

export const ScriptsProvider = ({ children }: { children: ReactNode }) => {
  const [allScripts, setAllScripts] = useState<Script[]>(mockScripts);
  const [featuredScript, setFeaturedScript] = useState<Script | undefined>(undefined);
  const [emergencyScripts, setEmergencyScripts] = useState<Script[]>([]);
  const [filteredScripts, setFilteredScripts] = useState<Script[]>([]);
  const [currentOS, setCurrentOS] = useState<OSType | 'all'>('all');
  const [currentCategory, setCurrentCategory] = useState<ScriptCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API fetch on mount
  useEffect(() => {
    const fetchData = async () => {
      // In a real app, this would be an API call
      // Using setTimeout to simulate network latency
      setTimeout(() => {
        setAllScripts(mockScripts);
        setFeaturedScript(getFeaturedScript());
        setEmergencyScripts(getEmergencyScripts());
        setFilteredScripts(mockScripts);
        setIsLoading(false);
      }, 500);
    };
    
    fetchData();
  }, []);

  // Filter scripts based on OS, category and search term
  useEffect(() => {
    let filtered = [...allScripts];
    
    // Filter by OS
    if (currentOS !== 'all') {
      filtered = filtered.filter(script => 
        script.os === currentOS || script.os === 'cross-platform'
      );
    }
    
    // Filter by category
    if (currentCategory !== 'all') {
      filtered = filtered.filter(script => script.category === currentCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowercaseTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(script => 
        script.title.toLowerCase().includes(lowercaseTerm) ||
        script.description.toLowerCase().includes(lowercaseTerm) ||
        script.tags.some(tag => tag.toLowerCase().includes(lowercaseTerm))
      );
    }
    
    setFilteredScripts(filtered);
  }, [allScripts, currentOS, currentCategory, searchTerm]);

  const getScriptByIdFn = (id: string) => {
    return allScripts.find(script => script.id === id);
  };

  const value = {
    allScripts,
    featuredScript,
    emergencyScripts,
    filteredScripts,
    currentOS,
    setCurrentOS,
    currentCategory,
    setCurrentCategory,
    searchTerm,
    setSearchTerm,
    getScriptById: getScriptByIdFn,
    isLoading
  };

  return (
    <ScriptsContext.Provider value={value}>
      {children}
    </ScriptsContext.Provider>
  );
};

export const useScripts = () => {
  const context = useContext(ScriptsContext);
  if (context === undefined) {
    throw new Error('useScripts must be used within a ScriptsProvider');
  }
  return context;
};
