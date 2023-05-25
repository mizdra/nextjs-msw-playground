import { graphql, HttpResponse } from 'msw';

export const handlers = [
  graphql.query('HomeQuery', () => {
    return HttpResponse.json({
      data: {
        hello: 'Hello world!',
      }
    })
  })
];
