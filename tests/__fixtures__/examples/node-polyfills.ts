import path from 'path';
import { EventEmitter } from 'events';

export const test = path.join('foo', 'bar');

export const emitter = new EventEmitter();

export class Example extends EventEmitter {
  log() {}
}
