import React, { useEffect, useState } from 'react';
import { measureRenderPerformance } from '../../utils/renderStrategy';

interface PerformanceMetrics {
  FCP: number;
  TTI: number;
  LCP: number;
}

interface PerformanceReportProps {
  showInProduction?: boolean;
}

export const PerformanceReport: React.FC<PerformanceReportProps> = ({ 
  showInProduction = false 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Only show in development or if explicitly allowed in production
    const isDevEnvironment = process.env.NODE_ENV === 'development';
    if (!isDevEnvironment && !showInProduction) {
      return;
    }
    
    // Start measuring performance
    const performanceMetrics = measureRenderPerformance();
    
    // Wait for metrics to be collected
    const timer = setTimeout(() => {
      setMetrics(performanceMetrics);
      setVisible(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [showInProduction]);
  
  if (!visible) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 text-xs z-50 opacity-80 hover:opacity-100 transition-opacity">
      <h4 className="font-bold mb-2 flex justify-between items-center">
        <span>Performance Metrics</span>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </h4>
      {metrics ? (
        <ul className="space-y-1">
          <li className="flex justify-between">
            <span>First Contentful Paint:</span>
            <span className={`font-mono ${metrics.FCP < 1000 ? 'text-green-500' : metrics.FCP < 2500 ? 'text-yellow-500' : 'text-red-500'}`}>
              {metrics.FCP.toFixed(1)} ms
            </span>
          </li>
          <li className="flex justify-between">
            <span>Time to Interactive:</span>
            <span className={`font-mono ${metrics.TTI < 3500 ? 'text-green-500' : metrics.TTI < 7500 ? 'text-yellow-500' : 'text-red-500'}`}>
              {metrics.TTI.toFixed(1)} ms
            </span>
          </li>
          <li className="flex justify-between">
            <span>Largest Contentful Paint:</span>
            <span className={`font-mono ${metrics.LCP < 2500 ? 'text-green-500' : metrics.LCP < 4000 ? 'text-yellow-500' : 'text-red-500'}`}>
              {metrics.LCP.toFixed(1)} ms
            </span>
          </li>
        </ul>
      ) : (
        <p>Collecting metrics...</p>
      )}
    </div>
  );
};

export default PerformanceReport;
