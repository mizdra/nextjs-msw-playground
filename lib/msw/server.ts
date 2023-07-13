import { setupServer } from 'msw/node'
import { handlers } from './handler'

// msw/node には handler の変更がライブリロードで反映されず、古い handler から
// レスポンスが返され続ける問題がある。
// ref: https://github.com/mswjs/msw/issues/1389
// これはライブリロードされた時に、古いバージョンの server が listen し続けているため引き起こされているものと思われる。
// そこで、ライブリロードされた時に古い server を close することで、この問題を回避する。

if ('server' in globalThis) {
  (globalThis as any).server.close();
}

export const server = setupServer(...handlers);
(globalThis as any).server = server;
