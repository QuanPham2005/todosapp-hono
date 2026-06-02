import http from 'node:http';
import { Readable } from 'stream';
import app from '../src/index.ts';

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;

function nodeReqToRequest(req) {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v === undefined) continue;
    headers.set(k, String(v));
  }

  const method = req.method || 'GET';
  const init = { method, headers };

  if (method !== 'GET' && method !== 'HEAD') {
    const readable = new Readable({ read() {} });
    req.on('data', (chunk) => readable.push(chunk));
    req.on('end', () => readable.push(null));
    init.body = readable;
    init.duplex = 'half';
  }

  return new Request(url.toString(), init);
}

const server = http.createServer(async (req, res) => {
  try {
    const request = nodeReqToRequest(req);
    const response = await app.fetch(request);

    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    const buf = Buffer.from(await response.arrayBuffer());
    res.end(buf);
  } catch (err) {
    console.error('dev-server error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'dev server error' }));
  }
});

server.listen(PORT, () => console.log(`Dev server listening on http://localhost:${PORT}`));
