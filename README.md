# markdown-it-obsidian-images

Renders [Obsidian-style images](https://help.obsidian.md/How+to/Format+your+notes#Images) in [markdown-it](https://github.com/markdown-it/markdown-it).

## Original

The original unmodified code came from [NPM](https://www.npmjs.com/package/markdown-it-obsidian-images).

But the repo behind it seems like it no longer exists. This is why I copied the code, made some changes, and publised it here.

## Modifications

- Also supports image sizes (like `![[files/image.png|500]]` or `![[files/image.png|250px]]`)

## Tips and Tricks

Use Obsidian Setting `Options > Files and links > New link format = Absolute path in vault` for reliability.

---

## Usage

Install this into your project:

```bash
npm --save install markdown-it-obsidian-images
```

...and *use* it:

```ts
import MarkdownIt from "markdown-it"
import obsidianImagesFn from "markdown-it-obsidian-images"

const obsidianImages = obsidianImagesFn({ relativeBaseURL: "/docs/" })

const mdi = new MarkdownIt()
mdi.use(obsidianImages)

const obsidianImages = require('markdown-it-obsidian-images')(options)
const md = mdi.render('![[files/image.png|500]]')
```

**Output:**

```html
<p><img src="/docs/files/image.png" width="500" /></p>
```

## Options

### `baseURL`

**Default:** `/`

The base URL for absolute image URLs.

```js
const html = require('markdown-it')()
  .use(require('markdown-it-obsidian-images')({ baseURL: '/content/' }))
  .render('![[/Hero Image]]')
  // <p><img src="/content/Hero_Image.png" /></p>
```

### `relativeBaseURL`

**Default:** `./`

The base URL for relative wiki links.

```js
const html = require('markdown-it')()
  .use(require('markdown-it-obsidian-images')({ relativeBaseURL: '/content/', suffix: '' }))
  .render('![[Hero Image]]')
  // <p><img src="/content/Hero_Image" /></p>
```

### `makeAllLinksAbsolute`

**Default:** `false`

Render all image URLs as absolute paths.

### `uriSuffix`

**Default:** `.png`

Append this suffix to every URL.

```js
const html = require('markdown-it')()
  .use(require('markdown-it-obsidian-images')({ uriSuffix: '.jpg' }))
  .render('![[Hero Image]]')
  // <p><img src="./Hero_Image.jpg" /></p>
```

### `htmlAttributes`

**Default:** `{}`

An object containing HTML attributes to be applied to every link.

```js
const attrs = {
  'class': 'full-width'
}
const html = require('markdown-it')()
  .use(require('markdown-it-obsidian-images')({ htmlAttributes: attrs }))
  .render('![[Hero Image]]')
  // <p><img src="./Hero_Image.png" class="full-width" /></p>
```

### `postProcessImageName`

A transform applied to every page name.

The default transform does the following things:

- trim surrounding whitespace
- [sanitize](https://github.com/parshap/node-sanitize-filename) the string

#### Example

```js
const _ = require('slugify')

function myCustomPostProcessImageName(label) {
  return label.split('/').map(function(pathSegment) {
    return slugify(pathSegment.toLowerCase())
  })
}

const html = require('markdown-it')()
  .use(require('markdown-it-obsidian-images')({ postProcessImageName: myCustomPostProcessImageName }))
  .render('![[Hello World]]')
  // <p><img src="./hello-world.png" /></p>
```

### `postProcessLabel`

A transform applied to every image alt label. You can override it just like `postProcessImageName` (see above).

The default transform trims surrounding whitespace and replaces the characters `<&"` with html-encoded equivalents

## Credits

Based on [markdown-it-wikilinks](https://github.com/jsepia/markdown-it-wikilinks/) by Julio Sepia
