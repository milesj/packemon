declare module 'rollup-plugin-visualizer' {
  import { Plugin } from 'rollup';

  interface PluginVisualizerOptions {
    filename?: string;
    gzipSize?: boolean;
    open?: boolean;
    sourcemap?: boolean;
    template?: string;
    title?: string;
  }

  function visualizer(options?: PluginVisualizerOptions): Plugin;

  export = visualizer;
}
