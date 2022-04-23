import assert from 'assert';
import * as packemon from 'packemon';
import { Packemon } from 'packemon';
import { createRootConfig } from 'packemon/babel';

console.log(Packemon, createRootConfig);

import('packemon').then((result) => {
	assert(Packemon === result.Packemon);
	assert.deepStrictEqual({ ...packemon }, { ...result });
});

import('packemon/babel').then((result) => {
	assert(createRootConfig === result.createRootConfig);
});
