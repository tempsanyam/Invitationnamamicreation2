import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Crown } from 'lucide-react';
import { CONFIG } from '../config/invitationConfig';
import {
  CornerFiligree,
  GoldDustField,
  HeritageDivider,
  LogoPresentation,
  RoyalGoldenToran,
  RoyalJaliArchBackdrop,
} from './RoyalOrnaments';
import { GoldenPetalShower } from './RoyalEffects';
import { Royal3DBox } from './Royal3DBox';
import {
  playBoxOpen,
  playFarmanUnroll,
  playRibbonStep,
  playRopePullTick,
  playRoyalSlide,
  playRoyalSuccess,
  playScrollExtract,
} from '../utils/royalSound';

export type OpeningStage = 'box' | 'unwrapping' | 'opening' | 'farman';

interface OpeningSequenceProps {
  onComplete: () => void;
}

export const OpeningSequence: React.FC<OpeningSequenceProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<OpeningStage>('box');
  const [unwrapStep, setUnwrapStep] = useState<0 | 1 | 2 | 3>(0);
  const [isExtracting, setIsExtracting] = useState(false);

  // Dedicated Rolled Scroll + Pull-the-Rope state
  const [isRopeUntied, setIsRopeUntied] = useState(false);
  const [ropePullY, setRopePullY] = useState(0);
  const [isPullingRope, setIsPullingRope] = useState(false);
  const ropeStartYRef = useRef<number | null>(null);
  const ropeLastTickYRef = useRef(0);
  const ropeMovedRef = useRef(false);
  const ROPE_PULL_THRESHOLD = 38;
  const MAX_ROPE_PULL = 110;

  const [petalKey, setPetalKey] = useState(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  // Trigger sequential 3D gift-box unwrapping -> lid hinges open (stays rotatable 360°)
  const handleBoxOpen = () => {
    if (stage !== 'box') return;
    setStage('unwrapping');
    setUnwrapStep(1);
    playRibbonStep(1);

    const t1 = window.setTimeout(() => {
      setUnwrapStep(2);
      playRibbonStep(2);
    }, 700);
    const t2 = window.setTimeout(() => {
      setUnwrapStep(3);
      playRibbonStep(3);
    }, 1400);
    const t3 = window.setTimeout(() => {
      setStage('opening');
      playBoxOpen();
    }, 2100);

    timersRef.current.push(t1, t2, t3);
  };

  // Extract tied scroll out of the 3D Box -> transitions to dedicated Rolled-Scroll screen
  const handleExtractScroll = () => {
    if (isExtracting || stage !== 'opening') return;
    clearTimers();
    playScrollExtract();
    setIsExtracting(true);
    const t = window.setTimeout(() => {
      setIsExtracting(false);
      setIsRopeUntied(false);
      setRopePullY(0);
      setStage('farman');
    }, 900);
    timersRef.current.push(t);
  };

  // Unfasten rope & unroll the full Royal Crimson-Red Maharaja Farman
  const triggerUntieAndUnroll = () => {
    if (isRopeUntied) return;
    playFarmanUnroll();
    setRopePullY(MAX_ROPE_PULL);
    setIsRopeUntied(true);
    setPetalKey((k) => k + 1);
  };

  const handleRopePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isRopeUntied) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    ropeStartYRef.current = e.clientY;
    ropeLastTickYRef.current = 0;
    ropeMovedRef.current = false;
    setIsPullingRope(true);
  };

  const handleRopePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPullingRope || ropeStartYRef.current === null || isRopeUntied) return;
    const dy = e.clientY - ropeStartYRef.current;
    if (Math.abs(dy) > 5) ropeMovedRef.current = true;
    const clamped = Math.max(0, Math.min(MAX_ROPE_PULL, dy));
    if (clamped - ropeLastTickYRef.current >= 16) {
      ropeLastTickYRef.current = clamped;
      playRopePullTick();
    }
    setRopePullY(clamped);
    if (clamped >= ROPE_PULL_THRESHOLD) {
      setIsPullingRope(false);
      ropeStartYRef.current = null;
      triggerUntieAndUnroll();
    }
  };

  const handleRopePointerEnd = () => {
    if (!isPullingRope || isRopeUntied) return;
    setIsPullingRope(false);
    ropeStartYRef.current = null;

    if (!ropeMovedRef.current || ropePullY >= ROPE_PULL_THRESHOLD) {
      triggerUntieAndUnroll();
    } else {
      setRopePullY(0);
    }
  };

  const ropeStretch = Math.min(1, ropePullY / MAX_ROPE_PULL);

  return (
    <div
      className="relative min-h-svh-safe w-full overflow-x-hidden overflow-y-auto bg-[#070D1C] flex flex-col items-center justify-center px-4 py-8 select-none"
      style={{
        paddingTop: 'max(20px, env(safe-area-inset-top))',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
      }}
    >
      <GoldenPetalShower triggerKey={petalKey} />

      {/* Atmospheric Royal Crimson-and-Midnight Palace Backdrop */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            stage === 'farman'
              ? 'radial-gradient(circle at 50% 35%, rgba(145, 24, 48, 0.34) 0%, rgba(44, 11, 22, 0.72) 48%, #070D1C 90%)'
              : 'radial-gradient(circle at 50% 38%, rgba(210, 173, 104, 0.16) 0%, rgba(18, 33, 59, 0.62) 48%, #070D1C 88%)',
        }}
        aria-hidden="true"
      />
      <RoyalJaliArchBackdrop />
      <GoldDustField />

      {/* Corner Filigree Frames */}
      <div className="pointer-events-none fixed inset-3 sm:inset-5">
        <CornerFiligree position="tl" className="absolute top-0 left-0" />
        <CornerFiligree position="tr" className="absolute top-0 right-0" />
        <CornerFiligree position="bl" className="absolute bottom-0 left-0" />
        <CornerFiligree position="br" className="absolute bottom-0 right-0" />
      </div>

      {/* Single Clean Top-Right Skip Control */}
      <button
        type="button"
        data-sound-handled="true"
        onClick={() => {
          playRoyalSlide();
          clearTimers();
          onComplete();
        }}
        className="fixed z-50 min-h-[44px] px-4 py-2 rounded-full border border-[#B18A48]/55 bg-[#070D1C]/85 backdrop-blur-sm text-[#E9D5A7] hover:text-[#F9F3E7] hover:border-[#D2AD68] transition-colors font-hindi-body text-xs sm:text-sm tracking-wide flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[#E9D5A7]"
        style={{
          top: 'max(14px, env(safe-area-inset-top))',
          right: 'max(16px, env(safe-area-inset-right))',
        }}
        aria-label="सीधे मुख्य आमंत्रण पर जाएँ"
      >
        <span>सीधे आमंत्रण देखें</span>
        <span aria-hidden="true">›</span>
      </button>

      {/* ============================================================
          STAGES A, B, C: REAL 360° 3D ROYAL GIFT BOX
      ============================================================ */}
      {(stage === 'box' || stage === 'unwrapping' || stage === 'opening') && (
        <div className="relative z-20 w-full max-w-[400px] flex flex-col items-center text-center animate-[fadeIn_0.5s_ease-out]">
          <Royal3DBox
            stage={stage === 'opening' ? 'open' : stage}
            unwrapStep={unwrapStep}
            isExtracting={isExtracting}
            onStartOpen={handleBoxOpen}
            onExtractScroll={handleExtractScroll}
          />
        </div>
      )}

      {/* ============================================================
          STAGE D: DEDICATED ROLLED SCROLL WITH TIED SILK ROPE -> UNROLLS
          INTO ROYAL CRIMSON-RED MAHARAJA FARMAN (शाही लाल आमंत्रण पत्र)
      ============================================================ */}
      {stage === 'farman' && (
        <div className="relative z-20 w-full max-w-[432px] pt-8 sm:pt-4 flex flex-col items-center text-center animate-[fadeIn_0.6s_ease-out]">
          {/* Outer Maharaja Darbar Crimson-Gold Canopy */}
          <div className="relative w-full rounded-t-[170px] rounded-b-3xl border-2 border-[#D2AD68]/85 bg-gradient-to-b from-[#4B0E1E]/95 via-[#2C0915]/96 to-[#130812]/98 px-3 pt-4 pb-5 sm:px-5 shadow-[0_32px_75px_rgba(0,0,0,0.9)]">
            <CornerFiligree position="bl" size={26} className="absolute bottom-3 left-3" />
            <CornerFiligree position="br" size={26} className="absolute bottom-3 right-3" />

            {/* Palace Golden Toran Canopy Arch */}
            <RoyalGoldenToran className="mx-auto -mt-1 mb-1 opacity-95" />

            {/* Rotating Royal Carved Stone Chakra Crown */}
            <div className="relative mx-auto -mt-2 mb-2 w-[92px] h-[92px] flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full blur-xl bg-[#D2AD68]/30 pointer-events-none"
                aria-hidden="true"
              />
              <svg
                viewBox="0 0 300 300"
                className="absolute inset-0 w-full h-full animate-stone-cw drop-shadow-[0_10px_20px_rgba(0,0,0,0.75)]"
                aria-hidden="true"
              >
                <defs>
                  <radialGradient id="maharajaCrimsonStoneGrad" cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#A09B93" />
                    <stop offset="55%" stopColor="#65625B" />
                    <stop offset="100%" stopColor="#322F2C" />
                  </radialGradient>
                </defs>
                <circle
                  cx="150"
                  cy="150"
                  r="142"
                  fill="url(#maharajaCrimsonStoneGrad)"
                  stroke="#D2AD68"
                  strokeWidth="4"
                />
                <circle cx="150" cy="150" r="128" fill="none" stroke="#17151A" strokeWidth="2.5" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <g key={i} transform={`rotate(${i * 15} 150 150)`}>
                    <path d="M150 10 L156 26 L144 26 Z" fill="#E9D5A7" opacity="0.92" />
                  </g>
                ))}
              </svg>
              <svg
                viewBox="0 0 240 240"
                className="absolute w-[78%] h-[78%] animate-stone-ccw"
                aria-hidden="true"
              >
                <circle cx="120" cy="120" r="112" fill="#4B0E1E" stroke="#E9D5A7" strokeWidth="3" />
                {Array.from({ length: 16 }).map((_, i) => (
                  <path
                    key={i}
                    d="M120 18 C124 27, 124 33, 120 39 C116 33, 116 27, 120 18 Z"
                    fill="#E9D5A7"
                    opacity="0.88"
                    transform={`rotate(${i * 22.5} 120 120)`}
                  />
                ))}
              </svg>
              <div className="relative z-10 rounded-full p-1 bg-[#2A0813] border border-[#E9D5A7]">
                <LogoPresentation variant="medallion" size={44} />
              </div>
            </div>

            {/* Royal Decree Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full border border-[#E9D5A7]/70 bg-gradient-to-r from-[#7A162D] via-[#981D38] to-[#7A162D] text-[#FFF3D6] font-hindi-serif text-xs sm:text-sm font-semibold mb-4 shadow-md">
              <Crown className="w-3.5 h-3.5 text-[#F5E7C4]" aria-hidden="true" />
              <span>शाही मंगल निमंत्रण पत्र</span>
              <Crown className="w-3.5 h-3.5 text-[#F5E7C4]" aria-hidden="true" />
            </div>

            {/* ========================================================
                SUB-STATE 1: ROLLED SCROLL BOUND BY SILK ROPE (रस्सी)
                Shows rolled crimson-gold cylinder + arrow cue to pull rope
            ======================================================== */}
            {!isRopeUntied && (
              <div className="w-full flex flex-col items-center py-4 animate-[fadeIn_0.45s_ease-out]">
                {/* Rolled Crimson-Red Royal Cylinder bound tightly by Golden Silk Rope */}
                <div className="relative w-[92%] flex flex-col items-center">
                  {/* Upper Gold Rod & Velvet Crimson Roll */}
                  <div
                    className="relative w-full h-24 rounded-full border-2 border-[#E9D5A7] shadow-[0_22px_45px_rgba(0,0,0,0.88)] flex items-center justify-between px-1"
                    style={{
                      background:
                        'linear-gradient(180deg, #B2223E 0%, #83142B 38%, #560B1B 74%, #35050F 100%)',
                    }}
                  >
                    {/* Subtle gold brocade border rings along cylinder */}
                    <span className="pointer-events-none absolute inset-y-2 left-8 w-[2px] bg-[#E9D5A7]/50" />
                    <span className="pointer-events-none absolute inset-y-2 right-8 w-[2px] bg-[#E9D5A7]/50" />

                    {/* Left & Right Heavy Carved Gold Finials */}
                    <span className="relative z-10 w-6 h-28 -ml-2.5 rounded bg-gradient-to-b from-[#FFF5D8] via-[#D2AD68] to-[#7D5A20] border border-[#E9D5A7] shadow-lg" />
                    <span className="relative z-10 w-6 h-28 -mr-2.5 rounded bg-gradient-to-b from-[#FFF5D8] via-[#D2AD68] to-[#7D5A20] border border-[#E9D5A7] shadow-lg" />

                    {/* Braided Gold-and-Red Silk Rope Tied Around the Center */}
                    <div
                      className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-20 flex flex-col items-center transition-transform"
                      style={{
                        transform: `translate(-50%, ${ropeStretch * 10}px)`,
                      }}
                    >
                      <svg
                        width="58"
                        height="112"
                        viewBox="0 0 58 112"
                        fill="none"
                        className="-mt-2 drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id="tiedRopeGold" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#FFF5D8" />
                            <stop offset="50%" stopColor="#D2AD68" />
                            <stop offset="100%" stopColor="#946B25" />
                          </linearGradient>
                        </defs>
                        {/* Vertical braided cord wrapping scroll */}
                        <rect
                          x="20"
                          y="0"
                          width="18"
                          height="104"
                          rx="6"
                          fill="url(#tiedRopeGold)"
                          stroke="#5A0B1C"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M20 12 L38 22 M20 26 L38 36 M20 40 L38 50 M20 54 L38 64 M20 68 L38 78 M20 82 L38 92"
                          stroke="#721226"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                        />
                        {/* Royal Silk Bow Knot */}
                        <path
                          d="M29 52 C14 38, 6 48, 12 60 C18 68, 26 60, 29 56 Z"
                          fill="url(#tiedRopeGold)"
                          stroke="#6B1024"
                          strokeWidth="1.3"
                        />
                        <path
                          d="M29 52 C44 38, 52 48, 46 60 C40 68, 32 60, 29 56 Z"
                          fill="url(#tiedRopeGold)"
                          stroke="#6B1024"
                          strokeWidth="1.3"
                        />
                        <circle
                          cx="29"
                          cy="55"
                          r="7.5"
                          fill="#8B152F"
                          stroke="#FFF0C4"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Interactive Rope Tail + Clear Pull Arrow Cue (रस्सी खींचें) */}
                  <div
                    onPointerDown={handleRopePointerDown}
                    onPointerMove={handleRopePointerMove}
                    onPointerUp={handleRopePointerEnd}
                    onPointerCancel={handleRopePointerEnd}
                    role="button"
                    tabIndex={0}
                    data-sound-handled="true"
                    aria-label="रस्सी खींचकर निमंत्रण खोलें"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        triggerUntieAndUnroll();
                      }
                    }}
                    className="relative z-30 flex flex-col items-center cursor-grab active:cursor-grabbing -mt-1 pt-1 pb-2 px-8"
                    style={{ touchAction: 'none' }}
                  >
                    {/* Stretching Braided Rope Strand */}
                    <div
                      className="w-2 rounded-full border border-[#6E1224]/60 shadow"
                      style={{
                        height: `${44 + ropePullY * 0.65}px`,
                        background:
                          'repeating-linear-gradient(135deg, #FFF0C4 0px, #D2AD68 5px, #8F1831 5px, #8F1831 9px)',
                        transition: isPullingRope ? 'none' : 'height 0.35s ease',
                      }}
                    />

                    {/* Gold Pull Ring + Downward Arrow */}
                    <div className="relative -mt-1 flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full border-2 border-[#FFF0C4] bg-gradient-to-b from-[#9B1C34] to-[#5E0C1D] shadow-[0_10px_28px_rgba(233,213,167,0.4)] flex items-center justify-center text-[#FFF3D6] hover:brightness-110 active:scale-95 transition-all">
                        <ArrowDown className="w-6 h-6 animate-pull-cue" aria-hidden="true" />
                      </div>

                      {/* Hanging Tassel Below Ring */}
                      <svg width="26" height="24" viewBox="0 0 26 24" fill="none" className="animate-tassel-sway" aria-hidden="true">
                        <path
                          d="M13 0 L7 21 M13 0 L10 22 M13 0 L13 24 M13 0 L16 22 M13 0 L19 21"
                          stroke="#E9D5A7"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        <circle cx="13" cy="3" r="2.6" fill="#D2AD68" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                SUB-STATE 2: FULL UNROLLED ROYAL CRIMSON-RED MAHARAJA FARMAN
                Contains ALL 3-page invitation content in regal red-and-gold
            ======================================================== */}
            {isRopeUntied && (
              <div className="w-full animate-farman-unfurl">
                {/* TOP CARVED GOLD SCROLL ROLLER ROD (SWARNA DANDA) */}
                <div className="relative mx-auto w-[98%] h-5 rounded-full bg-gradient-to-b from-[#FFF5DA] via-[#D2AD68] to-[#7D5B22] shadow-[0_8px_18px_rgba(0,0,0,0.75)] flex items-center justify-between px-0.5 z-30">
                  <span className="w-5 h-8 -ml-1.5 rounded bg-gradient-to-r from-[#8F6C2E] via-[#F5E7C4] to-[#B18A48] border border-[#E9D5A7] shadow-md" />
                  <span className="w-5 h-8 -mr-1.5 rounded bg-gradient-to-l from-[#8F6C2E] via-[#F5E7C4] to-[#B18A48] border border-[#E9D5A7] shadow-md" />
                </div>

                {/* ROYAL CRIMSON-RED VELVET & GOLD FARMAN BODY */}
                <div
                  className="relative mx-auto w-[92%] border-x-2 border-[#E9D5A7] overflow-hidden shadow-[0_24px_54px_rgba(0,0,0,0.88)]"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 28%, #8F1B33 0%, #6D1125 46%, #450917 100%)',
                  }}
                >
                  {/* Palace Jali Gold Pillars on Left & Right Edges */}
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 w-3.5 border-r border-[#E9D5A7]/45 bg-gradient-to-r from-[#D2AD68]/30 to-transparent"
                    aria-hidden="true"
                  />
                  <div
                    className="pointer-events-none absolute inset-y-0 right-0 w-3.5 border-l border-[#E9D5A7]/45 bg-gradient-to-l from-[#D2AD68]/30 to-transparent"
                    aria-hidden="true"
                  />

                  {/* Double Inner Engraved Gold Filigree Frame */}
                  <div className="pointer-events-none absolute inset-2.5 border border-[#E9D5A7]/75" />
                  <div className="pointer-events-none absolute inset-3.5 border border-[#D2AD68]/35" />

                  {/* Complete Royal Content Consolidated from All 3 Pages */}
                  <div className="relative z-10 px-6 py-5 sm:px-7 sm:py-6 flex flex-col items-center space-y-3.5 text-[#FFF6E5]">
                    {/* Page 1 Heritage Greeting & Logo */}
                    <p className="font-hindi-serif text-xl font-bold text-[#F7E4B6]">
                      {CONFIG.greeting}
                    </p>

                    <LogoPresentation variant="medallion" size={76} />

                    <div className="space-y-0.5">
                      <h2 className="font-hindi-serif text-[26px] sm:text-[28px] font-bold text-[#FFF5DC] leading-tight">
                        सादर मंगल आमंत्रण
                      </h2>
                      <p className="font-hindi-body text-sm sm:text-[15px] text-[#F5DFB0] font-medium">
                        {CONFIG.organizer} सप्रेम आमंत्रित करता है
                      </p>
                    </div>

                    <HeritageDivider color="#E9D5A7" />

                    {/* Page 2 Royal Gold-Engraved Event Plaque */}
                    <div className="w-full rounded-xl bg-gradient-to-br from-[#2B0711]/90 via-[#3F0B19]/90 to-[#16223D]/95 border-2 border-[#E9D5A7] px-4 py-4 text-center shadow-[0_12px_28px_rgba(0,0,0,0.45)] space-y-1.5">
                      <h1 className="font-hindi-serif royal-gold-title text-[28px] sm:text-[31px] font-bold leading-tight">
                        {CONFIG.eventTitle}
                      </h1>
                      <p className="font-hindi-serif text-base sm:text-lg font-semibold text-[#FFF1CC]">
                        {CONFIG.tagline}
                      </p>
                      <div className="pt-1 border-t border-[#E9D5A7]/35 mt-1">
                        <p className="font-hindi-serif text-base sm:text-lg font-bold text-[#FFF6E5]">
                          {CONFIG.datesDisplay}
                        </p>
                        <p className="font-hindi-body text-sm text-[#E9D5A7]">
                          {CONFIG.venueName}
                        </p>
                      </div>
                    </div>

                    {/* Page 3 Blessing & Warm Invitation Verse */}
                    <p className="font-hindi-body text-[14px] sm:text-[15px] text-[#FFF3DB]/95 leading-[1.7] px-1">
                      गुरु सान्निध्य, धर्म प्रभावना एवं मांगलिक आयोजनों से सुसज्जित इस पावन
                      त्रिदिवसीय महोत्सव में आपकी सपरिवार गरिमामयी उपस्थिति प्रार्थनीय है।
                    </p>

                    <HeritageDivider color="#E9D5A7" />

                    {/* Primary Enter CTA Button */}
                    <div className="w-full pt-0.5">
                      <button
                        type="button"
                        data-sound-handled="true"
                        onClick={() => {
                          playRoyalSuccess();
                          onComplete();
                        }}
                        className="royal-btn-sheen w-full min-h-[50px] px-6 py-3 rounded-xl bg-gradient-to-r from-[#B18A48] via-[#E9D5A7] to-[#D2AD68] hover:brightness-110 text-[#3B0814] border-2 border-[#FFF3D1] font-hindi-serif text-base sm:text-lg font-bold shadow-[0_12px_28px_rgba(0,0,0,0.5)] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FFF3D1]"
                      >
                        महोत्सव में प्रवेश करें ›
                      </button>
                    </div>
                  </div>
                </div>

                {/* BOTTOM CARVED GOLD SCROLL ROLLER ROD + SILK ROPE TASSELS */}
                <div className="relative mx-auto w-[98%] z-30 flex flex-col items-center">
                  <div className="w-full h-5 rounded-full bg-gradient-to-b from-[#FFF5DA] via-[#D2AD68] to-[#7D5B22] shadow-[0_10px_22px_rgba(0,0,0,0.85)] flex items-center justify-between px-0.5">
                    <span className="w-5 h-8 -ml-1.5 rounded bg-gradient-to-r from-[#8F6C2E] via-[#F5E7C4] to-[#B18A48] border border-[#E9D5A7] shadow-md" />
                    <span className="w-5 h-8 -mr-1.5 rounded bg-gradient-to-l from-[#8F6C2E] via-[#F5E7C4] to-[#B18A48] border border-[#E9D5A7] shadow-md" />
                  </div>

                  {/* Three Hanging Golden Silk Tassels */}
                  <div className="w-[82%] flex items-start justify-between px-2 pt-0.5" aria-hidden="true">
                    {[0, 1, 2].map((tIdx) => (
                      <svg key={tIdx} width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-tassel-sway" style={{ animationDelay: `${tIdx * 0.45}s` }}>
                        <circle cx="12" cy="3" r="2.5" fill="#E9D5A7" />
                        <path
                          d="M12 4 L7 22 M12 4 L9.5 23 M12 4 L12 24 M12 4 L14.5 23 M12 4 L17 22"
                          stroke={tIdx === 1 ? '#FFF0C4' : '#D2AD68'}
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
