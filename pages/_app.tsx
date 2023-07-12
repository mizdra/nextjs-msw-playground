import '@/styles/globals.css'
import type { AppProps } from 'next/app'

// データフェッチされる機構 (getServerSideProps/getStaticProps/getInitialProps) の実行よりも前に
// msw を起動したいので、Next.js で事実上のエントリポイントとなっている _app.tsx で起動する。
//
// ...ただしよくよく考えると、middleware.ts からもデータフェッチが発生する可能性があり、
// middleware.ts は _app.tsx とは別のコンテキストで実行されるので、middleware.ts からのデータフェッチは
// これではモック出来ない可能性がありそう... まあでも middleware.ts からデータフェッチするケース
// そんなに多くないと思うので、とりあえずこれでいいかな... あとよくよく考えたら、API Routes からの
// データフェッチもこれではモック出来ない気がする...
//
// ところで何故かこれでも、`next dev` した直後の初期のリクエストで msw でレスポンスがモックされない問題がある。
// 恐らく https://github.com/mswjs/msw/issues/1340 に関連する問題ではないかと思われるが、詳細は不明。
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
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
    import('../lib/msw/worker').then(({worker}) => {
      worker.start({
        onUnhandledRequest: 'bypass',
      });
    });
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
