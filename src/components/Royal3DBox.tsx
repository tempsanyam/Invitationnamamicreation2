import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Rotate3d } from 'lucide-react';
import { CONFIG } from '../config/invitationConfig';
import { CornerFiligree, LogoPresentation } from './RoyalOrnaments';
import { playRoyalTurn } from '../utils/royalSound';

interface Royal3DBoxProps {
  stage: 'box' | 'unwrapping' | 'open';
  unwrapStep: 0 | 1 | 2 | 3;
  isExtracting: boolean;
  onStartOpen: () => void;
  onExtractScroll: () => void;
}

/**
 * Genuine 6-faced 3D CSS Royal Gift Box with overhanging hinged lid,
 * 4-sided wrapping satin ribbons, inner velvet chamber with resting Farman scroll,
 * and full 360° pointer orbit.
 */
export const Royal3DBox: React.FC<Royal3DBoxProps> = ({
  stage,
  unwrapStep,
  isExtracting,
  onStartOpen,
  onExtractScroll,
}) => {
  // Default isometric view so 3D depth is visible immediately
  const [rotX, setRotX] = useState(-24);
  const [rotY, setRotY] = useState(-26);
  const [isOrbiting, setIsOrbiting] = useState(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    baseRotX: number;
    baseRotY: number;
    lastSoundAngle: number;
    moved: boolean;
  } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseRotX: rotX,
      baseRotY: rotY,
      lastSoundAngle: rotY,
      moved: false,
    };
    setIsOrbiting(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragRef.current.moved = true;
    }
    const nextRotY = dragRef.current.baseRotY + dx * 0.55;
    if (Math.abs(nextRotY - dragRef.current.lastSoundAngle) >= 42) {
      dragRef.current.lastSoundAngle = nextRotY;
      playRoyalTurn();
    }
    setRotY(nextRotY);
    setRotX(Math.max(-78, Math.min(28, dragRef.current.baseRotX - dy * 0.45)));
  };

  const handlePointerUp = () => {
    if (!dragRef.current) return;
    const wasTap = !dragRef.current.moved;
    dragRef.current = null;
    setIsOrbiting(false);

    if (wasTap && !isExtracting) {
      if (stage === 'box') {
        onStartOpen();
      } else if (stage === 'open') {
        onExtractScroll();
      }
    }
  };

  // Box physical geometry (px)
  const W = 224; // Box width & depth
  const H = 84;  // Box wall height
  const HALF = W / 2;
  const LID_W = 234;
  const LID_HALF = LID_W / 2;
  const LID_LIP = 22;

  const isLidOpen = stage === 'open';

  return (
    <div className="flex flex-col items-center w-full">
      {/* 3D Orbit Stage */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="region"
        aria-label="3D राजसी उपहार बॉक्स — चारों ओर घुमाकर देखें"
        className="relative w-full h-[300px] sm:h-[330px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: '1100px',
          touchAction: 'none',
        }}
      >
        {/* Soft Floor Ambient Shadow */}
        <div
          className="pointer-events-none absolute bottom-6 w-52 h-10 rounded-full blur-xl bg-black/75 animate-halo-breathe"
          aria-hidden="true"
        />

        {/* Gentle Levitation Wrapper when closed and idle */}
        <div className={`preserve-3d ${stage === 'box' && !isOrbiting ? 'animate-box-levitate' : ''}`}>
        {/* Rotatable 3D Box Assembly */}
        <div
          className="relative preserve-3d"
          style={{
            width: `${W}px`,
            height: `${W}px`,
            transform: isExtracting
              ? 'translateY(48px) rotateX(-16deg) rotateY(0deg) scale(0.92)'
              : `translateY(14px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            opacity: isExtracting ? 0.18 : 1,
            transition: isOrbiting
              ? 'none'
              : 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.9s ease',
          }}
        >
          {/* ==========================================================
              BOX BODY BOTTOM BASE (at Z = -H/2)
          ========================================================== */}
          <div
            className="absolute inset-0 bg-[#0B1325] border border-[#B18A48]/70"
            style={{
              transform: `translateZ(${-H / 2}px) rotateY(180deg)`,
              backfaceVisibility: 'visible',
            }}
          />

          {/* ==========================================================
              BOX INNER VELVET FLOOR + ROYAL SEAL + RESTING FARMAN SCROLL
          ========================================================== */}
          <div
            className="absolute inset-[2px] border border-[#D2AD68]/60 flex flex-col items-center justify-center preserve-3d"
            style={{
              transform: `translateZ(${-H / 2 + 8}px)`,
              background:
                'radial-gradient(circle at 50% 50%, #3A1527 0%, #142440 62%, #0B1428 100%)',
              boxShadow: isLidOpen
                ? 'inset 0 0 38px rgba(233, 213, 167, 0.45)'
                : 'inset 0 0 24px rgba(0, 0, 0, 0.85)',
            }}
          >
            {/* Golden Light Aura emerging from inside box */}
            {isLidOpen && (
              <div
                className="pointer-events-none absolute inset-4 rounded-full blur-lg bg-[#E9D5A7]/35 animate-halo-breathe"
                style={{ transform: 'translateZ(4px)' }}
                aria-hidden="true"
              />
            )}

            {/* Official Sumati Dham Logo Seal on Velvet Bed */}
            <div
              className={`flex flex-col items-center justify-center transition-all duration-700 ${
                isLidOpen ? 'opacity-95 scale-90 -translate-y-4' : 'opacity-60 scale-75'
              }`}
              style={{ transform: 'translateZ(6px)' }}
            >
              <div className="p-1 rounded-full border border-[#E9D5A7] bg-[#0B1428]/85 shadow-[0_0_20px_rgba(233,213,167,0.45)]">
                <LogoPresentation variant="medallion" size={64} />
              </div>
            </div>

            {/* 3D ROLLED ROYAL FARMAN SCROLL RESTING INSIDE BOX -> RISES OUT WHEN EXTRACTED */}
            <div
              className="preserve-3d pointer-events-none flex flex-col items-center"
              style={{
                transform: isExtracting
                  ? 'translateZ(200px) translateY(-120px) scale(1.5)'
                  : isLidOpen
                    ? 'translateZ(28px) translateY(24px) scale(1)'
                    : 'translateZ(12px) translateY(24px) scale(0.9)',
                transition: 'transform 0.95s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {/* Rolled Royal Crimson-Red Scroll + Gold Scroll Rods + Tied Braided Silk Rope (No Om) */}
              <div
                className="relative w-36 h-11 rounded-full border border-[#E9D5A7] shadow-[0_12px_24px_rgba(0,0,0,0.85)] flex items-center justify-between px-1"
                style={{
                  background:
                    'linear-gradient(180deg, #9B1C34 0%, #6B1124 46%, #3D0713 100%)',
                }}
              >
                {/* Left & Right Gold Finial Caps */}
                <span className="w-3.5 h-12 -ml-2 rounded-sm bg-gradient-to-b from-[#FFF3D1] via-[#D2AD68] to-[#8F6C2E] border border-[#E9D5A7] shadow" />
                <span className="w-3.5 h-12 -mr-2 rounded-sm bg-gradient-to-b from-[#FFF3D1] via-[#D2AD68] to-[#8F6C2E] border border-[#E9D5A7] shadow" />

                {/* Central Braided Gold & Silk Rope Band + Hanging Knot Tail */}
                <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex flex-col items-center">
                  <svg
                    width="34"
                    height="58"
                    viewBox="0 0 34 58"
                    fill="none"
                    className="-mt-0.5 drop-shadow-[0_4px_8px_rgba(0,0,0,0.75)]"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="boxRopeGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFF0C4" />
                        <stop offset="50%" stopColor="#D2AD68" />
                        <stop offset="100%" stopColor="#9D7228" />
                      </linearGradient>
                    </defs>
                    {/* Twisted braided rope wrapped tightly around the scroll */}
                    <rect
                      x="11"
                      y="0"
                      width="12"
                      height="44"
                      rx="4"
                      fill="url(#boxRopeGrad)"
                      stroke="#7A1428"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M11 8 L23 14 M11 16 L23 22 M11 24 L23 30 M11 32 L23 38"
                      stroke="#7A1428"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    {/* Central Royal Rope Knot */}
                    <circle
                      cx="17"
                      cy="22"
                      r="5.5"
                      fill="#E9D5A7"
                      stroke="#6E1224"
                      strokeWidth="1.4"
                    />
                    {/* Hanging Rope Tail & Tassel */}
                    <path
                      d="M17 28 C17 38, 17 44, 17 50"
                      stroke="#E9D5A7"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M17 48 L12 57 M17 48 L17 58 M17 48 L22 57"
                      stroke="#D2AD68"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================================
              4 OUTER VERTICAL BOX WALLS (Front, Back, Left, Right)
              Each carries a matching gold border & vertical satin ribbon
          ========================================================== */}
          {/* FRONT WALL (+Y in box plane -> rotateX(-90deg)) */}
          <div
            className="absolute left-0 right-0 royal-velvet-surface border-2 border-[#B18A48] overflow-hidden"
            style={{
              height: `${H}px`,
              top: `${HALF - H / 2}px`,
              transform: `rotateX(-90deg) translateZ(${HALF}px)`,
              boxShadow: 'inset 0 0 18px rgba(0,0,0,0.45)',
            }}
          >
            <div className="absolute inset-1.5 border border-[#E9D5A7]/35 pointer-events-none" />
            <div
              className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-7 satin-gold-ribbon-v transition-all duration-700 ${
                unwrapStep >= 3 ? 'translate-y-full opacity-0' : 'opacity-100'
              }`}
            />
          </div>

          {/* BACK WALL */}
          <div
            className="absolute left-0 right-0 royal-velvet-surface border-2 border-[#B18A48] overflow-hidden"
            style={{
              height: `${H}px`,
              top: `${HALF - H / 2}px`,
              transform: `rotateX(90deg) translateZ(${HALF}px)`,
              filter: 'brightness(0.82)',
            }}
          >
            <div className="absolute inset-1.5 border border-[#E9D5A7]/30 pointer-events-none" />
            <div
              className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-7 satin-gold-ribbon-v transition-all duration-700 ${
                unwrapStep >= 3 ? 'translate-y-full opacity-0' : 'opacity-100'
              }`}
            />
          </div>

          {/* RIGHT WALL */}
          <div
            className="absolute top-0 bottom-0 royal-velvet-surface border-2 border-[#B18A48] overflow-hidden"
            style={{
              width: `${H}px`,
              left: `${HALF - H / 2}px`,
              transform: `rotateY(90deg) translateZ(${HALF}px)`,
              filter: 'brightness(0.92)',
            }}
          >
            <div className="absolute inset-1.5 border border-[#E9D5A7]/35 pointer-events-none" />
            <div
              className={`absolute left-0 right-0 top-[24%] h-6 satin-gold-ribbon-h transition-all duration-700 ${
                unwrapStep >= 2 ? 'translate-y-full opacity-0' : 'opacity-100'
              }`}
            />
          </div>

          {/* LEFT WALL */}
          <div
            className="absolute top-0 bottom-0 royal-velvet-surface border-2 border-[#B18A48] overflow-hidden"
            style={{
              width: `${H}px`,
              left: `${HALF - H / 2}px`,
              transform: `rotateY(-90deg) translateZ(${HALF}px)`,
              filter: 'brightness(0.86)',
            }}
          >
            <div className="absolute inset-1.5 border border-[#E9D5A7]/35 pointer-events-none" />
            <div
              className={`absolute left-0 right-0 top-[24%] h-6 satin-gold-ribbon-h transition-all duration-700 ${
                unwrapStep >= 2 ? 'translate-y-full opacity-0' : 'opacity-100'
              }`}
            />
          </div>

          {/* ==========================================================
              HINGED 3D LID ASSEMBLY (Top + 4 overhanging lip walls + Inner lining)
              Hinges along back edge (top = -5px, origin = top center)
          ========================================================== */}
          <div
            className="absolute preserve-3d transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: `${LID_W}px`,
              height: `${LID_W}px`,
              left: `${(W - LID_W) / 2}px`,
              top: `${(W - LID_W) / 2}px`,
              transformOrigin: '50% 0%',
              transform: isLidOpen
                ? `translateZ(${H / 2 + 2}px) rotateX(108deg)`
                : `translateZ(${H / 2 + 2}px) rotateX(0deg)`,
            }}
          >
            {/* LID TOP SURFACE */}
            <div
              className="absolute inset-0 royal-velvet-surface border-2 border-[#D2AD68] rounded-md overflow-hidden"
              style={{
                transform: 'translateZ(2px)',
                backfaceVisibility: 'hidden',
                boxShadow: 'inset 0 1px 0 rgba(233,213,167,0.4)',
              }}
            >
              <div className="absolute inset-2 rounded border border-[#E9D5A7]/45 pointer-events-none" />
              <CornerFiligree position="tl" size={20} className="absolute top-2.5 left-2.5" />
              <CornerFiligree position="tr" size={20} className="absolute top-2.5 right-2.5" />
              <CornerFiligree position="bl" size={20} className="absolute bottom-2.5 left-2.5" />
              <CornerFiligree position="br" size={20} className="absolute bottom-2.5 right-2.5" />

              {/* Vertical Satin Ribbon on Lid Top (behind logo) */}
              <div
                className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-7 satin-gold-ribbon-v z-10 transition-all duration-700 ${
                  unwrapStep >= 3 ? 'translate-y-[115%] opacity-0' : 'opacity-100'
                }`}
              />

              {/* Horizontal Satin Ribbon on Lid Top (upper band, above logo) */}
              <div className="absolute top-[34px] left-0 right-0 h-6 z-10 flex overflow-hidden pointer-events-none">
                <div
                  className={`w-1/2 h-full satin-gold-ribbon-h transition-all duration-700 ${
                    unwrapStep >= 2 ? '-translate-x-full opacity-0' : ''
                  }`}
                />
                <div
                  className={`w-1/2 h-full satin-gold-ribbon-h transition-all duration-700 ${
                    unwrapStep >= 2 ? 'translate-x-full opacity-0' : ''
                  }`}
                />
              </div>

              {/* Sculpted 3D Bow — Positioned ABOVE central logo plaque */}
              <div
                className={`absolute top-[10px] left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-700 ${
                  unwrapStep === 1
                    ? 'scale-105'
                    : unwrapStep >= 2
                      ? '-translate-y-10 scale-75 opacity-0'
                      : ''
                }`}
              >
                <svg width="112" height="52" viewBox="0 0 136 62" fill="none">
                  <defs>
                    <linearGradient id="bowLoopGrad3d" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F5E7C4" />
                      <stop offset="45%" stopColor="#D2AD68" />
                      <stop offset="100%" stopColor="#9C7331" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M58 34 L22 56 L36 58 L64 38 Z"
                    fill="url(#bowLoopGrad3d)"
                    className={`origin-center transition-transform duration-500 ${
                      unwrapStep >= 1 ? '-translate-x-3 rotate-6' : ''
                    }`}
                  />
                  <path
                    d="M78 34 L114 56 L100 58 L72 38 Z"
                    fill="url(#bowLoopGrad3d)"
                    className={`origin-center transition-transform duration-500 ${
                      unwrapStep >= 1 ? 'translate-x-3 -rotate-6' : ''
                    }`}
                  />
                  <path
                    d="M64 29 C46 8, 12 10, 14 29 C16 46, 48 44, 64 31 Z"
                    fill="url(#bowLoopGrad3d)"
                    stroke="#E9D5A7"
                    strokeWidth="1"
                  />
                  <path
                    d="M72 29 C90 8, 124 10, 122 29 C120 46, 88 44, 72 31 Z"
                    fill="url(#bowLoopGrad3d)"
                    stroke="#E9D5A7"
                    strokeWidth="1"
                  />
                  <rect
                    x="58"
                    y="20"
                    width="20"
                    height="20"
                    rx="6"
                    fill="#E9D5A7"
                    stroke="#8E6728"
                    strokeWidth="1.2"
                  />
                </svg>
              </div>

              {/* Dedicated Central Logo Container (z-30) — 100% Unobstructed */}
              <div className="absolute inset-0 z-30 flex items-center justify-center pt-9 pointer-events-none">
                <div className="rounded-full p-1 bg-[#0B1428]/90 border border-[#D2AD68] shadow-[0_6px_22px_rgba(0,0,0,0.65)]">
                  <LogoPresentation variant="medallion" size={96} />
                </div>
              </div>
            </div>

            {/* LID UNDERSIDE (Burgundy & Gold lining visible when opened!) */}
            <div
              className="absolute inset-0 bg-[#491C30] border-2 border-[#D2AD68] rounded-md flex flex-col items-center justify-center p-4 text-center"
              style={{
                transform: 'rotateX(180deg) translateZ(1px)',
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="absolute inset-2 border border-[#E9D5A7]/50 rounded pointer-events-none" />
              <p className="font-hindi-serif text-base font-bold text-[#E9D5A7]">
                {CONFIG.eventTitle}
              </p>
              <p className="font-hindi-body text-xs text-[#F8F1E4]/90 mt-1">
                {CONFIG.datesDisplay}
              </p>
            </div>

            {/* LID 4 OVERHANGING LIP SIDES */}
            <div
              className="absolute left-0 right-0 bg-[#1B3054] border border-[#D2AD68]"
              style={{
                height: `${LID_LIP}px`,
                top: `${LID_HALF - LID_LIP / 2}px`,
                transform: `rotateX(-90deg) translateZ(${LID_HALF}px) translateY(${LID_LIP / 2}px)`,
              }}
            />
            <div
              className="absolute left-0 right-0 bg-[#11203A] border border-[#B18A48]"
              style={{
                height: `${LID_LIP}px`,
                top: `${LID_HALF - LID_LIP / 2}px`,
                transform: `rotateX(90deg) translateZ(${LID_HALF}px) translateY(${-LID_LIP / 2}px)`,
              }}
            />
            <div
              className="absolute top-0 bottom-0 bg-[#182B4B] border border-[#D2AD68]"
              style={{
                width: `${LID_LIP}px`,
                left: `${LID_HALF - LID_LIP / 2}px`,
                transform: `rotateY(90deg) translateZ(${LID_HALF}px) translateX(${-LID_LIP / 2}px)`,
              }}
            />
            <div
              className="absolute top-0 bottom-0 bg-[#142542] border border-[#B18A48]"
              style={{
                width: `${LID_LIP}px`,
                left: `${LID_HALF - LID_LIP / 2}px`,
                transform: `rotateY(-90deg) translateZ(${LID_HALF}px) translateX(${LID_LIP / 2}px)`,
              }}
            />
          </div>
        </div>
        </div>
      </div>

      {/* Controls & 360 Orbit Guidance */}
      <div className="mt-2 flex flex-col items-center text-center space-y-3">
        <p className="font-hindi-serif text-xl sm:text-2xl text-[#E9D5A7] font-semibold">
          {CONFIG.greeting}
        </p>

        <div className="flex items-center justify-center gap-3 text-[#D2AD68]/90">
          <button
            type="button"
            data-sound-handled="true"
            onClick={() => {
              playRoyalTurn();
              setRotY((y) => y - 60);
            }}
            aria-label="बाएँ घुमाएँ"
            className="w-8 h-8 rounded-full border border-[#D2AD68]/50 bg-[#142440]/85 hover:bg-[#1D3455] flex items-center justify-center transition-colors active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <Rotate3d className="w-4 h-4 text-[#E9D5A7]/85" aria-hidden="true" />
          <button
            type="button"
            data-sound-handled="true"
            onClick={() => {
              playRoyalTurn();
              setRotY((y) => y + 60);
            }}
            aria-label="दाएँ घुमाएँ"
            className="w-8 h-8 rounded-full border border-[#D2AD68]/50 bg-[#142440]/85 hover:bg-[#1D3455] flex items-center justify-center transition-colors active:scale-90"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {stage === 'box' && (
          <button
            type="button"
            data-sound-handled="true"
            onClick={onStartOpen}
            className="royal-btn-sheen min-h-[46px] px-7 py-2.5 rounded-full border border-[#D2AD68] bg-gradient-to-r from-[#B18A48] via-[#D2AD68] to-[#B18A48] text-[#0B1428] font-hindi-serif text-base font-bold shadow-[0_10px_28px_rgba(210,173,104,0.3)] hover:brightness-110 active:scale-95 transition-all"
          >
            मंगल बॉक्स खोलें
          </button>
        )}

        {stage === 'unwrapping' && (
          <p className="min-h-[46px] flex items-center font-hindi-body text-sm text-[#E9D5A7]">
            साटन रिबन खुल रहा है...
          </p>
        )}

        {stage === 'open' && !isExtracting && (
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              data-sound-handled="true"
              onClick={() => {
                playRoyalTurn();
                setRotX(-24);
                setRotY((y) => y + 360);
              }}
              className="min-h-[44px] px-4 py-2 rounded-full border border-[#D2AD68]/65 bg-[#142440] text-[#E9D5A7] font-hindi-body text-xs sm:text-sm hover:bg-[#1D3455] transition-colors"
            >
              360° घुमाएँ
            </button>
            <button
              type="button"
              data-sound-handled="true"
              onClick={onExtractScroll}
              className="royal-btn-sheen min-h-[46px] px-6 py-2.5 rounded-full border border-[#E9D5A7] bg-gradient-to-r from-[#B18A48] via-[#D2AD68] to-[#B18A48] text-[#0B1428] font-hindi-serif text-sm sm:text-base font-bold shadow-[0_10px_28px_rgba(210,173,104,0.35)] hover:brightness-110 active:scale-95 transition-all"
            >
              निमंत्रण बाहर निकालें
            </button>
          </div>
        )}

        {isExtracting && (
          <p className="min-h-[46px] flex items-center font-hindi-body text-sm text-[#E9D5A7]">
            बॉक्स से शाही फ़रमान निकल रहा है...
          </p>
        )}
      </div>
    </div>
  );
};
