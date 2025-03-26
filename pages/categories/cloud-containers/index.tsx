// pages/categories/cloud-containers/index.tsx
import { useEffect } from 'react';
import Link from 'next/link';
import { FiCloud, FiBox, FiLayers, FiDatabase, FiUploadCloud, FiPackage, FiZap, FiShield } from 'react-icons/fi';
import { useScripts } from '../../../context/ScriptsContext';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';
import { ScriptCard } from '../../../components/scripts/ScriptCard';
import { motion } from 'framer-motion';

const subcategories = [
  {
    id: 'container-management',
    name: 'Container Management',
    icon: <FiBox className="w-6 h-6" />,
    description: 'Scripts for managing containers, orchestration, and deployment (Docker, Kubernetes).',
    path: '/categories/cloud-containers/container-management'
  },
  {
    id: 'cloud-operations',
    name: 'Cloud Operations',
    icon: <FiCloud className="w-6 h-6" />,
    description: 'Automate cloud deployments, resource scaling, and infrastructure management.',
    path: '/categories/cloud-containers/cloud-operations'
  },
  {
    id: 'serverless-functions',
    name: 'Serverless Functions',
    icon: <FiUploadCloud className="w-6 h-6" />,
    description: 'Deploy and manage serverless functions and event-driven architectures.',
    path: '/categories/cloud-containers/serverless-functions'
  },
  {
    id: 'storage-databases',
    name: 'Storage & Databases',
    icon: <FiDatabase className="w-6 h-6" />,
    description: 'Manage databases, backups, data migrations, and cloud storage solutions.',
    path: '/categories/cloud-containers/storage-databases'
  }
];

export default function CloudContainersPage() {
  const { setCurrentCategory, allScripts, isLoading } = useScripts();

  useEffect(() => {
    setCurrentCategory('cloud-containers');
  }, [setCurrentCategory]);

  const popularScripts = allScripts
    .filter(script => script.category === 'cloud-containers')
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 3);

  if (isLoading) return <LoadingPlaceholder />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section - Alternative Concept */}
      <section className="relative bg-gray-50 dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700 mb-12 overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white mb-4">
            Master Cloud & Container Automation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Build and manage scalable systems across cloud providers with modern automation. Our curated scripts support cloud-native tools like Docker, Kubernetes, and serverless workflows.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/platforms/aws" className="inline-block px-5 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              Explore AWS
            </Link>
            <Link href="/platforms/kubernetes" className="inline-block px-5 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              Kubernetes Tools
            </Link>
            <Link href="/add-script" className="inline-block px-5 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark">
              + Submit Your Script
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 z-0 bg-[url('/images/cloud-bg-pattern.svg')] bg-cover bg-center" aria-hidden="true"></div>
      </section>

      {/* Subcategories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Cloud Containers Areas</h2>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subcategories.map(({ id, name, icon, description, path }) => (
            <motion.div
              key={id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <Link href={path} className="flex">
                <div className="mr-4 flex-shrink-0">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary dark:text-primary-light">
                    {icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Popular Scripts Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Popular Cloud Scripts</h2>
          <Link href="/categories/cloud-containers/all" className="text-sm text-primary dark:text-primary-light hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularScripts.map(script => <ScriptCard key={script.id} script={script} />)}
        </div>
      </section>

      {/* Tips Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Best Practices for Cloud Scripts</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <ul className="space-y-4">
            <li className="flex items-start">
              <FiZap className="mr-3 text-primary dark:text-primary-light" />
              <span>Use environment variables for secure credentials and sensitive config values.</span>
            </li>
            <li className="flex items-start">
              <FiZap className="mr-3 text-primary dark:text-primary-light" />
              <span>Design idempotent scripts to avoid duplicate resources or inconsistent states.</span>
            </li>
            <li className="flex items-start">
              <FiZap className="mr-3 text-primary dark:text-primary-light" />
              <span>Test automation in sandbox environments before pushing to production.</span>
            </li>
            <li className="flex items-start">
              <FiZap className="mr-3 text-primary dark:text-primary-light" />
              <span>Enable logging and alerting for long-running or critical operations.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Related Categories */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Related Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/categories/devops-cicd" className="flex items-center p-5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md">
            <div className="w-10 h-10 mr-4 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <FiPackage className="text-primary" />
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white font-medium">DevOps & CI/CD</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Continuous deployment pipelines</p>
            </div>
          </Link>
          <Link href="/categories/security" className="flex items-center p-5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md">
            <div className="w-10 h-10 mr-4 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <FiShield className="text-primary" />
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white font-medium">Security</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cloud access, secrets, roles</p>
            </div>
          </Link>
          <Link href="/categories/monitoring" className="flex items-center p-5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md">
            <div className="w-10 h-10 mr-4 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <FiLayers className="text-primary" />
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white font-medium">Monitoring</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Metrics, uptime, alerts</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
