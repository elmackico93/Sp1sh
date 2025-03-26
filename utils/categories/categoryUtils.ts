import { CategoryItem } from '../../types/categories';
import { navigationMenu } from '../../components/layout/EnhancedNavbar';

/**
 * Find a category by its path
 */
export const findCategoryByPath = (path: string): CategoryItem | null => {
  // Handle home path
  if (path === '/') {
    return {
      id: 'home',
      name: 'Home',
      path: '/',
      level: 'first'
    };
  }
  
  // Check if path is a valid category path
  if (!path.startsWith('/categories/') && !path.startsWith('/emergency/')) {
    return null;
  }
  
  // Extract the category ID from the path
  const pathParts = path.split('/').filter(Boolean);
  if (pathParts.length < 2) return null;
  
  const categoryType = pathParts[0]; // 'categories' or 'emergency'
  const categoryId = pathParts[1];
  
  // Find the category in the navigation menu
  for (const firstLevelItem of navigationMenu) {
    // Check if first level item matches
    if (firstLevelItem.path === path) {
      return {
        id: categoryId,
        name: firstLevelItem.name,
        path: firstLevelItem.path,
        icon: firstLevelItem.icon,
        level: 'first',
        children: firstLevelItem.children?.map(child => ({
          id: child.path.split('/').pop() || '',
          name: child.name,
          path: child.path,
          icon: child.icon,
          level: 'second' as const,
          parentId: categoryId
        }))
      };
    }
    
    // Check second level
    for (const secondLevelItem of firstLevelItem.children || []) {
      if (secondLevelItem.path === path) {
        return {
          id: secondLevelItem.path.split('/').pop() || '',
          name: secondLevelItem.name,
          path: secondLevelItem.path,
          icon: secondLevelItem.icon,
          level: 'second',
          parentId: firstLevelItem.path.split('/').pop(),
          children: secondLevelItem.children?.map(child => ({
            id: child.path.split('/').pop() || '',
            name: child.name,
            path: child.path,
            level: 'third' as const,
            parentId: secondLevelItem.path.split('/').pop() || ''
          }))
        };
      }
      
      // Check third level
      for (const thirdLevelItem of secondLevelItem.children || []) {
        if (thirdLevelItem.path === path) {
          return {
            id: thirdLevelItem.path.split('/').pop() || '',
            name: thirdLevelItem.name,
            path: thirdLevelItem.path,
            level: 'third',
            parentId: secondLevelItem.path.split('/').pop() || ''
          };
        }
      }
    }
  }
  
  return null;
};

/**
 * Generate breadcrumbs for a category path
 */
export const generateBreadcrumbs = (path: string): { name: string; path: string }[] => {
  const breadcrumbs = [{ name: 'Home', path: '/' }];
  
  // Return early for home path
  if (path === '/') return breadcrumbs;
  
  // Extract path parts
  const pathParts = path.split('/').filter(Boolean);
  
  // Handle emergency special case
  if (pathParts[0] === 'emergency') {
    breadcrumbs.push({ name: 'Emergency', path: '/emergency' });
    
    // Add additional breadcrumbs for deeper emergency paths
    let currentPath = '/emergency';
    for (let i = 1; i < pathParts.length; i++) {
      currentPath += `/${pathParts[i]}`;
      const category = findCategoryByPath(currentPath);
      if (category) {
        breadcrumbs.push({ name: category.name, path: category.path });
      } else {
        // Fallback for paths that don't match exactly
        const name = pathParts[i]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        breadcrumbs.push({ name, path: currentPath });
      }
    }
    
    return breadcrumbs;
  }
  
  // Handle categories paths
  if (pathParts[0] === 'categories' && pathParts.length > 1) {
    // Build path progressively
    let currentPath = '';
    for (let i = 0; i < pathParts.length; i++) {
      currentPath += `/${pathParts[i]}`;
      if (i === 0) continue; // Skip adding 'categories' as a breadcrumb
      
      const category = findCategoryByPath(currentPath);
      if (category) {
        breadcrumbs.push({ name: category.name, path: category.path });
      } else {
        // Fallback for paths that don't match exactly
        const name = pathParts[i]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        breadcrumbs.push({ name, path: currentPath });
      }
    }
  }
  
  return breadcrumbs;
};

/**
 * Find a category name based on its path
 */
export const getCategoryNameFromPath = (path: string): string => {
  const category = findCategoryByPath(path);
  if (category) return category.name;
  
  // Fallback: extract from path
  const pathParts = path.split('/').filter(Boolean);
  if (pathParts.length === 0) return 'Home';
  
  const lastPart = pathParts[pathParts.length - 1];
  return lastPart
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Filter scripts by category path
 */
export const filterScriptsByCategory = (scripts: any[], categoryPath: string): any[] => {
  if (!categoryPath || categoryPath === '/') return scripts;
  
  const pathParts = categoryPath.split('/').filter(Boolean);
  if (pathParts.length === 0) return scripts;
  
  // Extract category information
  const categoryType = pathParts[0]; // 'categories' or 'emergency'
  
  // Emergency is a special case
  if (categoryType === 'emergency') {
    return scripts.filter(script => {
      // Match any script with emergency level or category
      if (script.emergencyLevel) return true;
      if (script.category === 'emergency') return true;
      
      // For deeper emergency paths, check tags and title match
      if (pathParts.length > 1) {
        const emergencySubcategory = pathParts[1];
        return script.tags.some(tag => tag.toLowerCase().includes(emergencySubcategory)) ||
               script.title.toLowerCase().includes(emergencySubcategory);
      }
      
      return false;
    });
  }
  
  // Categories case
  if (categoryType === 'categories' && pathParts.length > 1) {
    const mainCategory = pathParts[1];
    
    return scripts.filter(script => {
      // Direct category match
      if (script.category.toLowerCase() === mainCategory.toLowerCase()) {
        // For deeper paths (subcategories), filter further by tags or title
        if (pathParts.length > 2) {
          const subcategory = pathParts.slice(2).join('-');
          return script.tags.some(tag => tag.toLowerCase().includes(subcategory)) ||
                 script.title.toLowerCase().includes(subcategory);
        }
        return true;
      }
      
      return false;
    });
  }
  
  return scripts;
};
