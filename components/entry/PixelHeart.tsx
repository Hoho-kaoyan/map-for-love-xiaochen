"use client";

/**
 * Pixel-art heart icon used in the brand row of both mobile and desktop
 * entry experiences. Inline SVG keeps it crisp at all sizes; the `pixelated`
 * class (from globals.css) disables smoothing.
 */
export function PixelHeart() {
  return (
    <svg className="h-9 w-9 pixelated" viewBox="0 0 22 22" aria-hidden="true">
      <path
        d="M5 3h4v2h2V3h4v2h2v6h-2v2h-2v2h-2v2H9v-2H7v-2H5v-2H3V5h2z"
        fill="#F5DCE0"
      />
      <path
        d="M5 3h4v2H5v6H3V5h2zm10 0v2h2v6h-2V5h-4V3zm0 8v2h-2v2h-2v2H9v-2H7v-2H5v-2h2v2h2v2h2v-2h2v-2z"
        fill="#E8B8C2"
      />
      <path d="M7 5h2v2H7zm8 2h-2V5h2z" fill="#FAFBF7" />
    </svg>
  );
}