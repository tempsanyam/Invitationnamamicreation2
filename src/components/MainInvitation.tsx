import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Phone,
  RotateCcw,
  Share2,
} from 'lucide-react';
import { CONFIG } from '../config/invitationConfig';
import {
  CeremonyArtwork,
  CornerFiligree,
  DateMedallion,
  GoldDustField,
  HeritageDivider,
  LogoPresentation,
  RoyalGoldenToran,
  RoyalJaliArchBackdrop,
} from './RoyalOrnaments';
import {
  RoyalContactConnectCard,
  RoyalRegistrationModal,
  SocialPlatformIcon,
} from './RoyalConnect';
import { playRoyalSlide, playRoyalSuccess } from '../utils/royalSound';

interface MainInvitationProps {
  onReplayOpening: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  started: boolean;
}

function getISTCountdown(targetIso: string): TimeRemaining {
  const targetMs = new Date(targetIso).getTime();
  const nowMs = Date.now();
  const diff = targetMs - nowMs;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, started: false };
}

/**
 * Reusable scroll-triggered reveal wrapper using IntersectionObserver.
 * Keeps content immediately readable if IntersectionObserver isn't triggered yet or reduced-motion is set.
 */
const RevealSection: React.FC<{
  id?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ id, className = '', children }) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -24px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-90 translate-y-5 scale-[0.985]'
      } ${className}`}
    >
      {children}
    </section>
  );
};

export const MainInvitation: React.FC<MainInvitationProps> = ({ onReplayOpening }) => {
  const [countdown, setCountdown] = useState<TimeRemaining>(() =>
    getISTCountdown(CONFIG.countdownTargetIsoIST)
  );
  const [scrollProgress, setScrollProgress] = useState(0);

  // Horizontal carousel indices & refs
  const [guruIndex, setGuruIndex] = useState(0);
  const guruTrackRef = useRef<HTMLDivElement | null>(null);

  const [daysIndex, setDaysIndex] = useState(0);
  const daysTrackRef = useRef<HTMLDivElement | null>(null);

  const [highlightsIndex, setHighlightsIndex] = useState(0);
  const highlightsTrackRef = useRef<HTMLDivElement | null>(null);

  // Interactive celebration & registration modal states
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const programmaticCarouselUntilRef = useRef(0);

  const handleShareInvite = async () => {
    playRoyalSuccess();
    const shareText = `${CONFIG.greeting}\n${CONFIG.eventTitle} — ${CONFIG.tagline}\n${CONFIG.datesDisplay} | ${CONFIG.venueName}\nआयोजक: ${CONFIG.organizer}\nस्थान: ${CONFIG.mapsUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${CONFIG.eventTitle} — ${CONFIG.venueName}`,
          text: shareText,
          url: window.location.href,
        });
        return;
      }
    } catch {
      // User cancelled or Web Share unavailable; fall through cleanly
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setShareNotice('आमंत्रण विवरण कॉपी किया गया');
    } catch {
      setShareNotice('निमंत्रण साझा करने के लिए तैयार है');
    }
    window.setTimeout(() => setShareNotice(null), 3200);
  };

  // Live IST countdown interval
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getISTCountdown(CONFIG.countdownTargetIsoIST));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setScrollProgress(pct);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollCarouselTo = (
    ref: React.RefObject<HTMLDivElement | null>,
    index: number,
    total: number,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const clamped = Math.max(0, Math.min(total - 1, index));
    programmaticCarouselUntilRef.current = Date.now() + 650;
    playRoyalSlide();
    setter(clamped);
    const container = ref.current;
    if (!container) return;
    const child = container.children[clamped] as HTMLElement | undefined;
    if (child) {
      container.scrollTo({
        left: child.offsetLeft - container.offsetLeft,
        behavior: 'smooth',
      });
    }
  };

  const handleCarouselScroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const container = ref.current;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;
    const scrollCenter = container.scrollLeft + container.clientWidth * 0.4;
    let closestIdx = 0;
    let minDist = Infinity;
    children.forEach((child, idx) => {
      const dist = Math.abs(child.offsetLeft - container.offsetLeft - (scrollCenter - child.offsetWidth / 2));
      if (dist < minDist) {
        minDist = dist;
        closestIdx = idx;
      }
    });
    setter((prev) => {
      if (prev !== closestIdx && Date.now() > programmaticCarouselUntilRef.current) {
        playRoyalSlide();
      }
      return closestIdx;
    });
  };

  const scrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0B1428] text-[#F8F1E4]">
      {/* Thin Top Gold Scroll Progress Line */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-[#142440]/80 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-[#B18A48] via-[#E9D5A7] to-[#D2AD68] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Desktop Architectural Palace Backdrop & Subtle Chapter Rail */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 18%, rgba(210, 173, 104, 0.1) 0%, rgba(11, 20, 40, 0.92) 55%, #080E1D 100%)',
          }}
        />
        <RoyalJaliArchBackdrop className="opacity-[0.06]" showCenterCircles={false} />
      </div>

      {/* Subtle Desktop Side Section Indicators */}
      <nav
        aria-label="महोत्सव अनुभाग संकेत"
        className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3"
      >
        {[
          { id: 'grand-invite', label: 'आमंत्रण' },
          { id: 'guru-sannidhya', label: 'गुरु सान्निध्य' },
          { id: 'three-days', label: 'त्रिदिवसीय कार्यक्रम' },
          { id: 'day-1', label: '15 दिसंबर' },
          { id: 'day-2', label: '16 दिसंबर' },
          { id: 'day-3', label: '17 दिसंबर' },
          { id: 'highlights', label: 'प्रमुख आकर्षण' },
          { id: 'temple', label: 'पावन सुमतिधाम' },
          { id: 'location', label: 'स्थान एवं मानचित्र' },
          { id: 'contact-connect', label: 'पंजीकरण एवं संपर्क' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToSection(item.id)}
            className="group flex items-center gap-2.5 text-xs font-hindi-body text-[#E9D5A7]/60 hover:text-[#E9D5A7] transition-colors py-0.5"
          >
            <span className="opacity-70 group-hover:opacity-100">{item.label}</span>
            <span className="w-2 h-2 rounded-full border border-[#D2AD68]/70 group-hover:bg-[#D2AD68] transition-colors" />
          </button>
        ))}
      </nav>

      {/* Main Centered Mobile-First Royal Invitation Column (~430px) */}
      <main className="relative z-10 mx-auto w-full max-w-[440px] px-4 pt-8 sm:pt-12 pb-10 space-y-12 sm:space-y-14">
        {/* ============================================================
            TOP ROYAL HEADER BANNER
        ============================================================ */}
        <header className="relative text-center pt-1 pb-1 flex flex-col items-center space-y-3 animate-[fadeIn_0.65s_ease-out]">
          <RoyalGoldenToran className="mb-1 opacity-95" />
          <p className="font-hindi-serif text-lg text-[#E9D5A7] font-semibold">
            {CONFIG.greeting}
          </p>
          <div className="relative w-[162px] h-[162px] flex items-center justify-center">
            <svg
              viewBox="0 0 180 180"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 w-full h-full z-0"
            >
              <defs>
                <radialGradient id="headerLogoGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E9D5A7" stopOpacity="0.11" />
                  <stop offset="58%" stopColor="#E9D5A7" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#E9D5A7" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Subtle radial highlight behind logo */}
              <circle cx="90" cy="90" r="84" fill="url(#headerLogoGlow)" />
              {/* Ring 3 (Outer): subtle solid antique-gold hairline */}
              <circle cx="90" cy="90" r="84" stroke="#E9D5A7" strokeWidth="0.9" strokeOpacity="0.18" />
              {/* Ring 2 (Middle): symmetrical dashed gold ring */}
              <circle
                cx="90"
                cy="90"
                r="70"
                stroke="#D2AD68"
                strokeWidth="0.85"
                strokeDasharray="3 3.5"
                strokeOpacity="0.34"
              />
              {/* Ring 1 (Inner): crisp solid gold ring framing the medallion */}
              <circle cx="90" cy="90" r="56" stroke="#E9D5A7" strokeWidth="0.95" strokeOpacity="0.28" />
            </svg>
            <LogoPresentation variant="medallion" size={88} className="relative z-10" />
          </div>
          <div className="space-y-1 pt-1">
            <h1 className="font-hindi-serif royal-gold-title text-[34px] sm:text-[38px] font-bold leading-tight">
              {CONFIG.eventTitle}
            </h1>
            <p className="font-hindi-serif text-base sm:text-lg text-[#E9D5A7]">
              {CONFIG.tagline}
            </p>
            <p className="font-hindi-body text-sm text-[#D2AD68] tracking-wide pt-0.5">
              {CONFIG.datesDisplay} · {CONFIG.venueName}
            </p>
          </div>
          <HeritageDivider color="#D2AD68" className="pt-1" />
        </header>

        {/* ============================================================
            SECTION 1: GRAND INVITATION MESSAGE
        ============================================================ */}
        <RevealSection id="grand-invite">
          <div className="relative royal-ivory-paper rounded-2xl border-2 border-[#B18A48] p-6 sm:p-7 text-center text-[#142440]">
            {/* Inner Gold Frame */}
            <div className="pointer-events-none absolute inset-2.5 rounded-xl border border-[#B18A48]/50" />
            <CornerFiligree position="tl" color="#B18A48" size={26} className="absolute top-3 left-3" />
            <CornerFiligree position="tr" color="#B18A48" size={26} className="absolute top-3 right-3" />
            <CornerFiligree position="bl" color="#B18A48" size={26} className="absolute bottom-3 left-3" />
            <CornerFiligree position="br" color="#B18A48" size={26} className="absolute bottom-3 right-3" />

            <div className="relative z-10 space-y-4">
              <h2 className="font-hindi-serif text-[30px] sm:text-[33px] font-bold text-[#4A182D]">
                {CONFIG.grandInvitation.heading}
              </h2>

              <HeritageDivider color="#B18A48" />

              <div className="flex justify-center">
                <LogoPresentation variant="medallion" size={60} />
              </div>

              <p className="font-hindi-body text-[15px] sm:text-base text-[#13223D] leading-[1.8] text-center">
                {CONFIG.grandInvitation.body}
              </p>

              <HeritageDivider color="#B18A48" />

              <p className="font-hindi-serif text-base sm:text-lg font-semibold text-[#4A182D]">
                {CONFIG.grandInvitation.closingLine}
              </p>
            </div>
          </div>
        </RevealSection>

        {/* ============================================================
            SECTION 2: GURU SANNNIDHYA
        ============================================================ */}
        <RevealSection id="guru-sannidhya" className="relative">
          <div className="relative rounded-2xl border border-[#B18A48]/65 bg-[#0B1428] p-5 sm:p-6 overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.65)]">
            <GoldDustField />
            <div
              className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl bg-[#D2AD68]/20 animate-halo-breathe"
              aria-hidden="true"
            />

            <div className="relative z-10 text-center space-y-2 mb-5">
              <h2 className="font-hindi-serif text-[29px] sm:text-[32px] font-bold text-[#F9F3E7]">
                {CONFIG.guruSannidhya.heading}
              </h2>
              <HeritageDivider color="#D2AD68" />
            </div>

            {/* Main Visual: Tall Indian Architectural Arch Portrait Frame */}
            <div className="relative z-10 mx-auto max-w-[330px]">
              <div className="relative p-2 rounded-t-[170px] rounded-b-xl border-2 border-[#D2AD68] bg-gradient-to-b from-[#1D3455]/60 to-[#0B1428] shadow-[0_16px_40px_rgba(0,0,0,0.75)]">
                {/* Decorative Upper Arch Inner Border */}
                <div className="relative overflow-hidden rounded-t-[162px] rounded-b-lg border border-[#E9D5A7]/50 aspect-[3/4] bg-[#142440]">
                  <img
                    src={CONFIG.images.acharyaMain}
                    alt="आचार्य श्री का पावन सान्निध्य"
                    className="w-full h-full object-cover object-top animate-gentle-zoom"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle Gold Vignette */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(11,20,40,0.12) 0%, transparent 25%, transparent 78%, rgba(11,20,40,0.65) 100%)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Second Visual: Swipeable Horizontal Portrait Gallery */}
            <div className="relative z-10 mt-6">
              <div className="relative">
                <div
                  ref={guruTrackRef}
                  onScroll={() => handleCarouselScroll(guruTrackRef, setGuruIndex)}
                  className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
                  style={{ touchAction: 'pan-x pan-y' }}
                >
                  {CONFIG.images.acharyaGallery.map((photo, idx) => (
                    <div
                      key={idx}
                      className="w-full shrink-0 snap-center rounded-xl border border-[#D2AD68]/75 overflow-hidden bg-[#142440] shadow-lg"
                    >
                      <div className="relative aspect-[3/2] overflow-hidden">
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          className="w-full h-full object-cover object-top animate-gentle-zoom"
                          referrerPolicy="no-referrer"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1428]/50 via-transparent to-transparent" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Navigation Arrows */}
                <button
                  type="button"
                  data-sound-handled="true"
                  onClick={() =>
                    scrollCarouselTo(
                      guruTrackRef,
                      guruIndex - 1,
                      CONFIG.images.acharyaGallery.length,
                      setGuruIndex
                    )
                  }
                  disabled={guruIndex === 0}
                  aria-label="पिछला चित्र"
                  className="hidden sm:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0B1428]/80 border border-[#D2AD68]/70 text-[#E9D5A7] disabled:opacity-30 hover:bg-[#142440] transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  data-sound-handled="true"
                  onClick={() =>
                    scrollCarouselTo(
                      guruTrackRef,
                      guruIndex + 1,
                      CONFIG.images.acharyaGallery.length,
                      setGuruIndex
                    )
                  }
                  disabled={guruIndex === CONFIG.images.acharyaGallery.length - 1}
                  aria-label="अगला चित्र"
                  className="hidden sm:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0B1428]/80 border border-[#D2AD68]/70 text-[#E9D5A7] disabled:opacity-30 hover:bg-[#142440] transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Compact Arrows & Pagination Dots */}
              <div className="mt-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  data-sound-handled="true"
                  onClick={() =>
                    scrollCarouselTo(
                      guruTrackRef,
                      guruIndex - 1,
                      CONFIG.images.acharyaGallery.length,
                      setGuruIndex
                    )
                  }
                  disabled={guruIndex === 0}
                  aria-label="पिछला चित्र"
                  className="w-8 h-8 rounded-full border border-[#D2AD68]/55 bg-[#12213B]/85 text-[#E9D5A7] flex items-center justify-center disabled:opacity-30 hover:bg-[#1B3254] transition-opacity"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-center gap-2">
                  {CONFIG.images.acharyaGallery.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      data-sound-handled="true"
                      aria-label={`चित्र ${idx + 1}`}
                      onClick={() =>
                        scrollCarouselTo(
                          guruTrackRef,
                          idx,
                          CONFIG.images.acharyaGallery.length,
                          setGuruIndex
                        )
                      }
                      className={`h-2 rounded-full transition-all ${
                        guruIndex === idx ? 'w-6 bg-[#D2AD68]' : 'w-2 bg-[#D2AD68]/35'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  data-sound-handled="true"
                  onClick={() =>
                    scrollCarouselTo(
                      guruTrackRef,
                      guruIndex + 1,
                      CONFIG.images.acharyaGallery.length,
                      setGuruIndex
                    )
                  }
                  disabled={guruIndex === CONFIG.images.acharyaGallery.length - 1}
                  aria-label="अगला चित्र"
                  className="w-8 h-8 rounded-full border border-[#D2AD68]/55 bg-[#12213B]/85 text-[#E9D5A7] flex items-center justify-center disabled:opacity-30 hover:bg-[#1B3254] transition-opacity"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ============================================================
            SECTION 3: THREE DAY CELEBRATION + COUNTDOWN + CAROUSEL
        ============================================================ */}
        <RevealSection id="three-days" className="space-y-6">
          <div className="text-center space-y-2 px-1">
            <h2 className="font-hindi-serif text-[30px] sm:text-[34px] font-bold text-[#F9F3E7]">
              {CONFIG.threeDays.heading}
            </h2>
            <p className="font-hindi-body text-[15px] text-[#E9D5A7]/90">
              {CONFIG.threeDays.supportingText}
            </p>
          </div>

          {/* Live IST Countdown to 15 December 2026 */}
          <div className="rounded-2xl border border-[#B18A48]/65 bg-[#13223D]/90 p-4 text-center shadow-lg">
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'दिन', value: countdown.days },
                { label: 'घंटे', value: countdown.hours },
                { label: 'मिनट', value: countdown.minutes },
                { label: 'सेकंड', value: countdown.seconds },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="rounded-xl border border-[#B18A48]/45 bg-[#081022]/90 py-2.5 px-1 flex flex-col items-center transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E9D5A7]/75"
                >
                  <span className="font-english-serif text-2xl sm:text-3xl font-bold text-[#E9D5A7] tabular-nums leading-none">
                    {String(unit.value).padStart(2, '0')}
                  </span>
                  <span className="font-hindi-body text-xs text-[#F9F3E7]/85 mt-1.5">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2.5 font-hindi-body text-xs text-[#D2AD68]/90">
              {countdown.started
                ? 'महोत्सव शुभारंभ दिवस · सुमतिधाम, इंदौर'
                : 'शुभारंभ दिवस · 15 दिसंबर 2026'}
            </p>
          </div>

          {/* Three-Day Horizontal Carousel — Zero overlap, clean snap, consistent sizing */}
          <div className="relative">
            <div
              ref={daysTrackRef}
              onScroll={() => handleCarouselScroll(daysTrackRef, setDaysIndex)}
              className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 px-1"
              style={{ touchAction: 'pan-x pan-y' }}
            >
              {CONFIG.threeDays.cards.map((card, idx) => {
                const bgClass =
                  card.theme === 'burgundy'
                    ? 'bg-[#491C30]'
                    : card.theme === 'blue'
                      ? 'bg-[#1D3455]'
                      : 'bg-[#173E35]';

                return (
                  <button
                    key={card.dayNumber}
                    type="button"
                    onClick={() => scrollToSection(card.targetId)}
                    className={`relative w-[84%] shrink-0 snap-center rounded-2xl border-2 border-[#D2AD68] ${bgClass} p-6 text-center flex flex-col items-center justify-between min-h-[246px] shadow-[0_18px_36px_rgba(0,0,0,0.55)] cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#E9D5A7] ${
                      daysIndex === idx ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-90'
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-2 rounded-xl border border-[#E9D5A7]/35" />
                    <CornerFiligree position="tl" size={24} className="absolute top-2.5 left-2.5" />
                    <CornerFiligree position="tr" size={24} className="absolute top-2.5 right-2.5" />
                    <CornerFiligree position="bl" size={24} className="absolute bottom-2.5 left-2.5" />
                    <CornerFiligree position="br" size={24} className="absolute bottom-2.5 right-2.5" />

                    <div className="relative z-10 flex flex-col items-center">
                      <span className="font-english-serif text-[64px] font-bold text-[#F8F1E4] leading-none tabular-nums">
                        {card.dayNumber}
                      </span>
                      <span className="font-hindi-body text-sm text-[#E9D5A7] mt-1">
                        {card.monthYear}
                      </span>
                    </div>

                    <HeritageDivider color="#D2AD68" className="my-2 relative z-10" />

                    <div className="relative z-10 space-y-1">
                      <p className="font-hindi-body text-xs text-[#E9D5A7] tracking-wide">
                        {card.dayLabel}
                      </p>
                      <h3 className="font-hindi-serif text-xl sm:text-[22px] font-bold text-[#F8F1E4] leading-snug">
                        {card.title}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Desktop Arrow Controls */}
            <button
              type="button"
              data-sound-handled="true"
              onClick={() =>
                scrollCarouselTo(
                  daysTrackRef,
                  daysIndex - 1,
                  CONFIG.threeDays.cards.length,
                  setDaysIndex
                )
              }
              disabled={daysIndex === 0}
              aria-label="पिछला दिवस कार्ड"
              className="hidden sm:flex items-center justify-center absolute -left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0B1428]/90 border border-[#D2AD68] text-[#E9D5A7] disabled:opacity-25 shadow-lg hover:bg-[#142440]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              data-sound-handled="true"
              onClick={() =>
                scrollCarouselTo(
                  daysTrackRef,
                  daysIndex + 1,
                  CONFIG.threeDays.cards.length,
                  setDaysIndex
                )
              }
              disabled={daysIndex === CONFIG.threeDays.cards.length - 1}
              aria-label="अगला दिवस कार्ड"
              className="hidden sm:flex items-center justify-center absolute -right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0B1428]/90 border border-[#D2AD68] text-[#E9D5A7] disabled:opacity-25 shadow-lg hover:bg-[#142440]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              data-sound-handled="true"
              onClick={() =>
                scrollCarouselTo(
                  daysTrackRef,
                  daysIndex - 1,
                  CONFIG.threeDays.cards.length,
                  setDaysIndex
                )
              }
              disabled={daysIndex === 0}
              aria-label="पिछला दिवस"
              className="w-8 h-8 rounded-full border border-[#D2AD68]/60 bg-[#12213B]/90 text-[#E9D5A7] flex items-center justify-center disabled:opacity-30 hover:bg-[#1B3254] transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center gap-2">
              {CONFIG.threeDays.cards.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  data-sound-handled="true"
                  aria-label={`दिवस ${idx + 1}`}
                  onClick={() =>
                    scrollCarouselTo(
                      daysTrackRef,
                      idx,
                      CONFIG.threeDays.cards.length,
                      setDaysIndex
                    )
                  }
                  className={`h-2 rounded-full transition-all ${
                    daysIndex === idx ? 'w-7 bg-[#D2AD68]' : 'w-2 bg-[#D2AD68]/35'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              data-sound-handled="true"
              onClick={() =>
                scrollCarouselTo(
                  daysTrackRef,
                  daysIndex + 1,
                  CONFIG.threeDays.cards.length,
                  setDaysIndex
                )
              }
              disabled={daysIndex === CONFIG.threeDays.cards.length - 1}
              aria-label="अगला दिवस"
              className="w-8 h-8 rounded-full border border-[#D2AD68]/60 bg-[#12213B]/90 text-[#E9D5A7] flex items-center justify-center disabled:opacity-30 hover:bg-[#1B3254] transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </RevealSection>

        {/* ============================================================
            SECTION 4: FIRST DAY — 15 DECEMBER 2026
        ============================================================ */}
        <RevealSection id="day-1">
          <div className="relative royal-ivory-paper rounded-2xl border-2 border-[#B18A48] p-6 text-[#142440]">
            <div className="pointer-events-none absolute inset-2.5 rounded-xl border border-[#B18A48]/45" />
            <CornerFiligree position="tl" color="#B18A48" size={24} className="absolute top-3 left-3" />
            <CornerFiligree position="tr" color="#B18A48" size={24} className="absolute top-3 right-3" />
            <CornerFiligree position="bl" color="#B18A48" size={24} className="absolute bottom-3 left-3" />
            <CornerFiligree position="br" color="#B18A48" size={24} className="absolute bottom-3 right-3" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              <DateMedallion
                dayNumber={CONFIG.day1.dayNumber}
                monthYear={CONFIG.day1.monthYear}
                accent="burgundy"
              />
              <p className="font-hindi-body text-sm font-semibold text-[#491C30]">
                {CONFIG.day1.dayLabel} · {CONFIG.day1.date}
              </p>
              <h2 className="font-hindi-serif text-[29px] sm:text-[32px] font-bold text-[#491C30]">
                {CONFIG.day1.heading}
              </h2>
              <HeritageDivider color="#B18A48" />
            </div>

            <div className="relative z-10 mt-5 space-y-5">
              {CONFIG.day1.groups.map((group) => (
                <div
                  key={group.period}
                  className="border-b border-[#B18A48]/30 pb-4 last:border-b-0 last:pb-0"
                >
                  <h3 className="font-hindi-serif text-lg font-bold text-[#491C30] mb-2">
                    {group.period}
                  </h3>
                  <ul className="space-y-1.5 font-hindi-body text-[15px] text-[#142440]">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#B18A48] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Special Royal Gatha Typographic Panel */}
            <div className="relative z-10 mt-6 rounded-xl bg-[#4A182D] border border-[#D2AD68] p-5 text-center shadow-md overflow-hidden">
              <span
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#E9D5A7]/15 to-transparent animate-light-sweep"
                aria-hidden="true"
              />
              <p className="relative z-10 font-hindi-serif text-xl sm:text-[22px] font-bold text-[#F9F3E7] leading-relaxed">
                {CONFIG.day1.gatha}
              </p>
            </div>
          </div>
        </RevealSection>

        {/* ============================================================
            SECTION 5: SECOND DAY — 16 DECEMBER 2026 (MOST PROMINENT)
        ============================================================ */}
        <RevealSection id="day-2">
          <div className="relative rounded-2xl border-2 border-[#D2AD68] bg-gradient-to-b from-[#491C30] via-[#2F162B] to-[#142440] p-6 text-[#F8F1E4] shadow-[0_24px_56px_rgba(0,0,0,0.75)]">
            <div className="pointer-events-none absolute inset-2.5 rounded-xl border border-[#E9D5A7]/35" />
            <CornerFiligree position="tl" color="#E9D5A7" size={26} className="absolute top-3 left-3" />
            <CornerFiligree position="tr" color="#E9D5A7" size={26} className="absolute top-3 right-3" />
            <CornerFiligree position="bl" color="#E9D5A7" size={26} className="absolute bottom-3 left-3" />
            <CornerFiligree position="br" color="#E9D5A7" size={26} className="absolute bottom-3 right-3" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              <DateMedallion
                dayNumber={CONFIG.day2.dayNumber}
                monthYear={CONFIG.day2.monthYear}
                accent="blue"
              />
              <p className="font-hindi-body text-sm font-medium text-[#E9D5A7]">
                {CONFIG.day2.dayLabel} · {CONFIG.day2.date}
              </p>
              <h2 className="font-hindi-serif text-[29px] sm:text-[33px] font-bold text-[#F8F1E4]">
                {CONFIG.day2.heading}
              </h2>
              <HeritageDivider color="#D2AD68" />
            </div>

            {/* Morning Group */}
            <div className="relative z-10 mt-5 rounded-xl border border-[#D2AD68]/45 bg-[#0B1428]/45 p-4">
              <h3 className="font-hindi-serif text-lg font-bold text-[#E9D5A7] mb-2">
                प्रातःकाल
              </h3>
              <ul className="space-y-1.5 font-hindi-body text-[15px] text-[#F8F1E4]">
                {CONFIG.day2.morningItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#D2AD68] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* GRAND CEREMONY PANELS A & B */}
            <div className="relative z-10 mt-4 space-y-3.5">
              {CONFIG.day2.grandPanels.map((panel, idx) => (
                <div
                  key={panel.title}
                  className="relative rounded-xl border-2 border-[#E9D5A7] bg-gradient-to-r from-[#142440] via-[#1D3455] to-[#142440] p-5 text-center shadow-[0_12px_28px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                  <span
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#E9D5A7]/15 to-transparent animate-light-sweep"
                    style={{ animationDelay: `${idx * 1.4}s` }}
                    aria-hidden="true"
                  />
                  <p className="relative z-10 font-english-serif text-3xl sm:text-4xl font-bold text-[#E9D5A7] tabular-nums leading-none">
                    {panel.shortTime}
                  </p>
                  <p className="relative z-10 font-hindi-body text-xs text-[#D2AD68] mt-1">
                    {panel.time}
                  </p>
                  <h3 className="relative z-10 mt-2 font-hindi-serif text-[24px] sm:text-[26px] font-bold text-[#F8F1E4] leading-snug">
                    {panel.title}
                  </h3>
                  {idx === 0 && (
                    <span className="relative z-10 block mx-auto mt-2 w-12 h-[1px] bg-[#D2AD68]/60" />
                  )}
                </div>
              ))}
            </div>

            {/* Evening Group */}
            <div className="relative z-10 mt-4 rounded-xl border border-[#D2AD68]/45 bg-[#0B1428]/45 p-4">
              <h3 className="font-hindi-serif text-lg font-bold text-[#E9D5A7] mb-2">
                सायंकाल
              </h3>
              <ul className="space-y-1.5 font-hindi-body text-[15px] text-[#F8F1E4]">
                {CONFIG.day2.eveningItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#D2AD68] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Night-Time Drone Show Panel */}
            <div className="relative z-10 mt-4 rounded-xl border border-[#D2AD68] bg-[#0B1428] p-5 text-center shadow-lg overflow-hidden">
              <span
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#E9D5A7]/12 to-transparent animate-light-sweep"
                style={{ animationDelay: '0.8s' }}
                aria-hidden="true"
              />
              <p className="relative z-10 font-hindi-body text-xs text-[#D2AD68]">
                {CONFIG.day2.droneShow.time}
              </p>
              <h3 className="relative z-10 font-hindi-serif text-[25px] font-bold text-[#E9D5A7] mt-1">
                {CONFIG.day2.droneShow.title}
              </h3>
            </div>

            {/* Final Entertainment Panel: Bhakti Night */}
            <div className="relative z-10 mt-4 rounded-xl border border-[#D2AD68]/80 bg-gradient-to-br from-[#491C30] to-[#1D3455] p-5 text-center shadow-lg overflow-hidden">
              <span
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#E9D5A7]/12 to-transparent animate-light-sweep"
                style={{ animationDelay: '2.2s' }}
                aria-hidden="true"
              />
              <p className="relative z-10 font-hindi-body text-xs text-[#E9D5A7]/90">
                {CONFIG.day2.bhaktiNight.period}
              </p>
              <h3 className="relative z-10 font-hindi-serif text-[25px] font-bold text-[#F8F1E4] mt-1">
                {CONFIG.day2.bhaktiNight.title}
              </h3>
            </div>
          </div>
        </RevealSection>

        {/* ============================================================
            SECTION 6: THIRD DAY — 17 DECEMBER 2026
        ============================================================ */}
        <RevealSection id="day-3">
          <div className="relative rounded-2xl border-2 border-[#B18A48] bg-[#173E35] p-6 text-[#F8F1E4] shadow-[0_20px_48px_rgba(0,0,0,0.65)]">
            <div className="pointer-events-none absolute inset-2.5 rounded-xl border border-[#E9D5A7]/40" />
            <CornerFiligree position="tl" color="#E9D5A7" size={24} className="absolute top-3 left-3" />
            <CornerFiligree position="tr" color="#E9D5A7" size={24} className="absolute top-3 right-3" />
            <CornerFiligree position="bl" color="#E9D5A7" size={24} className="absolute bottom-3 left-3" />
            <CornerFiligree position="br" color="#E9D5A7" size={24} className="absolute bottom-3 right-3" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              <DateMedallion
                dayNumber={CONFIG.day3.dayNumber}
                monthYear={CONFIG.day3.monthYear}
                accent="emerald"
              />
              <p className="font-hindi-body text-sm text-[#E9D5A7]">
                {CONFIG.day3.dayLabel} · {CONFIG.day3.date}
              </p>
              <h2 className="font-hindi-serif text-[29px] sm:text-[32px] font-bold text-[#F8F1E4]">
                {CONFIG.day3.heading}
              </h2>
              <HeritageDivider color="#D2AD68" />
            </div>

            {/* Special Highlight Panel: 1008 आचार्य पाद प्रक्षालन */}
            <div className="relative z-10 mt-5 rounded-xl royal-ivory-paper border-2 border-[#D2AD68] p-5 text-center text-[#173E35] overflow-hidden">
              <span
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#D2AD68]/25 to-transparent animate-light-sweep"
                style={{ animationDelay: '1.1s' }}
                aria-hidden="true"
              />
              <p className="relative z-10 font-english-serif text-4xl font-bold text-[#491C30] tabular-nums leading-none">
                {CONFIG.day3.highlight.number}
              </p>
              <h3 className="relative z-10 font-hindi-serif text-[24px] font-bold text-[#173E35] mt-1.5">
                {CONFIG.day3.highlight.title}
              </h3>
            </div>

            {/* Ivory Programme Details Card */}
            <div className="relative z-10 mt-4 rounded-xl royal-ivory-paper border border-[#B18A48] p-5 text-[#142440] space-y-5">
              {CONFIG.day3.groups.map((group) => (
                <div
                  key={group.period}
                  className="border-b border-[#B18A48]/30 pb-4 last:border-b-0 last:pb-0"
                >
                  <h3 className="font-hindi-serif text-lg font-bold text-[#173E35] mb-2">
                    {group.period}
                  </h3>
                  <ul className="space-y-1.5 font-hindi-body text-[15px] text-[#142440]">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#B18A48] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ============================================================
            SECTION 7: MAHOTSAV HIGHLIGHTS (6 SWIPEABLE CEREMONY CARDS)
        ============================================================ */}
        <RevealSection id="highlights" className="space-y-5">
          <div className="text-center space-y-2">
            <h2 className="font-hindi-serif text-[29px] sm:text-[33px] font-bold text-[#F9F3E7]">
              {CONFIG.highlights.heading}
            </h2>
            <HeritageDivider color="#D2AD68" />
          </div>

          <div className="relative">
            <div
              ref={highlightsTrackRef}
              onScroll={() => handleCarouselScroll(highlightsTrackRef, setHighlightsIndex)}
              className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 px-1"
              style={{ touchAction: 'pan-x pan-y' }}
            >
              {CONFIG.highlights.cards.map((item, idx) => {
                const bgClass =
                  item.theme === 'burgundy'
                    ? 'bg-gradient-to-b from-[#491C30] to-[#2A101C]'
                    : item.theme === 'emerald'
                      ? 'bg-gradient-to-b from-[#173E35] to-[#0D2620]'
                      : 'bg-gradient-to-b from-[#1D3455] to-[#0E1B30]';

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.targetId)}
                    className={`group relative w-[86%] shrink-0 snap-center rounded-2xl border border-[#D2AD68] ${bgClass} p-4 sm:p-5 flex flex-col items-center text-center justify-between min-h-[290px] shadow-[0_18px_36px_rgba(0,0,0,0.55)] cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#E9D5A7] ${
                      highlightsIndex === idx ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-90'
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-2 rounded-xl border border-[#E9D5A7]/30" />
                    <CornerFiligree position="tl" size={20} className="absolute top-2.5 left-2.5 z-20" />
                    <CornerFiligree position="tr" size={20} className="absolute top-2.5 right-2.5 z-20" />

                    <div className="relative z-10 w-full">
                      {item.image ? (
                        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-[#E9D5A7]/65 bg-[#081022] shadow-md">
                          <img
                            src={item.image}
                            alt={item.title}
                            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                              item.imageFocus === 'top' ? 'object-top' : 'object-center'
                            }`}
                            referrerPolicy="no-referrer"
                          />
                          <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background:
                                'linear-gradient(180deg, rgba(8,16,34,0.08) 0%, transparent 40%, rgba(8,16,34,0.48) 100%)',
                            }}
                          />
                        </div>
                      ) : (
                        <CeremonyArtwork type={item.artworkType} />
                      )}
                    </div>

                    <div className="relative z-10 space-y-1 pt-3 pb-0.5">
                      <p className="font-hindi-body text-xs text-[#E9D5A7]/90">
                        {item.dayLabel}
                      </p>
                      <h3 className="font-hindi-serif text-[21px] sm:text-[23px] font-bold text-[#F8F1E4] leading-snug">
                        {item.title}
                      </h3>
                      <p className="font-hindi-body text-xs sm:text-sm text-[#D2AD68]">
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Desktop Prev/Next Arrows */}
            <button
              type="button"
              data-sound-handled="true"
              onClick={() =>
                scrollCarouselTo(
                  highlightsTrackRef,
                  highlightsIndex - 1,
                  CONFIG.highlights.cards.length,
                  setHighlightsIndex
                )
              }
              disabled={highlightsIndex === 0}
              aria-label="पिछला प्रमुख समारोह"
              className="hidden sm:flex items-center justify-center absolute -left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0B1428]/90 border border-[#D2AD68] text-[#E9D5A7] disabled:opacity-25 shadow-lg hover:bg-[#142440]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              data-sound-handled="true"
              onClick={() =>
                scrollCarouselTo(
                  highlightsTrackRef,
                  highlightsIndex + 1,
                  CONFIG.highlights.cards.length,
                  setHighlightsIndex
                )
              }
              disabled={highlightsIndex === CONFIG.highlights.cards.length - 1}
              aria-label="अगला प्रमुख समारोह"
              className="hidden sm:flex items-center justify-center absolute -right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0B1428]/90 border border-[#D2AD68] text-[#E9D5A7] disabled:opacity-25 shadow-lg hover:bg-[#142440]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              data-sound-handled="true"
              onClick={() =>
                scrollCarouselTo(
                  highlightsTrackRef,
                  highlightsIndex - 1,
                  CONFIG.highlights.cards.length,
                  setHighlightsIndex
                )
              }
              disabled={highlightsIndex === 0}
              aria-label="पिछला आकर्षण"
              className="w-8 h-8 rounded-full border border-[#D2AD68]/60 bg-[#12213B]/90 text-[#E9D5A7] flex items-center justify-center disabled:opacity-30 hover:bg-[#1B3254] transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center gap-2">
              {CONFIG.highlights.cards.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  data-sound-handled="true"
                  aria-label={item.title}
                  onClick={() =>
                    scrollCarouselTo(
                      highlightsTrackRef,
                      idx,
                      CONFIG.highlights.cards.length,
                      setHighlightsIndex
                    )
                  }
                  className={`h-2 rounded-full transition-all ${
                    highlightsIndex === idx ? 'w-7 bg-[#D2AD68]' : 'w-2 bg-[#D2AD68]/35'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              data-sound-handled="true"
              onClick={() =>
                scrollCarouselTo(
                  highlightsTrackRef,
                  highlightsIndex + 1,
                  CONFIG.highlights.cards.length,
                  setHighlightsIndex
                )
              }
              disabled={highlightsIndex === CONFIG.highlights.cards.length - 1}
              aria-label="अगला आकर्षण"
              className="w-8 h-8 rounded-full border border-[#D2AD68]/60 bg-[#12213B]/90 text-[#E9D5A7] flex items-center justify-center disabled:opacity-30 hover:bg-[#1B3254] transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </RevealSection>

        {/* ============================================================
            SECTION 8: SUMATI DHAM TEMPLE
        ============================================================ */}
        <RevealSection id="temple" className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="font-hindi-serif text-[29px] sm:text-[33px] font-bold text-[#F9F3E7]">
              {CONFIG.temple.heading}
            </h2>
            <HeritageDivider color="#D2AD68" />
          </div>

          <div className="relative rounded-2xl border-2 border-[#D2AD68] p-2 bg-[#13223D] shadow-[0_22px_50px_rgba(0,0,0,0.75)]">
            <div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-[#081022]">
              <img
                src={CONFIG.images.temple}
                alt="सुमतिधाम मंदिर, इंदौर"
                className="w-full h-full object-cover object-center animate-gentle-zoom"
                referrerPolicy="no-referrer"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(210,173,104,0.12) 0%, transparent 35%, rgba(8,16,34,0.92) 100%)',
                }}
              />
              <div className="absolute bottom-0 inset-x-0 p-5 text-center space-y-1">
                <h3 className="font-hindi-serif text-2xl font-bold text-[#E9D5A7]">
                  {CONFIG.temple.title}
                </h3>
                <p className="font-hindi-body text-sm sm:text-[15px] text-[#F9F3E7]/95">
                  {CONFIG.temple.caption}
                </p>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ============================================================
            SECTION 9: LOCATION & GOOGLE MAPS NAVIGATION
        ============================================================ */}
        <RevealSection id="location">
          <div className="relative rounded-2xl border border-[#D2AD68] bg-gradient-to-b from-[#13223D] to-[#081022] p-6 text-center shadow-[0_20px_48px_rgba(0,0,0,0.65)]">
            <CornerFiligree position="tl" size={24} className="absolute top-3 left-3" />
            <CornerFiligree position="tr" size={24} className="absolute top-3 right-3" />
            <CornerFiligree position="bl" size={24} className="absolute bottom-3 left-3" />
            <CornerFiligree position="br" size={24} className="absolute bottom-3 right-3" />

            <div className="relative z-10 space-y-4">
              <h2 className="font-hindi-serif text-[29px] sm:text-[32px] font-bold text-[#F9F3E7]">
                {CONFIG.location.heading}
              </h2>

              {/* Temple Thumbnail + Gold Pin */}
              <div className="flex items-center justify-center gap-4 py-2">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#D2AD68] shrink-0 shadow-md">
                  <img
                    src={CONFIG.images.temple}
                    alt="सुमतिधाम मंदिर दृश्य"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-2">
                    {/* Custom Gold Location Pin SVG */}
                    <svg width="20" height="24" viewBox="0 0 24 28" fill="none" className="animate-pull-cue" aria-hidden="true">
                      <path
                        d="M12 1C6.48 1 2 5.48 2 11C2 18.25 12 27 12 27C12 27 22 18.25 22 11C22 5.48 17.52 1 12 1Z"
                        fill="#D2AD68"
                        stroke="#F8F1E4"
                        strokeWidth="1.2"
                      />
                      <circle cx="12" cy="11" r="3.5" fill="#0B1428" />
                    </svg>
                    <span className="font-hindi-serif text-xl font-bold text-[#E9D5A7]">
                      {CONFIG.location.venue}
                    </span>
                  </div>
                  <p className="font-hindi-body text-base text-[#F8F1E4]/90 pl-7">
                    {CONFIG.location.city}
                  </p>
                </div>
              </div>

              <a
                href={CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="royal-btn-sheen w-full min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-[#B18A48] via-[#D2AD68] to-[#B18A48] hover:brightness-110 text-[#0B1428] font-hindi-serif text-base font-bold inline-flex items-center justify-center gap-2 shadow-[0_10px_28px_rgba(210,173,104,0.3)] transition-all focus-visible:outline-2 focus-visible:outline-[#F8F1E4]"
              >
                <span>{CONFIG.location.buttonText}</span>
                <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>
        </RevealSection>

        {/* ============================================================
            SECTION 9B: REGISTRATION, CONTACT / WHATSAPP & SOCIAL MEDIA
        ============================================================ */}
        <RevealSection id="contact-connect">
          <RoyalContactConnectCard onOpenRegistration={() => setIsRegistrationOpen(true)} />
        </RevealSection>

        {/* ============================================================
            SECTION 10: FINAL ROYAL INVITATION
        ============================================================ */}
        <RevealSection id="final-invite" className="pb-4">
          <div className="relative rounded-2xl border-2 border-[#B18A48] bg-[#0B1428] p-7 text-center overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
            <GoldDustField />
            <div className="pointer-events-none absolute inset-2.5 rounded-xl border border-[#D2AD68]/55" />
            <CornerFiligree position="tl" color="#E9D5A7" size={28} className="absolute top-3 left-3" />
            <CornerFiligree position="tr" color="#E9D5A7" size={28} className="absolute top-3 right-3" />
            <CornerFiligree position="bl" color="#E9D5A7" size={28} className="absolute bottom-3 left-3" />
            <CornerFiligree position="br" color="#E9D5A7" size={28} className="absolute bottom-3 right-3" />

            <div className="relative z-10 flex flex-col items-center space-y-4">
              <p className="font-hindi-serif text-xl font-semibold text-[#E9D5A7]">
                {CONFIG.finalInvitation.greeting}
              </p>

              <div className="relative p-3 rounded-full border border-[#D2AD68]/55">
                <LogoPresentation variant="medallion" size={88} />
              </div>

              <h2 className="font-hindi-serif royal-gold-title text-[30px] sm:text-[34px] font-bold">
                {CONFIG.finalInvitation.title}
              </h2>

              <p className="font-hindi-body text-base text-[#E9D5A7] font-medium">
                {CONFIG.finalInvitation.dates}
                <br />
                {CONFIG.finalInvitation.venue}
              </p>

              <HeritageDivider color="#D2AD68" />

              <p className="font-hindi-body text-[15px] text-[#F8F1E4]/95 leading-relaxed">
                {CONFIG.finalInvitation.line1}
                <br />
                {CONFIG.finalInvitation.line2}
              </p>

              <div className="pt-2 space-y-0.5">
                <p className="font-hindi-body text-xs text-[#D2AD68]">
                  {CONFIG.finalInvitation.signOffPrefix}
                </p>
                <p className="font-hindi-serif text-lg font-bold text-[#E9D5A7]">
                  {CONFIG.finalInvitation.organizer}
                </p>
              </div>

              {/* Royal Invitation Share & Replay Actions */}
              <div className="w-full pt-3 flex flex-col items-center space-y-3">
                <button
                  type="button"
                  data-sound-handled="true"
                  onClick={handleShareInvite}
                  className="royal-btn-sheen w-full max-w-xs min-h-[48px] px-6 py-3 rounded-xl border border-[#D2AD68] bg-gradient-to-r from-[#B18A48] via-[#D2AD68] to-[#B18A48] text-[#081022] font-hindi-serif text-base font-bold inline-flex items-center justify-center gap-2 shadow-[0_10px_28px_rgba(210,173,104,0.3)] hover:brightness-110 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-[#F8F1E4]"
                >
                  <Share2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>परिवार संग साझा करें</span>
                </button>

                {shareNotice && (
                  <p className="font-hindi-body text-xs text-[#E9D5A7]" role="status">
                    {shareNotice}
                  </p>
                )}

                <button
                  type="button"
                  data-sound-handled="true"
                  onClick={() => {
                    playRoyalSlide();
                    onReplayOpening();
                  }}
                  className="min-h-[44px] px-5 py-2 rounded-full border border-[#B18A48]/55 text-xs font-hindi-body text-[#E9D5A7]/90 hover:bg-[#12213B] inline-flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>राजसी निमंत्रण पुनः देखें</span>
                </button>

                {/* Quiet Footer Social & Helpline Row */}
                <div className="w-full pt-4 mt-1 border-t border-[#D2AD68]/25 flex flex-col items-center space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    {CONFIG.socialMedia.map((social) => (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`सुमतिधाम ${social.label}`}
                        className="w-10 h-10 rounded-full border border-[#D2AD68]/50 bg-[#12213B]/80 hover:bg-[#1D3455] hover:border-[#E9D5A7] text-[#E9D5A7] flex items-center justify-center transition-colors"
                      >
                        <SocialPlatformIcon platform={social.id} className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[#D2AD68]/90 font-english-label tabular-nums">
                    {CONFIG.contacts.map((contact) => (
                      <a
                        key={contact.display}
                        href={contact.telHref}
                        className="hover:text-[#F9F3E7] inline-flex items-center gap-1 py-1 transition-colors"
                      >
                        <Phone className="w-3 h-3" aria-hidden="true" />
                        <span>{contact.display}</span>
                      </a>
                    ))}
                    <a
                      href={CONFIG.registration.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-hindi-body hover:text-[#F9F3E7] inline-flex items-center gap-1 py-1 transition-colors"
                    >
                      <span>ऑनलाइन पंजीकरण</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </main>

      {/* Royal Online Registration Popup Window */}
      <RoyalRegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />
    </div>
  );
};
