import React, { useState, useEffect, useRef } from 'react';
import { Script } from '../../mocks/scripts';

interface TerminalAnimationProps {
  script: Script;
  onComplete: () => void;
}

export const TerminalAnimation: React.FC<TerminalAnimationProps> = ({ script, onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Animation sequence
  useEffect(() => {
    const filename = `${script.title.toLowerCase().replace(/\s+/g, '-')}.${script.os === 'windows' ? 'ps1' : 'sh'}`;
    const commandSequence = [
      { text: `user@sp1sh:~$ sudo sp1sh-get download ${filename}`, delay: 50 },
      { text: `[sudo] password for user: `, delay: 500 },
      { text: `******`, delay: 400 },
      { text: `Searching for ${filename}...`, delay: 1000 },
      { text: `Found ${filename} in repository: sp1sh-main`, delay: 800 },
      { text: `Repository: https://repo.sp1sh.io/${script.category}`, delay: 600 },
      { text: `Author: ${script.authorUsername}`, delay: 400 },
      { text: `Version: ${new Date(script.updatedAt).toLocaleDateString()}`, delay: 400 },
      { text: `Rating: ${script.rating.toFixed(1)}/5.0 (${script.downloads} downloads)`, delay: 400 },
      { text: `Starting download...`, delay: 800 },
      { text: `Connecting to sp1sh servers...`, delay: 1200 },
      { text: `Downloading [                    ] 0%`, delay: 200 },
      { text: `Downloading [==                  ] 10%`, delay: 200 },
      { text: `Downloading [====                ] 20%`, delay: 200 },
      { text: `Downloading [======              ] 30%`, delay: 200 },
      { text: `Downloading [========            ] 40%`, delay: 200 },
      { text: `Downloading [==========          ] 50%`, delay: 200 },
      { text: `Downloading [============        ] 60%`, delay: 200 },
      { text: `Downloading [==============      ] 70%`, delay: 200 },
      { text: `Downloading [================    ] 80%`, delay: 200 },
      { text: `Downloading [==================  ] 90%`, delay: 200 },
      { text: `Downloading [====================] 100%`, delay: 300 },
      { text: `Verifying integrity of ${filename}...`, delay: 800 },
      { text: `Checksum verification: OK`, delay: 400 },
      { text: `Granting execution permissions: chmod +x ${filename}`, delay: 600 },
      { text: `Download complete! ${filename} ready to use.`, delay: 400 },
      { text: `user@sp1sh:~$ _`, delay: 300 },
    ];

    let currentLines: string[] = [];
    let currentIndex = 0;

    const typeNextLine = () => {
      if (currentIndex < commandSequence.length) {
        const { text, delay } = commandSequence[currentIndex];
        currentLines = [...currentLines, text];
        setLines([...currentLines]);
        
        // Scroll to bottom when new line is added
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }

        currentIndex++;
        setTimeout(typeNextLine, delay);
      } else {
        setIsComplete(true);
        // Wait a moment before triggering the download
        setTimeout(onComplete, 800);
      }
    };

    // Start the animation
    typeNextLine();

    // Cleanup
    return () => {
      currentLines = [];
      currentIndex = 0;
    };
  }, [script, onComplete]);

  return (
    <div 
      ref={terminalRef}
      className="bg-terminal-bg text-terminal-text rounded-lg h-64 overflow-auto p-4 font-mono text-sm border border-gray-700"
    >
      {lines.map((line, index) => (
        <div key={index} className="terminal-line">
          {line}
        </div>
      ))}
      {isComplete && <div className="text-green-400 mt-2">Download ready - File saved to your computer</div>}
    </div>
  );
};

export default TerminalAnimation;