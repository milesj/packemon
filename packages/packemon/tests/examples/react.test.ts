import { testExampleOutput } from '../helpers';

// Automatic only
describe('React/JSX', () => {
	testExampleOutput('react.tsx', 'babel');
	testExampleOutput('react.tsx', 'swc');
});
