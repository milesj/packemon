import { checkPackageOutdated, Program } from '@boost/cli';
import { getVersion } from './helpers/getVersion';
import {
	BuildCommand,
	CleanCommand,
	InitCommand,
	PackCommand,
	ValidateCommand,
	WatchCommand,
} from '.';

let version = 'internal';

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
		.register(new InitCommand())
		.register(new PackCommand())
		.register(new ValidateCommand())
		.register(new WatchCommand());

	await program.runAndExit(process.argv);
}

void run();
