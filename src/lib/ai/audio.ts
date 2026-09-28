export const MIC_SAMPLE_RATE = 16000;
export const PLAYBACK_SAMPLE_RATE = 24000;
/** If queued playback drifts further ahead than this, snap back to "now" to avoid lag. */
export const MAX_BUFFER_AHEAD_S = 1.5;

export function createAudioContext(sampleRate: number): AudioContext {
  const Ctor = window.AudioContext || (window as any).webkitAudioContext;
  return new Ctor({ sampleRate });
}

/** Float32 mic samples -> base64-encoded 16-bit PCM. */
export function encodePcm16Base64(samples: Float32Array): string {
  const pcm = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    pcm[i] = Math.max(-1, Math.min(1, samples[i])) * 0x7fff;
  }
  return btoa(String.fromCharCode(...new Uint8Array(pcm.buffer)));
}

/** Base64-encoded 16-bit little-endian PCM -> Float32 samples. */
export function decodePcm16Base64(base64: string): Float32Array<ArrayBuffer> {
  const binary = atob(base64);
  const samples = new Float32Array(binary.length / 2);
  for (let i = 0; i < samples.length; i++) {
    const unsigned =
      binary.charCodeAt(i * 2) | (binary.charCodeAt(i * 2 + 1) << 8);
    const signed = (unsigned << 16) >> 16;
    samples[i] = signed / 0x7fff;
  }
  return samples;
}
