import { prefersReducedMotion } from './motion.js';

/* ------------------------------------------------------------------
   A multi-tone air horn, synthesised rather than shipped as an audio
   file: a chord of detuned sawtooths through a lowpass, fired as two
   blasts — "पों पों!". Costs no bytes and never 404s.
   ------------------------------------------------------------------ */

const CHORD = [196, 392, 494, 587];   // G3 + a G-major triad
const MASTER_GAIN = 0.22;             // friendly, not startling

let audioCtx = null;
let master = null;

function getContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  if (!master) {
    master = audioCtx.createGain();
    master.gain.value = MASTER_GAIN;
    master.connect(audioCtx.destination);
  }
  return audioCtx;
}

function blast(ctx, at, duration) {
  const bus = ctx.createGain();
  bus.gain.setValueAtTime(0.0001, at);
  bus.gain.exponentialRampToValueAtTime(0.9, at + 0.03);   // hard attack
  bus.gain.setValueAtTime(0.9, at + duration - 0.09);
  bus.gain.exponentialRampToValueAtTime(0.0001, at + duration);

  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.setValueAtTime(1500, at);
  tone.frequency.linearRampToValueAtTime(2600, at + 0.05);
  tone.Q.value = 0.7;

  bus.connect(tone).connect(master);

  CHORD.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.detune.value = (i - 1.5) * 7;                      // slight spread = "reedy"
    osc.frequency.setValueAtTime(freq * 0.965, at);        // bends up as it fires
    osc.frequency.exponentialRampToValueAtTime(freq, at + 0.07);

    const voice = ctx.createGain();
    voice.gain.value = i === 0 ? 0.16 : 0.1;               // low note underneath

    osc.connect(voice).connect(bus);
    osc.start(at);
    osc.stop(at + duration + 0.05);
  });
}

function honk() {
  const ctx = getContext();
  if (!ctx) return;

  const t = ctx.currentTime + 0.02;
  blast(ctx, t, 0.3);
  blast(ctx, t + 0.4, 0.42);
}

/** Re-triggerable CSS animation: drop the class, force reflow, re-add. */
function replay(el, className, ms) {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
  setTimeout(() => el.classList.remove(className), ms);
}

export function initHorn({ button, truck, burst }) {
  if (!button) return;

  button.addEventListener('click', () => {
    honk();
    replay(button, 'is-blaring', 900);

    if (!prefersReducedMotion()) {
      replay(truck, 'is-jolting', 640);
      replay(burst, 'is-on', 940);
    }
  });
}
