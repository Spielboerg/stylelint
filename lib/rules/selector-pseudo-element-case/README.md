# selector-pseudo-element-case

> **Warning** This rule is deprecated and will be removed in the future. See [the migration guide](../../../docs/migration-guide/to-15.md).

Specify lowercase or uppercase for pseudo-element selectors.

<!-- prettier-ignore -->
```css
  a::before {}
/**  ↑
 * This pseudo-element selector */
```

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"lower"|"upper"`

### `"lower"`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a:Before {}
```

<!-- prettier-ignore -->
```css
a:bEfOrE {}
```

<!-- prettier-ignore -->
```css
a:BEFORE {}
```

<!-- prettier-ignore -->
```css
a::Before {}
```

<!-- prettier-ignore -->
```css
a::bEfOrE {}
```

<!-- prettier-ignore -->
```css
a::BEFORE {}
```

<!-- prettier-ignore -->
```css
input::-MOZ-PLACEHOLDER {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a:before {}
```

<!-- prettier-ignore -->
```css
a::before {}
```

<!-- prettier-ignore -->
```css
input::-moz-placeholder {}
```

### `"upper"`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a:Before {}
```

<!-- prettier-ignore -->
```css
a:bEfOrE {}
```

<!-- prettier-ignore -->
```css
a:BEFORE {}
```

<!-- prettier-ignore -->
```css
a::Before {}
```

<!-- prettier-ignore -->
```css
a::bEfOrE {}
```

<!-- prettier-ignore -->
```css
a::before {}
```

<!-- prettier-ignore -->
```css
input::-moz-placeholder {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a:BEFORE {}
```

<!-- prettier-ignore -->
```css
a::BEFORE {}
```

<!-- prettier-ignore -->
```css
input::-MOZ-PLACEHOLDER {}
```
