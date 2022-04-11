# Modern TypeScript ESM project template

Minimalistic example of configuring TypeScript and Node to:
* emit modern ES modules code
* import modules that use Node built-ins
* import modules that don't have named exports
* import your own modules without specifying an extension
* lint with ESLint, with TypeScript support
* test the TypeScript code instantly without having to build first
* run the resulting JavaScript code

Bonus: continuous integration script for GitHub Actions. It automatically runs tests on every pushed commit.

# Emit ES modules code

In [`tsconfig.json`](tsconfig.json), set this in `compilerOptions`:

```json
    "target": "ES2022",
    "module": "ES2022",  // Output `import`/`export` ES modules
```


# Import modules that use Node built-ins (`http`, `url` etc.)

* run `npm install --save-dev @types/node`
* in `tsconfig.json` under `compilerOptions`, set
  * `"moduleResolution": "node"`, so `tsc` can find modules [when targeting ES6+](https://github.com/Microsoft/TypeScript/issues/8189)
  * `"types": ["node"]` to avoid errors related to Node built-in modules


# Import modules that don't have named exports

Normally we could write in TypeScript

    import { Foo } from 'package';

but when generating ES modules code, that statement will be passed through as is, and will cause Node to fail with

> SyntaxError: The requested module 'package' does not provide an export named 'Foo'

because `package` doesn't provide named exports.

What we'll do is import the entire module, and then destructure it:

```js
import package from 'package';
const { Foo } = package;
```

However, this will generate `Error TS1192: Module '...' has no default export.` To prevent that, set `"allowSyntheticDefaultImports": true` in `tsconfig.json`.


# Import your own modules without specifying an extension

When transpiling, [TypeScript won't generate an extension for you](https://github.com/microsoft/TypeScript/issues/16577). Run Node with the [`node --experimental-specifier-resolution=node` parameter](https://nodejs.org/api/cli.html#cli_experimental_specifier_resolution_mode):

    node --experimental-specifier-resolution=node run.js

Otherwise, [node mandates that you specify the extension](https://nodejs.org/api/esm.html#esm_mandatory_file_extensions) in the `import` statement.


# Run the resulting JavaScript code

Add `"type": "module"` to `package.json`, because [TypeScript can't generate files with the .mjs extension](https://github.com/microsoft/TypeScript/issues/18442#issuecomment-581738714).


# ESLint

To be able to run `eslint`, we must create an `.eslintrc.json` file. Then, install the required dependencies:

    npm i -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-deprecation eslint-plugin-unicorn


# Testing with Mocha

The cleanest way to fully support Mocha with TypeScript, ES Modules and ESLint, is to use `ts-node/esm`. What we need to do:

* `npm install -D mocha @types/mocha`
* add `"mocha"` to the `types` array in `tsconfig.json`
* use the [`.mocharc.jsonc`](.mocharc.jsonc) file to config (do not use .js config files).

To run Mocha from `package.json`, we simply add a `"test": "npx mocha"` line.


# Source maps

If your script generates an error, you'll see the line numbers from the generated `.js` files, which is not helpful. We want to see the original paths and line numbers from the `.ts` files. To do that, we'll add `sourceMap: true` to `tsconfig.json`, install [`source-map-support`](https://www.npmjs.com/package/source-map-support) and run node with the `-r source-map-support/register` parameter. Note that Mocha already takes care of source mapping so you'll see the `.ts` line numbers without having to do anything extra.


## CI testing

Using [GitHub Actions](https://github.com/features/actions), we can configure automatic testing via `.yml` files under [.github/workflows](.github/workflows).
