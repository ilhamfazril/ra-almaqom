'use client';

import React from 'react';
import App from '../../src/App';

/**
 * Komponen Client terisolasi untuk Next.js App Router ('use client')
 * Memisahkan semua logika interaktif (Firebase Realtime Firestore, Modal PPDB,
 * Carousel Berita, dan Dashboard Admin) agar tidak menghalangi Server-Side
 * Rendering (SSR) teks-teks SEO utama di page.js.
 */
export default function SchoolAppClient() {
  return (
    <div className="w-full">
      <App />
    </div>
  );
}
