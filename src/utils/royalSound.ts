/**
 * Royal Temple & Silk Acoustic Sound Engine (Web Audio API)
 *
 * Calibrated for a gentle, warm, medium-balanced sound ("हल्का साउंड — न ज़्यादा तेज़ न ज़्यादा धीरे")
 * using soft sine/triangle harmonics, smooth lowpass warmth, and dynamic compression so
 * stacked interactions never clip or sound startling.
 */

type SoundState = {
  ctx: AudioContext | null;
  master: GainNode | null;
  muted: boolean;
  lastTapAt: number;
  lastTurnAt: number;
  lastRopeAt: number;
  lastSlideAt: number;
};

const STORAGE_KEY = 'shramanonnnayak_sound_muted';

function readInitialMute(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

const state: SoundState = {
  ctx: null,
  master: null,
  muted: typeof window !== 'undefined' ? readInitialMute() : false,
  lastTapAt: 0,
  lastTurnAt: 0,
  lastRopeAt: 0,
  lastSlideAt: 0,
};

function ensureAudio(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === 'undefined' || state.muted) return null;

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;

  try {
    if (!state.ctx) {
      const ctx = new AudioCtx();
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-18, ctx.currentTime);
      compressor.knee.setValueAtTime(14, ctx.currentTime);
      compressor.ratio.setValueAtTime(4, ctx.currentTime);
      compressor.attack.setValueAtTime(0.004, ctx.currentTime);
      compressor.release.setValueAtTime(0.16, ctx.currentTime);

      const warmthFilter = ctx.createBiquadFilter();
      warmthFilter.type = 'lowpass';
      warmthFilter.frequency.setValueAtTime(4200, ctx.currentTime);
      warmthFilter.Q.setValueAtTime(0.6, ctx.currentTime);

      const master = ctx.createGain();
      // Balanced medium-soft level: clearly audible & soothing, never too loud or too quiet
      master.gain.setValueAtTime(0.36, ctx.currentTime);

      master.connect(warmthFilter);
      warmthFilter.connect(compressor);
      compressor.connect(ctx.destination);

      state.ctx = ctx;
      state.master = master;
    }

    if (state.ctx.state === 'suspended') {
      void state.ctx.resume().catch(() => {});
    }

    if (!state.master) return null;
    return { ctx: state.ctx, master: state.master };
  } catch {
    return null;
  }
}

export function unlockRoyalAudio(): void {
  ensureAudio();
}

export function isRoyalSoundMuted(): boolean {
  return state.muted;
}

export function setRoyalSoundMuted(muted: boolean): void {
  state.muted = muted;
  try {
    window.localStorage.setItem(STORAGE_KEY, muted ? 'true' : 'false');
  } catch {
    // Ignore storage restriction
  }
  if (!muted) {
    ensureAudio();
  }
}

function playTone(
  ctx: AudioContext,
  master: GainNode,
  opts: {
    freq: number;
    endFreq?: number;
    type?: OscillatorType;
    gain: number;
    attack?: number;
    decay: number;
    delay?: number;
  }
): void {
  const now = ctx.currentTime + (opts.delay ?? 0);
  const attack = opts.attack ?? 0.008;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();

  osc.type = opts.type ?? 'sine';
  osc.frequency.setValueAtTime(opts.freq, now);
  if (opts.endFreq && opts.endFreq !== opts.freq) {
    osc.frequency.exponentialRampToValueAtTime(opts.endFreq, now + opts.decay);
  }

  env.gain.setValueAtTime(0.0001, now);
  env.gain.linearRampToValueAtTime(opts.gain, now + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, now + attack + opts.decay);

  osc.connect(env);
  env.connect(master);

  osc.start(now);
  osc.stop(now + attack + opts.decay + 0.03);
}

function playSilkBrush(
  ctx: AudioContext,
  master: GainNode,
  opts: {
    fromFreq: number;
    toFreq: number;
    duration: number;
    gain: number;
    delay?: number;
  }
): void {
  const now = ctx.currentTime + (opts.delay ?? 0);
  const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * opts.duration));
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Soft pink-like smoothed noise
  let prev = 0;
  for (let i = 0; i < sampleCount; i++) {
    const white = Math.random() * 2 - 1;
    prev = (prev + 0.08 * white) / 1.08;
    data[i] = prev * 2.2;
  }

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(opts.fromFreq, now);
  filter.frequency.exponentialRampToValueAtTime(opts.toFreq, now + opts.duration);
  filter.Q.setValueAtTime(1.4, now);

  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, now);
  env.gain.linearRampToValueAtTime(opts.gain, now + opts.duration * 0.25);
  env.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration);

  src.connect(filter);
  filter.connect(env);
  env.connect(master);

  src.start(now);
  src.stop(now + opts.duration + 0.02);
}

/**
 * 1. General soft royal chime-tap for buttons, cards, links, and controls
 */
export function playRoyalTap(): void {
  const nowMs = performance.now();
  if (nowMs - state.lastTapAt < 55) return;
  state.lastTapAt = nowMs;

  const audio = ensureAudio();
  if (!audio) return;

  playTone(audio.ctx, audio.master, {
    freq: 587.33, // D5
    endFreq: 576,
    type: 'sine',
    gain: 0.16,
    attack: 0.007,
    decay: 0.14,
  });
  playTone(audio.ctx, audio.master, {
    freq: 1174.66, // D6 soft sparkle partial
    type: 'sine',
    gain: 0.045,
    attack: 0.006,
    decay: 0.09,
  });
}

/**
 * 2. Carousel slide / arrow / tab glide sound
 */
export function playRoyalSlide(): void {
  const nowMs = performance.now();
  if (nowMs - state.lastSlideAt < 90) return;
  state.lastSlideAt = nowMs;

  const audio = ensureAudio();
  if (!audio) return;

  playSilkBrush(audio.ctx, audio.master, {
    fromFreq: 750,
    toFreq: 1350,
    duration: 0.16,
    gain: 0.075,
  });
  playTone(audio.ctx, audio.master, {
    freq: 659.25, // E5
    type: 'sine',
    gain: 0.13,
    attack: 0.01,
    decay: 0.17,
  });
}

/**
 * 3. Subtle velvet-wood rotation tick for 3D Box orbit steps
 */
export function playRoyalTurn(): void {
  const nowMs = performance.now();
  if (nowMs - state.lastTurnAt < 105) return;
  state.lastTurnAt = nowMs;

  const audio = ensureAudio();
  if (!audio) return;

  playTone(audio.ctx, audio.master, {
    freq: 440, // A4
    endFreq: 392,
    type: 'triangle',
    gain: 0.095,
    attack: 0.006,
    decay: 0.085,
  });
}

/**
 * 4. Satin ribbon unwrap steps (1 -> 2 -> 3)
 */
export function playRibbonStep(step: 1 | 2 | 3): void {
  const audio = ensureAudio();
  if (!audio) return;

  const notes = [587.33, 739.99, 880.0]; // D5, F#5, A5
  const freq = notes[step - 1] ?? 587.33;

  playSilkBrush(audio.ctx, audio.master, {
    fromFreq: 680 + step * 180,
    toFreq: 1400 + step * 240,
    duration: 0.24,
    gain: 0.08,
  });
  playTone(audio.ctx, audio.master, {
    freq,
    type: 'sine',
    gain: 0.15,
    attack: 0.012,
    decay: 0.28,
  });
  playTone(audio.ctx, audio.master, {
    freq: freq * 2,
    type: 'sine',
    gain: 0.04,
    attack: 0.012,
    decay: 0.18,
  });
}

/**
 * 5. Royal 3D Box lid hinged open — warm santoor/harp ascending chord
 */
export function playBoxOpen(): void {
  const audio = ensureAudio();
  if (!audio) return;

  playSilkBrush(audio.ctx, audio.master, {
    fromFreq: 520,
    toFreq: 1650,
    duration: 0.34,
    gain: 0.085,
  });

  const chord = [587.33, 739.99, 880.0, 1174.66]; // D major luminous chord
  chord.forEach((freq, idx) => {
    playTone(audio.ctx, audio.master, {
      freq,
      type: 'sine',
      gain: 0.14 - idx * 0.015,
      attack: 0.014,
      decay: 0.56,
      delay: idx * 0.065,
    });
  });
}

/**
 * 6. Farman scroll lifted out of the box
 */
export function playScrollExtract(): void {
  const audio = ensureAudio();
  if (!audio) return;

  playSilkBrush(audio.ctx, audio.master, {
    fromFreq: 600,
    toFreq: 1800,
    duration: 0.3,
    gain: 0.09,
  });
  playTone(audio.ctx, audio.master, {
    freq: 880,
    type: 'sine',
    gain: 0.14,
    attack: 0.012,
    decay: 0.32,
  });
  playTone(audio.ctx, audio.master, {
    freq: 1174.66,
    type: 'sine',
    gain: 0.12,
    attack: 0.014,
    decay: 0.42,
    delay: 0.08,
  });
}

/**
 * 7. Gentle braided-rope tension tick while dragging down
 */
export function playRopePullTick(): void {
  const nowMs = performance.now();
  if (nowMs - state.lastRopeAt < 95) return;
  state.lastRopeAt = nowMs;

  const audio = ensureAudio();
  if (!audio) return;

  playSilkBrush(audio.ctx, audio.master, {
    fromFreq: 500,
    toFreq: 900,
    duration: 0.09,
    gain: 0.075,
  });
  playTone(audio.ctx, audio.master, {
    freq: 493.88, // B4
    type: 'triangle',
    gain: 0.07,
    attack: 0.005,
    decay: 0.075,
  });
}

/**
 * 8. Sacred royal scroll untie & crimson Farman unroll — gentle bronze temple chime
 */
export function playFarmanUnroll(): void {
  const audio = ensureAudio();
  if (!audio) return;

  // Velvet parchment unfurl
  playSilkBrush(audio.ctx, audio.master, {
    fromFreq: 480,
    toFreq: 2100,
    duration: 0.42,
    gain: 0.1,
  });

  // Gentle bronze bell harmonics (peaceful, lingering, balanced volume)
  const bellPartials = [
    { freq: 293.66, gain: 0.12, decay: 1.05 }, // D4 warm body
    { freq: 587.33, gain: 0.15, decay: 0.95 }, // D5 primary
    { freq: 880.0, gain: 0.08, decay: 0.72 },  // A5 5th
    { freq: 1174.66, gain: 0.06, decay: 0.6 }, // D6 shimmer
  ];

  bellPartials.forEach((p, idx) => {
    playTone(audio.ctx, audio.master, {
      freq: p.freq,
      type: 'sine',
      gain: p.gain,
      attack: 0.014,
      decay: p.decay,
      delay: idx === 0 ? 0.04 : 0.04 + idx * 0.025,
    });
  });
}

/**
 * 9. Gentle 3-note auspicious chime on sharing / entering Mahotsav
 */
export function playRoyalSuccess(): void {
  const audio = ensureAudio();
  if (!audio) return;

  [587.33, 739.99, 880.0].forEach((freq, idx) => {
    playTone(audio.ctx, audio.master, {
      freq,
      type: 'sine',
      gain: 0.13,
      attack: 0.01,
      decay: 0.34,
      delay: idx * 0.07,
    });
  });
}
