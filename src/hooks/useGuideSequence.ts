import { useCallback, useEffect, useState } from 'react';

/** Timeline (ms after the page is ready) for the guide's one-time introduction. */
export const GUIDE_TIMING = {
  bubbleIn: 700,
  greetingStart: 1000,
  greetingSpeed: 26, // ms per character
  messageGap: 450, // pause between greeting and message
  messageSpeed: 12,
  chipsGap: 250,
} as const;

export interface GuideSequence {
  bubbleVisible: boolean;
  greetingChars: number;
  messageChars: number;
  chipsVisible: boolean;
  finished: boolean;
  skip: () => void;
}

/**
 * Drives the avatar's greeting: bubble appears, greeting types, message types,
 * section chips appear. It plays once. With reduced motion (or after `skip`)
 * everything is shown immediately.
 */
export function useGuideSequence(
  ready: boolean,
  instant: boolean,
  greetingLength: number,
  messageLength: number,
): GuideSequence {
  const [elapsed, setElapsed] = useState(0);
  const [skipped, setSkipped] = useState(false);

  const t = GUIDE_TIMING;
  const greetingEnd = t.greetingStart + greetingLength * t.greetingSpeed;
  const messageStart = greetingEnd + t.messageGap;
  const messageEnd = messageStart + messageLength * t.messageSpeed;
  const chipsAt = messageEnd + t.chipsGap;

  const done = instant || skipped || elapsed >= chipsAt;

  useEffect(() => {
    if (!ready || done) return;
    const start = performance.now();
    const id = window.setInterval(() => setElapsed(performance.now() - start), 32);
    return () => window.clearInterval(id);
  }, [ready, done]);

  const skip = useCallback(() => setSkipped(true), []);

  if (done) {
    return {
      bubbleVisible: ready,
      greetingChars: greetingLength,
      messageChars: messageLength,
      chipsVisible: ready,
      finished: ready,
      skip,
    };
  }

  const clamp = (n: number, max: number) => Math.max(0, Math.min(max, Math.floor(n)));
  return {
    bubbleVisible: ready && elapsed >= t.bubbleIn,
    greetingChars: clamp((elapsed - t.greetingStart) / t.greetingSpeed, greetingLength),
    messageChars: clamp((elapsed - messageStart) / t.messageSpeed, messageLength),
    chipsVisible: elapsed >= chipsAt,
    finished: false,
    skip,
  };
}
