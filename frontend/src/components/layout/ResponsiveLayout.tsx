import { ReactNode } from 'react';

interface ResponsiveLayoutProps {
  children: ReactNode;
  backgroundImage?: string;
  className?: string;
}

export default function ResponsiveLayout({ 
  children, 
  backgroundImage = '/assets/backgrounds/default-bg.jpg',
  className = '' 
}: ResponsiveLayoutProps) {
  return (
    <div 
      className={`min-h-screen bg-cover bg-center bg-fixed ${className}`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${backgroundImage})`,
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="min-h-screen">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 max-w-7xl">
          {children}
        </div>
      </div>
    </div>
  );
}