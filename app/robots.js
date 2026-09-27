// app/robots.js
/**
 * Konfigurasi Robots.txt bawaan Next.js App Router
 * Mengizinkan Googlebot merayap seluruh konten publik dan mengarahkan ke sitemap
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/*?*admin=*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: 'https://ra-almaqom.sch.id/sitemap.xml',
    host: 'https://ra-almaqom.sch.id',
  };
}
