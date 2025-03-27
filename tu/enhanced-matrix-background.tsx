import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useTerminalTheme } from './TerminalThemeProvider';

interface MatrixBackgroundProps {
  density?: number; // 0.0 to 1.0, controls character density
  speed?: number;   // 0.5 to 2.0, controls fall speed
  glowIntensity?: number; // 0.0 to 1.0, controls glow effect
}

export const EnhancedMatrixBackground: React.FC<MatrixBackgroundProps> = ({
  density = 0.8,
  speed = 1.0,
  glowIntensity = 0.7
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const { terminalTheme, isTransitioning } = useTerminalTheme();
  const [opacity, setOpacity] = useState(0.2);
  const animationRef = useRef<number>(0);

  // Update based on theme and terminal theme
  useEffect(() => {
    // Base opacity based on light/dark mode
    const baseOpacity = resolvedTheme === 'dark' ? 0.2 : 0.1;
    
    // Adjust based on terminal theme
    let themeMultiplier = 1.0;
    switch (terminalTheme) {
      case 'tokyo-night':
        themeMultiplier = 1.1;
        break;
      case 'dracula':
        themeMultiplier = 1.2;
        break;
      case 'nord':
        themeMultiplier = 0.9;
        break;
      case 'github':
        themeMultiplier = 0.8;
        break;
      case 'monokai':
        themeMultiplier = 1.3;
        break;
    }
    
    // Apply changes
    setOpacity(baseOpacity * themeMultiplier);
  }, [resolvedTheme, terminalTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Enhanced matrix characters with special symbols based on theme
    let chars = '01010101abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/?;:~#%^*()-=_+|';
    
    // Add theme-specific characters
    if (terminalTheme === 'tokyo-night') {
      chars += '日月水火木金土天海空';
    } else if (terminalTheme === 'dracula') {
      chars += '†‡§¶œæ∂ƒ©˙∆˚¬…æ';
    } else if (terminalTheme === 'github') {
      chars += 'λπωμσψδφγηξκςβν';
    }
    
    // Font size and column count - adjusted by density
    const fontSize = Math.floor(14 * (0.8 + density * 0.4)); // 11-17px based on density
    const columns = Math.floor(canvas.width / (fontSize * (2.0 - density))); // More columns with higher density
    
    // Drop position, brightness and speed for each column
    const drops: number[] = [];
    const brightness: number[] = [];
    const columnSpeed: number[] = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height);
      brightness[i] = 0.1 + Math.random() * 0.2;
      columnSpeed[i] = (0.5 + Math.random() * 1.5) * speed;
    }

    // Function to get a random character
    const getChar = () => chars[Math.floor(Math.random() * chars.length)];

    // Get matrix color based on theme
    const getMatrixColor = () => {
      if (resolvedTheme === 'dark') {
        switch (terminalTheme) {
          case 'tokyo-night': return [158, 206, 106]; // Green
          case 'nord': return [163, 190, 140]; // Softer green
          case 'dracula': return [80, 250, 123]; // Bright green
          case 'github': return [63, 185, 80]; // GitHub green
          case 'monokai': return [166, 226, 46]; // Monokai green
          default: return [0, 255, 0]; // Default green
        }
      } else {
        switch (terminalTheme) {
          case 'tokyo-night': return [15, 118, 110]; // Teal
          case 'nord': return [76, 86, 106]; // Nord blue
          case 'dracula': return [80, 250, 123]; // Green (still visible in light)
          case 'github': return [3, 102, 214]; // GitHub blue
          case 'monokai': return [102, 217, 239]; // Monokai blue
          default: return [0, 128, 100]; // Default teal for light
        }
      }
    };

    // Drawing animation
    const draw = () => {
      // Add semi-transparent black rectangle for fade effect
      // Use a lighter fade for faster speed
      const fadeOpacity = 0.05 / speed;
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Get color values based on current theme
      const [r, g, b] = getMatrixColor();

      // Draw falling characters
      for (let i = 0; i < columns; i++) {
        const y = drops[i] * fontSize;
        if (y > 0 && y < canvas.height) {
          // Head character (brighter)
          // Apply glow effect based on glowIntensity
          if (glowIntensity > 0) {
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${glowIntensity})`;
            ctx.shadowBlur = 5 * glowIntensity;
          }
          
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness[i] + 0.4})`;
          ctx.font = `${fontSize}px monospace`;
          ctx.fillText(getChar(), i * fontSize, y);
          
          // Reset shadow for trail characters
          ctx.shadowBlur = 0;
          
          // Trail characters (fading)
          for (let j = 1; j < 20; j++) {
            const prevY = y - j * fontSize;
            if (prevY > 0) {
              const fadingBrightness = brightness[i] * (1 - j/20);
              if (fadingBrightness > 0.02) {
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fadingBrightness})`;
                ctx.fillText(getChar(), i * fontSize, prevY);
              }
            }
          }
        }

        // Move the drop down - speed adjusted by column
        drops[i] += columnSpeed[i];
        
        // Reset when a column reaches the bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975 / speed) {
          drops[i] = Math.floor(Math.random() * -50);
          brightness[i] = 0.1 + Math.random() * 0.2;
          columnSpeed[i] = (0.5 + Math.random() * 1.5) * speed;
        }
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(draw);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resolvedTheme, terminalTheme, density, speed, glowIntensity]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 matrix-background"
      style={{ 
        opacity: isTransitioning ? 0 : opacity,
        transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }} 
    />
  );
};

export default EnhancedMatrixBackground;
