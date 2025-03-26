import React, { createContext, useContext, ReactNode } from 'react';
import { findCategoryByPath, generateBreadcrumbs } from '../utils/categories/categoryUtils';
import { navigationMenu } from '../components/layout/EnhancedNavbar';
import { CategoryItem } from '../types/categories';

type NavigationContextType = {
  navigationMenu: typeof navigationMenu;
  findCategoryByPath: (path: string) => CategoryItem | null;
  getBreadcrumbs: (path: string) => { name: string; path: string }[];
  getCurrentCategory: (path: string) => CategoryItem | null;
};

const NavigationContext = createContext<NavigationContextType>({
  navigationMenu,
  findCategoryByPath,
  getBreadcrumbs: generateBreadcrumbs,
  getCurrentCategory: findCategoryByPath
});

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <NavigationContext.Provider value={{
      navigationMenu,
      findCategoryByPath,
      getBreadcrumbs: generateBreadcrumbs,
      getCurrentCategory: findCategoryByPath
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
