/* eslint-disable no-magic-numbers */

import https from 'https';

https
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Hello World!');
    res.end();
  })
  .listen(8080);
