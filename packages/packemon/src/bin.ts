import { checkPackageOutdated, Program } from '@boost/cli';
import { getVersion } from './helpers/getVersion';
import {
	BuildCommand,
	CleanCommand,
	FilesCommand,
	InitCommand,
	PackCommand,
	ScaffoldCommand,
	ValidateCommand,
	WatchCommand,
} from '.';

let version = '0.0.0-internal';

try {
	version = getVersion();
} catch {
	// Ignore
}

async function run() {
	const program = new Program({
		bin: 'packemon',
		footer: 'Documentation: https://packemon.dev',
		name: 'Packemon',
		version,
	});

	program
		.categories({
			filter: 'Filtering',
		})
		.middleware(checkPackageOutdated('packemon', version))
		.register(new BuildCommand())
		.register(new CleanCommand())
		.register(new FilesCommand())
		.register(new InitCommand())
		.register(new PackCommand())
		.register(new ScaffoldCommand())
		.register(new ValidateCommand())
		.register(new WatchCommand());

	await program.runAndExit(process.argv);
}

void run();
