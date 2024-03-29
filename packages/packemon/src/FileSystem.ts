import fs from 'node:fs';
import { json } from '@boost/common';

export interface FileSystem {
	copyFile: (from: string, to: string) => void;
	createDirAll: (path: string) => void;
	exists: (path: string) => boolean;
	readFile: (path: string) => string;
	readJson: <T>(path: string) => T;
	removeDir: (path: string) => void;
	removeFile: (path: string) => void;
	writeFile: (path: string, data: string) => void;
	writeJson: (path: string, data: unknown) => void;
}

export const nodeFileSystem: FileSystem = {
	copyFile: fs.copyFileSync,
	createDirAll: (path) => fs.mkdirSync(path, { recursive: true }),
	exists: (path) => fs.existsSync(path),
	readFile: (path) => fs.readFileSync(path, 'utf8'),
	readJson: (path) => json.parse(nodeFileSystem.readFile(path)),
	removeDir: (path) => {
		fs.rmSync(path, { recursive: true });
	},
	removeFile: fs.unlinkSync,
	writeFile: (path, data) => {
		fs.writeFileSync(path, `${data.trim()}\n`, 'utf8');
	},
	writeJson: (path, data) => {
		nodeFileSystem.writeFile(path, JSON.stringify(data, null, 2));
	},
};
