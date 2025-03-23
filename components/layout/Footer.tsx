import React from 'react';
import Link from 'next/link';
import { FiTwitter, FiGithub, FiLinkedin, FiRss } from 'react-icons/fi';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">Sp1sh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/guidelines" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  Script Guidelines
                </Link>
              </li>
              <li>
                <Link href="/security-standards" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  Security Standards
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  API
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  System Status
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/os/linux" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  Linux Scripts
                </Link>
              </li>
              <li>
                <Link href="/os/windows" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  Windows PowerShell
                </Link>
              </li>
              <li>
                <Link href="/os/macos" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  macOS Scripts
                </Link>
              </li>
              <li>
                <Link href="/categories/security" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  Security Scripts
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  All Categories
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">Stay Updated</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Subscribe to our newsletter for new scripts and features
            </p>
            <form className="flex mb-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 py-2 px-3 text-sm border border-r-0 border-gray-300 dark:border-gray-700 rounded-l-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark"
                required
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="py-2 px-4 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-r-md"
                aria-label="Subscribe"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Sp1sh. All rights reserved.
          </div>
          
          <div className="flex mt-4 md:mt-0">
            <Link href="/terms" className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light mr-4">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light mr-4">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
              Cookie Policy
            </Link>
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="https://twitter.com/sp1sh" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-primary">
              <FiTwitter />
            </a>
            <a href="https://github.com/sp1sh" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-400 hover:text-primary">
              <FiGithub />
            </a>
            <a href="https://linkedin.com/company/sp1sh" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-primary">
              <FiLinkedin />
            </a>
            <a href="/rss" target="_blank" rel="noopener noreferrer" aria-label="RSS Feed" className="text-gray-400 hover:text-primary">
              <FiRss />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
