const assert = require('assert');
const packemon = require('packemon');
const { Packemon } = require('packemon');
const { createRootConfig } = require('packemon/babel');

console.log(Packemon, createRootConfig);

import('packemon').then((result) => {
	assert(Packemon === result.Packemon);
	assert.deepStrictEqual({ ...packemon }, { ...result });
});

import('packemon/babel').then((result) => {
	assert(createRootConfig === result.createRootConfig);
});
