import { setupWorker } from 'msw/browser'
import { handlers } from './handler'

const worker = setupWorker(...handlers)

// `worker.start` は非同期なので await しない場合、msw の初期化が完了するよりも前に
// クライアントサイドでのリクエストが発生して、それがモックされないという問題が発生する。
// ref: https://github.com/mswjs/msw/issues/73#issuecomment-601584127
//
// そのため、`worker.start` は必ず await するべきだが...そのためには top-level await が必要になる。
// しかし Next.js で swc トランスパイルモードを有効にしている場合、top-level await が使えない。
// ref: https://github.com/vercel/next.js/issues/31054
// ref: https://github.com/mswjs/msw/issues/1340#issuecomment-1438417381
//
// 仕方がないので、ここでは諦めて await しないことにしている。
// msw の初期化よりも前にリクエストが発生しないことを祈りましょう。
worker.start({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    // next.config.js の `basePath` を利用している場合は、このオプションも必要
    //
    // ところで `basePath` を利用しているプロジェクトで msw を動かすと、たまに chrome が無限リロードされる不具合がある。
    // 原因は不明だが、「ServiceWorker のインストール中にページをリロードすると無限リロード状態に陥る」こと、
    // そして chrome devtools を使って ServiceWorker をアンインストールすると直るという対症療法が存在することが分かっている。
    options: {
      scope: '/base/',
    },
    url: '/base/mockServiceWorker.js',
  },
})
