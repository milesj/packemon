import { Support } from '../types';

export const supportRanks: Record<Support, number> = {
  legacy: 1,
  stable: 2,
  current: 3,
  experimental: 4,
};

export function getLowestSupport(a: Support, b: Support): Support {
  return supportRanks[a] <= supportRanks[b] ? a : b;
}
