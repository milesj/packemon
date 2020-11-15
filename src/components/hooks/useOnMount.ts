import { EffectCallback, useEffect } from 'react';

export default function useOnMount(cb: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(cb, []);
}
