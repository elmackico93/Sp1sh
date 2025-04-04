import Head from "next/head";

import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-powershell';
import { useScripts } from '../../context/ScriptsContext';

import { ScriptDetailHeader } from '../../components/scripts/ScriptDetailHeader';
import { ScriptActions } from '../../components/scripts/ScriptActions';
import { ScriptCode } from '../../components/scripts/ScriptCode';
import { ScriptTags } from '../../components/scripts/ScriptTags';
import { ScriptMetadata } from '../../components/scripts/ScriptMetadata';
import { RelatedScripts } from '../../components/scripts/RelatedScripts';
import { ScriptComments } from '../../components/scripts/ScriptComments';
import { LoadingPlaceholder } from '../../components/ui/LoadingPlaceholder';
import { withStaticRendering } from '../../utils/renderStrategy';
import { getScriptById as getScriptByIdUtil, mockScripts } from '../../mocks/scripts';
import TerminalSync from '../../components/scripts/TerminalSync';

// Props interface for the page
interface ScriptDetailProps {
  initialScript: any;
  renderedAt: string;
}

export default function ScriptDetail({ initialScript, renderedAt }: ScriptDetailProps) {
  const router = useRouter();
  const { id } = router.query;
  const { getScriptById, allScripts, isLoading } = useScripts();
  const codeRef = useRef<HTMLPreElement>(null);
  const [script, setScript] = useState(initialScript);
  const [copyFeedback, setCopyFeedback] = useState(false);
  
  // If we get initial script from static props, use it
  // Otherwise fall back to client-side loading
  useEffect(() => {
    // If we have id but no script, try to load it client-side
    if (id && typeof id === 'string' && !script) {
      const scriptData = getScriptById(id);
      if (scriptData) {
        setScript(scriptData);
      }
    }
  }, [id, getScriptById, script]);
  
  // Get related scripts based on tags and category
  const relatedScripts = script
    ? allScripts
        .filter(s => 
          s.id !== script.id && 
          (s.category === script.category || 
           s.tags.some(tag => script.tags.includes(tag)))
        )
        .slice(0, 3)
    : [];
  
  // Initialize syntax highlighting
  useEffect(() => {
    if (codeRef.current && script) {
      Prism.highlightElement(codeRef.current);
    }
  }, [script]);

  // Handle copying script to clipboard
  const handleCopyScript = async () => {
    if (script) {
      try {
        await navigator.clipboard.writeText(script.code);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  // Handle back button
  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      // If no history, go to homepage
      router.push('/');
    }
  };

  // Determine loading state by combining SSR data and client state
  const isPageLoading = isLoading || (typeof id === 'string' && !script);

  if (isPageLoading) {
    return <LoadingPlaceholder />;
  }

  if (!script) {
    return (
<>
<Head>
  <title>{script?.title || "Script Detail"} | Sp1sh</title>
  <meta name="description" content={script?.description || "Script details"} />
</Head>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Script not found</h1>
          <p className="mb-6">The script you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-full"
          >
            Go Back
          </button>
        </div>
</>
    );
  }

  return (
<>
<Head>
  <title>{script.title || "Script Detail"}</title>
  <meta name="description" content={script.description} />
</Head>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ScriptDetailHeader script={script} />
            <ScriptActions script={script} onCopy={handleCopyScript} showCopyFeedback={copyFeedback} />
            <ScriptCode script={script} codeRef={codeRef} onCopy={handleCopyScript} showCopyFeedback={copyFeedback} />
            <ScriptTags tags={script.tags} />
            <div className="mt-10">
              <TerminalSync />
            </div>

            <ScriptComments />
          </div>
          
          <div className="lg:col-span-1">
            <ScriptMetadata script={script} />
            <RelatedScripts scripts={relatedScripts} />
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-2 bg-gray-100 text-xs text-gray-500 rounded">
                Rendered at: {new Date(renderedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
</>
  );
}

// Get static paths for commonly accessed scripts
export async function getStaticPaths() {
  // Identify the top scripts (e.g., most popular, critical ones)
  const topScriptIds = mockScripts
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 5)
    .map(script => script.id);
  
  const paths = topScriptIds.map(id => ({
    params: { id },
  }));
  
  return {
    paths,
    fallback: 'blocking', // Show a loading state for paths not pre-rendered
  };
}

// Use static props with revalidation for script details
export const getStaticProps = withStaticRendering(async (context) => {
  const { id } = context.params as { id: string };
  const script = getScriptByIdUtil(id);
  
  if (!script) {
    return {
      notFound: true, // Will show 404 page
    };
  }
  
  return {
    props: {
      initialScript: script,
      renderedAt: new Date().toISOString(),
    },
  };
}, 60 * 60); // Revalidate every hour
