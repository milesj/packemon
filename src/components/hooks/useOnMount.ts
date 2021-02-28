import { EffectCallback, useEffect } from 'react';

export function useOnMount(cb: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(cb, []);
}
