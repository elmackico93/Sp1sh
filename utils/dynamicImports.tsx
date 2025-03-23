import React from "react";
import dynamic from 'next/dynamic';

const componentMap: Record<string, () => Promise<any>> = {
  FeaturedScript: () => import('../components/home/FeaturedScript'),
  EmergencyScripts: () => import('../components/home/EmergencyScripts'),
  OSTabs: () => import('../components/home/OSTabs'),
  TrendingTable: () => import('../components/home/TrendingTable'),
  CategoriesSection: () => import('../components/home/CategoriesSection'),
  QuickActions: () => import('../components/home/QuickActions')
};

export const dynamicImport = (componentName: string) => {
  if (!(componentName in componentMap)) {
    throw new Error(`Component "${componentName}" not mapped in dynamicImport.`);
  }

  return dynamic(componentMap[componentName], {
    ssr: true,
    loading: () => <div>Loading...</div>,
  });
};
