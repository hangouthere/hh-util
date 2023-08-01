import envPlugin from '@chialab/esbuild-plugin-env';
import htmlPlugin from '@chialab/esbuild-plugin-html';
import chalk from 'chalk';
import esbuild, { type BuildOptions, type BuildResult, type Format, type Platform, type ServeOptions } from 'esbuild';
import copyStaticFiles from 'esbuild-copy-static-files';
import sassPlugin from 'esbuild-plugin-sass';
import { existsSync as exists } from 'node:fs';
import path from 'node:path';
import { definedProps } from '../core/index.js';

const isProd = process.env.NODE_ENV === 'production';

interface HHBuilderOptions {
  dirSrc: string;
  dirStatic: string;
  outdirStatic: string;
  forceBuildOnly: boolean;
  nodeEnv: string;
  verbose: boolean;
  isProd: boolean;

  serveOptions: ServeOptions;
  buildOptions: BuildOptions;
}

const DEFAULT_ESBUILDEROPTIONS: Partial<HHBuilderOptions> = {
  dirSrc: path.resolve('src'),
  dirStatic: path.resolve('static'),
  outdirStatic: path.resolve('dist'),
  forceBuildOnly: false,
  nodeEnv: 'development',
  verbose: false,
  isProd,

  serveOptions: {
    port: 9000,
    servedir: 'dist'
  },

  buildOptions: {
    bundle: true,
    metafile: true,
    minify: isProd,
    outdir: path.resolve('dist'),
    platform: 'browser',
    sourcemap: isProd ? false : 'inline',
    target: 'esnext',
    assetNames: 'assets/[name]-[hash]',
    chunkNames: '[ext]/[name]-[hash]'
  }
};

const ENV_ESBUILDEOPTIONS: Partial<HHBuilderOptions> = {
  dirSrc: process.env.DIRSRC ? path.resolve(process.env.DIRSRC) : undefined,
  dirStatic: process.env.DIRSTATIC ? process.env.DIRSTATIC : undefined,
  outdirStatic: process.env.OUTDIRSTATIC ? process.env.OUTDIRSTATIC : undefined,
  forceBuildOnly: !!process.env.FORCEBUILDONLY,
  nodeEnv: process.env.NODE_ENV || 'development',
  verbose: !!process.env.VERBOSE,

  serveOptions: {
    port: process.env.DEVPORT ? parseInt(process.env.DEVPORT) : undefined,
    servedir: process.env.DIROUT ? process.env.DIROUT : undefined
  },

  buildOptions: {
    format: process.env.FORMAT ? (process.env.FORMAT as Format) : 'esm',
    logLevel: process.env.VERBOSE ? 'debug' : 'info',
    minify: isProd,
    outdir: process.env.DIROUT ? process.env.DIROUT : undefined,
    platform: process.env.RUNTIMEPLATFORM ? (process.env.RUNTIMEPLATFORM as Platform) : undefined,
    sourcemap: isProd ? false : 'inline',
    target: process.env.JSTARGET ? process.env.JSTARGET : undefined
  }
};

/**
 * Browser-first ESBuilder
 *
 * Override getters, or supply input options to constructor to override behavior!
 *
 * Available Environment Variables
 * DEVPORT - Port to run Dev Server on, defaults to `9000`
 * DIROUT - Output directory for bundle(s), defaults to 'dist'
 * DIRSRC - Source directory for input(s), defaults to 'src'
 * DIRSTATIC - Input directory for static files, defaults to 'static'
 * EXTERNALS - Libs to consider external and not included in bundle(s) (i.e., './node_modules/*'), defaults to []
 * FILESRC - Input filename(s) for entrypoints, separated by '|' (i.e., 'index.html|anotherView.html'),
 *            defaults to 'index.html'
 * FORCEBUILDONLY - Set to anything to force an output build, useful for when NODE_ENV=development,
 *            but you want to see the source instead of a dev server
 * JSTARGET - ESBuild-specific JS Target, defaults to 'esnext'
 * NODE_ENV - Your standard node env variable, defaults to 'development'
 * RUNTIMEPLATFORM - ESBuild-specific Platform target, defaults to 'browser'
 * VERBOSE - Set to anything to output extra info when building
 */
export class ESBuilder {
  private _optionsCache?: HHBuilderOptions;

  /**
   * Resolve proper Root Path for project
   */
  get rootPath() {
    return this._options.dirSrc || ENV_ESBUILDEOPTIONS.dirSrc || DEFAULT_ESBUILDEROPTIONS.dirSrc || __dirname;
  }

  /**
   * Dynamic resolution of Entrypoints for ESBuild, relative to `dirRoot`
   *
   * See: https://esbuild.github.io/api/#entry-points
   */
  get entryPoints(): BuildOptions['entryPoints'] {
    // Grab ENV value, or default to index.html
    const entryPoints = process.env.FILESRC ? process.env.FILESRC.split('|') : ['index.html'];

    console.log('Root Path:', this.rootPath);

    // Build path relative to root dir
    return entryPoints.map(entryPoint => path.resolve(this.rootPath, entryPoint));
  }

  /**
   * Dynamic resolution of Externals for ESBuild
   *
   * See: https://esbuild.github.io/api/#external
   */
  get externals(): BuildOptions['external'] {
    return process.env.EXTERNALS ? process.env.EXTERNALS.split('|') : [];
  }

  /**
   * Available loaders to ESBuild
   *
   * See: https://esbuild.github.io/api/#loader
   */
  get loaders(): BuildOptions['loader'] {
    return {
      '.png': 'file',
      '.svg': 'file',
      '.ts': 'ts',
      '.tsx': 'tsx'
    };
  }

  /**
   * Build Plugin array for ESBuild pipeline
   */
  get plugins(): BuildOptions['plugins'] {
    const opts = this._optionsCache as HHBuilderOptions;
    const plugins = [envPlugin(), htmlPlugin(), sassPlugin()];

    if (opts.dirStatic) {
      console.info(chalk.gray(`Checking for: '${opts.dirStatic}'`));

      if (true === exists(opts.dirStatic)) {
        console.info(chalk.white(`Adding Static Copy...`));
        plugins.push(
          copyStaticFiles({
            src: opts.dirStatic,
            dest: opts.outdirStatic
          })
        );
      } else {
        console.log(chalk.yellowBright(`Warning: '${opts.dirStatic}' doesn't exist!`));
      }
    }

    return plugins;
  }

  /**
   * Dynamically generates options as needed, typically upon ready to build or serve for dev.
   */
  get options(): HHBuilderOptions {
    if (this._optionsCache) {
      return this._optionsCache;
    }

    const opts: HHBuilderOptions = {
      ...definedProps<HHBuilderOptions>(DEFAULT_ESBUILDEROPTIONS),
      ...definedProps<HHBuilderOptions>(ENV_ESBUILDEOPTIONS),
      ...this._options,

      serveOptions: {
        ...definedProps<ServeOptions>(DEFAULT_ESBUILDEROPTIONS.serveOptions ?? {}),
        ...definedProps<ServeOptions>(ENV_ESBUILDEOPTIONS.serveOptions ?? {}),
        ...definedProps<ServeOptions>(this._options.serveOptions ?? {})
      },

      buildOptions: {
        ...definedProps<BuildOptions>(DEFAULT_ESBUILDEROPTIONS.buildOptions ?? {}),
        ...definedProps<BuildOptions>(ENV_ESBUILDEOPTIONS.buildOptions ?? {}),
        ...definedProps<BuildOptions>(this._options.buildOptions ?? {}),
        entryPoints: this.entryPoints,
        external: this.externals,
        loader: this.loaders
      }
    };

    this._optionsCache = opts;

    return this._optionsCache;
  }

  constructor(private _options: Partial<HHBuilderOptions> = {}) {}

  /**
   * Perform Build, based on environment and options
   */
  async build() {
    const opts = this.options;

    if (opts.forceBuildOnly || opts.isProd) {
      await this._runBuild(opts);
    } else {
      await this._runDevServer(opts);
    }
  }

  protected _verboseOutput(buildResult?: BuildResult) {
    if (this.options.verbose) {
      console.log('\n-- Verbose Start', Array(20).fill('-').join(''));
      console.log('Constructor Options', this._options, '\n');
      console.log('Default Options', DEFAULT_ESBUILDEROPTIONS, '\n');
      console.log('ENV-based Options', ENV_ESBUILDEOPTIONS, '\n');
      console.log('Derived Options', this.options, '\n');
      if (buildResult) {
        console.log('Build Result', buildResult);
      }
      console.log(Array(20).fill('-').join(''), 'Verbose End --');
    }
  }

  /**
   * Run build only and complete
   */
  protected async _runBuild(opts: HHBuilderOptions) {
    const chosenColor = isProd ? chalk.redBright : chalk.yellowBright;

    console.log(chosenColor('Building Bundle...'));

    const buildResult = await esbuild.build({
      ...opts.buildOptions,
      plugins: this.plugins
    });

    this._verboseOutput(buildResult);

    console.log(`Build (${opts.nodeEnv}) Complete:\n\tBuildDir: ${opts.buildOptions.outdir}`);
  }

  /**
   * Run Dev Server for continuous building and serving files.
   * Useful for web-work, not so much node-work
   */
  protected async _runDevServer(opts: HHBuilderOptions) {
    console.log(chalk.greenBright('Running Dev Server...'));

    const esbuildContext = await esbuild.context({
      ...opts.buildOptions,
      plugins: this.plugins
    });

    const { host, port } = await esbuildContext.serve(opts.serveOptions);

    this._verboseOutput();

    console.log(`Dev Server Running:\n\tServeDir: ${opts.buildOptions.outdir}\n\tDevServer: ${host}:${port}`);
  }
}
