/* Takes the 4 screenshots of the guide in a headless Chromium, via playwright-core.
   Serve app/ first (`node serve.ts`), then run `node shots.mjs`. The seed=overview
   query seeds localStorage with 14 earned trophies so the progress bar is visible. */
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('/home/hatch/workspace/makefun/pw/node_modules/playwright-core');
const here = dirname(fileURLToPath(import.meta.url));
const shots = JSON.parse(readFileSync(join(here, 'shots.json'), 'utf8'));

const SEEDED = [
  'Just Like Paradise',
  'Paradise Lost',
  'Trust',
  'Master of None',
  'Stick Fiddler',
  'Baited My Tackle',
  'Cunning Stunts',
  'Earn Cash, Not Kudos',
  'Whip It Good',
  'Little Boxes',
  'On the Spot',
  'Treat Yo Self',
  'Dime on the Dollar',
  'Top Fun',
];

const browser = await chromium.launch({
  executablePath: '/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome',
  args: ['--no-sandbox'],
});
for (const shot of shots) {
  const page = await browser.newPage({ viewport: shot.viewport });
  const url = new URL(shot.path, 'http://127.0.0.1:8080/');
  if (url.searchParams.get('seed') === 'overview') {
    await page.addInitScript((names) => {
      localStorage.setItem('leonida-platinum-earned', JSON.stringify(names));
    }, SEEDED);
  }
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  if (shot.scroll) await page.evaluate((y) => window.scrollTo(0, y), shot.scroll);
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(here, 'screenshots', shot.file), type: 'jpeg', quality: 80 });
  console.log('shot ' + shot.file);
  await page.close();
}
await browser.close();
console.log('done');
