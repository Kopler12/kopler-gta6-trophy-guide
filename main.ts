/* Leonida Platinum — hands the guide in. Copies this repo's app/ and screenshots/ into the
   output directory and writes dossier.json with the vendored make.fun library, so the judge
   reads the same bytes the scorer checks. Node 22, standard library only. Run it as:
   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
   Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output. */
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(here, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

/* Caps from the scorer's own reference: the text cap shapes the dossier bytes; the others
   refuse anything the gate would refuse (more than 4 screenshots, one over 256 KiB, more
   than 993 app files or 48 MiB of app files — app/ shares /output's 1000-entry cap with
   screenshots/ and dossier.json, so the room is left on purpose). */
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
console.log('Wrote ' + join(outDir, 'dossier.json'));
