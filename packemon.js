/* eslint-disable no-underscore-dangle */

global.__DEV__ = true;
global.__PROD__ = false;
global.__TEST__ = false;

require('./build/bin');
