import React, { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config/invitationConfig';
import {
  CornerFiligree,
  GoldDustField,
  RoyalJaliArchBackdrop,
} from './RoyalOrnaments';
import { GoldenPetalShower } from './RoyalEffects';
import { Royal3DBox } from './Royal3DBox';
import {
  playBoxOpen,
  playRibbonStep,
  playRoyalSlide,
} from '../utils/royalSound';

export type OpeningStage = 'box' | 'unwrapping' | 'zooming' | 'open';

interface OpeningSequenceProps {
  onComplete: () => void;
}

export const OpeningSequence: React.FC<OpeningSequenceProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<OpeningStage>('box');
  const [unwrapStep, setUnwrapStep] = useState<0 | 1 | 2 | 3>(0);
  const [petalKey, setPetalKey] = useState(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  // Trigger contained ribbon unwrap -> smooth controlled zoom into box -> Front-View Open Box
  const handleBoxOpen = () => {
    if (stage !== 'box') return;
    clearTimers();
    setStage('unwrapping');
    setUnwrapStep(1);
    playRibbonStep(1);

    const t1 = window.setTimeout(() => {
      setUnwrapStep(2);
      playRibbonStep(2);
    }, 460);

    const t2 = window.setTimeout(() => {
      setUnwrapStep(3);
      playRibbonStep(3);
    }, 920);

    const t3 = window.setTimeout(() => {
      setStage('zooming');
      playRoyalSlide();
    }, 1480);

    const t4 = window.setTimeout(() => {
      setStage('open');
      playBoxOpen();
    }, 2480);

    timersRef.current.push(t1, t2, t3, t4);
  };

  return (
    <div
      className="relative min-h-svh-safe w-full overflow-x-hidden overflow-y-auto bg-[#070D1C] flex flex-col items-center justify-center px-4 py-6 select-none"
      style={{
        paddingTop: 'max(18px, env(safe-area-inset-top))',
        paddingBottom: 'max(22px, env(safe-area-inset-bottom))',
      }}
    >
      <GoldenPetalShower triggerKey={petalKey} />

      {/* Atmospheric Royal Midnight Palace Backdrop */}
      <div
        className="pointer-events-none fixed inset-0 transition-opacity duration-700"
        style={{
          background:
            stage === 'open'
              ? 'radial-gradient(circle at 50% 42%, rgba(92, 24, 48, 0.24) 0%, rgba(18, 33, 59, 0.68) 46%, #070D1C 88%)'
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

      {/* Main Centered Royal Mangal Box Stage */}
      <div
        className={`relative z-20 w-full flex flex-col items-center text-center ${
          stage === 'open' ? 'max-w-[440px] pt-10 sm:pt-6' : 'max-w-[420px] pt-12 sm:pt-8'
        }`}
      >
        <Royal3DBox
          stage={stage}
          unwrapStep={unwrapStep}
          onStartOpen={handleBoxOpen}
          onTriggerPetals={() => setPetalKey((k) => k + 1)}
          onEnterInvitation={() => {
            clearTimers();
            onComplete();
          }}
        />
      </div>
    </div>
  );
};

// Keep CONFIG reference active for consistent typography/greeting usage
void CONFIG;
