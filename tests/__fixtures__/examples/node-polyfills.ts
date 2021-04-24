import { EventEmitter } from 'events';
import path from 'path';

export const test = path.join('foo', 'bar');

export const emitter = new EventEmitter();

export class Example extends EventEmitter {
  log() {}
}
