import fs from 'fs';
import { parse } from '@babel/parser';
import { File } from '@babel/types';

export default class JsAsset {
  contents: string;

  extensions: string[] = ['js', 'mjs'];

  resolvedPath: string;

  constructor(resolvedPath: string) {
    this.resolvedPath = resolvedPath;
    // TODO make async
    this.contents = fs.readFileSync(resolvedPath, 'utf8');
  }

  get ast(): File {
    return parse(this.contents, {
      plugins: [
        'classProperties',
        'dynamicImport',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'objectRestSpread',
        'optionalCatchBinding',
        'typescript',
      ],
      sourceFilename: this.resolvedPath,
      sourceType: 'unambiguous',
    });
  }

  getRequirePaths(): string[] {
    const paths: string[] = [];

    this.ast.program.body.forEach(node => {
      if (node.type === 'ImportDeclaration' && node.source.type === 'StringLiteral') {
        // TODO resolve path
        paths.push(node.source.value);
      }
    });

    return paths;
  }
}
