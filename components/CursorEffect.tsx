'use client';

import { useEffect, useState } from 'react';

const CursorEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if we're on desktop (screen width > 768px)
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    // Initial check
    checkIfDesktop();

    // Add resize listener
    window.addEventListener('resize', checkIfDesktop);

    return () => {
      window.removeEventListener('resize', checkIfDesktop);
    };
  }, []);

  useEffect(() => {
    // Only run cursor effect on desktop
    if (!isDesktop) return;

    let animationFrameId: number;
    
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animateDot = () => {
      setDotPosition(prev => ({
        x: lerp(prev.x, mousePosition.x, 0.065),
        y: lerp(prev.y, mousePosition.y, 0.065)
      }));

      setRingPosition(prev => ({
        x: lerp(prev.x, mousePosition.x, 0.035),
        y: lerp(prev.y, mousePosition.y, 0.035)
      }));

      animationFrameId = requestAnimationFrame(animateDot);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      setCursorVisible(true);
    };

    const handleMouseLeave = () => {
      setCursorVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(animateDot);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition, isDesktop]);

  // Don't render anything on mobile
  if (!isDesktop) return null;

  return (
    <>
      {/* Filled circle */}
      <div
        className={`fixed pointer-events-none z-50 mix-blend-difference ${
          cursorVisible ? 'opacity-100' : 'opacity-0'
        } hidden md:block`}
        style={{
          left: `${dotPosition.x}px`,
          top: `${dotPosition.y}px`,
          transform: 'translate(-50%, -50%)',
          transition: 'opacity 0.3s ease'
        }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: '#4ade80',
            boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)'
          }}
        />
      </div>

      {/* Outlined circle */}
      <div
        className={`fixed pointer-events-none z-50 mix-blend-difference ${
          cursorVisible ? 'opacity-100' : 'opacity-0'
        } hidden md:block`}
        style={{
          left: `${ringPosition.x}px`,
          top: `${ringPosition.y}px`,
          transform: 'translate(-50%, -50%)',
          transition: 'opacity 0.3s ease'
        }}
      >
        <div
          className="w-10 h-10 rounded-full"
          style={{
            border: '2px solid #4ade80',
            boxShadow: '0 0 10px rgba(74, 222, 128, 0.3)'
          }}
        />
      </div>
    </>
  );
};

export default CursorEffect; 