export function convertGoogleDriveUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  const queryMatch = trimmed.match(/[?&]id=([^&#]+)/i);
  const id = fileMatch?.[1] || queryMatch?.[1];

  if (!id || !/drive\.google\.com/i.test(trimmed)) {
    return trimmed;
  }

  return `https://drive.google.com/thumbnail?id=${decodeURIComponent(id)}&sz=w2000`;
}
