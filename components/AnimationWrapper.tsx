import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimationWrapperProps {
  children: React.ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'slide-in';
  delay?: number;
  threshold?: number;
  className?: string;
}

export default function AnimationWrapper({
  children,
  animation = 'fade-in',
  delay = 0,
  threshold = 0.1,
  className = '',
}: AnimationWrapperProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [inView, hasAnimated]);

  // Check if user prefers reduced motion
  const prefersReducedMotion = useRef<boolean>(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  if (prefersReducedMotion.current) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={`${className} ${hasAnimated ? `animate-${animation}` : 'opacity-0'}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
} 