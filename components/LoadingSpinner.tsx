import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
    >
      <path 
        d="M32 68V32H63V41H42V49H58V58H42V68H32Z"
        stroke="url(#paint0_linear_spinner)" 
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="logo-spinner"
        strokeDasharray="200"
      />
      <defs>
        <linearGradient id="paint0_linear_spinner" x1="32" y1="32" x2="63" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE"/>
          <stop offset="1" stopColor="#4ADE80"/>
        </linearGradient>
      </defs>
    </svg>
  );
};