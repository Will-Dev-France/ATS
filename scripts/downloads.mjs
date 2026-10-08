// Compteur de téléchargements (voir README) : additionne le nombre de téléchargements que GitHub
// tient pour chaque fichier de chaque release des dépôts listés, puis l'inscrit dans les pages.
// Aucune donnée sur les visiteurs : seulement ces totaux anonymes.
// Usage : node scripts/downloads.mjs <dossier du site> (le site publié, ou « . » pour le dépôt)
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// L'ancien dépôt garde les téléchargements faits avant le déménagement du 08/10/2026.
const REPOS = ['Will-Dev-France/ATS', 'PADDOCK-AUTO/ats-checker-site'];
const PAGES = [
  ['index.html', 'fr'],
  ['en/index.html', 'en'],
];
const MARKER = /(<span data-downloads>)[^<]*(<\/span>)/g;

async function total() {
  const headers = { accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  let sum = 0;
  for (const repo of REPOS) {
    for (let page = 1; ; page++) {
      const url = `https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`;
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`${repo} : HTTP ${res.status}`);
      const releases = await res.json();
      for (const release of releases)
        for (const asset of release.assets) sum += asset.download_count;
      if (releases.length < 100) break;
    }
  }
  return sum;
}

function label(n, lang) {
  const number = new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US').format(n);
  return lang === 'fr'
    ? `${number} téléchargement${n > 1 ? 's' : ''}`
    : `${number} download${n === 1 ? '' : 's'}`;
}

const dir = process.argv[2];
if (!dir) throw new Error('Usage : node scripts/downloads.mjs <dossier du site>');
// Total calculé avant toute écriture : en cas d'erreur, les pages gardent le dernier chiffre.
const n = await total();
for (const [file, lang] of PAGES) {
  const path = join(dir, file);
  const html = readFileSync(path, 'utf8');
  if (!html.includes('<span data-downloads>'))
    throw new Error(`Marqueur data-downloads absent de ${file}`);
  writeFileSync(path, html.replace(MARKER, `$1${label(n, lang)}$2`));
}
console.log(`${n} téléchargements`);
