import { build } from 'vite';

async function buildSSR() {
  await build({ configFile: 'vite.config.ts' });
  await build({ configFile: 'vite.ssr.config.ts' });
}

buildSSR().catch(console.error);
