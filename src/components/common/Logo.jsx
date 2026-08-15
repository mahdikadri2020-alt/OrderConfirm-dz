import React from 'react';

export function LogoIcon({ className = "h-10 w-10", size }) {
  const pixelSize = size ? `${size}px` : undefined;
  const style = pixelSize ? { height: pixelSize, width: pixelSize, minWidth: pixelSize } : undefined;

  return (
    <img 
      src="/logo-orderconfirm-192.png?v=4" 
      alt="OrderConfirm Logo" 
      className={`shrink-0 object-contain rounded-full shadow-xs ${className}`}
      style={style}
    />
  );
}

export default function Logo({ className = "", textClassName = "", showText = true, iconSize = 44 }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <LogoIcon size={iconSize} className="h-10 w-10" />
      {showText && (
        <span className={`text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-foreground ${textClassName}`}>
          OrderConfirm
        </span>
      )}
    </div>
  );
}
