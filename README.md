# Settle Loader

## Features

### settle module in `window`

```js
export default class extends Component {
  render() { return <p /> }
}
/// settle-loader - stub: x
window.x.entry = exports.default
```

### import implicit dependency

```js
// a.js
webpack(
  class A {
    // B is not used by A
    // but need to be exposed to global in a.js
  }
  /// settle-loader - link: B
  require(B)
)

// b.js
window.B
```

Use `expose-loader` to expose required modules.

## Usage

```sh
npm install --save settle-loader@latest
```

```js
{
  loader: 'settle-loader',
  options: {
    stub: 'a.b', // window.a.b = ...
    link: ['c'], // require('c')
  }
}
```
