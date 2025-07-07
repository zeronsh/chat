import { serve } from 'bun';
import index from './index.html';

class Test {
    static GET(req: Bun.BunRequest<'/api/hello/:name'>) {
        const name = req.params.name;

        return Response.json({
            message: `Hello, ${name}!`,
        });
    }
}

const server = serve({
    routes: {
        '/*': index,
        '/api/hello/:name': Test,
    },
    development: process.env.NODE_ENV !== 'production' && {
        hmr: true,
        console: true,
    },
});

console.log(`🚀 Server running at ${server.url}`);
