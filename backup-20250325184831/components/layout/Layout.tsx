import React, { ReactNode } from 'react';
import Head from 'next/head';
import { Header } from './Header';
import { OSNavbar } from './OSNavbar';
import { Footer } from './Footer';

type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export const Layout = ({ 
  children, 
  title = 'Sp1sh | Ultimate Shell Script Repository',
  description = 'Find and use expert-curated shell scripts for Linux, Windows, and macOS. Emergency solutions, automation tools, and system administration scripts with verified security.'
}: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <Header />
      <OSNavbar />
      
      <main id="main-content" className="min-h-screen pb-12">
        {children}
      </main>
      
      <Footer />
    </>
  );
};
