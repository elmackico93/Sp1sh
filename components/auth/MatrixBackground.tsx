import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

export const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [opacity, setOpacity] = useState(0.2);

  // Update opacity based on theme
  useEffect(() => {
    setOpacity(resolvedTheme === 'dark' ? 0.2 : 0.1);
  }, [resolvedTheme]);

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

    // Matrix characters
    const chars = '01010101abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/?;:~#%^*()-=_+|';
    
    // Font size and column count
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Drop position, brightness and speed for each column
    const drops: number[] = [];
    const brightness: number[] = [];
    const speed: number[] = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height);
      brightness[i] = 0.1 + Math.random() * 0.2;
      speed[i] = 0.5 + Math.random() * 2;
    }

    // Function to get a random character
    const getChar = () => chars[Math.floor(Math.random() * chars.length)];

    // Get matrix color based on theme
    const getMatrixColor = () => {
      return resolvedTheme === 'dark' ? 
        [0, 255, 0] : // Green for dark mode
        [0, 128, 100]; // Teal-green for light mode
    };

    // Drawing animation
    const draw = () => {
      // Add semi-transparent black rectangle for fade effect
      ctx.fillStyle = `rgba(0, 0, 0, 0.05)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Get color values based on current theme
      const [r, g, b] = getMatrixColor();

      // Draw falling characters
      for (let i = 0; i < columns; i++) {
        const y = drops[i] * fontSize;
        if (y > 0 && y < canvas.height) {
          // Head character (brighter)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness[i] + 0.4})`;
          ctx.font = `${fontSize}px monospace`;
          ctx.fillText(getChar(), i * fontSize, y);
          
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

        // Move the drop down
        drops[i] += speed[i];
        
        // Reset when a column reaches the bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = Math.floor(Math.random() * -50);
          brightness[i] = 0.1 + Math.random() * 0.2;
          speed[i] = 0.5 + Math.random() * 2;
        }
      }
    };

    // Set animation interval
    const interval = setInterval(draw, 70);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resolvedTheme]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0`}
      style={{ opacity }} 
    />
  );
};

export default MatrixBackground;