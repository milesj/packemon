import('./helpers').then((result) => {
	result.foo();
});

import(/* webpackChunkName: "helpers" */ './helpers').then(({ bar }) => {
	bar();
});
