// @ts-expect-error resolveJsonModule is not on
import data from './data.json';

export const keys = Object.keys(data);
