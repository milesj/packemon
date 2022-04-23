const assert = require('assert');
const { Packemon } = require('packemon');
const { createRootConfig } = require('packemon/babel');

console.log(Packemon, createRootConfig);

import('packemon').then((result) => {
	assert(Packemon === result.Packemon);
});

import('packemon/babel').then((result) => {
	assert(createRootConfig === result.createRootConfig);
});
