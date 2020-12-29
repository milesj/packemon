import { types as t, NodePath } from '@babel/core';

const exprs = {
  __DEV__: ['!==', 'production'],
  __PROD__: ['===', 'production'],
  __TEST__: ['===', 'test'],
};

export default function envExpressions() {
  return {
    visitor: {
      Identifier: {
        enter(path: NodePath<t.Identifier>) {
          Object.entries(exprs).forEach(([expr, [op, env]]) => {
            if (!path.isIdentifier({ name: expr })) {
              return;
            }

            // const __DEV__ = var;
            if (path.parentPath.isVariableDeclarator()) {
              return;
            }

            // { __DEV__: var }
            // { [__DEV__]: var }
            if (path.parentPath.isObjectProperty() && path.parentPath.node.value !== path.node) {
              return;
            }

            // obj.__DEV__ = var;
            if (path.parentPath.isMemberExpression()) {
              return;
            }

            path.replaceWith(
              t.binaryExpression(
                op as '===',
                t.memberExpression(
                  t.memberExpression(t.identifier('process'), t.identifier('env'), false),
                  t.identifier('NODE_ENV'),
                  false,
                ),
                t.stringLiteral(env),
              ),
            );
          });
        },
      },
    },
  };
}
