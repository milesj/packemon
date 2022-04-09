// Browser ESM
import esmExportJs from 'esm-exports-js';
import esmExportJsModule from 'esm-exports-js-module';
import esmExportMjs from 'esm-exports-mjs';
import esmModuleJs from 'esm-module-js';
import esmModuleJsModule from 'esm-module-js-module';
import esmModuleMjs from 'esm-module-mjs';

// These are weird but allowed
import 'valid-cjs-via-import';

// These should fail
// import 'invalid-js-module-via-require';
// import 'invalid-mjs-via-require';

console.log(
	esmExportJs,
	esmExportJsModule,
	esmExportMjs,
	esmModuleJs,
	esmModuleJsModule,
	esmModuleMjs,
);
