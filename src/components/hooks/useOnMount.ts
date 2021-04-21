import { EffectCallback, useEffect } from 'react';

// eslint-disable-next-line promise/prefer-await-to-callbacks
export function useOnMount(cb: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(cb, []);
}
