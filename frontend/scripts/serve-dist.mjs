import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..', 'dist');
const port = Number(process.env.PORT ?? 5173);
const host = process.env.HOST ?? '127.0.0.1';

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function resolveFilePath(url) {
  const requestPath = decodeURIComponent(url.split('?')[0]);
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1);
  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(root)) {
    return null;
  }

  return filePath;
}

async function sendFile(response, filePath) {
  const body = await readFile(filePath);
  const contentType = contentTypes[path.extname(filePath)] ?? 'application/octet-stream';

  response.writeHead(200, { 'Content-Type': contentType });
  response.end(body);
}

const server = createServer(async (request, response) => {
  const filePath = resolveFilePath(request.url ?? '/');

  if (!filePath) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    await sendFile(response, filePath);
  } catch {
    await sendFile(response, path.join(root, 'index.html'));
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the existing frontend server first.`);
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`Murmur frontend ready: http://${host}:${port}`);
});
