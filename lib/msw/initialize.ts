import {server} from './server'

export async function initMSW() {
  if (typeof window === 'undefined') {
    server.listen({
      onUnhandledRequest: 'bypass',
    });
  } else {
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
    import('./worker').then(({worker}) => {
      worker.start({
        onUnhandledRequest: 'bypass',
      });
    });
  }
  
}
