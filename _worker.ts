interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return new Response(`${request.url} not found`, {
        status: 404,
        statusText: 'not found',
      });
    }
  },
}; 