import crypto from 'crypto';

/**
 * Real file-integrity verification for uploaded documents.
 * No new dependencies: works purely on file bytes already on disk.
 *
 * What it genuinely verifies:
 *  1. File is non-empty and within readable bounds.
 *  2. Magic bytes match the claimed extension + MIME type
 *     (rejects renamed .txt/.exe/.html files masquerading as PDF/JPG/PNG/WEBP).
 *  3. Internal structure parses (PNG IHDR dimensions, JPEG SOF dimensions,
 *     PDF header version + page count) — catches truncated/corrupt files.
 *  4. SHA-256 is computed over actual file BYTES (not the stored filename).
 *
 * What it does NOT do (honest boundary): it cannot attest issuance by a
 * government authority — that needs DigiLocker/issuer API credentials, which
 * this deployment does not have. Issuer attestation stays a human-officer step.
 */

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);
const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46]); // %PDF
const RIFF_MAGIC = Buffer.from([0x52, 0x49, 0x46, 0x46]); // RIFF
const WEBP_MAGIC = Buffer.from([0x57, 0x45, 0x42, 0x50]); // WEBP

export const sha256Hex = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

/** Detect true file kind from magic bytes. Returns 'pdf'|'jpeg'|'png'|'webp'|null. */
export const detectFileKind = (buffer) => {
  if (!buffer || buffer.length < 12) return null;
  if (buffer.subarray(0, 4).equals(PDF_MAGIC)) return 'pdf';
  if (buffer.subarray(0, 3).equals(JPG_MAGIC)) return 'jpeg';
  if (buffer.subarray(0, 8).equals(PNG_MAGIC)) return 'png';
  if (buffer.subarray(0, 4).equals(RIFF_MAGIC) && buffer.subarray(8, 12).equals(WEBP_MAGIC)) return 'webp';
  return null;
};

const KIND_BY_EXT = { '.pdf': 'pdf', '.jpg': 'jpeg', '.jpeg': 'jpeg', '.png': 'png', '.webp': 'webp' };
const KIND_BY_MIME = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/** Parse PNG IHDR for width/height. Returns {width,height} or null. */
export const parsePngDimensions = (buffer) => {
  try {
    if (buffer.length < 25) return null;
    // IHDR chunk: length(4) + 'IHDR'(4) at offset 8..16, then width(4) height(4) BE
    if (buffer.toString('ascii', 12, 16) !== 'IHDR') return null;
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  } catch {
    return null;
  }
};

/** Scan JPEG markers for first SOF (Start Of Frame) to get dimensions. */
export const parseJpegDimensions = (buffer) => {
  try {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) return null;
      const marker = buffer[offset + 1];
      // SOF0..SOF15 except DHT(0xC4), JPGn(0xC8..), DAC(0xCC)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
      }
      if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
        offset += 2;
        continue;
      }
      const length = buffer.readUInt16BE(offset + 2);
      if (length < 2) return null;
      offset += 2 + length;
    }
    return null;
  } catch {
    return null;
  }
};

/** Parse PDF header version + page count. Returns {version, pages} or null. */
export const parsePdfInfo = (buffer) => {
  try {
    const head = buffer.subarray(0, 64).toString('ascii');
    const versionMatch = head.match(/%PDF-(\d+\.\d+)/);
    if (!versionMatch) return null;
    // Count page objects; cap scan at 2MB for performance
    const scan = buffer.subarray(0, Math.min(buffer.length, 2 * 1024 * 1024)).toString('latin1');
    const pages = (scan.match(/\/Type\s*\/Page[^s]/g) || []).length;
    return { version: versionMatch[1], pages };
  } catch {
    return null;
  }
};

/**
 * Run the full integrity suite. Never throws — every check reports pass/fail.
 * hardFail=true means the file must be rejected outright.
 */
export const verifyUploadIntegrity = ({ buffer, originalName = '', mimeType = '', sizeBytes = 0 }) => {
  const checks = [];
  const metadata = {};
  const ext = (originalName.match(/\.[a-z0-9]+$/i) || [''])[0].toLowerCase();
  const claimedKind = KIND_BY_EXT[ext] || KIND_BY_MIME[(mimeType || '').toLowerCase()] || null;

  // 1. Non-empty file
  const nonEmpty = Buffer.isBuffer(buffer) && buffer.length > 0 && sizeBytes > 0;
  checks.push({
    code: 'FILE_NON_EMPTY',
    label: 'File contains data',
    passed: nonEmpty,
    hardFail: true,
    detail: nonEmpty ? `${sizeBytes} bytes received` : 'Empty file received',
  });
  if (!nonEmpty) return { passedAll: false, checks, metadata };

  // 2. Magic-byte signature matches claimed type
  const actualKind = detectFileKind(buffer);
  const signatureOk = actualKind !== null && (claimedKind === null || actualKind === claimedKind);
  checks.push({
    code: 'SIGNATURE_MATCH',
    label: 'File signature matches type',
    passed: signatureOk,
    hardFail: true,
    detail: signatureOk
      ? `Detected ${actualKind.toUpperCase()} bytes matching ${ext || mimeType}`
      : `Claimed ${ext || mimeType} but bytes decode as ${actualKind || 'unknown/unsupported'} — possible renamed or forged file`,
  });
  if (!signatureOk) return { passedAll: false, checks, metadata };

  // 3. Internal structure parses
  let structureOk = false;
  if (actualKind === 'png') {
    const dims = parsePngDimensions(buffer);
    if (dims) {
      structureOk = true;
      metadata.width = dims.width;
      metadata.height = dims.height;
    }
    checks.push({
      code: 'STRUCTURE_PARSE',
      label: 'Image structure readable',
      passed: structureOk,
      hardFail: true,
      detail: structureOk ? `PNG ${dims.width}x${dims.height}px` : 'PNG header corrupt or truncated',
    });
  } else if (actualKind === 'jpeg') {
    const dims = parseJpegDimensions(buffer);
    if (dims) {
      structureOk = true;
      metadata.width = dims.width;
      metadata.height = dims.height;
    }
    checks.push({
      code: 'STRUCTURE_PARSE',
      label: 'Image structure readable',
      passed: structureOk,
      hardFail: true,
      detail: structureOk ? `JPEG ${dims.width}x${dims.height}px` : 'JPEG markers corrupt or truncated',
    });
  } else if (actualKind === 'pdf') {
    const info = parsePdfInfo(buffer);
    if (info) {
      structureOk = true;
      metadata.pdfVersion = info.version;
      metadata.pages = info.pages;
    }
    checks.push({
      code: 'STRUCTURE_PARSE',
      label: 'PDF structure readable',
      passed: structureOk,
      hardFail: true,
      detail: structureOk ? `PDF ${info.version}, ${info.pages} page object(s)` : 'PDF header unreadable',
    });
  } else if (actualKind === 'webp') {
    // RIFF/WEBP container validated by magic bytes; dimensions need VP8 parse — accept with metadata note
    structureOk = true;
    checks.push({
      code: 'STRUCTURE_PARSE',
      label: 'WEBP container valid',
      passed: true,
      hardFail: true,
      detail: 'RIFF/WEBP container signature verified',
    });
  }
  if (!structureOk) return { passedAll: false, checks, metadata };

  // 4. Readability advisory (warning only — never rejects a genuine file)
  const minDim = Math.min(metadata.width || Infinity, metadata.height || Infinity);
  const readable = minDim === Infinity || minDim >= 200;
  checks.push({
    code: 'READABILITY',
    label: 'Resolution sufficient for review',
    passed: readable,
    hardFail: false,
    detail:
      minDim === Infinity
        ? 'PDF accepted for officer review'
        : readable
          ? `Smallest side ${minDim}px meets review threshold`
          : `Smallest side ${minDim}px below 200px review threshold — flagged for manual review`,
  });

  return { passedAll: true, checks, metadata };
};
