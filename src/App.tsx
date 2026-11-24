import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { MainInvitation } from './components/MainInvitation';
import { OpeningSequence } from './components/OpeningSequence';
import {
  isRoyalSoundMuted,
  playRoyalTap,
  setRoyalSoundMuted,
  unlockRoyalAudio,
} from './utils/royalSound';

export default function App() {
  const [hasEnteredInvitation, setHasEnteredInvitation] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => isRoyalSoundMuted());

  // Unlock AudioContext on first user gesture and provide gentle acoustic
  // feedback whenever any interactive element in the invitation is used.
  useEffect(() => {
    const handleUnlock = () => {
      unlockRoyalAudio();
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest('button, a[href], [role="button"]');
      if (!interactive) return;
      if (interactive.hasAttribute('disabled')) return;
      if (interactive.getAttribute('aria-disabled') === 'true') return;
      // Skip elements that trigger their own bespoke sound handler
      if (interactive.closest('[data-sound-handled="true"]')) return;
      playRoyalTap();
    };

    window.addEventListener('pointerdown', handleUnlock, { passive: true });
    document.addEventListener('click', handleGlobalClick, true);

    return () => {
      window.removeEventListener('pointerdown', handleUnlock);
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, []);

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setRoyalSoundMuted(nextMuted);
    if (!nextMuted) {
      playRoyalTap();
    }
  };

  const handleEnterInvitation = () => {
    setHasEnteredInvitation(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleReplayOpening = () => {
    setHasEnteredInvitation(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <>
      <button
        type="button"
        data-sound-handled="true"
        onClick={handleToggleSound}
        aria-label={isMuted ? 'ध्वनि चालू करें' : 'ध्वनि बंद करें'}
        aria-pressed={!isMuted}
        className="fixed z-50 w-10 h-10 rounded-full border border-[#B18A48]/55 bg-[#070D1C]/85 backdrop-blur-sm text-[#E9D5A7] hover:text-[#F9F3E7] hover:border-[#D2AD68] transition-colors flex items-center justify-center shadow-[0_6px_18px_rgba(0,0,0,0.45)] focus-visible:outline-2 focus-visible:outline-[#E9D5A7] active:scale-95"
        style={{
          top: 'max(14px, env(safe-area-inset-top))',
          left: 'max(16px, env(safe-area-inset-left))',
        }}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 opacity-75" aria-hidden="true" />
        ) : (
          <Volume2 className="w-4 h-4" aria-hidden="true" />
        )}
      </button>

      {!hasEnteredInvitation ? (
        <OpeningSequence onComplete={handleEnterInvitation} />
      ) : (
        <MainInvitation onReplayOpening={handleReplayOpening} />
      )}
    </>
  );
}

