# launch-loader

## How It Works

You can input a `React` component as entry page by `webpack`.
```js
export default class extends Component {
  render() { return <p /> }
}

// or
export class Page extends Component {
  render() { return <p /> }
}
```

`launch-loader` will try to make this component export default and attach to global namespace, then append launch code.

```js
const View = window.epii.entry = exports.default;
const ReactDOM = require('react-dom');
const root = document.getElementById('app');
ReactDOM.render(React.createElement(View), root);
```

## Usage

```sh
npm install --save launch-loader@latest
```

```js
{
  loader: 'launch-loader',
  options: {
    holder: 'app', // div#app
    global: 'epii', // window.epii.entry = app class
  }
}
```