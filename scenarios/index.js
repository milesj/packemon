// Browser dual CJS/ESM
import dualExportsJs from 'dual-exports-js';
import dualExportsCjsMjs from 'dual-exports-cjs-mjs';
import dualModuleJs from 'dual-module-js';
import dualModuleCjsMjs from 'dual-module-cjs-mjs';

// Browser ESM
import esmExportJs from 'esm-exports-js';
import esmExportJsModule from 'esm-exports-js-module';
import esmExportMjs from 'esm-exports-mjs';
import esmModuleJs from 'esm-module-js';
import esmModuleJsModule from 'esm-module-js-module';
import esmModuleMjs from 'esm-module-mjs';

// Browser/Node conditions
import dualExportsConditions from 'dual-exports-conditions';

// These are weird but allowed
import validCjsViaImport from 'valid-cjs-via-import';

// These should fail
// import 'invalid-js-module-via-require';
// import 'invalid-mjs-via-require';

console.log(
	dualExportsJs,
	dualExportsCjsMjs,
	dualExportsConditions,
	dualModuleJs,
	dualModuleCjsMjs,
	esmExportJs,
	esmExportJsModule,
	esmExportMjs,
	esmModuleJs,
	esmModuleJsModule,
	esmModuleMjs,
	validCjsViaImport,
);
