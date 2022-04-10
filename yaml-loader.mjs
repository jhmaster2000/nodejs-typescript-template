/// <reference types="typings-esm-loader" />
/// @ts-check

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import yaml from 'yaml';

const logger = /** @type {const} */ ({
    enabled: false,
    get log() { return this.enabled ? console.log : () => {} },
    get dir() { return this.enabled ? console.dir : () => {} }
});

/** @type {resolve} */
export async function resolve(specifier, context, defaultResolve) {
    const result = await defaultResolve(specifier, context, defaultResolve);
    const child = new URL(result.url);

    if (context.parentURL !== undefined) {
        logger.log('\n-----[ESM RESOLVER DEBUG]-----');
        logger.log('specifier:', specifier);
        logger.log('context.parentURL:', context.parentURL);
        logger.log('context.conditions:', context.conditions);
        logger.log('result.url:', result.url);
        logger.log('child:', child);
        logger.log('-----[END RESOLVER DEBUG]-----\n');
    }

    // Ignore built-in modules and the `node_modules` folder.
    if (child.protocol === 'nodejs:' || child.protocol === 'node:' || child.pathname.includes('/node_modules/')) return result;

    // Apply our custom behavior for YAML files.
    if (/\.ya?ml$/.test(result.url)) return { url: result.url, format: 'yaml' };

    // Return the result as-is for all other files.
    return {
        url: result.url,
        format: context.parentURL ? undefined : 'main' // Let the load hook know if this is the main module.
    };
}

/** @type {load} */
export async function load(url, context, defaultLoad) {
    if (context.format !== 'main') {
        logger.log('\n-----[ESM LOADER DEBUG]-----');
        logger.log('url:', url);
        logger.log('context:', context);
        logger.log('-----[END LOADER DEBUG]-----\n');
    }
    // Clear up main module hint as it's not a real supported hint and will break loaders down the line if kept.
    if (context.format === 'main') context.format = undefined;

    // Perform custom loading for YAML files.
    if (context.format === 'yaml') return {
        format: 'json',
        source: JSON.stringify(yaml.parse(await fs.readFile(fileURLToPath(url), 'utf8'))),
    };

    // Defer to Node.js for all other URLs.
    return defaultLoad(url, context, defaultLoad);
}

/** @type {globalPreload} */
export function globalPreload() {
    logger.log('\n-----[ESM GLOBAL PRELOAD DEBUG]-----');
    //!@upcoming logger.log('utilities:', utilities);
    logger.log('-----[END GLOBAL PRELOAD DEBUG]-----\n');

    /** @ambient @type {getBuiltin} */ let getBuiltin;

    return (() => {
        //@ts-ignore
        global.someInjectedProperty = 42;
        console.log('Hello from preloaded code!');
  
        const { createRequire } = getBuiltin('module');  
        const require = createRequire(process.cwd() + '/<preload>');
    }).toString().slice(8, -2);
}
