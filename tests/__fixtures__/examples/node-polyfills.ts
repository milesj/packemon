import path from 'path';
import { EventEmitter } from 'events';

const test = path.join('foo', 'bar');

const emitter = new EventEmitter();

export class Example extends EventEmitter {
  log() {}
}
