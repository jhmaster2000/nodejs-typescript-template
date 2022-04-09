/// <reference types="./esm-loader" />
/// @ts-check

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import yaml from 'yaml';

/** @type {resolve} */
export async function resolve(specifier, context, defaultResolve) {
    const result = defaultResolve(specifier, context, defaultResolve);
    const child = new URL(result.url);

    if (context.parentURL !== undefined) {
        console.log('\n-----[ESM RESOLVER DEBUG]-----');
        console.log('specifier:', specifier);
        console.log('context.parentURL:', context.parentURL);
        console.log('context.conditions:', context.conditions);
        console.log('result.url:', result.url);
        console.log('child:', child);
        console.log('-----[END RESOLVER DEBUG]-----\n');
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
        console.log('\n-----[ESM LOADER DEBUG]-----');
        console.log('url:', url);
        console.log('context:', context);
        console.log('-----[END LOADER DEBUG]-----\n');
    }

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
    console.log('\n-----[ESM GLOBAL PRELOAD DEBUG]-----');
    //!@upcoming console.log('utilities:', utilities);
    console.log('-----[END GLOBAL PRELOAD DEBUG]-----\n');

    /** @ambient @type {getBuiltin} */ let getBuiltin;

    return (() => {
        //@ts-ignore
        global.someInjectedProperty = 42;
        console.log('Hello from preloaded code!');
  
        const { createRequire } = getBuiltin('module');  
        const require = createRequire(process.cwd() + '/<preload>');
    }).toString().slice(8, -2);
}
