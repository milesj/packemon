import { NodePath, type PluginObj, types as t } from '@babel/core';

function isWrappedWithConditional(path: NodePath<t.ExpressionStatement>): boolean {
	let currentPath: NodePath<t.Node> | null = path;
	let wrapped = false;

	while (currentPath) {
		// Is there a cleaner way of doing this???
		if (
			currentPath.isIfStatement() &&
			currentPath.get('test').isBinaryExpression({ operator: '!==' }) &&
			(currentPath.get('test.left') as NodePath<t.MemberExpression>).isMemberExpression() &&
			(currentPath.get('test.left.object') as NodePath<t.MemberExpression>).isMemberExpression() &&
			(currentPath.get('test.left.object.object') as NodePath<t.Identifier>).isIdentifier({
				name: 'process',
			}) &&
			(currentPath.get('test.left.object.property') as NodePath<t.Identifier>).isIdentifier({
				name: 'env',
			}) &&
			(currentPath.get('test.left.property') as NodePath<t.Identifier>).isIdentifier({
				name: 'NODE_ENV',
			}) &&
			(currentPath.get('test.right') as NodePath<t.StringLiteral>).isStringLiteral({
				value: 'production',
			})
		) {
			wrapped = true;
			break;
		}

		currentPath = currentPath.parentPath;
	}

	return wrapped;
}

export default function conditionalInvariantPlugin(): PluginObj {
	return {
		visitor: {
			ExpressionStatement: {
				enter(path: NodePath<t.ExpressionStatement>) {
					if (
						!path.get('expression').isCallExpression() ||
						!(path.get('expression.callee') as NodePath<t.Identifier>).isIdentifier({
							name: 'invariant',
						})
					) {
						return;
					}

					// Only transform invariants within the following scenarios:
					// 	- Block statements (if, while, functions, etc)
					// 	- Switch case statements
					//	- Module scope
					if (
						!path.parentPath.isBlockStatement() &&
						!path.parentPath.isSwitchCase() &&
						!path.parentPath.isProgram()
					) {
						return;
					}

					// Dont replace with new syntax if invariant is already wrapped
					// in a NODE_ENV conditional!
					if (isWrappedWithConditional(path)) {
						return;
					}

					path.replaceWith(
						t.ifStatement(
							t.binaryExpression(
								'!==',
								t.memberExpression(
									t.memberExpression(t.identifier('process'), t.identifier('env'), false),
									t.identifier('NODE_ENV'),
									false,
								),
								t.stringLiteral('production'),
							),
							t.blockStatement([path.node]),
						),
					);
				},
			},
		},
	};
}
