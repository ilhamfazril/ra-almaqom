import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// High body size limit for base64 school photos and assets
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const CONTENT_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'live_site_content.json');

function readLiveContent(): any {
  try {
    if (fs.existsSync(CONTENT_FILE_PATH)) {
      const raw = fs.readFileSync(CONTENT_FILE_PATH, 'utf8');
      return cleanCampusTerms(JSON.parse(raw));
    }
  } catch (err) {
    console.warn('Error reading live_site_content.json:', err);
  }
  return null;
}

function cleanCampusTerms(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    return obj
      .replace(/fasilitas kampus/gi, (match) => (match === 'Fasilitas Kampus' ? 'Fasilitas Sekolah' : match === 'FASILITAS KAMPUS' ? 'FASILITAS SEKOLAH' : 'fasilitas sekolah'))
      .replace(/lokasi kampus/gi, (match) => (match === 'Lokasi Kampus' ? 'Lokasi Sekolah' : match === 'LOKASI KAMPUS' ? 'LOKASI SEKOLAH' : 'lokasi sekolah'))
      .replace(/area kampus/gi, (match) => (match === 'Area Kampus' ? 'Area Sekolah' : match === 'AREA KAMPUS' ? 'AREA SEKOLAH' : 'area sekolah'))
      .replace(/bangunan kampus/gi, (match) => (match === 'Bangunan Kampus' ? 'Bangunan Sekolah' : match === 'BANGUNAN KAMPUS' ? 'BANGUNAN SEKOLAH' : 'bangunan sekolah'))
      .replace(/halaman kampus sekolah/gi, 'halaman sekolah')
      .replace(/halaman kampus/gi, 'halaman sekolah')
      .replace(/kampus sekolah/gi, 'sekolah')
      .replace(/kampus MTs Fatahillah/gi, 'RA Al-Maqom')
      .replace(/Kampus MTs Fatahillah/gi, 'RA Al-Maqom')
      .replace(/MTs Fatahillah Cimahi/gi, 'RA Al-Maqom')
      .replace(/MTs Fatahillah/gi, 'RA Al-Maqom')
      .replace(/MTS FATAHILLAH/gi, 'RA AL-MAQOM')
      .replace(/Yayasan Fatahillah Cimahi/gi, 'Yayasan Al-Maqom')
      .replace(/Yayasan Fatahillah/gi, 'Yayasan Al-Maqom')
      .replace(/\bkampus\b/gi, (match) => (match === 'Kampus' ? 'Sekolah' : match === 'KAMPUS' ? 'SEKOLAH' : 'sekolah'));
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanCampusTerms);
  }
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      res[key] = cleanCampusTerms(obj[key]);
    }
    return res;
  }
  return obj;
}

function writeLiveContent(data: any): boolean {
  try {
    const cleaned = cleanCampusTerms(data);
    const dir = path.dirname(CONTENT_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONTENT_FILE_PATH, JSON.stringify(cleaned, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing live_site_content.json:', err);
    return false;
  }
}

// Active SSE connections for instant real-time sync across all devices and tabs
const sseClients = new Set<express.Response>();

function broadcastContentUpdate(content: any) {
  if (!content) return;
  const payload = JSON.stringify({
    type: 'content_updated',
    updatedAt: content.updatedAt || Date.now(),
    data: content,
  });

  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch (e) {
      sseClients.delete(client);
    }
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

/**
 * GET /api/content/version
 * Ultra-lightweight endpoint returning the current updatedAt timestamp.
 * Allows other devices to poll effortlessly every few seconds without load.
 */
app.get('/api/content/version', (req, res) => {
  const content = readLiveContent();
  res.json({
    success: true,
    updatedAt: content?.updatedAt || 0,
  });
});

/**
 * GET /api/content/stream
 * Server-Sent Events (SSE) persistent stream for zero-latency multi-device real-time updates.
 * When anyone uploads a photo or edits text, every connected device updates instantly!
 */
app.get('/api/content/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
  });

  const initialPayload = JSON.stringify({
    type: 'connected',
    updatedAt: Date.now(),
  });
  res.write(`data: ${initialPayload}\n\n`);
  sseClients.add(res);

  // Heartbeat ping every 20 seconds to prevent proxy timeouts
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch (e) {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

/**
 * GET /api/content
 * Returns the current live site content stored on the server.
 * This guarantees that every device (phone, laptop, visitor) gets identical,
 * full-fidelity school data without being blocked by Firestore Quota limits.
 */
app.get('/api/content', (req, res) => {
  const content = readLiveContent();
  if (content) {
    res.json({ success: true, data: content });
  } else {
    res.json({ success: false, data: null });
  }
});

/**
 * POST /api/content
 * Saves or updates sections in the server-side persistent store and broadcasts to all clients.
 */
app.post('/api/content', (req, res) => {
  try {
    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object') {
      res.status(400).json({ success: false, message: 'Invalid payload' });
      return;
    }

    const current = readLiveContent() || {};
    const updated = {
      ...current,
      ...incoming,
      updatedAt: Date.now(),
    };

    const saved = writeLiveContent(updated);
    if (saved) {
      broadcastContentUpdate(updated);
      res.json({ success: true, updatedAt: updated.updatedAt, data: updated });
    } else {
      res.status(500).json({ success: false, message: 'Gagal menulis data ke storage server.' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

function isUserUploadedPhoto(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  if (url.includes('unsplash.com')) return false;
  if (url.includes('slide1_gedung') || url.includes('slide2_upacara') || url.includes('slide3_lab_komputer') || url.includes('slide4_lapangan')) {
    return false;
  }
  return url.startsWith('data:image/') || url.startsWith('blob:') || url.includes('principal_real.jpg');
}

function mergeArrayPreservingImages(currentArr: any[], incomingArr: any[], idKey = 'id'): any[] {
  if (!Array.isArray(incomingArr) || incomingArr.length === 0) return currentArr || [];
  if (!Array.isArray(currentArr) || currentArr.length === 0) return incomingArr;

  return incomingArr.map((inItem, idx) => {
    const curItem = currentArr.find((c: any) => (inItem[idKey] && c[idKey] === inItem[idKey])) || currentArr[idx];
    if (!curItem) return inItem;

    const mergedItem = { ...curItem, ...inItem };

    // If incoming has an explicit image/photo, use incoming! Only fallback to curItem if incoming is missing
    if (inItem.image && typeof inItem.image === 'string' && inItem.image.trim() !== '') {
      mergedItem.image = inItem.image;
    } else if (curItem.image) {
      mergedItem.image = curItem.image;
    }

    if (inItem.bgImage && typeof inItem.bgImage === 'string' && inItem.bgImage.trim() !== '') {
      mergedItem.bgImage = inItem.bgImage;
    } else if (curItem.bgImage) {
      mergedItem.bgImage = curItem.bgImage;
    }

    if (inItem.photo && typeof inItem.photo === 'string' && inItem.photo.trim() !== '') {
      mergedItem.photo = inItem.photo;
    } else if (curItem.photo) {
      mergedItem.photo = curItem.photo;
    }

    return mergedItem;
  });
}

/**
 * POST /api/content/sync
 * Allows the admin's browser (which holds the uploaded photos and modifications in localStorage)
 * to push their complete state to the server so ALL other devices see it immediately.
 */
app.post('/api/content/sync', (req, res) => {
  try {
    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object') {
      res.status(400).json({ success: false, message: 'Invalid payload' });
      return;
    }

    const current = readLiveContent() || {};

    // Smart merge: keep newest fields and preserve all uploaded images
    const merged = {
      ...current,
      ...incoming,
      updatedAt: Date.now(),
    };

    if (Array.isArray(incoming.facilities)) {
      merged.facilities = mergeArrayPreservingImages(current.facilities || [], incoming.facilities, 'id');
    }
    if (Array.isArray(incoming.heroSlides)) {
      merged.heroSlides = mergeArrayPreservingImages(current.heroSlides || [], incoming.heroSlides, 'id');
    }
    if (Array.isArray(incoming.news)) {
      merged.news = mergeArrayPreservingImages(current.news || [], incoming.news, 'id');
    }
    if (Array.isArray(incoming.programs)) {
      merged.programs = mergeArrayPreservingImages(current.programs || [], incoming.programs, 'id');
    }
    if (Array.isArray(incoming.extracurriculars)) {
      merged.extracurriculars = mergeArrayPreservingImages(current.extracurriculars || [], incoming.extracurriculars, 'id');
    }
    if (Array.isArray(incoming.achievements)) {
      merged.achievements = mergeArrayPreservingImages(current.achievements || [], incoming.achievements, 'id');
    }
    if (Array.isArray(incoming.teachers)) {
      merged.teachers = mergeArrayPreservingImages(current.teachers || [], incoming.teachers, 'id');
    }

    if (incoming.principal) {
      const curPrincipal = current.principal || {};
      const inPrincipal = incoming.principal;
      merged.principal = { ...curPrincipal, ...inPrincipal };
      if ((!inPrincipal.photo || inPrincipal.photo.trim() === '') && curPrincipal.photo) {
        merged.principal.photo = curPrincipal.photo;
      }
    }

    const saved = writeLiveContent(merged);
    if (saved) {
      broadcastContentUpdate(merged);
      console.log('✓ Successfully synchronized live site content across all devices via /api/content/sync');
      res.json({ success: true, updatedAt: merged.updatedAt, data: merged });
    } else {
      res.status(500).json({ success: false, message: 'Gagal menyimpan sinkronisasi ke server' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server sync error' });
  }
});

let firebaseConfigData: any = null;
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfigData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (e) {
  console.warn('Could not read firebase-applet-config.json:', e);
}

/**
 * GET /api/firestore-status
 * Supplies diagnostics regarding Firestore free quota limits
 */
app.get('/api/firestore-status', (req, res) => {
  const projectId = firebaseConfigData?.projectId || 'decisive-emitter-hds98';
  const databaseId = firebaseConfigData?.firestoreDatabaseId || '(default)';
  res.json({
    hasServerPersistence: true,
    databaseId,
    quotaExceededConsoleUrl: `https://console.firebase.google.com/project/${projectId}/firestore/databases/${databaseId}/data?openUpgradeDialog=true`,
  });
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RA Al-Maqom Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
