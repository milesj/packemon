import assert from 'assert';
import { Packemon } from 'packemon';
import { createRootConfig } from 'packemon/babel';

console.log(Packemon, createRootConfig);

import('packemon').then((result) => {
	assert(Packemon === result.Packemon);
});
