import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import Logger from '../core/Logger.js';
import Base, { type Manifest } from './Base.js';
import DependencyManager, { type FqnInstanceMap } from './DependencyManager.js';
import Host from './Host.js';
import LoaderHelper from './LoaderHelper.js';

const MODULE_NAME: string = path.basename(__filename, path.extname(__filename));
const log = Logger.extend(MODULE_NAME);
const PACKAGE_IDENTIFIER = /.*package.json$/;

//TODO: Consider generating a hashmap of known plugins
// First load will enable, and generate
// Subsequent loads will update generated map

export type LoaderOptions = {
  pluginPaths: string[];
  pluginTypes: string[];
};

export type LoaderMeta = {
  manifest: Manifest;
  pluginDefinition: typeof Base;
};

export default class Loader {
  static MANIFEST_KEY = 'MANIFEST';

  pluginHost?: Host;
  depMgr?: DependencyManager;

  constructor(public options: LoaderOptions) {
    this.options.pluginTypes = options.pluginTypes.map(o => o.toUpperCase());
  }

  async init(): Promise<FqnInstanceMap> {
    const _DEBUG = log.extend('init');

    _DEBUG('Scanning for Plugin Packages...');

    this.pluginHost = new Host();
    this.depMgr = new DependencyManager(this.pluginHost);

    this.setOptions();

    const pluginManifests = await this.scanForPlugins(this.options.pluginPaths);

    // Attempt to load the Plugin from the filesystem
    const loaderInfos: LoaderMeta[] = [];

    for (let idx = 0; idx < pluginManifests.length; idx++) {
      const manifest = pluginManifests[idx];
      const pluginDefinition = await import(manifest.pluginPath);

      loaderInfos.push({
        manifest,
        pluginDefinition
      } as LoaderMeta);
    }

    await this.depMgr.loadPluginDefinitions(loaderInfos);

    return this.depMgr.fqnInstanceMap;
  }

  setOptions() {
    // To be set by concrete class
  }

  async scanForPlugins(topLevelPaths: string[]): Promise<Manifest[]> {
    let foundManifests: Manifest[] = [];

    const _DEBUG = log.extend('scanForPlugins');

    _DEBUG(`Initiating Plugin Detection for ${topLevelPaths.length} Scan Directories`);

    try {
      for (const path of topLevelPaths) {
        const detPlugs: Manifest[] = await this.detectPluginPackages(path);
        foundManifests = foundManifests.concat(detPlugs);
      }
    } catch (err) {
      _DEBUG('Error loading Plugin from disk...');
      throw err;
    }

    _DEBUG(`Scan Complete, found ${foundManifests.length} Plugin Manifests`);

    return foundManifests;
  }

  async detectPluginPackages(scanDir: string): Promise<Manifest[]> {
    const _DEBUG = log.extend('detectPluginPackages');

    _DEBUG(`Scanning folder for Plugin Entries: ${scanDir}`);

    const potentialPluginDirs = await readdir(scanDir);
    const foundPlugins: Manifest[] = [];

    for (const pluginDir of potentialPluginDirs) {
      const isDir = (await stat(path.join(scanDir, pluginDir))).isDirectory();

      if (!isDir) {
        continue;
      }

      const entry = await this.findPluginManifest(path.join(scanDir, pluginDir));

      if (entry) {
        foundPlugins.push(entry);
      }
    }

    return foundPlugins;
  }

  async findPluginManifest(pluginDir: string): Promise<Manifest | undefined> {
    const _DEBUG = log.extend('findPluginEntrypoint');

    const pluginDirContents = await readdir(pluginDir);

    // Find the package file by the identifier
    let packagePath = pluginDirContents.find(fileName => PACKAGE_IDENTIFIER.test(fileName));
    if (!packagePath) {
      return;
    }

    packagePath = path.join(pluginDir, packagePath);

    const rawFile = await readFile(packagePath, 'utf8');
    const packageObj = JSON.parse(rawFile);
    const manifest = packageObj[Loader.MANIFEST_KEY];

    if (!manifest) {
      return;
    }

    _DEBUG(`Detected Plugin: ${packageObj.name}`);

    // Ensure the plugin is intended for the runtime type (PluginType Enum)
    if (false === this.options.pluginTypes.includes((manifest.type as string).toUpperCase())) {
      return undefined;
    }

    return {
      ...manifest,
      pluginPath: pluginDir,
      name: packageObj.name,
      version: packageObj.version
    };
  }

  unloadModule(moduleName: string, baseDirectory: string) {
    // Check if this is a module nested within the given baseDirectory
    // Avoids removing things outside of the namespace of the plugin root
    if (-1 === moduleName.indexOf(baseDirectory)) {
      return;
    }

    const solvedName = LoaderHelper.resolve(moduleName),
      nodeModule = LoaderHelper.cache[solvedName];

    if (nodeModule) {
      for (let i = 0; i < nodeModule.children.length; i++) {
        const child = nodeModule.children[i];
        this.unloadModule(child.filename, baseDirectory);
      }

      log.extend('ModuleUnload')(`Incorrect type for runtime: ${solvedName}`);

      delete LoaderHelper.cache[solvedName];
    }
  }
}
