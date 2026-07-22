import React from 'react';

export function LogoIcon({ className = "h-12 w-auto", size }) {
  const style = size ? { height: `${size}px`, width: 'auto' } : undefined;
  return (
    <svg 
      width="200" 
      height="200" 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${className}`}
      style={style}
      aria-label="OrderConfirm Logo"
    >
      <defs>
        {/* Modern Mint/Emerald Gradient */}
        <linearGradient id="oc-gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="35%" stopColor="#10B981" />
          <stop offset="70%" stopColor="#059669" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        {/* Bottom Fold Ribbon Overlay Shadow */}
        <linearGradient id="oc-gradient-shadow" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#047857" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>

        {/* Dark Teal Circular Background Badge */}
        <radialGradient id="oc-bg-radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0F232B" />
          <stop offset="100%" stopColor="#071217" />
        </radialGradient>
      </defs>

      {/* Dark Circular Container Badge */}
      <circle cx="100" cy="100" r="92" fill="url(#oc-bg-radial)" stroke="#16313B" strokeWidth="2.5" />

      {/* Top-Right Separate Dot */}
      <circle cx="124" cy="74" r="14" fill="url(#oc-gradient-primary)" />

      {/* Main Stylized 'OC' Ring Monogram */}
      <path 
        d="M 100 47 A 53 53 0 1 0 148 122 A 11 11 0 0 0 128 113 A 31 31 0 1 1 100 69 Z" 
        fill="url(#oc-gradient-primary)" 
      />

      {/* Ribbon Shadow Overlay for 3D Depth */}
      <path 
        d="M 60 120 A 53 53 0 0 0 120 151 A 53 53 0 0 0 148 122 A 11 11 0 0 0 128 113 A 31 31 0 0 1 78 110 Z" 
        fill="url(#oc-gradient-shadow)" 
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
