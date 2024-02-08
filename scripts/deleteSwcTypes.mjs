import fs from 'fs';

// This file causes issues with Jest tests!
// It's ok to delete through since there is a d.ts file.
const path = 'node_modules/@swc/types/index.ts';

if (fs.existsSync(path)) {
	fs.unlinkSync(path);
}
