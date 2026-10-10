/**
 * Web Audio API procedural ambient soundscape generator and audio cues.
 * Completely offline and self-contained with no external audio file dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundNodes: Map<
    string,
    {
      sourceNodes: AudioNode[];
      gainNode: GainNode;
      intervalId?: number;
    }
  > = new Map();

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Generate pink noise buffer
  private createPinkNoiseBuffer(ctx: AudioContext, seconds = 5): AudioBuffer {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // Play Pomodoro completion gentle chime
  playCompletionChime() {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chord

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 2.0);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Toggle ambient track
  toggleAmbient(trackId: 'rain' | 'forest' | 'coffee' | 'ocean', enable: boolean, volume = 0.5) {
    if (!enable) {
      this.stopAmbient(trackId);
      return;
    }
    this.startAmbient(trackId, volume);
  }

  setVolume(trackId: 'rain' | 'forest' | 'coffee' | 'ocean', volume: number) {
    const entry = this.soundNodes.get(trackId);
    if (entry && this.ctx) {
      entry.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.5)), this.ctx.currentTime);
    }
  }

  stopAmbient(trackId: string) {
    const entry = this.soundNodes.get(trackId);
    if (entry) {
      if (entry.intervalId) clearInterval(entry.intervalId);
      entry.sourceNodes.forEach((node) => {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          try {
            (node as AudioScheduledSourceNode).stop();
          } catch {
            // Already stopped
          }
        }
        node.disconnect();
      });
      entry.gainNode.disconnect();
      this.soundNodes.delete(trackId);
    }
  }

  stopAll() {
    Array.from(this.soundNodes.keys()).forEach((key) => this.stopAmbient(key));
  }

  private startAmbient(trackId: 'rain' | 'forest' | 'coffee' | 'ocean', volume: number) {
    this.stopAmbient(trackId);
    const ctx = this.initContext();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.45, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const sourceNodes: AudioNode[] = [];

    if (trackId === 'rain') {
      // Gentle Rain: Filtered pink noise + light high droplets
      const noiseBuffer = this.createPinkNoiseBuffer(ctx, 4);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(1000, ctx.currentTime);

      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(280, ctx.currentTime);

      noiseSource.connect(lowpass);
      lowpass.connect(highpass);
      highpass.connect(masterGain);

      noiseSource.start();
      sourceNodes.push(noiseSource, lowpass, highpass);
    } else if (trackId === 'forest') {
      // Pine Forest: Soft rustling leaves + gentle breeze modulation
      const noiseBuffer = this.createPinkNoiseBuffer(ctx, 5);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(650, ctx.currentTime);
      bandpass.Q.setValueAtTime(1.2, ctx.currentTime);

      // LFO for swaying breeze
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(250, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(bandpass.frequency);
      lfo.start();

      noiseSource.connect(bandpass);
      bandpass.connect(masterGain);
      noiseSource.start();
      sourceNodes.push(noiseSource, bandpass, lfo, lfoGain);
    } else if (trackId === 'ocean') {
      // Ocean Waves: Modulated surging tide
      const noiseBuffer = this.createPinkNoiseBuffer(ctx, 6);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      const swellGain = ctx.createGain();
      swellGain.gain.setValueAtTime(0.3, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.09, ctx.currentTime); // ~11s wave cycle
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.35, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(swellGain.gain);
      lfo.start();

      noiseSource.connect(filter);
      filter.connect(swellGain);
      swellGain.connect(masterGain);
      noiseSource.start();
      sourceNodes.push(noiseSource, filter, swellGain, lfo, lfoGain);
    } else if (trackId === 'coffee') {
      // Coffee Shop: Low ambient warm room acoustics
      const noiseBuffer = this.createPinkNoiseBuffer(ctx, 4);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter1 = ctx.createBiquadFilter();
      filter1.type = 'bandpass';
      filter1.frequency.setValueAtTime(400, ctx.currentTime);
      filter1.Q.setValueAtTime(0.8, ctx.currentTime);

      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'lowpass';
      filter2.frequency.setValueAtTime(1200, ctx.currentTime);

      noiseSource.connect(filter1);
      filter1.connect(filter2);
      filter2.connect(masterGain);
      noiseSource.start();
      sourceNodes.push(noiseSource, filter1, filter2);
    }

    this.soundNodes.set(trackId, {
      sourceNodes,
      gainNode: masterGain,
    });
  }
}

export const soundEngine = new SoundEngine();
