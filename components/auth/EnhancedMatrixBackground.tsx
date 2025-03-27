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
    // Optimized opacity settings for perfect balance in both modes
    const isDark = resolvedTheme === 'dark';
    const baseOpacity = isDark ? 0.2 : 0.22;
    
    // Custom theme multipliers for perfect visual balance
    let themeMultiplier = 1.0;
    switch (terminalTheme) {
      case 'tokyo-night':
        themeMultiplier = isDark ? 1.1 : 1.2;
        break;
      case 'dracula':
        themeMultiplier = isDark ? 1.2 : 1.3;
        break;
      case 'nord':
        themeMultiplier = isDark ? 0.9 : 1.0;
        break;
      case 'github':
        themeMultiplier = isDark ? 0.8 : 0.9;
        break;
      case 'monokai':
        themeMultiplier = isDark ? 1.3 : 1.4;
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

    // Optimized character sets for both modes
    const isDark = resolvedTheme === 'dark';
    const standardChars = '01010101abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/?;:~#%^*()-=_+|';
    
    // Theme-specific characters with perfect visual balance
    let themeChars = '';
    if (terminalTheme === 'tokyo-night') {
      themeChars = isDark ? '日月水火木金土天海空' : '円円円円円円円円円円';
    } else if (terminalTheme === 'dracula') {
      themeChars = '†‡§¶œæ∂ƒ©˙∆˚¬…æ';
    } else if (terminalTheme === 'github') {
      themeChars = 'λπωμσψδφγηξκςβν';
    }
    
    const chars = standardChars + themeChars;
    
    // Optimized font size and column calculations for both modes
    const baseFontSize = isDark ? 14 : 15; // Slightly larger in light mode for better visibility
    const fontSize = Math.floor(baseFontSize * (0.8 + density * 0.4));
    const densityMultiplier = isDark ? (2.0 - density) : (1.7 - density);
    const columns = Math.floor(canvas.width / (fontSize * densityMultiplier));
    
    // Drop position, brightness and speed for each column
    const drops: number[] = [];
    const brightness: number[] = [];
    const columnSpeed: number[] = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height);
      // Higher base brightness in light mode for better contrast
      brightness[i] = isDark ? (0.1 + Math.random() * 0.2) : (0.15 + Math.random() * 0.25);
      columnSpeed[i] = (0.5 + Math.random() * 1.5) * speed;
    }

    // Function to get a random character
    const getChar = () => chars[Math.floor(Math.random() * chars.length)];

    // Optimized colors for perfect visibility in both modes
    const getMatrixColor = () => {
      if (resolvedTheme === 'dark') {
        switch (terminalTheme) {
          case 'tokyo-night': return [158, 206, 106]; // Perfect green
          case 'nord': return [163, 190, 140]; // Softer green
          case 'dracula': return [80, 250, 123]; // Bright green
          case 'github': return [63, 185, 80]; // GitHub green
          case 'monokai': return [166, 226, 46]; // Monokai green
          default: return [0, 255, 0]; // Classic Matrix green
        }
      } else {
        // Optimized light mode colors with perfect visibility
        switch (terminalTheme) {
          case 'tokyo-night': return [0, 150, 190]; // Deep teal - optimal for light backgrounds
          case 'nord': return [43, 108, 196]; // Dark slate - high contrast on light
          case 'dracula': return [80, 200, 120]; // Softer green for light mode
          case 'github': return [0, 92, 220]; // Deeper GitHub blue for visibility
          case 'monokai': return [86, 182, 194]; // Deeper teal for Monokai in light mode
          default: return [0, 120, 215]; // Default teal for light mode
        }
      }
    };

    // Drawing animation with optimal settings
    const draw = () => {
      // Optimal fade effect tailored to each mode
      const isDark = resolvedTheme === 'dark';
      const fadeOpacity = isDark ? 0.05 / speed : 0.03 / speed;
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Get color values based on current theme
      const [r, g, b] = getMatrixColor();

      // Draw falling characters
      for (let i = 0; i < columns; i++) {
        const y = drops[i] * fontSize;
        if (y > 0 && y < canvas.height) {
          // Head character with perfect glow effect for each mode
          const headGlow = isDark ? glowIntensity : glowIntensity * 1.4; // Enhanced glow in light mode
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${headGlow})`;
          ctx.shadowBlur = isDark ? 5 * glowIntensity : 9 * glowIntensity;
          
          const headBrightness = isDark ? brightness[i] + 0.4 : brightness[i] + 0.6;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${headBrightness})`;
          ctx.font = `${fontSize}px monospace`;
          ctx.fillText(getChar(), i * fontSize, y);
          
          // Reset shadow for trail characters
          ctx.shadowBlur = isDark ? 5 * glowIntensity : 9 * glowIntensity;
          
          // Trail characters with optimized length for each mode
          const trailLength = isDark ? 20 : 15; // Shorter, more defined trails in light mode
          for (let j = 1; j < trailLength; j++) {
            const prevY = y - j * fontSize;
            if (prevY > 0) {
              // More prominent fade for light mode
              const fadeRatio = isDark ? (1 - j/trailLength) : (1 - j/(trailLength*0.8));
              const fadingBrightness = brightness[i] * fadeRatio;
              
              if (fadingBrightness > 0.02) {
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fadingBrightness})`;
                ctx.fillText(getChar(), i * fontSize, prevY);
              }
            }
          }
        }

        // Move the drop down - speed adjusted by column
        drops[i] += columnSpeed[i];
        
        // Reset when a column reaches the bottom with optimized randomization
        const resetThreshold = isDark ? 0.975 / speed : 0.96 / speed;
        if (drops[i] * fontSize > canvas.height && Math.random() > resetThreshold) {
          drops[i] = Math.floor(Math.random() * -50);
          brightness[i] = isDark ? (0.1 + Math.random() * 0.2) : (0.15 + Math.random() * 0.25);
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
