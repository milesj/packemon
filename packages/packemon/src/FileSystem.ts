import fs from 'node:fs';
import { json } from '@boost/common';

export interface FileSystem {
	createDirAll: (path: string) => void;
	exists: (path: string) => boolean;
	readFile: (path: string) => string;
	readJson: <T>(path: string) => T;
	remove: (path: string) => void;
	writeFile: (path: string, data: string) => void;
	writeJson: (path: string, data: unknown) => void;
}

export const nodeFileSystem: FileSystem = {
	createDirAll: (path) => fs.mkdirSync(path, { recursive: true }),
	exists: (path) => fs.existsSync(path),
	readFile: (path) => fs.readFileSync(path, 'utf8'),
	readJson: (path) => json.load(path),
	remove: fs.unlinkSync,
	writeFile: (path, data) => void fs.writeFileSync(path, data, 'utf8'),
	writeJson: (path, data) =>
		void fs.writeFileSync(path, json.stringify(data, { space: 2 }), 'utf8'),
};
