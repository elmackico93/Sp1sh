import React, { useEffect, useRef } from 'react';

export const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Matrix characters (using tech-related ASCII characters)
    const chars = '01010101abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/?;:~#%^*()-=_+|';
    
    // Font size and column count
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Drop position for each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height);
    }

    // Function to get a random character
    const getChar = () => chars[Math.floor(Math.random() * chars.length)];

    // Function to determine if a column should have a head (brighter character)
    const brightness: number[] = [];
    for (let i = 0; i < columns; i++) {
      brightness[i] = 0.1 + Math.random() * 0.2; // Random opacity between 0.1 and 0.3
    }

    // Speed of each column
    const speed: number[] = [];
    for (let i = 0; i < columns; i++) {
      speed[i] = 0.5 + Math.random() * 2; // Random speed between 0.5 and 2.5
    }

    // Drawing animation
    const draw = () => {
      // Add semi-transparent black rectangle on top to create fading effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Main drawing loop for the falling characters
      for (let i = 0; i < columns; i++) {
        // Draw the head character with higher brightness
        const y = drops[i] * fontSize;
        if (y > 0 && y < canvas.height) {
          // Head character
          ctx.fillStyle = `rgba(0, 255, 0, ${brightness[i] + 0.4})`;
          ctx.font = `${fontSize}px monospace`;
          ctx.fillText(getChar(), i * fontSize, y);
          
          // Draw previous characters with fading brightness
          for (let j = 1; j < 20; j++) {
            const prevY = y - j * fontSize;
            if (prevY > 0) {
              const fadingBrightness = brightness[i] * (1 - j/20);
              if (fadingBrightness > 0.02) {
                ctx.fillStyle = `rgba(0, 255, 0, ${fadingBrightness})`;
                ctx.fillText(getChar(), i * fontSize, prevY);
              }
            }
          }
        }

        // Move the drop down
        drops[i] += speed[i];
        
        // Reset when a column reaches the bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = Math.floor(Math.random() * -50); // Random start position above screen
          brightness[i] = 0.1 + Math.random() * 0.2; // New random brightness
          speed[i] = 0.5 + Math.random() * 2; // New random speed
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
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0" 
    />
  );
};

export default MatrixBackground;