import React from 'react';

interface CumminsLogoProps {
  height?: number;
  showWordmark?: boolean;
}

export const CumminsLogo: React.FC<CumminsLogoProps> = ({ 
  height = 36, 
  showWordmark = true 
}) => {
  // SVG Aspect ratio is 580 : 560 roughly 1.03 : 1
  const width = Math.round(height * 1.05);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
      {/* Official Cummins Red 'C' Emblem */}
      <svg 
        height={height} 
        width={width}
        viewBox="0 0 580 560" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M370 0H580V180H350C275 180 230 225 230 280C230 335 275 380 350 380H580V560H370C165 560 0 435 0 280C0 125 165 0 370 0Z" 
          fill="#DA291C" 
        />
        <g transform="translate(240, 195) rotate(-35)">
          <text 
            x="-92" 
            y="10" 
            fill="#FFFFFF" 
            fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
            fontWeight="900" 
            fontSize="108" 
            fontStyle="italic"
            letterSpacing="-0.02em"
          >
            Cummins
          </text>
        </g>
      </svg>

      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span 
            style={{ 
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              fontSize: `${Math.max(13, height * 0.42)}px`, 
              fontWeight: 800, 
              color: '#0F172A',
              letterSpacing: '-0.02em'
            }}
          >
            PPWR Platform
          </span>
          <span 
            style={{ 
              fontSize: `${Math.max(9, height * 0.26)}px`, 
              fontWeight: 700, 
              color: '#64748B',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}
          >
            Industrial Packaging
          </span>
        </div>
      )}
    </div>
  );
};
