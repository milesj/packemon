import { Path, type PortablePath } from '@boost/common';
import type { FileSystem } from '../FileSystem';
import type { TSConfigStructure } from '../types';
import { loadModule } from './loadModule';

const CACHE = new Map<Path, TSConfigStructure>();

export function loadTsconfigJson(
	path: PortablePath,
	fs: FileSystem,
): TSConfigStructure | undefined {
	const tsconfigJsonPath = Path.create(path);
	const tsconfig = CACHE.get(tsconfigJsonPath);

	if (tsconfig) {
		return tsconfig;
	}

	if (!tsconfigJsonPath.exists()) {
		return undefined;
	}

	const ts = loadModule(
		'typescript',
		'TypeScript is required for config loading.',
	) as typeof import('typescript');

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { config, error } = ts.readConfigFile(tsconfigJsonPath.path(), fs.readFile);

	const host = {
		getCanonicalFileName: (fileName: string) => fileName,
		getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
		getNewLine: () => ts.sys.newLine,
	};

	// istanbul ignore next
	if (error) {
		throw new Error(ts.formatDiagnostic(error, host));
	}

	const result = ts.parseJsonConfigFileContent(
		config,
		ts.sys,
		tsconfigJsonPath.parent().path(),
		{},
		tsconfigJsonPath.path(),
	);

	// istanbul ignore next
	if (result.errors.length > 0) {
		throw new Error(ts.formatDiagnostics(result.errors, host));
	}

	CACHE.set(tsconfigJsonPath, result);

	return result;
}
