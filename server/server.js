import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const server = createServer(async (req, res) => {
  try {
    const url = req.url?.split('?')[0] || '/';

    if (url === '/' || url === '/index.html') {
      let ssrHtml = '';
      let state = {};

      try {
        const ssrModule = await import('../dist/server/entry-server.js');
        const result = await ssrModule.render(url);
        ssrHtml = result.html || '';
        state = result.state || {};
      } catch (error) {
        console.error(error);
        ssrHtml = `<div data-ssr="true">error</div>`;
      }

      const template = await readFile(join(projectRoot, 'dist', 'index.html'), 'utf-8');
      const fullHtml = template
        .replace('<div id="root"></div>', `<div id="root">${ssrHtml}</div>`)
        .replace(
          '</body>',
          `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(state).replace(/</g, '\\u003c')}</script>\n</body>`
        );

      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache',
      });
      return res.end(fullHtml);
    }

    try {
      const data = await readFile(join(projectRoot, 'dist', url === '/' ? 'index.html' : url));
      const ext = url.split('.').pop() || 'html';
      const contentType =
        {
          html: 'text/html',
          js: 'application/javascript',
          css: 'text/css',
          json: 'application/json',
          png: 'image/png',
          jpg: 'image/jpeg',
          svg: 'image/svg+xml',
          ico: 'image/x-icon',
        }[ext] || 'text/plain';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        const data = await readFile(join(projectRoot, 'dist', 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

const PORT = process.env.PORT || 5173;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
