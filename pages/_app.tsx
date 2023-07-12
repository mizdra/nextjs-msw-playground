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
  require('../lib/msw/initialize')
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
