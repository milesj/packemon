import { Blueprint, predicates, toArray } from '@boost/common';
import {
  DEFAULT_FORMAT,
  DEFAULT_INPUT,
  DEFAULT_PLATFORM,
  DEFAULT_SUPPORT,
  FORMATS,
  FORMATS_BROWSER,
  FORMATS_NATIVE,
  FORMATS_NODE,
  PLATFORMS,
  SUPPORTS,
} from './constants';
import {
  AnalyzeType,
  BrowserFormat,
  BuildOptions,
  DeclarationType,
  Format,
  NativeFormat,
  NodeFormat,
  PackemonPackageConfig,
  Platform,
  Support,
  ValidateOptions,
} from './types';

const { array, bool, number, object, string, union } = predicates;

// PLATFORMS

const platform = string<Platform>(DEFAULT_PLATFORM).oneOf(PLATFORMS);

// FORMATS

const nativeFormat = string<NativeFormat>(DEFAULT_FORMAT).oneOf(FORMATS_NATIVE);
const nodeFormat = string<NodeFormat>(DEFAULT_FORMAT).oneOf(FORMATS_NODE);
const browserFormat = string<BrowserFormat>(DEFAULT_FORMAT).oneOf(FORMATS_BROWSER);

const format = string<Format>(DEFAULT_FORMAT)
  .oneOf(FORMATS)
  .custom<PackemonPackageConfig>((value, schema) => {
    const platforms = new Set(toArray(schema.struct.platform));

    if (platforms.has('browser') && platforms.size === 1) {
      browserFormat.validate(value as BrowserFormat, schema.currentPath);
    } else if (platforms.has('native') && platforms.size === 1) {
      nativeFormat.validate(value as NativeFormat, schema.currentPath);
    } else if (platforms.has('node') && platforms.size === 1) {
      nodeFormat.validate(value as NodeFormat, schema.currentPath);
    }
  });

// SUPPORT

const support = string<Support>(DEFAULT_SUPPORT).oneOf(SUPPORTS);

// BLUEPRINTS

export const packemonBlueprint: Blueprint<PackemonPackageConfig> = {
  format: union([array(format), format], []),
  inputs: object(string(), { index: DEFAULT_INPUT }).custom((obj) => {
    Object.keys(obj).forEach((key) => {
      if (!key.match(/^\w+$/u)) {
        throw new Error(`Input "${key}" may only contain alpha-numeric characters.`);
      }
    });
  }),
  namespace: string(),
  platform: union([array(platform), platform], DEFAULT_PLATFORM),
  support,
};

export const buildBlueprint: Blueprint<BuildOptions> = {
  addEngines: bool(),
  addExports: bool(),
  analyze: string('none').oneOf<AnalyzeType>(['none', 'sunburst', 'treemap', 'network']),
  concurrency: number(1).gte(1),
  declaration: string('none').oneOf<DeclarationType>(['none', 'standard', 'api']),
  skipPrivate: bool(),
  timeout: number().gte(0),
};

export const validateBlueprint: Blueprint<ValidateOptions> = {
  deps: bool(true),
  engines: bool(true),
  entries: bool(true),
  license: bool(true),
  links: bool(true),
  meta: bool(true),
  people: bool(true),
  skipPrivate: bool(false),
  repo: bool(true),
};
