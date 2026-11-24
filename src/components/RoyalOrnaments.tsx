import React from 'react';
import { CONFIG } from '../config/invitationConfig';

/**
 * Symmetrical corner filigree SVG ornament — replaces any empty rectangular corner boxes.
 * Intentionally fine, open-work scalloped floral stroke so it never looks like an empty box.
 */
export const CornerFiligree: React.FC<{
  position: 'tl' | 'tr' | 'bl' | 'br';
  color?: string;
  size?: number;
  className?: string;
}> = ({ position, color = '#D2AD68', size = 34, className = '' }) => {
  const rotationMap = {
    tl: 'rotate(0)',
    tr: 'rotate(90)',
    br: 'rotate(180)',
    bl: 'rotate(270)',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none select-none animate-filigree-gleam ${className}`}
      style={{ transform: rotationMap[position] }}
    >
      <path
        d="M3 28C3 14 14 3 28 3"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M7 22C7 13 13 7 22 7"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M4 12C6.5 9.5 9.5 6.5 12 4C11.5 8 8 11.5 4 12Z"
        fill={color}
        opacity="0.8"
      />
      <circle cx="15" cy="15" r="1.4" fill={color} opacity="0.75" />
      <circle cx="28" cy="3" r="1.4" fill={color} opacity="0.85" />
      <circle cx="3" cy="28" r="1.4" fill={color} opacity="0.85" />
    </svg>
  );
};

/**
 * Horizontal heritage lotus & filigree divider.
 */
export const HeritageDivider: React.FC<{
  color?: string;
  className?: string;
}> = ({ color = '#B18A48', className = '' }) => (
  <div className={`flex items-center justify-center gap-3 w-full ${className}`} aria-hidden="true">
    <span
      className="h-[1px] flex-1 max-w-[96px]"
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${color} 100%)`,
      }}
    />
    <svg width="36" height="18" viewBox="0 0 36 18" fill="none">
      <path
        d="M18 2C19.8 6 22.5 8 26 9C22.5 10 19.8 12 18 16C16.2 12 13.5 10 10 9C13.5 8 16.2 6 18 2Z"
        stroke={color}
        strokeWidth="1.1"
        fill={color}
        fillOpacity="0.18"
      />
      <circle cx="5" cy="9" r="1.5" fill={color} opacity="0.75" />
      <circle cx="31" cy="9" r="1.5" fill={color} opacity="0.75" />
    </svg>
    <span
      className="h-[1px] flex-1 max-w-[96px]"
      style={{
        background: `linear-gradient(270deg, transparent 0%, ${color} 100%)`,
      }}
    />
  </div>
);

/**
 * Two curated presentations of the official Sumati Dham logo:
 * - 'full': Clean transparent presentation preserving all outer scalloped ornaments & Hindi lettering.
 * - 'medallion': Framed inside a beveled antique gold circular seal without clipping any lettering.
 */
export const LogoPresentation: React.FC<{
  variant?: 'full' | 'medallion';
  size?: number;
  className?: string;
}> = ({ variant = 'medallion', size = 84, className = '' }) => {
  if (variant === 'full') {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={CONFIG.images.logo}
          alt="सुमतिधाम आधिकारिक प्रतीक चिह्न"
          className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(11,20,40,0.45)]"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        padding: Math.max(4, Math.round(size * 0.06)),
        background:
          'radial-gradient(circle at 35% 30%, #F5E7C4 0%, #D2AD68 48%, #8F6C2E 100%)',
        boxShadow:
          '0 10px 26px rgba(11, 20, 40, 0.55), inset 0 1px 2px rgba(255, 250, 235, 0.7)',
      }}
    >
      <span
        className="pointer-events-none absolute -inset-1.5 rounded-full bg-[#E9D5A7]/25 blur-md animate-halo-breathe"
        aria-hidden="true"
      />
      <div className="relative z-10 w-full h-full rounded-full bg-[#FAF4E8] p-[3px] flex items-center justify-center overflow-hidden shadow-inner">
        <img
          src={CONFIG.images.logo}
          alt="सुमतिधाम आधिकारिक प्रतीक चिह्न"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

/**
 * Lightweight floating gold dust particles (compositor-only properties: transform & opacity).
 */
const DUST_SPECS = [
  { left: '12%', top: '76%', dur: '7.5s', delay: '0s', x: '12px', y: '-62px', size: 3 },
  { left: '24%', top: '64%', dur: '9s', delay: '1.2s', x: '-10px', y: '-55px', size: 2 },
  { left: '38%', top: '82%', dur: '8.2s', delay: '0.6s', x: '16px', y: '-68px', size: 2.5 },
  { left: '54%', top: '72%', dur: '7.8s', delay: '2.1s', x: '-14px', y: '-54px', size: 3 },
  { left: '68%', top: '85%', dur: '9.4s', delay: '0.9s', x: '8px', y: '-70px', size: 2 },
  { left: '82%', top: '68%', dur: '8.6s', delay: '1.7s', x: '-12px', y: '-58px', size: 2.5 },
  { left: '19%', top: '34%', dur: '10s', delay: '2.6s', x: '10px', y: '-48px', size: 2 },
  { left: '77%', top: '32%', dur: '9.2s', delay: '1.4s', x: '-10px', y: '-46px', size: 2 },
];

export const GoldDustField: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    aria-hidden="true"
  >
    {DUST_SPECS.map((dot, idx) => (
      <span
        key={idx}
        className="gold-dust-particle absolute rounded-full bg-[#E9D5A7]"
        style={
          {
            left: dot.left,
            top: dot.top,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            boxShadow: '0 0 6px rgba(233, 213, 167, 0.7)',
            '--dust-dur': dot.dur,
            '--dust-delay': dot.delay,
            '--dust-x': dot.x,
            '--dust-y': dot.y,
          } as React.CSSProperties
        }
      />
    ))}
  </div>
);

/**
 * Architectural Indian Jali & Arch subtle background filigree.
 */
export const RoyalJaliArchBackdrop: React.FC<{
  className?: string;
  showCenterCircles?: boolean;
}> = ({ className = '', showCenterCircles = true }) => (
  <svg
    viewBox="0 0 400 640"
    fill="none"
    preserveAspectRatio="xMidYMin slice"
    aria-hidden="true"
    className={`pointer-events-none absolute inset-0 w-full h-full opacity-[0.09] ${className}`}
  >
    <path
      d="M40 620V210C40 120 120 65 200 32C280 65 360 120 360 210V620"
      stroke="#D2AD68"
      strokeWidth="1.2"
    />
    <path
      d="M58 620V216C58 134 132 84 200 54C268 84 342 134 342 216V620"
      stroke="#E9D5A7"
      strokeWidth="0.7"
      strokeDasharray="4 4"
    />
    {showCenterCircles && (
      <>
        <circle cx="200" cy="146" r="54" stroke="#D2AD68" strokeWidth="0.8" />
        <circle cx="200" cy="146" r="38" stroke="#D2AD68" strokeWidth="0.6" strokeDasharray="3 3" />
      </>
    )}
  </svg>
);

/**
 * Traditional Royal Palace Golden Toran (Bandarwal) framing the entrance banner.
 */
export const RoyalGoldenToran: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 380 62"
    fill="none"
    aria-hidden="true"
    className={`w-full max-w-[380px] h-auto pointer-events-none select-none animate-toran-sway ${className}`}
  >
    <defs>
      <linearGradient id="toranGold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#B18A48" />
        <stop offset="50%" stopColor="#F5E7C4" />
        <stop offset="100%" stopColor="#B18A48" />
      </linearGradient>
    </defs>
    {/* Top arch rail */}
    <path d="M12 6 H368" stroke="url(#toranGold)" strokeWidth="1.6" strokeLinecap="round" />
    {/* Graceful scalloped toran festoons */}
    <path
      d="M16 6 Q60 32 104 8 Q148 34 190 8 Q232 34 276 8 Q320 32 364 6"
      stroke="url(#toranGold)"
      strokeWidth="1.4"
      fill="none"
    />
    <path
      d="M36 8 Q60 22 84 8 M124 9 Q148 24 172 9 M208 9 Q232 24 256 9 M296 8 Q320 22 344 8"
      stroke="#E9D5A7"
      strokeWidth="0.8"
      opacity="0.7"
    />
    {/* Hanging lotus bells & medallions */}
    {[60, 148, 232, 320].map((cx) => (
      <g key={cx}>
        <line x1={cx} y1="22" x2={cx} y2="38" stroke="#D2AD68" strokeWidth="1" />
        <path
          d={`M${cx} 37 C${cx - 6} 41, ${cx - 6} 47, ${cx} 50 C${cx + 6} 47, ${cx + 6} 41, ${cx} 37 Z`}
          fill="#4A182D"
          stroke="#E9D5A7"
          strokeWidth="1"
        />
        <circle cx={cx} cy="53" r="2" fill="#E9D5A7" />
      </g>
    ))}
    {/* Central Sacred Lotus Crest */}
    <line x1="190" y1="8" x2="190" y2="26" stroke="#E9D5A7" strokeWidth="1.2" />
    <path
      d="M190 24 C196 31, 200 37, 190 46 C180 37, 184 31, 190 24 Z"
      fill="url(#toranGold)"
    />
    <circle cx="190" cy="52" r="2.6" fill="#F5E7C4" />
  </svg>
);

/**
 * Circular engraved gold date medallion for 15, 16, 17 December.
 */
export const DateMedallion: React.FC<{
  dayNumber: string;
  monthYear: string;
  accent?: 'burgundy' | 'blue' | 'emerald';
}> = ({ dayNumber, monthYear, accent = 'burgundy' }) => {
  const bgMap = {
    burgundy: '#491C30',
    blue: '#142440',
    emerald: '#173E35',
  };

  return (
    <div className="relative inline-flex items-center justify-center w-24 h-24 shrink-0">
      <span
        className="pointer-events-none absolute -inset-1 rounded-full bg-[#D2AD68]/20 blur-md animate-halo-breathe"
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full animate-stone-cw"
        style={{ animationDuration: '38s' }}
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="47" fill="none" stroke="#B18A48" strokeWidth="1.2" />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill={bgMap[accent]}
          stroke="#E9D5A7"
          strokeWidth="1"
          strokeDasharray="2.5 2.5"
        />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <circle
            key={deg}
            cx="50"
            cy="5"
            r="1.5"
            fill="#E9D5A7"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center text-center leading-none">
        <span className="font-english-serif text-[32px] font-bold text-[#F8F1E4] tabular-nums leading-none">
          {dayNumber}
        </span>
        <span className="font-hindi-body text-[10px] text-[#E9D5A7] mt-1 tracking-wide">
          {monthYear}
        </span>
      </div>
    </div>
  );
};

/**
 * Original SVG + CSS illustrations for each of the 6 Mahotsav Highlights.
 * Zero emojis, zero fabricated photographs.
 */
export const CeremonyArtwork: React.FC<{
  type:
    | 'pad-pratishtha'
    | 'diksha'
    | 'drone-show'
    | 'bhakti-night'
    | 'pad-prakshalana'
    | 'mahapuja';
}> = ({ type }) => {
  switch (type) {
    case 'pad-pratishtha':
      return (
        <svg viewBox="0 0 220 120" className="w-full h-28" fill="none" aria-hidden="true">
          <defs>
            <radialGradient id="throneGlow" cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#E9D5A7" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#E9D5A7" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="220" height="120" fill="url(#throneGlow)" />
          {/* Royal Chhatra / Throne Umbrella */}
          <path d="M72 34C88 20 132 20 148 34H72Z" stroke="#E9D5A7" strokeWidth="1.4" fill="#D2AD68" fillOpacity="0.22" />
          <line x1="110" y1="16" x2="110" y2="24" stroke="#E9D5A7" strokeWidth="1.5" />
          <circle cx="110" cy="14" r="2.5" fill="#E9D5A7" />
          {/* Ornamental Simhasan Arch */}
          <path
            d="M66 96V64C66 44 86 38 110 38C134 38 154 44 154 64V96"
            stroke="#D2AD68"
            strokeWidth="1.5"
          />
          <path
            d="M78 96V68C78 54 92 48 110 48C128 48 142 54 142 68V96"
            stroke="#E9D5A7"
            strokeWidth="0.9"
            strokeDasharray="3 3"
          />
          {/* Pedestal */}
          <rect x="56" y="96" width="108" height="8" rx="2" stroke="#D2AD68" strokeWidth="1.2" fill="#B18A48" fillOpacity="0.25" />
          <circle cx="110" cy="68" r="10" stroke="#E9D5A7" strokeWidth="1.2" />
          <circle cx="110" cy="68" r="4" fill="#E9D5A7" />
        </svg>
      );

    case 'diksha':
      return (
        <svg viewBox="0 0 220 120" className="w-full h-28" fill="none" aria-hidden="true">
          {/* Sacred Temple Arch */}
          <path
            d="M46 106V54C46 30 78 16 110 12C142 16 174 30 174 54V106"
            stroke="#D2AD68"
            strokeWidth="1.4"
          />
          <path
            d="M62 106V58C62 39 86 28 110 24C134 28 158 39 158 58V106"
            stroke="#E9D5A7"
            strokeWidth="0.9"
            opacity="0.7"
          />
          {/* Radiant Lotus */}
          <path
            d="M110 46C116 58 116 70 110 80C104 70 104 58 110 46Z"
            stroke="#E9D5A7"
            strokeWidth="1.2"
            fill="#E9D5A7"
            fillOpacity="0.24"
          />
          <path
            d="M110 80C100 72 91 64 90 54C98 58 105 68 110 80Z"
            stroke="#D2AD68"
            strokeWidth="1.1"
            fill="#D2AD68"
            fillOpacity="0.16"
          />
          <path
            d="M110 80C120 72 129 64 130 54C122 58 115 68 110 80Z"
            stroke="#D2AD68"
            strokeWidth="1.1"
            fill="#D2AD68"
            fillOpacity="0.16"
          />
          <line x1="70" y1="92" x2="150" y2="92" stroke="#D2AD68" strokeWidth="1.2" />
        </svg>
      );

    case 'drone-show':
      return (
        <svg viewBox="0 0 220 120" className="w-full h-28" fill="none" aria-hidden="true">
          {/* Night constellation drone formation */}
          <circle cx="110" cy="54" r="36" stroke="#D2AD68" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.6" />
          <circle cx="110" cy="54" r="22" stroke="#E9D5A7" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.75" />
          {/* Temple silhouette on horizon */}
          <path
            d="M24 106H196M80 106V88L95 78L110 64L125 78L140 88V106"
            stroke="#B18A48"
            strokeWidth="1.2"
            opacity="0.7"
          />
          {/* Luminous drone light nodes */}
          {[
            [110, 18], [134, 26], [146, 48], [138, 70], [82, 70], [74, 48], [86, 26],
            [110, 34], [126, 48], [94, 48], [52, 34], [168, 34], [44, 62], [176, 62],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="3.8" fill="#E9D5A7" fillOpacity="0.22" />
              <circle cx={cx} cy={cy} r="1.7" fill="#FFF7DF" />
            </g>
          ))}
        </svg>
      );

    case 'bhakti-night':
      return (
        <svg viewBox="0 0 220 120" className="w-full h-28" fill="none" aria-hidden="true">
          {/* Harmonic acoustic gold waves */}
          <path d="M22 60Q66 24 110 60T198 60" stroke="#E9D5A7" strokeWidth="1.3" opacity="0.85" />
          <path d="M22 60Q66 96 110 60T198 60" stroke="#D2AD68" strokeWidth="1.1" opacity="0.65" />
          <path d="M36 60Q73 36 110 60T184 60" stroke="#B18A48" strokeWidth="0.9" opacity="0.55" />
          {/* Central Veena / Swar Resonator Circle */}
          <circle cx="110" cy="60" r="20" stroke="#E9D5A7" strokeWidth="1.3" fill="#491C30" fillOpacity="0.55" />
          <circle cx="110" cy="60" r="12" stroke="#D2AD68" strokeWidth="0.9" strokeDasharray="2 2" />
          <circle cx="110" cy="60" r="3.5" fill="#E9D5A7" />
        </svg>
      );

    case 'pad-prakshalana':
      return (
        <svg viewBox="0 0 220 120" className="w-full h-28" fill="none" aria-hidden="true">
          {/* Sacred concentric floral lotus & kalash water ripples */}
          <ellipse cx="110" cy="92" rx="64" ry="12" stroke="#D2AD68" strokeWidth="1.1" opacity="0.7" />
          <ellipse cx="110" cy="92" rx="42" ry="7" stroke="#E9D5A7" strokeWidth="0.9" opacity="0.9" />
          {/* Kalash */}
          <path
            d="M94 64C94 52 126 52 126 64C126 76 118 82 110 82C102 82 94 76 94 64Z"
            stroke="#E9D5A7"
            strokeWidth="1.3"
            fill="#D2AD68"
            fillOpacity="0.2"
          />
          <path d="M100 50H120L116 55H104L100 50Z" stroke="#E9D5A7" strokeWidth="1.1" />
          <circle cx="110" cy="38" r="7" stroke="#E9D5A7" strokeWidth="1.1" fill="#E9D5A7" fillOpacity="0.22" />
          {/* Side floral petals */}
          <path d="M84 48C90 40 97 42 100 50" stroke="#D2AD68" strokeWidth="1.1" />
          <path d="M136 48C130 40 123 42 120 50" stroke="#D2AD68" strokeWidth="1.1" />
        </svg>
      );

    case 'mahapuja':
      return (
        <svg viewBox="0 0 220 120" className="w-full h-28" fill="none" aria-hidden="true">
          {/* Symmetrical 8-petal Ashtaprakari Mandala */}
          <circle cx="110" cy="60" r="42" stroke="#B18A48" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="110" cy="60" r="30" stroke="#E9D5A7" strokeWidth="1.2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <path
              key={angle}
              d="M110 34C114 44 114 52 110 60C106 52 106 44 110 34Z"
              stroke="#E9D5A7"
              strokeWidth="1"
              fill="#D2AD68"
              fillOpacity="0.2"
              transform={`rotate(${angle} 110 60)`}
            />
          ))}
          <circle cx="110" cy="60" r="7" fill="#173E35" stroke="#E9D5A7" strokeWidth="1.4" />
          <circle cx="110" cy="60" r="2.5" fill="#E9D5A7" />
        </svg>
      );
  }
};
