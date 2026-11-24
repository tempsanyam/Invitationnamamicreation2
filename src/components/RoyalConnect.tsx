import React, { useEffect } from 'react';
import { ClipboardCheck, ExternalLink, Phone, X } from 'lucide-react';
import { CONFIG } from '../config/invitationConfig';
import { CornerFiligree, HeritageDivider, LogoPresentation } from './RoyalOrnaments';
import { playRoyalSlide, playRoyalSuccess } from '../utils/royalSound';

type SocialId = (typeof CONFIG.socialMedia)[number]['id'];

export const SocialPlatformIcon: React.FC<{
  platform: SocialId | 'whatsapp';
  className?: string;
}> = ({ platform, className = 'w-5 h-5' }) => {
  switch (platform) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.6" cy="6.4" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <rect x="2.2" y="5" width="19.6" height="14" rx="4.2" />
          <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
          <path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 20.5l1.6-5.2A8.5 8.5 0 1 1 21 11.5z" />
          <path d="M9.4 8.7c-.2-.5-.4-.5-.7-.5h-.5c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.7 1.2 2.9c.2.2 2 3.1 4.9 4.2 2.4.9 2.9.7 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.1-1.4-.1-.1-.3-.2-.7-.4s-1.7-.8-2-.9-.5-.1-.7.2-.8.9-.9 1.1-.3.2-.7 0a7 7 0 0 1-2.1-1.3 8 8 0 0 1-1.5-1.8c-.2-.3 0-.4.1-.6l.4-.5c.2-.2.2-.3.3-.5s0-.4-.1-.6l-.8-2z" fill="currentColor" stroke="none" />
        </svg>
      );
  }
};

interface RoyalRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoyalRegistrationModal: React.FC<RoyalRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playRoyalSlide();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040813]/85 backdrop-blur-sm animate-[fadeIn_0.25s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playRoyalSlide();
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-modal-title"
    >
      <div className="relative w-full max-w-[420px] rounded-2xl border-2 border-[#D2AD68] bg-gradient-to-b from-[#152745] via-[#0E1A32] to-[#080F1E] p-6 sm:p-7 text-center text-[#F8F1E4] shadow-[0_28px_72px_rgba(0,0,0,0.9)]">
        <div className="pointer-events-none absolute inset-2.5 rounded-xl border border-[#E9D5A7]/30" />
        <CornerFiligree position="tl" color="#E9D5A7" size={22} className="pointer-events-none absolute top-3 left-3" />
        <CornerFiligree position="bl" color="#E9D5A7" size={22} className="pointer-events-none absolute bottom-3 left-3" />
        <CornerFiligree position="br" color="#E9D5A7" size={22} className="pointer-events-none absolute bottom-3 right-3" />

        <button
          type="button"
          data-sound-handled="true"
          onClick={() => {
            playRoyalSlide();
            onClose();
          }}
          aria-label="पंजीकरण विंडो बंद करें"
          className="absolute top-3.5 right-3.5 z-20 w-10 h-10 rounded-full border border-[#D2AD68]/60 bg-[#0B1428]/90 text-[#E9D5A7] hover:bg-[#1B3254] flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#E9D5A7]"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="relative z-10 flex flex-col items-center space-y-4 pt-1">
          <LogoPresentation variant="medallion" size={64} />

          <div className="space-y-1">
            <h2
              id="registration-modal-title"
              className="font-hindi-serif text-2xl font-bold text-[#F9F3E7]"
            >
              {CONFIG.registration.modalTitle}
            </h2>
            <p className="font-hindi-body text-xs sm:text-sm text-[#D2AD68]">
              {CONFIG.registration.modalSubtitle}
            </p>
          </div>

          <HeritageDivider color="#D2AD68" />

          <p className="font-hindi-body text-sm sm:text-[15px] text-[#F8F1E4]/90 leading-relaxed px-1">
            {CONFIG.registration.modalDescription}
          </p>

          <a
            href={CONFIG.registration.url}
            target="_blank"
            rel="noopener noreferrer"
            data-sound-handled="true"
            onClick={() => playRoyalSuccess()}
            className="royal-btn-sheen w-full min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-[#B18A48] via-[#E9D5A7] to-[#D2AD68] hover:brightness-110 text-[#0B1428] border border-[#FFF3D1] font-hindi-serif text-base font-bold inline-flex items-center justify-center gap-2 shadow-[0_12px_30px_rgba(210,173,104,0.34)] transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#FFF3D1]"
          >
            <ClipboardCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{CONFIG.registration.modalButtonText}</span>
            <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
          </a>

          <div className="w-full pt-2 border-t border-[#D2AD68]/25 space-y-2.5">
            <p className="font-hindi-body text-xs text-[#E9D5A7]/85">
              पंजीकरण सहायता एवं पूछताछ हेतु संपर्क करें:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {CONFIG.contacts.map((contact) => (
                <a
                  key={contact.display}
                  href={contact.telHref}
                  className="min-h-[40px] px-3.5 py-2 rounded-lg border border-[#D2AD68]/50 bg-[#0B1428]/85 hover:bg-[#182B4B] text-[#E9D5A7] font-english-label text-xs font-medium inline-flex items-center gap-1.5 transition-colors tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D2AD68]" aria-hidden="true" />
                  <span>{contact.display}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RoyalContactConnectCard: React.FC<{
  onOpenRegistration: () => void;
}> = ({ onOpenRegistration }) => {
  return (
    <div className="relative rounded-2xl border-2 border-[#D2AD68] bg-gradient-to-b from-[#13223D] via-[#0E1A31] to-[#081022] p-6 text-center text-[#F8F1E4] shadow-[0_22px_52px_rgba(0,0,0,0.72)]">
      <div className="pointer-events-none absolute inset-2.5 rounded-xl border border-[#E9D5A7]/30" />
      <CornerFiligree position="tl" color="#E9D5A7" size={24} className="pointer-events-none absolute top-3 left-3" />
      <CornerFiligree position="tr" color="#E9D5A7" size={24} className="pointer-events-none absolute top-3 right-3" />
      <CornerFiligree position="bl" color="#E9D5A7" size={24} className="pointer-events-none absolute bottom-3 left-3" />
      <CornerFiligree position="br" color="#E9D5A7" size={24} className="pointer-events-none absolute bottom-3 right-3" />

      <div className="relative z-10 space-y-6">
        {/* Part 1: Registration CTA */}
        <div className="space-y-3">
          <h2 className="font-hindi-serif text-[27px] sm:text-[30px] font-bold text-[#F9F3E7]">
            पंजीकरण एवं संपर्क
          </h2>
          <HeritageDivider color="#D2AD68" />
          <p className="font-hindi-body text-sm sm:text-[15px] text-[#F8F1E4]/90 leading-relaxed">
            श्रमणोन्नायक महोत्सव 2026 में सपरिवार सहभागिता एवं व्यवस्थाओं हेतु अपना ऑनलाइन पंजीकरण पूर्ण करें।
          </p>

          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              type="button"
              data-sound-handled="true"
              onClick={() => {
                playRoyalSuccess();
                onOpenRegistration();
              }}
              className="royal-btn-sheen w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-[#B18A48] via-[#E9D5A7] to-[#D2AD68] hover:brightness-110 text-[#0B1428] border border-[#FFF3D1] font-hindi-serif text-base font-bold inline-flex items-center justify-center gap-2 shadow-[0_10px_28px_rgba(210,173,104,0.3)] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FFF3D1]"
            >
              <ClipboardCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{CONFIG.registration.ctaLabel} (Register Now)</span>
            </button>
          </div>
        </div>

        {/* Hairline Divider */}
        <div className="h-px w-full bg-[#D2AD68]/25" aria-hidden="true" />

        {/* Part 2: Clickable Phone & WhatsApp Helpline */}
        <div className="space-y-3">
          <h3 className="font-hindi-serif text-lg sm:text-xl font-bold text-[#E9D5A7]">
            संपर्क सूत्र एवं WhatsApp
          </h3>

          <div className="space-y-2.5">
            {CONFIG.contacts.map((contact) => (
              <div
                key={contact.display}
                className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 rounded-xl border border-[#D2AD68]/40 bg-[#081022]/85 px-3 py-2"
              >
                <a
                  href={contact.telHref}
                  className="font-english-label text-[13px] sm:text-sm font-semibold text-[#F9F3E7] hover:text-[#E9D5A7] transition-colors tabular-nums whitespace-nowrap inline-flex items-center gap-1.5 min-h-[40px]"
                  aria-label={`कॉल करें ${contact.display}`}
                >
                  <Phone className="w-3.5 h-3.5 text-[#D2AD68] shrink-0" aria-hidden="true" />
                  <span>{contact.display}</span>
                </a>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={contact.telHref}
                    className="min-h-[40px] px-2.5 py-1.5 rounded-lg border border-[#D2AD68]/55 bg-[#142440] hover:bg-[#1D3455] text-[#E9D5A7] font-hindi-body text-xs font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap"
                    aria-label={`${contact.display} पर कॉल करें`}
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>कॉल</span>
                  </a>
                  <a
                    href={contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[40px] px-2.5 py-1.5 rounded-lg border border-[#34A874]/60 bg-[#133C32] hover:bg-[#194E41] text-[#E8FBF2] font-hindi-body text-xs font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap"
                    aria-label={`${contact.display} पर WhatsApp करें`}
                  >
                    <SocialPlatformIcon platform="whatsapp" className="w-3.5 h-3.5 shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hairline Divider */}
        <div className="h-px w-full bg-[#D2AD68]/25" aria-hidden="true" />

        {/* Part 3: Official Social Media Channels */}
        <div className="space-y-3">
          <h3 className="font-hindi-serif text-lg sm:text-xl font-bold text-[#E9D5A7]">
            सुमतिधाम से जुड़ें
          </h3>

          <div className="grid grid-cols-3 gap-2.5">
            {CONFIG.socialMedia.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`सुमतिधाम ${social.label}`}
                className="group min-h-[68px] rounded-xl border border-[#D2AD68]/45 bg-[#081022]/85 hover:bg-[#152745] hover:border-[#E9D5A7] px-2 py-2.5 flex flex-col items-center justify-center gap-1.5 text-[#E9D5A7] transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-[#E9D5A7]"
              >
                <SocialPlatformIcon
                  platform={social.id}
                  className="w-5 h-5 text-[#D2AD68] group-hover:text-[#FFF3D1] transition-colors"
                />
                <span className="font-english-label text-[11px] font-medium text-[#F8F1E4]/90">
                  {social.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
