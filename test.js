const path = require('path');
const JsAsset = require('./lib/JsAsset').default;

const js = new JsAsset(path.resolve('./src/assets/JsAsset.ts'));

console.log(js);

console.log(js.ast);

console.log(js.getRequirePaths());
