// ============================================================
//  AETHERIA ONLINE — sonido sintetizado (WebAudio, sin archivos)
//
//  El juego no cargaba ni un sample y se sentía mudo: golpeabas y nada
//  respondía. Este módulo fabrica cada efecto con osciladores y ruido
//  filtrado en el momento, así que no hay assets que descargar ni que
//  puedan faltar. Todo dura milisegundos y suena "de videojuego", que es
//  justo la estética del personaje hecho con primitivas.
//
//  Reglas del navegador: el AudioContext arranca mudo hasta un gesto real
//  del usuario. `init()` se llama en el primer keydown/mousedown; hasta
//  entonces `play()` simplemente no hace nada.
// ============================================================

let ctx = null, master = null, muted = false, ambGain = null, ambFilter = null, ambLfo = null;
let ambTarget = { freq: 600, gain: 0.08 };

function noiseBuffer(seconds){
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for(let i=0;i<len;i++) d[i] = Math.random()*2-1;
  return buf;
}
let noiseBuf = null;

export function init(){
  if(ctx) { if(ctx.state === 'suspended') ctx.resume(); return; }
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch(e){ return; }
  master = ctx.createGain(); master.gain.value = muted ? 0 : 0.5;
  master.connect(ctx.destination);
  noiseBuf = noiseBuffer(2);

  // ---- ambiente: un viento continuo (ruido pasabanda con un LFO lento).
  // Cada zona mueve la frecuencia y el volumen del filtro, así el bosque
  // susurra grave y la montaña silba agudo, sin sumar una sola pista.
  const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
  ambFilter = ctx.createBiquadFilter(); ambFilter.type = 'bandpass';
  ambFilter.frequency.value = ambTarget.freq; ambFilter.Q.value = 0.9;
  ambGain = ctx.createGain(); ambGain.gain.value = 0;
  ambLfo = ctx.createOscillator(); ambLfo.frequency.value = 0.13;
  const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.035;
  ambLfo.connect(lfoGain); lfoGain.connect(ambGain.gain);
  src.connect(ambFilter); ambFilter.connect(ambGain); ambGain.connect(master);
  src.start(); ambLfo.start();
  ambGain.gain.setTargetAtTime(ambTarget.gain, ctx.currentTime, 2);
}
export const ready = () => !!ctx;
export function toggleMute(){
  muted = !muted;
  if(master) master.gain.setTargetAtTime(muted ? 0 : 0.5, ctx.currentTime, 0.05);
  return muted;
}
export const isMuted = () => muted;

/** El viento cambia de carácter con la zona. `freq` en Hz, `gain` 0..1. */
export function setAmbience(freq, gain){
  ambTarget = { freq, gain };
  if(!ctx) return;
  ambFilter.frequency.setTargetAtTime(freq, ctx.currentTime, 1.5);
  ambGain.gain.setTargetAtTime(gain, ctx.currentTime, 1.5);
}

// ---- primitivas ----
function tone(type, f0, f1, dur, vol, delay=0){
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t);
  if(f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20,f1), t+dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t+dur+0.02);
}
function noise(dur, vol, filterType, f0, f1, delay=0, q=1){
  const t = ctx.currentTime + delay;
  const s = ctx.createBufferSource(); s.buffer = noiseBuf;
  s.playbackRate.value = 0.8 + Math.random()*0.4;
  const f = ctx.createBiquadFilter(); f.type = filterType; f.Q.value = q;
  f.frequency.setValueAtTime(f0, t);
  if(f1 !== f0) f.frequency.exponentialRampToValueAtTime(Math.max(40,f1), t+dur);
  const g = ctx.createGain(); g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
  s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t+dur+0.02);
}

// ---- catálogo de efectos ----
const FX = {
  swing:   ()=> noise(0.16, 0.35, 'bandpass', 900, 2600, 0, 0.8),
  swingHeavy:()=>{ noise(0.3, 0.45, 'bandpass', 500, 1800, 0, 0.7); tone('sawtooth', 180, 70, 0.28, 0.14); },
  draw:    ()=> { noise(0.3, 0.4, 'bandpass', 1800, 5200, 0, 3.5); tone('triangle', 2400, 1500, 0.22, 0.14); },
  sheathe: ()=> { noise(0.24, 0.28, 'bandpass', 3000, 900, 0, 2.5); tone('sine', 700, 400, 0.14, 0.08); },
  hit:     ()=> { noise(0.09, 0.5, 'lowpass', 1800, 300); tone('square', 220, 90, 0.09, 0.18); },
  crit:    ()=> { noise(0.14, 0.6, 'lowpass', 2600, 300); tone('square', 420, 110, 0.14, 0.22); tone('sine', 1200, 1800, 0.10, 0.12, 0.02); },
  hurt:    ()=> { noise(0.18, 0.5, 'lowpass', 700, 120); tone('sawtooth', 160, 60, 0.2, 0.25); },
  block:   ()=> { tone('triangle', 1400, 900, 0.10, 0.3); noise(0.08, 0.3, 'highpass', 2500, 4000); },
  dash:    ()=> noise(0.28, 0.4, 'bandpass', 500, 2400, 0, 1.4),
  jump:    ()=> tone('sine', 300, 620, 0.16, 0.18),
  jump2:   ()=> { tone('sine', 420, 900, 0.16, 0.18); tone('sine', 640, 1200, 0.14, 0.12, 0.04); },
  land:    ()=> noise(0.12, 0.35, 'lowpass', 500, 120),
  step:    ()=> noise(0.05, 0.10, 'lowpass', 900, 250),
  pickup:  ()=> { tone('sine', 880, 880, 0.08, 0.2); tone('sine', 1320, 1320, 0.12, 0.2, 0.08); },
  gold:    ()=> { tone('triangle', 1500, 1500, 0.06, 0.18); tone('triangle', 2000, 2000, 0.10, 0.18, 0.06); },
  potion:  ()=> { tone('sine', 500, 900, 0.18, 0.2); tone('sine', 700, 1300, 0.22, 0.15, 0.08); },
  levelup: ()=> { [523, 659, 784, 1046].forEach((f,i)=> tone('triangle', f, f, 0.35, 0.22, i*0.09)); noise(0.6, 0.15, 'highpass', 3000, 6000, 0.3); },
  kill:    ()=> { noise(0.25, 0.4, 'bandpass', 600, 150, 0, 0.6); tone('sine', 300, 80, 0.25, 0.15); },
  bosskill:()=> { noise(0.9, 0.6, 'lowpass', 1200, 80); [196, 262, 330, 392, 523].forEach((f,i)=> tone('sawtooth', f, f, 0.5, 0.14, i*0.1)); },
  windup:  ()=> tone('sawtooth', 110, 180, 0.35, 0.16),
  slam:    ()=> { noise(0.4, 0.7, 'lowpass', 400, 60); tone('sine', 70, 35, 0.4, 0.4); },
  bolt:    ()=> { noise(0.2, 0.3, 'bandpass', 1500, 4000, 0, 2); tone('sine', 900, 1500, 0.16, 0.14); },
  ice:     ()=> { noise(0.22, 0.32, 'highpass', 2500, 5000); tone('triangle', 1800, 900, 0.2, 0.14); },
  blink:   ()=> { noise(0.2, 0.3, 'bandpass', 300, 3000, 0, 3); tone('sine', 1400, 200, 0.2, 0.14); },
  dodge:   ()=> { tone('sine', 1000, 2000, 0.18, 0.22); noise(0.25, 0.25, 'highpass', 2000, 6000); },
  skill:   ()=> { noise(0.22, 0.35, 'bandpass', 800, 3200, 0, 1.2); tone('sine', 400, 1400, 0.22, 0.2); },
  alert:   ()=> tone('square', 700, 1000, 0.08, 0.10),
  death:   ()=> { [330, 262, 196, 131].forEach((f,i)=> tone('sawtooth', f, f*0.8, 0.5, 0.2, i*0.28)); },
  spawn:   ()=> noise(0.3, 0.2, 'lowpass', 300, 1200),
  zone:    ()=> { tone('sine', 660, 660, 0.5, 0.12); tone('sine', 990, 990, 0.7, 0.10, 0.15); },
  ui:      ()=> tone('sine', 1200, 1000, 0.05, 0.10),
  combo:   ()=> { tone('triangle', 1000, 1300, 0.08, 0.14); },
  save:    ()=> { tone('sine', 900, 900, 0.06, 0.08); tone('sine', 1350, 1350, 0.08, 0.08, 0.07); },
};

/** Dispara un efecto por nombre. Silencioso si el audio no arrancó todavía. */
export function play(name){
  if(!ctx || muted) return;
  const fx = FX[name]; if(!fx) return;
  try { fx(); } catch(e){ /* un efecto roto no tira el juego */ }
}
