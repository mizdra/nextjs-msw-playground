import { setupServer } from 'msw/node'
import { handlers } from './handler'

setupServer(...handlers)
  .listen({
  })
