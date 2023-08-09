# eslint-plugin-import-limits

Limit the module dependencies.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-import-limits`:

```sh
npm install eslint-plugin-import-limits --save-dev
# or
yarn add -D eslint-plugin-import-limits
```

## Usage

Add `import-limits` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```js
{
    "plugins": [
        "import-limits"
    ]
}
```

Then configure the rules you want to use under the rules section.

```js
{
    "rules": {
        "import-limits/independent-modules": [2, ['src/views']],
        "import-limits/level-declaration": [2, ['src/types', 'src/utils', ['src/components', 'src/hooks'], 'src/views']],
    }
}
```

## Supported Rules

### import-limits/independent-modules

Specify the giving modules to be independent modules, which disallow the sub-modules inside them to import something from sibling modules.

```bash
├── src
│   ├── utils
│   └── views
│         ├── foo
│         ├── bar
│         └── qux
```

```js
{
    "import-limits/independent-modules": [2, ['src/views']]
}
```

For example, this rule means the sub-modules in `src/views` should be independent, `src/views/foo` can't import anything from `src/views/bar` or `src/views/qux`.

If you want to share some abilities between src/views/foo and src/views/bar, you should extract them outside src/views, e.g., put them into src/utils.

### import-limits/level-declaration

```js
{
    "import-limits/level-declaration": [2, ['src/types','src/utils', ['src/components', 'src/hooks'], 'src/views']],
}
```

Declare the level orders. The lower levels should not import things from the higher levels. The order of level is proportional to its index in the array.

```bash
├── src
│   ├── types
│   ├── utils
│   ├── components
│   ├── hooks
│   └── views
```

For example, `src/types` can't import anything from `src/utils, src/components, src/views`.

The modules in the same level are allowed to import from each other (like the `src/components` and `src/hooks`).

## Settings

### Alias

Provide alias setting to plugin , which to be the same as [webpack alias](https://webpack.js.org/configuration/resolve/#resolvealias).

```js
{
    settings: {
        'import-limits': {
            alias: { '@': path.join(__dirname, 'src') },
        },
    },
}
```
