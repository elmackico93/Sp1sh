import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-powershell';
import Head from 'next/head';
import { useScripts } from '../../context/ScriptsContext';
import { ScriptDetailHeader } from '../../components/scripts/ScriptDetailHeader';
import { ScriptActions } from '../../components/scripts/ScriptActions';
import { ScriptCode } from '../../components/scripts/ScriptCode';
import { ScriptTags } from '../../components/scripts/ScriptTags';
import { ScriptMetadata } from '../../components/scripts/ScriptMetadata';
import { RelatedScripts } from '../../components/scripts/RelatedScripts';
import { ScriptComments } from '../../components/scripts/ScriptComments';
import { LoadingPlaceholder } from '../../components/ui/LoadingPlaceholder';

export default function ScriptDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { getScriptById, allScripts, isLoading } = useScripts();
  const codeRef = useRef<HTMLPreElement>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  
  const script = typeof id === 'string' ? getScriptById(id) : undefined;
  
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

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  if (!script) {
    return (
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
    );
  }

  return (
    <>
      <Head>
        <title>{script.title} | Sp1sh</title>
        <meta name="description" content={script.description} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ScriptDetailHeader script={script} />
            <ScriptActions script={script} onCopy={handleCopyScript} showCopyFeedback={copyFeedback} />
            <ScriptCode script={script} codeRef={codeRef} onCopy={handleCopyScript} showCopyFeedback={copyFeedback} />
            <ScriptTags tags={script.tags} />
            <ScriptComments />
          </div>
          
          <div className="lg:col-span-1">
            <ScriptMetadata script={script} />
            <RelatedScripts scripts={relatedScripts} />
          </div>
        </div>
      </div>
    </>
  );
}
