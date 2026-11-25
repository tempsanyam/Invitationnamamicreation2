import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { CONFIG } from '../config/invitationConfig';
import { CornerFiligree, HeritageDivider, LogoPresentation } from './RoyalOrnaments';
import {
  playFarmanUnroll,
  playRopePullTick,
  playRoyalSuccess,
} from '../utils/royalSound';

interface Royal3DBoxProps {
  stage: 'box' | 'unwrapping' | 'zooming' | 'open';
  unwrapStep: 0 | 1 | 2 | 3;
  onStartOpen: () => void;
  onTriggerPetals: () => void;
  onEnterInvitation: () => void;
}

/**
 * Two-scene Royal Mangal Box experience:
 * 1. Scene 1 ('box' | 'unwrapping' | 'zooming'):
 *    Standalone 3D-extruded Royal Velvet & Antique-Gold Mangal Casket set before a
 *    luminous counter-rotating Sacred Mandala aura, with interactive 3D tilt, gold
 *    satin cross-ribbons, sculpted 3D bow, engraved Sumati Dham medallion seal,
 *    and a multi-beat unwrap + golden lid-peek zoom seamlessly into Scene 2.
 * 2. Scene 2 ('open'):
 *    Straight Front-View Open Rigid Gift Box featuring:
 *    - Upper hinged lid open upward with burgundy/maroon inner panel & centered Sumati Dham logo.
 *    - Unobstructed deep navy velvet interior chamber containing the centered Pull-Through Reveal.
 *    - Attached front flap folded open downward along the bottom edge.
 */
export const Royal3DBox: React.FC<Royal3DBoxProps> = ({
  stage,
  unwrapStep,
  onStartOpen,
  onTriggerPetals,
  onEnterInvitation,
}) => {
  // Gentle gallery pointer parallax on hover (returns strictly straight/level at rest)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Scene 2 coordinated lid + front-flap opening state
  const [isBoxOpened, setIsBoxOpened] = useState(false);

  // Centered Pull-Through Reveal state inside the open box chamber
  const [isScrollRevealed, setIsScrollRevealed] = useState(false);
  const [ropePullY, setRopePullY] = useState(0);
  const [isPullingRope, setIsPullingRope] = useState(false);
  const ropeStartYRef = useRef<number | null>(null);
  const ropeLastTickYRef = useRef(0);
  const ropeMovedRef = useRef(false);
  const ROPE_PULL_THRESHOLD = 30;
  const MAX_ROPE_PULL = 56;

  // Reset Scene 1 straight posture cleanly during unwrap/zoom, animate Scene 2 opening immediately
  useEffect(() => {
    if (stage === 'open') {
      setIsBoxOpened(false);
      setIsScrollRevealed(false);
      setRopePullY(0);
      let raf2 = 0;
      const raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => {
          setIsBoxOpened(true);
        });
      });
      return () => {
        window.cancelAnimationFrame(raf1);
        window.cancelAnimationFrame(raf2);
      };
    }
    setTilt({ rx: 0, ry: 0 });
    setIsBoxOpened(false);
    setIsScrollRevealed(false);
    setRopePullY(0);
  }, [stage]);

  const handleBoxPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (stage !== 'box' || e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Math.max(-4, Math.min(4, -ny * 7)),
      ry: Math.max(-4, Math.min(4, nx * 7)),
    });
  };

  const handleBoxPointerLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  const triggerRevealInsideBox = () => {
    if (isScrollRevealed) return;
    playFarmanUnroll();
    setRopePullY(MAX_ROPE_PULL);
    setIsScrollRevealed(true);
    onTriggerPetals();
  };

  const handleRopePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isScrollRevealed || !isBoxOpened) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    ropeStartYRef.current = e.clientY;
    ropeLastTickYRef.current = 0;
    ropeMovedRef.current = false;
    setIsPullingRope(true);
  };

  const handleRopePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPullingRope || ropeStartYRef.current === null || isScrollRevealed) return;
    const dy = e.clientY - ropeStartYRef.current;
    if (Math.abs(dy) > 5) ropeMovedRef.current = true;
    const clamped = Math.max(0, Math.min(MAX_ROPE_PULL, dy));
    if (clamped - ropeLastTickYRef.current >= 14) {
      ropeLastTickYRef.current = clamped;
      playRopePullTick();
    }
    setRopePullY(clamped);
    if (clamped >= ROPE_PULL_THRESHOLD) {
      setIsPullingRope(false);
      ropeStartYRef.current = null;
      triggerRevealInsideBox();
    }
  };

  const handleRopePointerEnd = () => {
    if (!isPullingRope || isScrollRevealed) return;
    setIsPullingRope(false);
    ropeStartYRef.current = null;

    if (!ropeMovedRef.current || ropePullY >= ROPE_PULL_THRESHOLD) {
      triggerRevealInsideBox();
    } else {
      setRopePullY(0);
    }
  };

  // ============================================================================
  // SCENE 1: LUXURY MUSEUM DIAMOND-EXHIBITION VITRINE & STEPPED VELVET PEDESTAL
  // ============================================================================
  if (stage === 'box' || stage === 'unwrapping' || stage === 'zooming') {
    const isZooming = stage === 'zooming';
    const isVitrineLifted = unwrapStep >= 1 || isZooming;

    const activeTransform = isZooming
      ? 'rotateX(0deg) rotateY(0deg) scale(1.48)'
      : stage === 'unwrapping'
        ? 'rotateX(0deg) rotateY(0deg) scale(1.04)'
        : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${isHovered ? 1.02 : 1})`;

    return (
      <div className="relative flex flex-col items-center w-full animate-[fadeIn_0.5s_ease-out]">
        {/* Overhead Volumetric Gallery Exhibition Spotlight Cone */}
        <div
          className={`pointer-events-none fixed left-1/2 top-0 -translate-x-1/2 w-[420px] sm:w-[580px] h-[520px] transition-opacity duration-700 ${
            isZooming ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            background:
              'conic-gradient(from 180deg at 50% -8%, transparent 142deg, rgba(233,213,167,0.13) 168deg, rgba(255,244,210,0.22) 180deg, rgba(233,213,167,0.13) 192deg, transparent 218deg)',
            maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Exhibition Showcase Assembly (Crystal Vitrine + Straight Mangal Box + Stepped Pedestal) */}
        <div className="relative flex flex-col items-center pt-1 pb-2">
          {/* Sacred Rotating Mandala Halo Subtle Behind Vitrine */}
          <div
            className={`pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[316px] h-[316px] sm:w-[376px] sm:h-[376px] transition-all duration-700 ${
              isZooming ? 'scale-125 opacity-0' : 'opacity-85'
            }`}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 320 320"
              className="w-full h-full animate-stone-cw"
              style={{ animationDuration: '52s' }}
              fill="none"
            >
              <circle
                cx="160"
                cy="160"
                r="152"
                stroke="#D2AD68"
                strokeOpacity="0.22"
                strokeWidth="0.9"
                strokeDasharray="3 5"
              />
              <circle
                cx="160"
                cy="160"
                r="138"
                stroke="#E9D5A7"
                strokeOpacity="0.16"
                strokeWidth="0.7"
              />
              {Array.from({ length: 16 }).map((_, i) => (
                <circle
                  key={i}
                  cx="160"
                  cy="8"
                  r="1.3"
                  fill="#F5E7C4"
                  fillOpacity="0.45"
                  transform={`rotate(${i * 22.5} 160 160)`}
                />
              ))}
            </svg>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* MUSEUM CRYSTAL GLASS VITRINE CHAMBER + STRAIGHT MANGAL BOX       */}
          {/* ---------------------------------------------------------------- */}
          <div className="relative flex flex-col items-center">
            {/* Crystal Glass Exhibition Bell-Jar / Vitrine Enclosure (Lifts on Unwrap) */}
            <div
              className={`pointer-events-none absolute -inset-x-6 -top-7 bottom-0 z-30 flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isVitrineLifted
                  ? '-translate-y-12 opacity-0 scale-[1.03]'
                  : 'translate-y-0 opacity-100 scale-100'
              }`}
              aria-hidden="true"
            >
              {/* Top Ornate Brass Finial Crown */}
              <div className="relative z-20 flex flex-col items-center -mb-[1px]">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-b from-[#FFF7DF] via-[#E9D5A7] to-[#8F6727] border border-[#FFF3D1] shadow-[0_0_12px_rgba(233,213,167,0.7)]" />
                <span className="w-9 h-2 rounded-t-full bg-gradient-to-r from-[#8F6C2E] via-[#F5E7C4] to-[#8F6C2E] border-t border-[#FFF3D1]/80" />
              </div>

              {/* Faceted Crystal Glass Showcase Body */}
              <div
                className="relative w-full flex-1 rounded-t-[26px] border-x-[1.5px] border-t-[1.5px] border-[#E9D5A7]/50 overflow-hidden shadow-[inset_0_14px_30px_rgba(255,248,225,0.12),inset_0_0_24px_rgba(12,24,48,0.45),0_0_28px_rgba(210,173,104,0.12)]"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,250,235,0.09) 0%, rgba(255,255,255,0.02) 38%, rgba(210,173,104,0.03) 68%, rgba(255,250,235,0.07) 100%)',
                }}
              >
                {/* Thin Inner Brass Vitrine Chamfer Lines (Left & Right Glass Facets) */}
                <div className="absolute inset-y-2 left-2.5 w-[1px] bg-gradient-to-b from-[#E9D5A7]/40 via-[#E9D5A7]/12 to-[#E9D5A7]/35" />
                <div className="absolute inset-y-2 right-2.5 w-[1px] bg-gradient-to-b from-[#E9D5A7]/40 via-[#E9D5A7]/12 to-[#E9D5A7]/35" />

                {/* Crisp Diagonal Museum Glass Reflection Highlight */}
                <div
                  className="absolute -top-10 -left-8 w-24 h-[140%] rotate-[22deg] opacity-35"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,252,240,0.28) 50%, transparent 100%)',
                  }}
                />
                <div
                  className="absolute -top-8 left-12 w-6 h-[140%] rotate-[22deg] opacity-25"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,252,240,0.32) 50%, transparent 100%)',
                  }}
                />

                {/* Upper Gallery Spot Rim Light Inside Glass Ceiling */}
                <div
                  className="absolute inset-x-10 top-0 h-5 rounded-b-full blur-md bg-[#FFF4D6]/25"
                />
              </div>
            </div>

            {/* Warm Upward Display Light Cast From Cushion Onto Box */}
            <div
              className={`pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 w-[210px] sm:w-[248px] h-10 rounded-full blur-lg bg-[#E9D5A7]/30 transition-opacity duration-500 ${
                isZooming ? 'opacity-0' : 'opacity-90'
              }`}
              aria-hidden="true"
            />

            {/* Perfectly Straight, Level, Symmetrical Royal Mangal Box */}
            <div
              className="relative z-20 pt-2 pb-1.5"
              style={{ perspective: '1050px' }}
            >
              <button
                type="button"
                data-sound-handled="true"
                onClick={() => {
                  if (stage === 'box') onStartOpen();
                }}
                onPointerMove={handleBoxPointerMove}
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={handleBoxPointerLeave}
                disabled={stage !== 'box'}
                aria-label={
                  stage === 'box'
                    ? 'मंगल बॉक्स खोलने के लिए क्लिक करें'
                    : 'मंगल बॉक्स खुल रहा है'
                }
                className={`group relative block w-[208px] sm:w-[242px] preserve-3d focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#E9D5A7] ${
                  stage === 'box' ? 'cursor-pointer' : 'cursor-default'
                } ${
                  isZooming
                    ? 'transition-transform duration-[540ms] ease-[cubic-bezier(0.22,1,0.36,1)] opacity-100'
                    : 'transition-transform duration-300 ease-out opacity-100'
                }`}
                style={{
                  transform: activeTransform,
                }}
              >
                {/* Main Square Royal Velvet Lid Face (Perfectly Aligned, Flush & Flat) */}
                <div className="relative w-full aspect-square rounded-t-[10px] rounded-b-[4px] royal-velvet-surface border-2 border-[#D2AD68] overflow-hidden shadow-[0_14px_34px_rgba(0,0,0,0.75),inset_0_0_22px_rgba(5,10,24,0.65)]">
                  {/* Bespoke Royal Jali Diamond Embroidery Pattern on Velvet */}
                  <svg
                    className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.09]"
                    aria-hidden="true"
                  >
                    <defs>
                      <pattern
                        id="boxVelvetJaliVitrine"
                        width="22"
                        height="22"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M11 1 L21 11 L11 21 L1 11 Z"
                          fill="none"
                          stroke="#E9D5A7"
                          strokeWidth="0.7"
                        />
                        <circle cx="11" cy="11" r="1" fill="#D2AD68" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#boxVelvetJaliVitrine)" />
                  </svg>

                  {/* Travelling Gold Specular Sheen Across Lid */}
                  {stage === 'box' && (
                    <span
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#FFF4D6]/14 to-transparent animate-light-sweep"
                      aria-hidden="true"
                    />
                  )}

                  {/* Double Engraved Antique-Gold Inner Borders & Corner Filigrees */}
                  <div className="pointer-events-none absolute inset-2.5 rounded-[7px] border border-[#E9D5A7]/55" />
                  <div className="pointer-events-none absolute inset-3.5 rounded-[5px] border border-[#D2AD68]/25" />

                  <CornerFiligree position="tl" size={22} className="absolute top-2.5 left-2.5" />
                  <CornerFiligree position="tr" size={22} className="absolute top-2.5 right-2.5" />
                  <CornerFiligree position="bl" size={22} className="absolute bottom-2.5 left-2.5" />
                  <CornerFiligree position="br" size={22} className="absolute bottom-2.5 right-2.5" />

                  {/* Vertical Gold Satin Ribbon */}
                  <div className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-7 z-10 overflow-hidden">
                    <div
                      className={`w-full h-full satin-gold-ribbon-v origin-center transition-all duration-400 ease-out ${
                        unwrapStep >= 3 ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-100'
                      }`}
                    />
                  </div>

                  {/* Horizontal Gold Satin Ribbon */}
                  <div className="pointer-events-none absolute top-[28%] inset-x-0 h-6 z-10 flex overflow-hidden">
                    <div
                      className={`w-1/2 h-full satin-gold-ribbon-h transition-all duration-500 ease-out ${
                        unwrapStep >= 2 ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
                      }`}
                    />
                    <div
                      className={`w-1/2 h-full satin-gold-ribbon-h transition-all duration-500 ease-out ${
                        unwrapStep >= 2 ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
                      }`}
                    />
                  </div>

                  {/* Sculpted Gold Satin Bow Centered Above Medallion */}
                  <div
                    className={`pointer-events-none absolute top-[13%] left-1/2 -translate-x-1/2 z-20 transition-all duration-450 ease-out ${
                      unwrapStep === 1
                        ? 'scale-105 opacity-75'
                        : unwrapStep >= 2
                          ? 'scale-75 -translate-y-3 opacity-0'
                          : 'scale-100 opacity-100'
                    }`}
                  >
                    <svg
                      width="124"
                      height="60"
                      viewBox="0 0 156 76"
                      fill="none"
                      className="drop-shadow-[0_6px_12px_rgba(6,10,22,0.75)]"
                    >
                      <defs>
                        <linearGradient id="bowLoopGradVitrine" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#FFF6DB" />
                          <stop offset="40%" stopColor="#E9D5A7" />
                          <stop offset="72%" stopColor="#D2AD68" />
                          <stop offset="100%" stopColor="#8F6727" />
                        </linearGradient>
                        <linearGradient id="bowInnerFoldVitrine" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7C561D" />
                          <stop offset="100%" stopColor="#C49A4E" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M68 42 L26 68 L42 70 L74 46 Z"
                        fill="url(#bowLoopGradVitrine)"
                        stroke="#E9D5A7"
                        strokeWidth="0.7"
                        className={`origin-center transition-transform duration-500 ${
                          unwrapStep >= 1 ? '-translate-x-3 rotate-6' : ''
                        }`}
                      />
                      <path
                        d="M88 42 L130 68 L114 70 L82 46 Z"
                        fill="url(#bowLoopGradVitrine)"
                        stroke="#E9D5A7"
                        strokeWidth="0.7"
                        className={`origin-center transition-transform duration-500 ${
                          unwrapStep >= 1 ? 'translate-x-3 -rotate-6' : ''
                        }`}
                      />
                      <path
                        d="M72 34 C54 14, 24 14, 24 34 C24 50, 56 48, 72 37 Z"
                        fill="url(#bowInnerFoldVitrine)"
                      />
                      <path
                        d="M84 34 C102 14, 132 14, 132 34 C132 50, 100 48, 84 37 Z"
                        fill="url(#bowInnerFoldVitrine)"
                      />
                      <path
                        d="M74 34 C52 8, 12 10, 14 33 C16 54, 54 50, 74 37 Z"
                        fill="url(#bowLoopGradVitrine)"
                        stroke="#FFF3D1"
                        strokeWidth="1.1"
                      />
                      <path
                        d="M82 34 C104 8, 144 10, 142 33 C140 54, 102 50, 82 37 Z"
                        fill="url(#bowLoopGradVitrine)"
                        stroke="#FFF3D1"
                        strokeWidth="1.1"
                      />
                      <rect
                        x="67"
                        y="23"
                        width="22"
                        height="24"
                        rx="7"
                        fill="url(#bowLoopGradVitrine)"
                        stroke="#8E6728"
                        strokeWidth="1.3"
                      />
                    </svg>
                  </div>

                  {/* Central Official Sumati Dham Medallion Clasp Seal */}
                  <div className="pointer-events-none absolute inset-x-0 top-[44%] flex items-center justify-center z-30">
                    <div
                      className={`relative flex items-center justify-center ${
                        unwrapStep >= 1 ? 'animate-seal-pulse' : ''
                      }`}
                    >
                      <svg
                        viewBox="0 0 144 144"
                        className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] animate-stone-cw"
                        style={{ animationDuration: unwrapStep >= 1 ? '4s' : '28s' }}
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="72"
                          cy="72"
                          r="68"
                          stroke="#D2AD68"
                          strokeOpacity="0.58"
                          strokeWidth="1"
                          strokeDasharray="3 4"
                        />
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                          <circle
                            key={deg}
                            cx="72"
                            cy="4"
                            r="1.9"
                            fill="#F5E7C4"
                            fillOpacity="0.85"
                            transform={`rotate(${deg} 72 72)`}
                          />
                        ))}
                      </svg>

                      <div className="relative rounded-full p-1 bg-gradient-to-b from-[#49182D] to-[#0B1428] border-2 border-[#E9D5A7]/90 shadow-[0_10px_24px_rgba(0,0,0,0.8)]">
                        <div className="sm:hidden">
                          <LogoPresentation variant="medallion" size={78} />
                        </div>
                        <div className="hidden sm:block">
                          <LogoPresentation variant="medallion" size={92} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Crisp Straight Rigid Casket Lower Edge (Gold Brass Rim + Burgundy Body Seated on Cushion) */}
                <div
                  className="relative mx-auto w-[99%] h-3 rounded-b-[6px] border-x-2 border-b-2 border-[#B18A48] overflow-hidden shadow-[0_8px_16px_rgba(0,0,0,0.75)]"
                  style={{
                    background:
                      'linear-gradient(180deg, #E9D5A7 0%, #9C7331 28%, #591C36 42%, #2E0B1A 100%)',
                  }}
                >
                  <div
                    className={`mx-auto w-7 h-full satin-gold-ribbon-v transition-opacity duration-400 ${
                      unwrapStep >= 3 ? 'opacity-0' : 'opacity-95'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* STEPPED HIGH-JEWELRY VELVET CUSHION & BRUSHED-BRASS MUSEUM PLINTH */}
          {/* ---------------------------------------------------------------- */}
          <div
            className={`pointer-events-none relative z-20 flex flex-col items-center -mt-0.5 transition-all duration-500 ${
              isZooming ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'
            }`}
            aria-hidden="true"
          >
            {/* Tier 1: Plump Burgundy-Velvet Jewelry Display Cushion With Warm LED Edge */}
            <div className="relative w-[238px] sm:w-[278px] h-4 rounded-t-[10px] border-t border-x border-[#E9D5A7]/70 overflow-hidden shadow-[0_-4px_18px_rgba(233,213,167,0.22),inset_0_2px_6px_rgba(255,244,210,0.22)]"
              style={{
                background:
                  'linear-gradient(180deg, #63213B 0%, #441328 58%, #280917 100%)',
              }}
            >
              {/* Crisp Illuminated Gallery Rim Light */}
              <div className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFF4D6] to-transparent opacity-85" />
            </div>

            {/* Tier 2: Chamfered Brushed Antique-Gold Brass Deck (Vitrine Floor) */}
            <div
              className="relative w-[264px] sm:w-[308px] h-2.5 rounded-t-[3px] border-t border-[#FFF4D6]/85 shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
              style={{
                background:
                  'linear-gradient(90deg, #7D5920 0%, #D2AD68 22%, #F5E7C4 50%, #D2AD68 78%, #7D5920 100%)',
              }}
            />

            {/* Tier 3: Stepped Dark Obsidian & Gold Engraved Museum Exhibition Pedestal */}
            <div
              className="relative w-[290px] sm:w-[338px] h-10 sm:h-11 rounded-b-[10px] border-x-[1.5px] border-b-[1.5px] border-[#B18A48]/85 flex flex-col items-center justify-center overflow-hidden shadow-[0_24px_46px_rgba(0,0,0,0.92),inset_0_4px_12px_rgba(0,0,0,0.75)]"
              style={{
                background:
                  'linear-gradient(180deg, #13223E 0%, #0B1428 45%, #060B18 100%)',
              }}
            >
              {/* Inner Engraved Gold Trim Frame */}
              <div className="absolute inset-x-3 inset-y-1.5 rounded-b-[6px] border border-[#D2AD68]/35" />

              {/* Center Faceted Gold Diamond Emblem Inlay on Plinth Front */}
              <div className="relative z-10 flex items-center justify-center gap-3 w-4/5">
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#D2AD68]/70" />
                <svg width="20" height="14" viewBox="0 0 24 16" fill="none">
                  <path
                    d="M12 1 L19 8 L12 15 L5 8 Z"
                    fill="#D2AD68"
                    fillOpacity="0.28"
                    stroke="#E9D5A7"
                    strokeWidth="1"
                  />
                  <circle cx="12" cy="8" r="2" fill="#FFF3D1" />
                </svg>
                <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#D2AD68]/70" />
              </div>
            </div>

            {/* Subtle Base Ground Contact Shadow */}
            <div className="w-[260px] sm:w-[310px] h-4 -mt-1 rounded-full bg-black/80 blur-md" />
          </div>
        </div>

        {/* Preserved Greeting, Occasion Anchor & Royal Action CTA */}
        <div
          className={`mt-2 flex flex-col items-center text-center space-y-2 transition-all duration-500 ${
            isZooming ? 'opacity-0 translate-y-3 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}
        >
          <p className="font-hindi-serif text-xl sm:text-2xl text-[#E9D5A7] font-semibold">
            {CONFIG.greeting}
          </p>

          <p className="font-hindi-body text-xs sm:text-sm text-[#E9D5A7]/80 tracking-wide">
            {CONFIG.venueName} • {CONFIG.datesDisplay}
          </p>

          <div className="pt-1.5">
            {stage === 'box' && (
              <button
                type="button"
                data-sound-handled="true"
                onClick={onStartOpen}
                className="royal-btn-sheen min-h-[48px] px-8 py-2.5 rounded-full border border-[#E9D5A7]/90 bg-gradient-to-r from-[#B18A48] via-[#E9D5A7] to-[#B18A48] text-[#0B1428] font-hindi-serif text-base font-bold shadow-[0_12px_32px_rgba(210,173,104,0.34)] hover:brightness-110 active:scale-95 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF3D1]"
              >
                मंगल बॉक्स खोलें
              </button>
            )}

            {(stage === 'unwrapping' || stage === 'zooming') && (
              <p className="min-h-[48px] flex items-center justify-center font-hindi-body text-sm text-[#E9D5A7]">
                {stage === 'zooming' ? 'मंगल बॉक्स खुल रहा है...' : 'प्रदर्शनी काँच व रिबन खुल रहे हैं...'}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // SCENE 2: STRAIGHT FRONT-VIEW OPEN ROYAL MANGAL BOX
  // - Top Hinged Lid Open Upward with Maroon/Burgundy Inner Panel & Centered Logo
  // - Main Velvet Box Cavity with Real Recessed Depth & Centered Pull-Through Reveal
  // - Attached Front Flap Folded Open Downward Along the Bottom Edge
  // ============================================================================
  const pullRatio = Math.min(1, ropePullY / MAX_ROPE_PULL);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Subtle Top Greeting */}
      <p className="font-hindi-serif text-xl sm:text-2xl text-[#E9D5A7] font-semibold mb-3.5 sm:mb-4 animate-[fadeIn_0.35s_ease-out]">
        {CONFIG.greeting}
      </p>

      {/* Straight Front-View Rigid Gift Box Assembly */}
      <div
        className="relative w-full max-w-[318px] sm:max-w-[376px] mx-auto flex flex-col items-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          perspective: '1050px',
          transform: isBoxOpened ? 'scale(1)' : 'scale(0.95)',
        }}
      >
        {/* Soft Ambient Table Shadow Behind & Beneath Open Box */}
        <div
          className="pointer-events-none absolute -inset-x-4 top-8 bottom-2 rounded-3xl bg-black/55 blur-2xl -z-10"
          aria-hidden="true"
        />

        {/* 1. UPPER HINGED LID (Opens Upward; Maroon/Burgundy Inner Panel + Centered Logo) */}
        <div
          className="relative z-20 w-full transition-transform duration-[680ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transformOrigin: 'bottom center',
            transform: isBoxOpened
              ? 'perspective(900px) rotateX(10deg)'
              : 'perspective(900px) rotateX(-52deg)',
          }}
        >
          {/* Outer Navy & Gold Top Lid Lip Thickness */}
          <div className="mx-auto w-[99%] h-2.5 rounded-t-lg bg-gradient-to-b from-[#1F375E] to-[#11203B] border-t-2 border-x-2 border-[#D2AD68] shadow-sm" />

          {/* Lid Inner Maroon/Burgundy Velvet Panel */}
          <div
            className="relative w-full h-[126px] sm:h-[144px] border-x-[6px] border-t-[4px] border-b-2 border-[#132341] shadow-[inset_0_8px_24px_rgba(0,0,0,0.6),0_-8px_28px_rgba(0,0,0,0.45)] flex items-center justify-center overflow-hidden"
            style={{
              background:
                'radial-gradient(circle at 50% 48%, #63213B 0%, #4A172D 54%, #310D1C 100%)',
            }}
          >
            {/* Outer Antique-Gold Rigid Rim Highlight */}
            <div className="pointer-events-none absolute inset-0 border-x border-t border-[#D2AD68]/80" />

            {/* Recessed Double Gold Trim & Corner Filigrees */}
            <div className="pointer-events-none absolute inset-2.5 rounded-sm border border-[#E9D5A7]/65" />
            <div className="pointer-events-none absolute inset-3.5 rounded-sm border border-[#D2AD68]/30" />
            <CornerFiligree position="tl" size={18} className="absolute top-3 left-3" />
            <CornerFiligree position="tr" size={18} className="absolute top-3 right-3" />
            <CornerFiligree position="bl" size={18} className="absolute bottom-3 left-3" />
            <CornerFiligree position="br" size={18} className="absolute bottom-3 right-3" />

            {/* Subtle Velvet Sheen Behind Centered Logo */}
            <div
              className="pointer-events-none absolute w-28 h-28 rounded-full bg-[#E9D5A7]/12 blur-lg"
              aria-hidden="true"
            />

            {/* Official Sumati Dham Logo Embedded Cleanly at Center of Maroon Panel */}
            <div className="relative z-10 flex items-center justify-center rounded-full p-1.5 bg-[#360E1F]/90 border border-[#D2AD68]/85 shadow-[0_6px_18px_rgba(0,0,0,0.55),inset_0_0_10px_rgba(233,213,167,0.22)]">
              <LogoPresentation variant="medallion" size={76} />
            </div>
          </div>

          {/* Seamless Top Lid Hinge Crease Line */}
          <div className="w-full h-[3px] bg-gradient-to-r from-[#8F6C2E] via-[#F2E0B6] to-[#8F6C2E] shadow-[0_2px_6px_rgba(0,0,0,0.75)]" />
        </div>

        {/* 2. MAIN OPEN BOX INTERIOR CHAMBER (Straight Front View, Deep Navy Velvet Cavity) */}
        <div
          className="relative z-10 w-[98%] border-x-[6px] border-[#152645] shadow-[inset_0_16px_32px_rgba(0,0,0,0.75),0_18px_38px_rgba(0,0,0,0.7)] transition-all duration-500 overflow-hidden"
          style={{
            background:
              'radial-gradient(circle at 50% 48%, #1A3054 0%, #101E38 64%, #091224 100%)',
          }}
        >
          {/* Rigid Outer Gold Rim Piping */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[1.5px] bg-[#D2AD68]/75 z-30" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[1.5px] bg-[#D2AD68]/75 z-30" />

          {/* 3D Recessed Inner Side & Top/Bottom Velvet Depth Walls */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-[#070E1C]/95 to-transparent border-b border-[#D2AD68]/20 z-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-3.5 bg-gradient-to-r from-[#081020]/95 via-[#0E1B33]/65 to-transparent border-r border-[#D2AD68]/20 z-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-3.5 bg-gradient-to-l from-[#081020]/95 via-[#0E1B33]/65 to-transparent border-l border-[#D2AD68]/20 z-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-[#070E1C]/95 to-transparent border-t border-[#D2AD68]/20 z-10"
            aria-hidden="true"
          />

          {/* Inner Engraved Velvet Bed Frame */}
          <div className="pointer-events-none absolute inset-4 rounded border border-[#E9D5A7]/30 z-10" />

          {/* CENTERED PULL-THROUGH REVEAL CONTAINER (Horizontally & Vertically Centered) */}
          <div
            className={`relative z-20 w-full flex flex-col items-center justify-center px-5 transition-all duration-700 ${
              isScrollRevealed
                ? 'py-5 min-h-[348px] sm:min-h-[364px]'
                : 'py-5 min-h-[232px] sm:min-h-[254px]'
            }`}
          >
            {/* SUB-STATE A: ROLLED ROYAL FARMAN SCROLL + PULL-THROUGH ROPE (Strictly Centered Inside Box) */}
            {!isScrollRevealed && (
              <div className="w-full flex flex-col items-center justify-center animate-[fadeIn_0.5s_ease-out]">
                {/* Compact Golden Header Line Inside Box */}
                <p className="font-hindi-serif text-xs sm:text-sm tracking-wide text-[#E9D5A7] mb-3">
                  मंगल निमंत्रण पत्र
                </p>

                {/* Crimson-Red Rolled Scroll Centered Inside Velvet Cavity */}
                <div className="relative w-[224px] sm:w-[258px] flex flex-col items-center justify-center">
                  <div
                    onClick={triggerRevealInsideBox}
                    className="relative w-full h-[64px] sm:h-[70px] rounded-full border-2 border-[#E9D5A7] shadow-[0_14px_30px_rgba(0,0,0,0.75)] flex items-center justify-between px-1 cursor-pointer"
                    style={{
                      background:
                        'linear-gradient(180deg, #B2223E 0%, #83142B 42%, #560B1B 78%, #35050F 100%)',
                    }}
                  >
                    {/* Subtle gold brocade border rings */}
                    <span className="pointer-events-none absolute inset-y-1.5 left-7 w-[1.5px] bg-[#E9D5A7]/50" />
                    <span className="pointer-events-none absolute inset-y-1.5 right-7 w-[1.5px] bg-[#E9D5A7]/50" />

                    {/* Left & Right Carved Gold Finials */}
                    <span className="relative z-10 w-5 h-[74px] sm:h-[80px] -ml-2 rounded bg-gradient-to-b from-[#FFF5D8] via-[#D2AD68] to-[#7D5A20] border border-[#E9D5A7] shadow-md" />
                    <span className="relative z-10 w-5 h-[74px] sm:h-[80px] -mr-2 rounded bg-gradient-to-b from-[#FFF5D8] via-[#D2AD68] to-[#7D5A20] border border-[#E9D5A7] shadow-md" />

                    {/* Center Tied Gold-Crimson Silk Ribbon Knot */}
                    <div
                      className="absolute left-1/2 top-0 bottom-0 z-20 flex flex-col items-center pointer-events-none"
                      style={{
                        transform: `translate(-50%, ${pullRatio * 6}px)`,
                      }}
                    >
                      <svg
                        width="44"
                        height="76"
                        viewBox="0 0 58 100"
                        fill="none"
                        className="-mt-1 drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)]"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id="boxCenterRopeGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#FFF5D8" />
                            <stop offset="50%" stopColor="#D2AD68" />
                            <stop offset="100%" stopColor="#946B25" />
                          </linearGradient>
                        </defs>
                        <rect
                          x="21"
                          y="0"
                          width="16"
                          height="92"
                          rx="5"
                          fill="url(#boxCenterRopeGrad)"
                          stroke="#5A0B1C"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M21 12 L37 22 M21 26 L37 36 M21 40 L37 50 M21 54 L37 64 M21 68 L37 78"
                          stroke="#721226"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="29"
                          cy="46"
                          r="7"
                          fill="#8B152F"
                          stroke="#FFF0C4"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Pull-Through Interactive Gold-Crimson Braided Rope & Pull-Ring (Strictly Inside Box Bounds) */}
                  <div
                    onPointerDown={handleRopePointerDown}
                    onPointerMove={handleRopePointerMove}
                    onPointerUp={handleRopePointerEnd}
                    onPointerCancel={handleRopePointerEnd}
                    role="button"
                    tabIndex={0}
                    data-sound-handled="true"
                    aria-label="नीचे खींचकर या टैप करके निमंत्रण खोलें"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        triggerRevealInsideBox();
                      }
                    }}
                    className="relative z-30 flex flex-col items-center cursor-grab active:cursor-grabbing -mt-0.5 pt-0.5 pb-1 px-8 focus-visible:outline-2 focus-visible:outline-[#E9D5A7]"
                    style={{ touchAction: 'none' }}
                  >
                    {/* Stretching Braided Rope Strand */}
                    <div
                      className="w-1.5 rounded-full border border-[#6E1224]/60 shadow"
                      style={{
                        height: `${24 + ropePullY * 0.55}px`,
                        background:
                          'repeating-linear-gradient(135deg, #FFF0C4 0px, #D2AD68 5px, #8F1831 5px, #8F1831 9px)',
                        transition: isPullingRope ? 'none' : 'height 0.3s ease',
                      }}
                    />

                    {/* Gold-Trimmed Pull Ring + Downward Arrow */}
                    <div className="relative -mt-0.5 flex flex-col items-center">
                      <div className="w-11 h-11 rounded-full border-2 border-[#FFF0C4] bg-gradient-to-b from-[#9B1C34] to-[#5E0C1D] shadow-[0_8px_20px_rgba(233,213,167,0.35)] flex items-center justify-center text-[#FFF3D6] hover:brightness-110 active:scale-95 transition-all">
                        <ArrowDown className="w-5 h-5 animate-pull-cue" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <p className="font-hindi-body text-[11px] sm:text-xs text-[#E9D5A7]/85 mt-1">
                    Rope नीचे खींचें या टैप करें
                  </p>
                </div>
              </div>
            )}

            {/* SUB-STATE B: UNROLLED ROYAL CRIMSON FARMAN INSIDE BOX CAVITY */}
            {isScrollRevealed && (
              <div className="w-full max-w-[276px] sm:max-w-[324px] mx-auto animate-farman-unfurl overflow-hidden">
                {/* Top Carved Gold Roller Rod */}
                <div className="relative mx-auto w-[98%] h-4 rounded-full bg-gradient-to-b from-[#FFF5DA] via-[#D2AD68] to-[#7D5B22] shadow-[0_6px_14px_rgba(0,0,0,0.7)] flex items-center justify-between px-0.5 z-30">
                  <span className="w-4 h-6 -ml-1 rounded bg-gradient-to-r from-[#8F6C2E] via-[#F5E7C4] to-[#B18A48] border border-[#E9D5A7]" />
                  <span className="w-4 h-6 -mr-1 rounded bg-gradient-to-l from-[#8F6C2E] via-[#F5E7C4] to-[#B18A48] border border-[#E9D5A7]" />
                </div>

                {/* Crimson Velvet Farman Body Centered Inside Box Walls */}
                <div
                  className="relative mx-auto w-[92%] border-x-2 border-[#E9D5A7] overflow-hidden shadow-[0_16px_38px_rgba(0,0,0,0.75)]"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 30%, #8F1B33 0%, #6D1125 48%, #450917 100%)',
                  }}
                >
                  {/* Engraved Inner Gold Frames */}
                  <div className="pointer-events-none absolute inset-2 border border-[#E9D5A7]/70" />
                  <div className="pointer-events-none absolute inset-3 border border-[#D2AD68]/30" />

                  <div className="relative z-10 px-4 py-4 sm:px-5 sm:py-5 flex flex-col items-center text-center space-y-2.5 text-[#FFF6E5]">
                    <div className="space-y-0.5">
                      <h2 className="font-hindi-serif text-xl sm:text-2xl font-bold text-[#FFF5DC] leading-tight">
                        सादर मंगल आमंत्रण
                      </h2>
                      <p className="font-hindi-body text-xs sm:text-[13px] text-[#F5DFB0]">
                        {CONFIG.organizer} सप्रेम आमंत्रित करता है
                      </p>
                    </div>

                    {/* Gold-Framed Royal Event Plaque */}
                    <div className="w-full rounded-lg bg-gradient-to-br from-[#2B0711]/90 via-[#3F0B19]/90 to-[#16223D]/95 border border-[#E9D5A7] px-3 py-2.5 text-center space-y-1">
                      <h1 className="font-hindi-serif royal-gold-title text-xl sm:text-2xl font-bold leading-tight">
                        {CONFIG.eventTitle}
                      </h1>
                      <p className="font-hindi-serif text-xs sm:text-sm font-semibold text-[#FFF1CC]">
                        {CONFIG.tagline}
                      </p>
                      <div className="pt-1 border-t border-[#E9D5A7]/30 mt-1">
                        <p className="font-hindi-serif text-xs sm:text-sm font-bold text-[#FFF6E5]">
                          {CONFIG.datesDisplay}
                        </p>
                        <p className="font-hindi-body text-[11px] sm:text-xs text-[#E9D5A7]">
                          {CONFIG.venueName}
                        </p>
                      </div>
                    </div>

                    <p className="font-hindi-body text-xs sm:text-[13px] text-[#FFF3DB]/95 leading-[1.6] px-0.5">
                      गुरु सान्निध्य एवं मांगलिक आयोजनों से सुसज्जित इस पावन त्रिदिवसीय महोत्सव में
                      आपकी सपरिवार उपस्थिति प्रार्थनीय है।
                    </p>

                    <HeritageDivider color="#E9D5A7" />

                    {/* Single Primary Action to Enter Full Invitation */}
                    <button
                      type="button"
                      data-sound-handled="true"
                      onClick={() => {
                        playRoyalSuccess();
                        onEnterInvitation();
                      }}
                      className="royal-btn-sheen w-full min-h-[46px] px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#B18A48] via-[#E9D5A7] to-[#D2AD68] hover:brightness-110 text-[#3B0814] border border-[#FFF3D1] font-hindi-serif text-sm sm:text-base font-bold shadow-[0_8px_20px_rgba(0,0,0,0.45)] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FFF3D1]"
                    >
                      महोत्सव में प्रवेश करें ›
                    </button>
                  </div>
                </div>

                {/* Bottom Carved Gold Roller Rod */}
                <div className="relative mx-auto w-[98%] h-4 rounded-full bg-gradient-to-b from-[#FFF5DA] via-[#D2AD68] to-[#7D5B22] shadow-[0_8px_16px_rgba(0,0,0,0.8)] flex items-center justify-between px-0.5 z-30">
                  <span className="w-4 h-6 -ml-1 rounded bg-gradient-to-r from-[#8F6C2E] via-[#F5E7C4] to-[#B18A48] border border-[#E9D5A7]" />
                  <span className="w-4 h-6 -mr-1 rounded bg-gradient-to-l from-[#8F6C2E] via-[#F5E7C4] to-[#B18A48] border border-[#E9D5A7]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. ATTACHED FRONT FLAP (Folds Open Downward Seamlessly Below Box Cavity) */}
        <div
          className="relative z-20 w-[98%] -mt-[1px] transition-transform duration-[680ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transformOrigin: 'top center',
            transform: isBoxOpened
              ? 'perspective(760px) rotateX(-24deg)'
              : 'perspective(760px) rotateX(58deg)',
          }}
        >
          {/* Continuous Golden Hinge Line Connecting Front Flap to Box Base */}
          <div className="w-full h-[4px] bg-gradient-to-r from-[#8F6C2E] via-[#F5E7C4] to-[#8F6C2E] shadow-[0_3px_8px_rgba(0,0,0,0.8)]" />

          {/* Unfolded Front Flap Body */}
          <div
            className="relative w-full h-[64px] sm:h-[74px] rounded-b-lg border-x-[6px] border-b-[6px] border-[#152645] shadow-[0_22px_36px_rgba(0,0,0,0.85),inset_0_8px_16px_rgba(0,0,0,0.55)] flex flex-col items-center justify-center overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, #3A1123 0%, #521A32 52%, #391021 100%)',
            }}
          >
            {/* Outer Gold Edge Rim */}
            <div className="pointer-events-none absolute inset-0 rounded-b border-x border-b border-[#D2AD68]/75" />

            {/* Inner Decorative Gold Trim Border */}
            <div className="pointer-events-none absolute inset-2 rounded-b-sm border border-[#E9D5A7]/50" />

            {/* Subtle Engraved Heritage Divider on Opened Flap */}
            <div className="w-3/4 opacity-80">
              <HeritageDivider color="#E9D5A7" />
            </div>

            {/* Subtle Gold Magnetic Closure Lip Detail at Bottom Center */}
            <div
              className="mt-1.5 w-14 h-1.5 rounded-full bg-gradient-to-r from-[#9C7331] via-[#F5E7C4] to-[#9C7331] shadow-sm"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
