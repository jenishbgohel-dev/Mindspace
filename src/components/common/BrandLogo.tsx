import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  tagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  tagline = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-extrabold',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* MindSpace Emblem: Leaf + Book */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle background container squircle */}
          <rect width="100" height="100" rx="24" fill="#F0FDF4" />
          
          {/* Green Leaf Stem & Outline */}
          <path
            d="M 28 68 C 24 50 32 32 50 24 C 44 40 40 54 50 68"
            stroke="#2E7D4E"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 37 46 C 44 48 48 53 50 60"
            stroke="#2E7D4E"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Navy Blue Open Book Pages */}
          <path
            d="M 50 68 C 50 50 56 32 72 28 L 76 60 C 62 62 54 66 50 68 Z"
            stroke="#222B58"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Second overlapping page border */}
          <path
            d="M 72 34 L 75 33 L 78 61 C 74 62 70 63 68 64"
            stroke="#222B58"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`${textSizes[size]} tracking-tight text-[#166534] dark:text-emerald-400`}>
              Mind<span className="text-[#1e293b] dark:text-slate-100">Space</span>
            </span>
          </div>
          {tagline && (
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 dark:text-emerald-400">
              Knowledge & Well-Being
            </span>
          )}
        </div>
      )}
    </div>
  );
};
