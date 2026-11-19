/* Progress storage for Leonida Platinum: localStorage checklist, plus export and import. */
export const STORAGE_KEY = 'leonida-platinum-earned';
export const SPOILER_KEY = 'leonida-platinum-spoilers';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(list) ? list.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned]));
}

export function loadSpoilersHidden() {
  return localStorage.getItem(SPOILER_KEY) === '1';
}

export function saveSpoilersHidden(hidden) {
  localStorage.setItem(SPOILER_KEY, hidden ? '1' : '0');
}

export function exportProgress(earned) {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned] }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

export async function importProgressFile(file, validNames) {
  const data = JSON.parse(await file.text());
  const names = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(names)) throw new Error('That file does not hold a trophy list.');
  const kept = names.filter((n) => validNames.has(n));
  return new Set(kept);
}
