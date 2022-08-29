import { Path } from '@boost/common';
import { getFixturePath } from '@boost/test-utils';
import { testExampleOutput } from '../helpers';

// Automatic only
describe('Solid/JSX', () => {
	const root = new Path(getFixturePath('example-solid'));

	testExampleOutput('solid.tsx', 'babel', undefined, root);
	testExampleOutput('solid.tsx', 'swc', undefined, root);
});
