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
 *    Hosts portrait (head-to-knees) with the closed box anchored straight in their hands.
 *    Clicking unwraps ribbons strictly inside the box bounds, then performs a smooth,
 *    controlled zoom-in centered on the box that seamlessly enters Scene 2 without flashes.
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
  const hostsStageRef = useRef<HTMLDivElement | null>(null);
  const [hostsStageWidth, setHostsStageWidth] = useState(342);

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

  useEffect(() => {
    if (stage === 'open') return;
    const el = hostsStageRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        setHostsStageWidth(rect.width);
      }
    };
    updateSize();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateSize);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [stage]);

  // Animate top lid & bottom front flap smoothly open upon entering Scene 2
  useEffect(() => {
    if (stage === 'open') {
      setIsBoxOpened(false);
      setIsScrollRevealed(false);
      setRopePullY(0);
      const t = window.setTimeout(() => {
        setIsBoxOpened(true);
      }, 90);
      return () => window.clearTimeout(t);
    }
    setIsBoxOpened(false);
    setIsScrollRevealed(false);
    setRopePullY(0);
  }, [stage]);

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
  // SCENE 1: HOSTS PORTRAIT + CONTAINED RIBBON UNWRAP + SMOOTH ZOOM TRANSITION
  // ============================================================================
  if (stage === 'box' || stage === 'unwrapping' || stage === 'zooming') {
    const STAGE1_LID_W = 234;
    // Measured exact box bounds inside re-cropped 880x1100 image:
    // left: 31.48%, top: 37.36%, width: 35.45%, height: 28.36%
    // Box center: (49.205%, 51.54%)
    const baseBoxPx = hostsStageWidth * 0.3545;
    const restScale = baseBoxPx / STAGE1_LID_W;
    const isZooming = stage === 'zooming';

    return (
      <div className="flex flex-col items-center w-full animate-[fadeIn_0.45s_ease-out]">
        {/* Re-cropped 4:5 Head-to-Knees Hosts Portrait Frame with Box-Centered Zoom */}
        <div
          ref={hostsStageRef}
          className={`relative aspect-[4/5] w-full max-w-[342px] sm:max-w-[386px] mx-auto rounded-2xl transition-all duration-[950ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isZooming
              ? 'border-2 border-transparent shadow-none overflow-visible'
              : 'border-2 border-[#D2AD68]/80 shadow-[0_24px_60px_rgba(0,0,0,0.85)] bg-[#140E12] overflow-hidden'
          }`}
          style={{
            transformOrigin: '49.2% 51.5%',
            transform: isZooming ? 'scale(2.55)' : 'scale(1)',
          }}
        >
          {/* Clipped Hosts Photo + Hands Backdrop (dissolves gently during zoom into midnight backdrop) */}
          <div
            className={`absolute inset-0 rounded-2xl overflow-hidden transition-opacity duration-[780ms] ease-out ${
              isZooming ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {/* Subtle Inner Gold Trim */}
            <div
              className="pointer-events-none absolute inset-1.5 rounded-xl border border-[#E9D5A7]/30 z-40"
              aria-hidden="true"
            />

            {/* Re-cropped Head-to-Knees Hosts Backdrop */}
            <img
              src={CONFIG.images.hostsBoxScene}
              alt="सुमतिधाम परिवार — हाथों में मंगल बॉक्स लिए आत्मीय स्वागत"
              draggable={false}
              className="w-full h-full object-cover object-center select-none pointer-events-none"
            />

            {/* Soft Bottom Gradient Vignette */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#070D1C]/50 to-transparent z-10"
              aria-hidden="true"
            />

            {/* Natural Underside Contact Shadow onto Palms & Attire */}
            <div
              className="pointer-events-none absolute z-10 rounded-xl bg-black/60 blur-md"
              style={{
                left: '32.0%',
                top: '64.6%',
                width: '34.4%',
                height: '3.6%',
              }}
              aria-hidden="true"
            />
          </div>

          {/* Straight, Stationary, Clickable Mangal Box Anchored Inside Hosts' Hands */}
          <button
            type="button"
            data-sound-handled="true"
            onClick={() => {
              if (stage === 'box') onStartOpen();
            }}
            disabled={stage !== 'box'}
            aria-label={
              stage === 'box'
                ? 'मंगल बॉक्स खोलने के लिए क्लिक करें'
                : 'मंगल बॉक्स खुल रहा है'
            }
            className={`absolute z-20 flex items-center justify-center overflow-hidden rounded-[5px] focus-visible:outline-2 focus-visible:outline-[#E9D5A7] transition-opacity ${
              stage === 'box' ? 'cursor-pointer' : 'cursor-default'
            } ${
              isZooming
                ? 'opacity-0 delay-[620ms] duration-[380ms] ease-in'
                : 'opacity-100 duration-300'
            }`}
            style={{
              left: '31.48%',
              top: '37.36%',
              width: '35.45%',
              height: '28.36%',
              boxShadow: isZooming
                ? '0 22px 48px rgba(0, 0, 0, 0.72)'
                : '0 8px 18px rgba(10, 6, 12, 0.45)',
            }}
          >
            {/* Scaled Lid Surface Held Completely Straight & Contained */}
            <div
              className="relative shrink-0 royal-velvet-surface border-2 border-[#D2AD68] rounded-md overflow-hidden"
              style={{
                width: `${STAGE1_LID_W}px`,
                height: `${STAGE1_LID_W}px`,
                transform: `scale(${restScale})`,
                transformOrigin: 'center center',
              }}
            >
              {/* Inner Engraved Gold Trim & Filigrees */}
              <div className="absolute inset-2 rounded border border-[#E9D5A7]/45 pointer-events-none" />
              <CornerFiligree position="tl" size={20} className="absolute top-2.5 left-2.5" />
              <CornerFiligree position="tr" size={20} className="absolute top-2.5 right-2.5" />
              <CornerFiligree position="bl" size={20} className="absolute bottom-2.5 left-2.5" />
              <CornerFiligree position="br" size={20} className="absolute bottom-2.5 right-2.5" />

              {/* Subtle Breathing Gold Invite Highlight When Waiting for Click */}
              {stage === 'box' && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-[#E9D5A7]/40 animate-halo-breathe"
                  aria-hidden="true"
                />
              )}

              {/* Contained Vertical Satin Ribbon Track */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-7 z-10 overflow-hidden pointer-events-none">
                <div
                  className={`w-full h-full satin-gold-ribbon-v transition-all duration-600 ease-out ${
                    unwrapStep >= 3 ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                  }`}
                />
              </div>

              {/* Contained Horizontal Satin Ribbon Track */}
              <div className="absolute top-[34px] inset-x-0 h-6 z-10 flex overflow-hidden pointer-events-none">
                <div
                  className={`w-1/2 h-full satin-gold-ribbon-h transition-all duration-600 ease-out ${
                    unwrapStep >= 2 ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
                  }`}
                />
                <div
                  className={`w-1/2 h-full satin-gold-ribbon-h transition-all duration-600 ease-out ${
                    unwrapStep >= 2 ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
                  }`}
                />
              </div>

              {/* Contained Sculpted Golden Bow */}
              <div
                className={`absolute top-[10px] left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-500 ease-out ${
                  unwrapStep === 1
                    ? 'scale-95 opacity-60'
                    : unwrapStep >= 2
                      ? 'scale-75 opacity-0'
                      : 'scale-100 opacity-100'
                }`}
              >
                <svg width="112" height="52" viewBox="0 0 136 62" fill="none">
                  <defs>
                    <linearGradient id="bowLoopGradHosts" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F5E7C4" />
                      <stop offset="45%" stopColor="#D2AD68" />
                      <stop offset="100%" stopColor="#9C7331" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M58 34 L22 56 L36 58 L64 38 Z"
                    fill="url(#bowLoopGradHosts)"
                    className={`origin-center transition-transform duration-500 ${
                      unwrapStep >= 1 ? '-translate-x-2' : ''
                    }`}
                  />
                  <path
                    d="M78 34 L114 56 L100 58 L72 38 Z"
                    fill="url(#bowLoopGradHosts)"
                    className={`origin-center transition-transform duration-500 ${
                      unwrapStep >= 1 ? 'translate-x-2' : ''
                    }`}
                  />
                  <path
                    d="M64 29 C46 8, 12 10, 14 29 C16 46, 48 44, 64 31 Z"
                    fill="url(#bowLoopGradHosts)"
                    stroke="#E9D5A7"
                    strokeWidth="1"
                  />
                  <path
                    d="M72 29 C90 8, 124 10, 122 29 C120 46, 88 44, 72 31 Z"
                    fill="url(#bowLoopGradHosts)"
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

              {/* Central Official Sumati Dham Logo Seal (Scene 1 Closed Box Exterior) */}
              <div className="absolute inset-0 z-30 flex items-center justify-center pt-9 pointer-events-none">
                <div className="rounded-full p-1 bg-[#0B1428]/90 border border-[#D2AD68] shadow-[0_6px_22px_rgba(0,0,0,0.65)]">
                  <LogoPresentation variant="medallion" size={96} />
                </div>
              </div>
            </div>
          </button>

          {/* Foreground Hosts' Thumbs & Fingers Wrapping Naturally Over Bottom Corners */}
          <img
            src={CONFIG.images.hostsHandsOverlay}
            alt=""
            aria-hidden="true"
            draggable={false}
            className={`pointer-events-none absolute inset-0 w-full h-full object-cover object-center z-30 select-none transition-opacity duration-[700ms] ease-out ${
              isZooming ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>

        {/* Preserved Greeting & Open Action (fades out gently during zoom) */}
        <div
          className={`mt-3.5 flex flex-col items-center text-center space-y-3 transition-all duration-500 ${
            isZooming ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}
        >
          <p className="font-hindi-serif text-xl sm:text-2xl text-[#E9D5A7] font-semibold">
            {CONFIG.greeting}
          </p>

          {stage === 'box' && (
            <button
              type="button"
              data-sound-handled="true"
              onClick={onStartOpen}
              className="royal-btn-sheen min-h-[46px] px-7 py-2.5 rounded-full border border-[#D2AD68] bg-gradient-to-r from-[#B18A48] via-[#D2AD68] to-[#B18A48] text-[#0B1428] font-hindi-serif text-base font-bold shadow-[0_10px_28px_rgba(210,173,104,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              मंगल बॉक्स खोलें
            </button>
          )}

          {(stage === 'unwrapping' || stage === 'zooming') && (
            <p className="min-h-[46px] flex items-center font-hindi-body text-sm text-[#E9D5A7]">
              {stage === 'zooming' ? 'मंगल बॉक्स खुल रहा है...' : 'साटन रिबन खुल रहा है...'}
            </p>
          )}
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
    <div className="flex flex-col items-center w-full animate-[fadeIn_0.55s_ease-out]">
      {/* Subtle Top Greeting */}
      <p className="font-hindi-serif text-xl sm:text-2xl text-[#E9D5A7] font-semibold mb-3.5 sm:mb-4">
        {CONFIG.greeting}
      </p>

      {/* Straight Front-View Rigid Gift Box Assembly */}
      <div
        className="relative w-full max-w-[318px] sm:max-w-[376px] mx-auto flex flex-col items-center"
        style={{ perspective: '1050px' }}
      >
        {/* Soft Ambient Table Shadow Behind & Beneath Open Box */}
        <div
          className="pointer-events-none absolute -inset-x-4 top-8 bottom-2 rounded-3xl bg-black/55 blur-2xl -z-10"
          aria-hidden="true"
        />

        {/* 1. UPPER HINGED LID (Opens Upward; Maroon/Burgundy Inner Panel + Centered Logo) */}
        <div
          className="relative z-20 w-full transition-transform duration-[950ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transformOrigin: 'bottom center',
            transform: isBoxOpened
              ? 'perspective(900px) rotateX(10deg)'
              : 'perspective(900px) rotateX(-78deg)',
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
                  शाही मंगल निमंत्रण पत्र
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

                  {/* Pull-Through Interactive Rope & Gold Pull-Ring (Strictly Inside Box Bounds) */}
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

                    {/* Gold Pull Ring + Downward Arrow */}
                    <div className="relative -mt-0.5 flex flex-col items-center">
                      <div className="w-11 h-11 rounded-full border-2 border-[#FFF0C4] bg-gradient-to-b from-[#9B1C34] to-[#5E0C1D] shadow-[0_8px_20px_rgba(233,213,167,0.35)] flex items-center justify-center text-[#FFF3D6] hover:brightness-110 active:scale-95 transition-all">
                        <ArrowDown className="w-5 h-5 animate-pull-cue" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <p className="font-hindi-body text-[11px] sm:text-xs text-[#E9D5A7]/85 mt-1">
                    रस्सी नीचे खींचें या टैप करें
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
          className="relative z-20 w-[98%] -mt-[1px] transition-transform duration-[950ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transformOrigin: 'top center',
            transform: isBoxOpened
              ? 'perspective(760px) rotateX(-24deg)'
              : 'perspective(760px) rotateX(84deg)',
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
