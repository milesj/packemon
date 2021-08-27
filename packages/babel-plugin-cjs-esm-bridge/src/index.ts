import { NodePath, types as t } from '@babel/core';

export default function cjsEsmBridge() {
	return {
		visitor: {
			Identifier: {
				enter(path: NodePath<t.Identifier>) {},
			},
		},
	};
}
