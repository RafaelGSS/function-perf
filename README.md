# perf-function

Measure the performance of an function easily

## Installation

This is a [Node.js](https://nodejs.org/) module available through the 
[npm registry](https://www.npmjs.com/). It can be installed using the 
[`npm`](https://docs.npmjs.com/getting-started/installing-npm-packages-locally)
or 
[`yarn`](https://yarnpkg.com/en/)
command line tools.

```sh
npm install perf-function --save
```

## Usage

```ts
import { Measure } from 'perf-function';

class Example {

  @Measure({ asyncFunction: true })
  async asyncFunctionToMeasure() {
    // ...
  }

  @Measure()
  functionToMeasure() {
    // ...
  }
}
```

run `demo.ts` to complete usage

## Tests

```sh
npm install
npm test
```

## Dependencies

None

## Dev Dependencies

- [@types/node](https://ghub.io/@types/node): TypeScript definitions for Node.js

## License

MIT
