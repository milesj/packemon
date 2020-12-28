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
            if (
              path.isIdentifier({ name: expr }) &&
              // const __DEV__ = var;
              !path.parentPath.isVariableDeclarator() &&
              // { __DEV__: var }
              !path.parentPath.isObjectProperty() &&
              // obj.__DEV__ = var;
              !path.parentPath.isMemberExpression()
              // // if (__DEV__)
              // (path.parentPath.isIfStatement() ||
              //   // switch(__DEV__)
              //   path.parentPath.isSwitchStatement() ||
              //   // __DEV__ && var
              //   path.parentPath.isLogicalExpression() ||
              //   // __DEV__ ? a : b
              //   path.parentPath.isConditionalExpression() ||
              //   // !__DEV__
              //   path.parentPath.isUnaryExpression() ||
              //   // prop={__DEV__}
              //   path.parentPath.isJSXExpressionContainer())
            ) {
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
            }
          });
        },
      },
    },
  };
}
