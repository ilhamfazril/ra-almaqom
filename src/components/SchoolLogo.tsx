import React, { useId, useState, useEffect } from 'react';
import { subscribeToSiteContent, getCurrentSchoolLogo } from '../services/siteContentService';

interface SchoolLogoProps {
  className?: string;
  size?: number;
  showBadgeBorder?: boolean;
  withWhiteBg?: boolean;
  customSrc?: string | null;
}

/**
 * Official Logo Component for RA Al-Maqom (Raudhatul Athfal Al-Maqom)
 * Supports:
 * - Dynamic Custom Logo uploaded from Admin Panel (Real-Time Synchronized via Firestore & Server)
 * - Pixel-Perfect Fallback to Official Vector SVG Emblem:
 *     - Arched top typography: "RAUDHATUL ATHFAL"
 *     - Stylized green mosque dome emblem forming Arabic calligraphy "Al-Maqom" (المقام)
 *     - Two dots of the letter Qaf (ق)
 *     - Central finial droplet with white center eye
 *     - Flowing calligraphy curves representing 'Alif-Lam' and 'Mim'
 *     - Solid horizontal grounding base bar
 *     - Bottom serif typography: "AL-MAQOM"
 *     - Official emerald green color: #009B4D
 */
export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = '',
  size = 52,
  showBadgeBorder = false,
  withWhiteBg = false,
  customSrc,
}) => {
  const rawId = useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
  const archPathId = `almaqom_arch_${safeId}`;

  const [activeLogoSrc, setActiveLogoSrc] = useState<string | null>(() => {
    if (customSrc !== undefined) return customSrc;
    return getCurrentSchoolLogo();
  });
  const [hasImageError, setHasImageError] = useState(false);

  // Subscribe to real-time logo changes across the entire website
  useEffect(() => {
    if (customSrc !== undefined) {
      setActiveLogoSrc(customSrc);
      setHasImageError(false);
      return;
    }

    // Set initial from memory
    const current = getCurrentSchoolLogo();
    setActiveLogoSrc(current);
    setHasImageError(false);

    const unsubscribe = subscribeToSiteContent((content) => {
      setActiveLogoSrc(content.customLogo || null);
      setHasImageError(false);
    });

    return unsubscribe;
  }, [customSrc]);

  const hasExplicitSizeInClass = className.includes('w-') || className.includes('h-');
  const shouldRenderCustomImage = !!activeLogoSrc && !hasImageError;

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none overflow-visible transition-transform ${
        withWhiteBg 
          ? 'p-1 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60' 
          : showBadgeBorder 
            ? 'p-1 rounded-2xl bg-white/10 ring-1 ring-white/20 shadow-sm' 
            : ''
      } ${className}`}
      style={hasExplicitSizeInClass ? undefined : { width: size, height: size }}
      title="Logo Resmi RA Al-Maqom"
    >
      {shouldRenderCustomImage ? (
        <img
          src={activeLogoSrc}
          alt="Logo Resmi RA Al-Maqom"
          className="w-full h-full object-contain select-none pointer-events-none drop-shadow-xs transition-opacity duration-300"
          loading="eager"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-xs overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
        >
          <defs>
            {/* Curve path for arched top text: RAUDHATUL ATHFAL */}
            <path id={archPathId} d="M 50,230 A 215,215 0 0,1 450,230" fill="none" />
          </defs>

          {/* Arched Top Text: RAUDHATUL ATHFAL */}
          <text 
            fill="#009B4D" 
            fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif" 
            fontWeight="900" 
            fontSize="34" 
            letterSpacing="3.5"
          >
            <textPath href={`#${archPathId}`} startOffset="50%" textAnchor="middle">
              RAUDHATUL ATHFAL
            </textPath>
          </text>

          {/* Central Mosque Dome & Calligraphy Emblem (المقام) */}
          <g fill="#009B4D">
            {/* Outer Dome Canopy Arch */}
            <path d="M 52,320 C 60,285 86,242 120,210 C 158,175 204,156 250,150 C 296,156 342,175 380,210 C 414,242 440,285 448,320 L 434,320 C 426,288 402,248 370,218 C 334,185 292,168 250,162 C 208,168 166,185 130,218 C 98,248 74,288 66,320 Z" />

            {/* Inner Parallel Dome Rib */}
            <path d="M 88,320 C 96,294 116,260 144,234 C 174,206 210,190 250,184 C 290,190 326,206 356,234 C 384,260 404,294 412,320 L 400,320 C 392,296 374,265 348,241 C 320,215 287,200 250,194 C 213,200 180,215 152,241 C 126,265 108,296 100,320 Z" />

            {/* Two Dots of the letter Qaf (ق) */}
            <circle cx="233" cy="214" r="11.5" />
            <circle cx="267" cy="214" r="11.5" />

            {/* Central Qaf Finial / Droplet Motif */}
            <path d="M 250,226 C 250,226 235,252 235,273 C 235,286 242,298 250,298 C 258,298 265,286 265,273 C 265,252 250,226 250,226 Z" />
            {/* White Eye of Qaf */}
            <circle cx="250" cy="273" r="6.5" fill="#ffffff" />

            {/* Connecting Vertical Stem */}
            <rect x="244" y="296" width="12" height="24" rx="2" />

            {/* Left Arabic Calligraphic Form ('Alif-Lam') */}
            <path d="M 68,320 C 70,285 92,256 122,242 C 142,232 160,235 166,248 C 172,261 166,277 156,292 C 148,304 138,314 132,320 L 118,320 C 126,312 136,300 142,290 C 148,278 152,266 148,258 C 144,250 132,247 116,256 C 94,268 78,292 78,320 Z" />
            <path d="M 170,320 C 170,272 186,244 208,236 C 218,233 226,238 230,248 C 234,260 230,278 222,295 C 216,308 208,318 204,320 L 190,320 C 196,316 204,306 208,293 C 215,278 217,265 214,257 C 211,250 205,248 198,251 C 182,258 174,282 174,320 Z" />

            {/* Right Arabic Calligraphic Form ('Mim-Alif-Qaf') */}
            <path d="M 432,320 C 430,285 408,256 378,242 C 358,232 340,235 334,248 C 328,261 334,277 344,292 C 352,304 362,314 368,320 L 382,320 C 374,312 364,300 358,290 C 352,278 348,266 352,258 C 356,250 368,247 384,256 C 406,268 422,292 422,320 Z" />
            <path d="M 330,320 C 330,272 314,244 292,236 C 282,233 274,238 270,248 C 266,260 270,278 278,295 C 284,308 292,318 296,320 L 310,320 C 304,316 296,306 292,293 C 285,278 283,265 286,257 C 289,250 295,248 302,251 C 318,258 326,282 326,320 Z" />

            {/* Intermediate Inner Curved Vaults */}
            <path d="M 126,320 C 135,286 148,268 164,268 C 180,268 191,286 198,320 Z" />
            <path d="M 302,320 C 309,286 320,268 336,268 C 352,268 365,286 374,320 Z" />

            {/* Solid Horizontal Grounding Base Bar */}
            <rect x="48" y="320" width="404" height="15" rx="3" />
          </g>

          {/* Bottom Serif Text: AL-MAQOM */}
          <text 
            x="250" 
            y="388" 
            fontFamily="'Times New Roman', Times, 'Cinzel', 'Playfair Display', Georgia, serif" 
            fontWeight="900" 
            fontSize="44" 
            fill="#009B4D" 
            textAnchor="middle" 
            letterSpacing="4"
          >
            AL-MAQOM
          </text>
        </svg>
      )}
    </div>
  );
};

export const AlMaqomLogo = SchoolLogo;
export const FatahillahLogo = SchoolLogo;
export default SchoolLogo;
