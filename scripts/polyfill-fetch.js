// Node.js v18+ では fetch が native fetch に差し替わっている関係で msw がリクエストを interrupt できない問題がある。
// ref: https://t-yng.jp/post/msw-node18-error
//
// それを回避するためには、`globalThis.fetch` を node-fetch 実装に差し替える必要がある。
// しかし素朴に _app.ts で差し替えただけでは、`next dev` の `globalThis.fetch` の上書きと競合してしまい、
// `globalThis.fetch` が node-fetch 実装に差し替わらない。
// ref: https://github.com/vercel/next.js/issues/47596, https://twitter.com/mizdra/status/1660971015860793344
//
// そこで `node --require` でこのモジュールを読み込み、`next dev` 起動前に `globalThis.fetch` を node-fetch
// 実装に差し替えるようにする。
//
// あと node-fetch の最新バージョンは 3 系だが、3 系は Pure ESM であり、Next.js では使えないという問題がある。
// そのため 2 系を使わないといけない。
const {default: nodeFetch} = require('node-fetch');
globalThis.fetch = nodeFetch;
