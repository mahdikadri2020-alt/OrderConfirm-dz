import React from 'react';

export function LogoIcon({ className = "h-12 w-auto", size }) {
  const style = size ? { height: `${size}px`, width: `${size}px`, minWidth: `${size}px` } : undefined;
  return (
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${className}`}
      style={style}
      aria-label="OrderConfirm Logo"
    >
      {/* Dark Circular Container Badge */}
      <circle cx="100" cy="100" r="92" fill="#071217" stroke="#16313B" strokeWidth="2.5" />

      {/* Top-Right Separate Dot */}
      <circle cx="124" cy="74" r="14" fill="#10B981" />

      {/* Main Stylized 'C' Ring Monogram */}
      <path 
        d="M 100 47 A 53 53 0 1 0 148 122 A 11 11 0 0 0 128 113 A 31 31 0 1 1 100 69 Z" 
        fill="#10B981" 
      />

      {/* 3D Ribbon Shadow Overlay for Depth */}
      <path 
        d="M 60 120 A 53 53 0 0 0 120 151 A 53 53 0 0 0 148 122 A 11 11 0 0 0 128 113 A 31 31 0 0 1 78 110 Z" 
        fill="#059669" 
        opacity="0.8" 
      />
    </svg>
  );
}

export default function Logo({ className = "", textClassName = "", showText = true, iconSize = 48 }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <LogoIcon size={iconSize} className="h-12 w-auto" />
      {showText && (
        <span className={`text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-foreground ${textClassName}`}>
          OrderConfirm
        </span>
      )}
    </div>
  );
}
