/**
 * Minimal flat-design inline SVG illustrations for SeatSync.
 * All use the neo-brutalism palette: thick #1a1a1a strokes, saturated fills.
 */

/* ─── Car with passengers (Landing Hero) ─── */
export const CarIllustration = ({ size = 200 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* road */}
    <rect x="0" y="95" width="200" height="25" fill="#1a1a1a" />
    <rect x="10" y="105" width="30" height="4" rx="0" fill="#ffe156" />
    <rect x="55" y="105" width="30" height="4" rx="0" fill="#ffe156" />
    <rect x="100" y="105" width="30" height="4" rx="0" fill="#ffe156" />
    <rect x="145" y="105" width="30" height="4" rx="0" fill="#ffe156" />
    {/* car body */}
    <rect x="30" y="60" width="140" height="38" fill="#ffe156" stroke="#1a1a1a" strokeWidth="3" />
    {/* car roof */}
    <polygon points="60,60 80,30 140,30 160,60" fill="#a0d2ff" stroke="#1a1a1a" strokeWidth="3" />
    {/* windows */}
    <polygon points="82,57 88,35 108,35 108,57" fill="#fffef5" stroke="#1a1a1a" strokeWidth="2" />
    <polygon points="112,57 112,35 132,35 138,57" fill="#fffef5" stroke="#1a1a1a" strokeWidth="2" />
    {/* passengers - simple dots */}
    <circle cx="96" cy="48" r="5" fill="#ff8fab" stroke="#1a1a1a" strokeWidth="2" />
    <circle cx="123" cy="48" r="5" fill="#b8f3b0" stroke="#1a1a1a" strokeWidth="2" />
    {/* headlights */}
    <rect x="164" y="70" width="10" height="8" fill="#fffef5" stroke="#1a1a1a" strokeWidth="2" />
    <rect x="26" y="70" width="10" height="8" fill="#ff8fab" stroke="#1a1a1a" strokeWidth="2" />
    {/* wheels */}
    <circle cx="65" cy="98" r="12" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2" />
    <circle cx="65" cy="98" r="5" fill="#fffef5" />
    <circle cx="150" cy="98" r="12" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2" />
    <circle cx="150" cy="98" r="5" fill="#fffef5" />
  </svg>
);

/* ─── Magnifying glass + map pin (Search) ─── */
export const SearchIllustration = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* map pin */}
    <path d="M28 15 C28 8, 42 8, 42 15 C42 22, 35 32, 35 32 C35 32, 28 22, 28 15Z" fill="#ff8fab" stroke="#1a1a1a" strokeWidth="2.5" />
    <circle cx="35" cy="16" r="3" fill="#fffef5" />
    {/* magnifying glass */}
    <circle cx="50" cy="42" r="16" fill="#a0d2ff" stroke="#1a1a1a" strokeWidth="3" />
    <circle cx="50" cy="42" r="8" fill="#fffef5" stroke="#1a1a1a" strokeWidth="2" />
    <line x1="61" y1="54" x2="72" y2="68" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="square" />
  </svg>
);

/* ─── Ticket with checkmark (Book) ─── */
export const BookIllustration = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ticket body */}
    <rect x="8" y="16" width="64" height="48" fill="#ffe156" stroke="#1a1a1a" strokeWidth="3" />
    {/* ticket notch */}
    <rect x="48" y="16" width="3" height="48" fill="#1a1a1a" opacity="0.15" />
    {/* dashed line */}
    <line x1="50" y1="20" x2="50" y2="60" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="4 3" />
    {/* text lines */}
    <rect x="14" y="26" width="28" height="4" fill="#1a1a1a" />
    <rect x="14" y="34" width="20" height="3" fill="#1a1a1a" opacity="0.3" />
    <rect x="14" y="41" width="24" height="3" fill="#1a1a1a" opacity="0.3" />
    {/* checkmark */}
    <circle cx="62" cy="40" r="10" fill="#b8f3b0" stroke="#1a1a1a" strokeWidth="2.5" />
    <polyline points="57,40 61,44 68,36" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="square" />
  </svg>
);

/* ─── Road with pin markers (Travel) ─── */
export const TravelIllustration = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* road */}
    <polygon points="25,70 55,70 46,10 34,10" fill="#e5e5e5" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* road dashes */}
    <rect x="38" y="55" width="4" height="8" fill="#ffe156" />
    <rect x="38.5" y="40" width="3" height="7" fill="#ffe156" />
    <rect x="39" y="27" width="2.5" height="6" fill="#ffe156" />
    {/* start pin */}
    <circle cx="40" cy="68" r="5" fill="#b8f3b0" stroke="#1a1a1a" strokeWidth="2" />
    <circle cx="40" cy="68" r="2" fill="#1a1a1a" />
    {/* end pin */}
    <path d="M35 8 C35 2, 45 2, 45 8 C45 14, 40 20, 40 20 C40 20, 35 14, 35 8Z" fill="#ff8fab" stroke="#1a1a1a" strokeWidth="2" />
    <circle cx="40" cy="9" r="2.5" fill="#fffef5" />
  </svg>
);

/* ─── Key icon (Auth) ─── */
export const KeyIllustration = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* key head */}
    <circle cx="22" cy="24" r="14" fill="#ffe156" stroke="#1a1a1a" strokeWidth="3" />
    <circle cx="22" cy="24" r="6" fill="#fffef5" stroke="#1a1a1a" strokeWidth="2" />
    {/* key shaft */}
    <rect x="34" y="21" width="24" height="6" fill="#a0d2ff" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* key teeth */}
    <rect x="48" y="27" width="5" height="8" fill="#a0d2ff" stroke="#1a1a1a" strokeWidth="2" />
    <rect x="40" y="27" width="4" height="6" fill="#a0d2ff" stroke="#1a1a1a" strokeWidth="2" />
  </svg>
);

/* ═══════════════════════════════════════════
   NEO-BRUTALISM HUMAN CHARACTERS
   Bold outlines, saturated fills, fun vibes
   ═══════════════════════════════════════════ */

/* ─── Girl with Beret & Sunglasses ─── */
export const PersonGirl = ({ size = 140 }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 140 196" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hair behind */}
    <path d="M40 55 C40 55, 30 70, 28 100 C26 130, 35 160, 38 170 L102 170 C105 160, 114 130, 112 100 C110 70, 100 55, 100 55Z" fill="#dbb8ff" stroke="#1a1a1a" strokeWidth="3" />
    {/* Neck */}
    <rect x="57" y="105" width="26" height="20" fill="#e8b88a" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* Body / Jacket */}
    <path d="M25 125 L55 118 L85 118 L115 125 L120 196 L20 196Z" fill="#b8f3b0" stroke="#1a1a1a" strokeWidth="3" />
    {/* Jacket center line */}
    <line x1="70" y1="118" x2="70" y2="196" stroke="#1a1a1a" strokeWidth="2" />
    {/* Jacket collar */}
    <polygon points="55,118 70,135 85,118" fill="#b8f3b0" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* Scarf / turtleneck */}
    <rect x="52" y="108" width="36" height="14" rx="0" fill="#dbb8ff" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* Head */}
    <ellipse cx="70" cy="72" rx="32" ry="36" fill="#e8b88a" stroke="#1a1a1a" strokeWidth="3" />
    {/* Beret */}
    <ellipse cx="70" cy="42" rx="38" ry="14" fill="#b8f3b0" stroke="#1a1a1a" strokeWidth="3" />
    <circle cx="70" cy="30" r="6" fill="#b8f3b0" stroke="#1a1a1a" strokeWidth="2.5" />
    <path d="M35 42 C35 30, 52 24, 70 24 C88 24, 105 30, 105 42" fill="#b8f3b0" stroke="#1a1a1a" strokeWidth="3" />
    {/* Sunglasses */}
    <rect x="44" y="62" width="22" height="16" rx="0" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2" />
    <rect x="74" y="62" width="22" height="16" rx="0" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2" />
    <line x1="66" y1="70" x2="74" y2="70" stroke="#1a1a1a" strokeWidth="3" />
    <line x1="38" y1="68" x2="44" y2="68" stroke="#1a1a1a" strokeWidth="2" />
    <line x1="96" y1="68" x2="102" y2="68" stroke="#1a1a1a" strokeWidth="2" />
    {/* Sunglasses shine */}
    <rect x="48" y="65" width="6" height="3" fill="#ffe156" opacity="0.6" />
    <rect x="78" y="65" width="6" height="3" fill="#ffe156" opacity="0.6" />
    {/* Nose */}
    <line x1="70" y1="78" x2="72" y2="84" stroke="#1a1a1a" strokeWidth="2" />
    {/* Mouth */}
    <path d="M60 90 Q70 97 80 90" stroke="#1a1a1a" strokeWidth="2.5" fill="none" />
    {/* Jacket buttons */}
    <circle cx="64" cy="145" r="3" fill="#1a1a1a" />
    <circle cx="64" cy="160" r="3" fill="#1a1a1a" />
    <circle cx="64" cy="175" r="3" fill="#1a1a1a" />
  </svg>
);

/* ─── Guy with Headphones ─── */
export const PersonGuy = ({ size = 140 }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 140 196" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Neck */}
    <rect x="57" y="102" width="26" height="22" fill="#c68642" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* Body / T-shirt */}
    <path d="M20 124 L55 118 L85 118 L120 124 L125 196 L15 196Z" fill="#ffe156" stroke="#1a1a1a" strokeWidth="3" />
    {/* T-shirt collar */}
    <path d="M55 118 Q70 130 85 118" fill="#ffe156" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* T-shirt design - lightning bolt */}
    <polygon points="65,140 72,140 68,155 78,155 62,178 66,162 58,162" fill="#1a1a1a" />
    {/* Head */}
    <ellipse cx="70" cy="70" rx="30" ry="35" fill="#c68642" stroke="#1a1a1a" strokeWidth="3" />
    {/* Hair - curly/afro top */}
    <path d="M40 58 C38 35, 45 20, 70 18 C95 20, 102 35, 100 58" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2" />
    <circle cx="45" cy="42" r="8" fill="#1a1a1a" />
    <circle cx="60" cy="32" r="9" fill="#1a1a1a" />
    <circle cx="78" cy="32" r="9" fill="#1a1a1a" />
    <circle cx="93" cy="42" r="8" fill="#1a1a1a" />
    <circle cx="70" cy="25" r="8" fill="#1a1a1a" />
    {/* Headphones band */}
    <path d="M34 60 C34 35, 45 22, 70 20 C95 22, 106 35, 106 60" stroke="#ff8fab" strokeWidth="5" fill="none" />
    {/* Left ear cup */}
    <rect x="27" y="55" width="14" height="22" rx="0" fill="#ff8fab" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* Right ear cup */}
    <rect x="99" y="55" width="14" height="22" rx="0" fill="#ff8fab" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* Eyes */}
    <circle cx="58" cy="68" r="4" fill="#fffef5" stroke="#1a1a1a" strokeWidth="2" />
    <circle cx="58" cy="68" r="2" fill="#1a1a1a" />
    <circle cx="82" cy="68" r="4" fill="#fffef5" stroke="#1a1a1a" strokeWidth="2" />
    <circle cx="82" cy="68" r="2" fill="#1a1a1a" />
    {/* Eyebrows */}
    <line x1="52" y1="60" x2="63" y2="59" stroke="#1a1a1a" strokeWidth="2.5" />
    <line x1="77" y1="59" x2="88" y2="60" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* Nose */}
    <line x1="70" y1="72" x2="72" y2="80" stroke="#1a1a1a" strokeWidth="2" />
    {/* Smile */}
    <path d="M58 88 Q70 96 82 88" stroke="#1a1a1a" strokeWidth="2.5" fill="none" />
    {/* Arms out suggestion */}
    <rect x="0" y="140" width="22" height="12" fill="#c68642" stroke="#1a1a1a" strokeWidth="2.5" />
    <rect x="118" y="140" width="22" height="12" fill="#c68642" stroke="#1a1a1a" strokeWidth="2.5" />
  </svg>
);

/* ─── Girl Waving with Hair Clips ─── */
export const PersonWaving = ({ size = 140 }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 140 196" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Long hair */}
    <path d="M38 50 C35 55, 28 80, 30 110 C32 130, 30 160, 32 180 L45 180 C45 150, 48 120, 48 100Z" fill="#ff8fab" stroke="#1a1a1a" strokeWidth="2.5" />
    <path d="M102 50 C105 55, 112 80, 110 110 C108 130, 110 160, 108 180 L95 180 C95 150, 92 120, 92 100Z" fill="#ff8fab" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* Neck */}
    <rect x="57" y="103" width="26" height="20" fill="#e8b88a" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* Body / Tank top */}
    <path d="M35 123 L55 118 L85 118 L105 123 L110 196 L30 196Z" fill="#a0d2ff" stroke="#1a1a1a" strokeWidth="3" />
    {/* Tank top straps */}
    <rect x="53" y="112" width="10" height="14" fill="#a0d2ff" stroke="#1a1a1a" strokeWidth="2" />
    <rect x="77" y="112" width="10" height="14" fill="#a0d2ff" stroke="#1a1a1a" strokeWidth="2" />
    {/* Inner shirt */}
    <rect x="48" y="126" width="44" height="30" fill="#ffe156" stroke="#1a1a1a" strokeWidth="2" />
    {/* Head */}
    <ellipse cx="70" cy="70" rx="32" ry="36" fill="#e8b88a" stroke="#1a1a1a" strokeWidth="3" />
    {/* Hair top */}
    <path d="M38 65 C36 42, 48 26, 70 24 C92 26, 104 42, 102 65 Q90 48, 70 46 Q50 48, 38 65Z" fill="#ff8fab" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* Hair clips */}
    <rect x="88" y="48" width="12" height="5" rx="0" fill="#ffe156" stroke="#1a1a1a" strokeWidth="1.5" />
    <rect x="88" y="56" width="12" height="5" rx="0" fill="#ffe156" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* Eyes */}
    <ellipse cx="57" cy="68" rx="5" ry="5.5" fill="#fffef5" stroke="#1a1a1a" strokeWidth="2" />
    <circle cx="58" cy="69" r="2.5" fill="#1a1a1a" />
    <ellipse cx="83" cy="68" rx="5" ry="5.5" fill="#fffef5" stroke="#1a1a1a" strokeWidth="2" />
    <circle cx="84" cy="69" r="2.5" fill="#1a1a1a" />
    {/* Eyebrows */}
    <path d="M50 59 Q57 55 64 59" stroke="#ff8fab" strokeWidth="2.5" fill="none" />
    <path d="M76 59 Q83 55 90 59" stroke="#ff8fab" strokeWidth="2.5" fill="none" />
    {/* Nose */}
    <circle cx="70" cy="78" r="2" fill="#d4956b" />
    {/* Smile with teeth */}
    <path d="M58 88 Q70 98 82 88" stroke="#1a1a1a" strokeWidth="2.5" fill="#fffef5" />
    {/* Lips */}
    <path d="M58 88 Q70 92 82 88" stroke="#ff6b6b" strokeWidth="1.5" fill="none" />
    {/* Waving arm */}
    <path d="M105 123 L122 100 L132 82" stroke="#e8b88a" strokeWidth="12" fill="none" strokeLinecap="square" />
    <path d="M105 123 L122 100 L132 82" stroke="#1a1a1a" strokeWidth="14" fill="none" strokeLinecap="square" opacity="0" />
    {/* draw arm outline manually */}
    <line x1="99" y1="120" x2="117" y2="96" stroke="#1a1a1a" strokeWidth="2.5" />
    <line x1="111" y1="128" x2="128" y2="104" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* Hand */}
    <rect x="126" y="72" width="14" height="16" fill="#e8b88a" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* Fingers */}
    <rect x="127" y="64" width="4" height="10" fill="#e8b88a" stroke="#1a1a1a" strokeWidth="1.5" />
    <rect x="132" y="62" width="4" height="12" fill="#e8b88a" stroke="#1a1a1a" strokeWidth="1.5" />
    <rect x="137" y="64" width="4" height="10" fill="#e8b88a" stroke="#1a1a1a" strokeWidth="1.5" />
    {/* Star accessory */}
    <polygon points="48,38 50,44 56,44 51,48 53,54 48,50 43,54 45,48 40,44 46,44" fill="#ffe156" stroke="#1a1a1a" strokeWidth="1.5" />
  </svg>
);

/* ─── Person in Car Scene (Hero Combo) ─── */
export const HeroScene = ({ width = 400 }) => {
  const h = width * 0.65;
  return (
    <svg width={width} height={h} viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sky dots / decoration */}
      <circle cx="50" cy="30" r="4" fill="#ff8fab" />
      <circle cx="350" cy="45" r="3" fill="#a0d2ff" />
      <circle cx="180" cy="20" r="5" fill="#ffe156" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Star */}
      <polygon points="320,20 323,28 332,28 325,33 327,42 320,37 313,42 315,33 308,28 317,28" fill="#ffe156" stroke="#1a1a1a" strokeWidth="2" />

      {/* Road */}
      <rect x="0" y="215" width="400" height="45" fill="#1a1a1a" />
      <rect x="20" y="233" width="40" height="5" fill="#ffe156" />
      <rect x="80" y="233" width="40" height="5" fill="#ffe156" />
      <rect x="140" y="233" width="40" height="5" fill="#ffe156" />
      <rect x="200" y="233" width="40" height="5" fill="#ffe156" />
      <rect x="260" y="233" width="40" height="5" fill="#ffe156" />
      <rect x="320" y="233" width="40" height="5" fill="#ffe156" />

      {/* Car body */}
      <rect x="60" y="160" width="220" height="58" fill="#ffe156" stroke="#1a1a1a" strokeWidth="3.5" />
      {/* Car roof */}
      <polygon points="110,160 135,100 255,100 280,160" fill="#a0d2ff" stroke="#1a1a1a" strokeWidth="3.5" />

      {/* Window 1 - driver */}
      <polygon points="138,155 148,108 195,108 195,155" fill="#fffef5" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Window 2 - passenger */}
      <polygon points="202,155 202,108 250,108 260,155" fill="#fffef5" stroke="#1a1a1a" strokeWidth="2.5" />

      {/* Person 1 in car - driver (dark skin, green beret) */}
      <ellipse cx="168" cy="135" rx="14" ry="16" fill="#c68642" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Driver hair */}
      <path d="M155 130 C153 118, 162 110, 168 110 C174 110, 183 118, 181 130" fill="#1a1a1a" />
      {/* Driver eyes */}
      <circle cx="162" cy="133" r="2.5" fill="#fffef5" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="162" cy="133" r="1" fill="#1a1a1a" />
      <circle cx="174" cy="133" r="2.5" fill="#fffef5" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="174" cy="133" r="1" fill="#1a1a1a" />
      {/* Driver smile */}
      <path d="M162 141 Q168 146 174 141" stroke="#1a1a1a" strokeWidth="2" fill="none" />

      {/* Person 2 in car - passenger (light skin, purple hair) */}
      <ellipse cx="228" cy="135" rx="14" ry="16" fill="#e8b88a" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Passenger purple hair */}
      <path d="M214 132 C212 116, 220 105, 228 105 C236 105, 244 116, 242 132 Q235 118, 228 118 Q221 118, 214 132Z" fill="#dbb8ff" stroke="#1a1a1a" strokeWidth="2" />
      {/* Hair clips */}
      <rect x="237" y="114" width="7" height="3.5" fill="#ffe156" stroke="#1a1a1a" strokeWidth="1" />
      <rect x="237" y="120" width="7" height="3.5" fill="#ffe156" stroke="#1a1a1a" strokeWidth="1" />
      {/* Passenger eyes */}
      <circle cx="222" cy="133" r="2.5" fill="#fffef5" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="223" cy="134" r="1" fill="#1a1a1a" />
      <circle cx="234" cy="133" r="2.5" fill="#fffef5" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="235" cy="134" r="1" fill="#1a1a1a" />
      {/* Passenger smile */}
      <path d="M222 141 Q228 146 234 141" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      {/* Passenger waving hand out window */}
      <rect x="258" y="120" width="14" height="12" fill="#e8b88a" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="259" y="112" width="3.5" height="9" fill="#e8b88a" stroke="#1a1a1a" strokeWidth="1" />
      <rect x="263" y="110" width="3.5" height="11" fill="#e8b88a" stroke="#1a1a1a" strokeWidth="1" />
      <rect x="267" y="112" width="3.5" height="9" fill="#e8b88a" stroke="#1a1a1a" strokeWidth="1" />

      {/* Headlights */}
      <rect x="272" y="175" width="14" height="12" fill="#fffef5" stroke="#1a1a1a" strokeWidth="2.5" />
      <rect x="55" y="175" width="14" height="12" fill="#ff8fab" stroke="#1a1a1a" strokeWidth="2.5" />

      {/* Wheels */}
      <circle cx="115" cy="218" r="18" fill="#1a1a1a" />
      <circle cx="115" cy="218" r="7" fill="#fffef5" />
      <circle cx="240" cy="218" r="18" fill="#1a1a1a" />
      <circle cx="240" cy="218" r="7" fill="#fffef5" />

      {/* Person standing outside (waiting) - left side */}
      {/* Body */}
      <rect x="12" y="155" width="28" height="60" fill="#ff8fab" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Head */}
      <ellipse cx="26" cy="136" rx="12" ry="14" fill="#e8b88a" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Hijab/scarf */}
      <path d="M14 132 C12 120, 18 110, 26 108 C34 110, 40 120, 38 132 Q32 122, 26 122 Q20 122, 14 132Z" fill="#b8f3b0" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M14 132 C14 140, 16 150, 16 155 L36 155 C36 150, 38 140, 38 132" fill="#b8f3b0" stroke="#1a1a1a" strokeWidth="2" />
      {/* Eyes */}
      <circle cx="22" cy="134" r="2" fill="#1a1a1a" />
      <circle cx="30" cy="134" r="2" fill="#1a1a1a" />
      {/* Smile */}
      <path d="M22 140 Q26 144 30 140" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      {/* Backpack */}
      <rect x="3" y="155" width="12" height="25" fill="#a0d2ff" stroke="#1a1a1a" strokeWidth="2" />

      {/* Person standing outside - right side (guy with phone) */}
      {/* Body */}
      <rect x="330" y="150" width="30" height="65" fill="#dbb8ff" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Head */}
      <ellipse cx="345" cy="130" rx="13" ry="15" fill="#c68642" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Hair */}
      <path d="M332 126 C330 112, 338 104, 345 104 C352 104, 360 112, 358 126" fill="#1a1a1a" />
      {/* Cap */}
      <rect x="330" y="108" width="32" height="8" fill="#ffe156" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="356" y="106" width="12" height="5" fill="#ffe156" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Eyes */}
      <circle cx="340" cy="130" r="2" fill="#fffef5" stroke="#1a1a1a" strokeWidth="1" />
      <circle cx="340" cy="130" r="1" fill="#1a1a1a" />
      <circle cx="350" cy="130" r="2" fill="#fffef5" stroke="#1a1a1a" strokeWidth="1" />
      <circle cx="350" cy="130" r="1" fill="#1a1a1a" />
      {/* Smile */}
      <path d="M340 137 Q345 142 350 137" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      {/* Phone in hand */}
      <rect x="360" y="160" width="10" height="18" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="1" />
      <rect x="361" y="162" width="8" height="12" fill="#a0d2ff" />
      {/* Arm */}
      <rect x="356" y="155" width="8" height="5" fill="#c68642" stroke="#1a1a1a" strokeWidth="1.5" />
    </svg>
  );
};
