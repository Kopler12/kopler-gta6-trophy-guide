/* Leonida Platinum — checklist, filters, spoiler mode, roadmap and missables views. */
import { loadEarned, saveEarned, loadSpoilersHidden, saveSpoilersHidden, exportProgress, importProgressFile } from './tracker.js';
import { renderRoadmap } from './roadmap.js';

const params = new URLSearchParams(location.search);
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [String(t.id), t]));
const byName = new Map(trophies.map((t) => [t.name, t]));

let earned = loadEarned();
let spoilerHidden = loadSpoilersHidden();
if (params.get('spoiler') === '1') spoilerHidden = true;

const rowsEl = document.getElementById('rows');
const detailEl = document.getElementById('detail');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kind');
const gradeEl = document.getElementById('grade');
const earnedEl = document.getElementById('earned');
const spoilerEl = document.getElementById('spoiler');
spoilerEl.checked = spoilerHidden;

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function isSpoiled(trophy) {
  return spoilerHidden && trophy.kind === 'story' && !earned.has(trophy.name);
}

function badge(text, cls) {
  const span = document.createElement('span');
  span.className = 'badge ' + cls;
  span.textContent = text;
  return span;
}

function trophyCard(trophy) {
  const item = document.createElement('li');
  item.className = 'trophy' + (earned.has(trophy.name) ? ' earned' : '');
  if (isSpoiled(trophy)) item.classList.add('spoiled');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.name);
  box.setAttribute('aria-label', 'Mark ' + trophy.name + ' earned');
  box.addEventListener('change', () => {
    if (box.checked) earned.add(trophy.name);
    else earned.delete(trophy.name);
    saveEarned(earned);
    renderAll();
  });
  const body = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = isSpoiled(trophy) ? 'Hidden story trophy' : trophy.name;
  title.className = isSpoiled(trophy) ? 'spoiler-text' : '';
  const desc = document.createElement('p');
  desc.className = 'desc' + (isSpoiled(trophy) ? ' spoiler-text' : '');
  desc.textContent = isSpoiled(trophy) ? 'Story trophy — earn it to reveal its name and description.' : trophy.description;
  const snippet = document.createElement('p');
  snippet.className = 'guide-snippet';
  snippet.textContent = isSpoiled(trophy) ? '' : trophy.guide.slice(0, 180) + (trophy.guide.length > 180 ? '…' : '');
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.append(badge(gradeLabel(trophy.grade), trophy.grade));
  meta.append(badge(trophy.kind, trophy.kind === 'story' ? 'story' : ''));
  if (trophy.hidden) meta.append(badge('Hidden on PSN', 'hidden'));
  if (trophy.missable) meta.append(badge('Possibly missable', 'missable'));
  if (trophy.storyLocked) meta.append(badge('Story-locked', 'story'));
  if (trophy.count) meta.append(badge('Count: ' + trophy.count, ''));
  body.append(title, desc, snippet, meta);
  const open = document.createElement('button');
  open.type = 'button';
  open.className = 'guide-btn';
  open.textContent = 'Guide & sources';
  open.addEventListener('click', () => openDetail(trophy));
  item.append(box, body, open);
  return item;
}

function visibleTrophies() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (kindEl.value === 'missable' && !t.missable && !t.storyLocked) return false;
    if (kindEl.value !== 'all' && kindEl.value !== 'missable' && t.kind !== kindEl.value) return false;
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
    if (earnedEl.value === 'earned' && !earned.has(t.name)) return false;
    if (earnedEl.value === 'unearned' && earned.has(t.name)) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) return false;
    return true;
  });
}

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  document.getElementById('progressText').textContent = done + ' of ' + total + ' earned';
  document.getElementById('barFill').style.width = Math.round((done / total) * 100) + '%';
  const counts = {};
  for (const t of trophies) counts[t.grade] = (counts[t.grade] || 0) + 1;
  const got = {};
  for (const name of earned) {
    const t = byName.get(name);
    if (t) got[t.grade] = (got[t.grade] || 0) + 1;
  }
  document.getElementById('gradeCounts').textContent =
    'Platinum ' + (got.platinum || 0) + '/1 · Gold ' + (got.gold || 0) + '/2 · Silver ' + (got.silver || 0) + '/6 · Bronze ' + (got.bronze || 0) + '/46';
  document.getElementById('progressNote').textContent =
    done === total ? 'Platinum earned — you are a Leonida Legend.' :
    done === 0 ? 'Tick a trophy when you earn it — progress is saved on this device.' :
    'Keep going — ' + (total - done) + ' to go until the Platinum.';
}

function renderList() {
  const list = visibleTrophies();
  document.getElementById('countLine').textContent =
    'Showing ' + list.length + ' of 55 trophies' + (earned.size ? ' · ' + earned.size + ' earned' : '');
  rowsEl.replaceChildren();
  for (const t of list) rowsEl.append(trophyCard(t));
}

function openDetail(trophy) {
  detailEl.hidden = false;
  detailEl.replaceChildren();
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'close';
  close.textContent = 'Close guide';
  close.addEventListener('click', () => { detailEl.hidden = true; });
  const title = document.createElement('h2');
  title.textContent = trophy.name;
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.append(badge(gradeLabel(trophy.grade), trophy.grade));
  meta.append(badge(trophy.kind, ''));
  if (trophy.missable) meta.append(badge('Possibly missable', 'missable'));
  if (trophy.storyLocked) meta.append(badge('Story-locked', 'story'));
  if (trophy.count) meta.append(badge('Count: ' + trophy.count, ''));
  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = 'Official description: ' + trophy.description;
  const guide = document.createElement('p');
  guide.className = 'guide-full';
  guide.textContent = trophy.guide;
  const sourcesTitle = document.createElement('h3');
  sourcesTitle.textContent = 'Sources';
  const sources = document.createElement('div');
  sources.className = 'sources';
  for (const s of trophy.sources || []) {
    const link = document.createElement('a');
    link.href = s.url;
    link.textContent = s.name;
    link.target = '_blank';
    link.rel = 'noreferrer';
    sources.append(link);
  }
  const note = document.createElement('p');
  note.className = 'count-line';
  note.textContent = 'Guide written in our own words for this entry. Where a step follows only from the official description, the guide says so.';
  detailEl.append(close, title, meta, desc, guide, sourcesTitle, sources, note);
  detailEl.scrollTop = 0;
}

function renderMissables() {
  const box = document.getElementById('missableList');
  box.replaceChildren();
  const flagged = trophies.filter((t) => t.missable);
  const locked = trophies.filter((t) => t.storyLocked);
  const head1 = document.createElement('h3');
  head1.textContent = 'Possibly missable — do it before it locks (' + flagged.length + ')';
  box.append(head1);
  for (const t of flagged) box.append(trophyCard(t));
  const head2 = document.createElement('h3');
  head2.textContent = 'Story-locked — no mission replay, keep a manual save per chapter (' + locked.length + ')';
  box.append(head2);
  for (const t of locked) box.append(trophyCard(t));
}

function showView(view) {
  document.querySelectorAll('.views button').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
  document.getElementById('roadmapView').hidden = view !== 'roadmap';
  document.getElementById('missablesView').hidden = view !== 'missables';
  document.getElementById('listView').hidden = view !== 'overview';
  document.querySelector('.toolbar').style.display = view === 'overview' ? '' : 'none';
  if (view === 'roadmap') renderRoadmap(document.getElementById('roadmapSteps'));
  if (view === 'missables') renderMissables();
}

function renderAll() {
  renderProgress();
  renderList();
  if (!document.getElementById('missablesView').hidden) renderMissables();
}

document.querySelectorAll('.views button').forEach((b) => {
  b.addEventListener('click', () => {
    history.replaceState(null, '', '?view=' + b.dataset.view);
    showView(b.dataset.view);
  });
});
for (const el of [searchEl, kindEl, gradeEl, earnedEl]) el.addEventListener('input', renderList);
spoilerEl.addEventListener('change', () => {
  spoilerHidden = spoilerEl.checked;
  saveSpoilersHidden(spoilerHidden);
  renderAll();
});
document.getElementById('export').addEventListener('click', () => exportProgress(earned));
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    earned = await importProgressFile(file, new Set(trophies.map((t) => t.name)));
    saveEarned(earned);
    renderAll();
  } catch (err) {
    alert('Could not import that file: ' + err.message);
  }
  e.target.value = '';
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') detailEl.hidden = true;
});

const startView = params.get('view');
showView(startView === 'roadmap' || startView === 'missables' ? startView : 'overview');
renderAll();
const openId = params.get('trophy');
if (openId && byId.has(openId)) openDetail(byId.get(openId));
