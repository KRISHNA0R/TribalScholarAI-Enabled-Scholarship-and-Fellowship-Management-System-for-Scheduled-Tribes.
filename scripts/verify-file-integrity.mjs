#!/usr/bin/env node
/**
 * Document file-integrity regression test.
 *
 * Proves the upload pipeline rejects disguised/forged/truncated files and
 * accepts genuine ones, using the same code path the API calls.
 *
 * Usage: node scripts/verify-file-integrity.mjs
 */
import { verifyUploadIntegrity, sha256Hex, detectFileKind } from '../server/services/fileIntegrityService.js';

const results = [];
const check = (name, condition, extra = '') =>
  results.push({ name, pass: Boolean(condition), extra });

// --- Builders ---------------------------------------------------------------
const png = (w, h) => {
  const b = Buffer.alloc(33);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(b, 0);
  b.writeUInt32BE(13, 8); // IHDR chunk length
  b.write('IHDR', 12, 'ascii');
  b.writeUInt32BE(w, 16);
  b.writeUInt32BE(h, 20);
  b[24] = 8; // bit depth
  b[25] = 2; // colour type
  return b;
};

const jpeg = (w, h) => {
  const b = Buffer.alloc(60);
  b.writeUInt8(0xff, 0);
  b.writeUInt8(0xd8, 1);
  b.writeUInt8(0xff, 2);
  b.writeUInt8(0xc0, 3);
  b.writeUInt16BE(17, 4);
  b.writeUInt8(8, 6);
  b.writeUInt16BE(h, 7);
  b.writeUInt16BE(w, 9);
  b.writeUInt8(0xff, 11);
  b.writeUInt8(0xd9, 12);
  return b;
};

const pdf = () =>
  Buffer.concat([
    Buffer.from('%PDF-1.7\n'),
    Buffer.from('1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n'),
    Buffer.from('2 0 obj<</Type/Pages/Kids[3 0 R]/Count 2>>endobj\n'),
    Buffer.from('3 0 obj<</Type/Page/Parent 2 0 R>>endobj\n'),
    Buffer.from('4 0 obj<</Type/Page/Parent 2 0 R>>endobj\n'),
    Buffer.alloc(512),
  ]);

// --- 1. Genuine files are accepted -----------------------------------------
let r = verifyUploadIntegrity({ buffer: png(1200, 900), originalName: 'st-cert.png', mimeType: 'image/png', sizeBytes: 33 });
check('genuine PNG accepted', r.passedAll && r.metadata.width === 1200 && r.metadata.height === 900, JSON.stringify(r.metadata));

r = verifyUploadIntegrity({ buffer: jpeg(800, 600), originalName: 'income.jpg', mimeType: 'image/jpeg', sizeBytes: 60 });
check('genuine JPEG accepted', r.passedAll && r.metadata.width === 800, JSON.stringify(r.metadata));

r = verifyUploadIntegrity({ buffer: pdf(), originalName: 'marksheet.pdf', mimeType: 'application/pdf', sizeBytes: 600 });
check('genuine PDF accepted', r.passedAll && r.metadata.pdfVersion === '1.7' && r.metadata.pages === 2, JSON.stringify(r.metadata));

// --- 2. Forged / renamed files are rejected ---------------------------------
const textFile = Buffer.from('#!/bin/sh\nrm -rf /\n# definitely not a PDF', 'utf8');
r = verifyUploadIntegrity({ buffer: textFile, originalName: 'income.pdf', mimeType: 'application/pdf', sizeBytes: textFile.length });
check('shell script renamed to .pdf rejected', !r.passedAll && r.checks.some((c) => c.code === 'SIGNATURE_MATCH' && !c.passed));

const svgAsPng = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
r = verifyUploadIntegrity({ buffer: svgAsPng, originalName: 'aadhaar.png', mimeType: 'image/png', sizeBytes: svgAsPng.length });
check('SVG masquerading as PNG rejected', !r.passedAll);

const pngAsPdf = png(400, 400);
r = verifyUploadIntegrity({ buffer: pngAsPdf, originalName: 'fake.pdf', mimeType: 'application/pdf', sizeBytes: pngAsPdf.length });
check('PNG bytes renamed to .pdf rejected', !r.passedAll);

const truncated = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]);
r = verifyUploadIntegrity({ buffer: truncated, originalName: 'cut.png', mimeType: 'image/png', sizeBytes: truncated.length });
check('truncated PNG rejected', !r.passedAll);

r = verifyUploadIntegrity({ buffer: Buffer.alloc(0), originalName: 'empty.pdf', mimeType: 'application/pdf', sizeBytes: 0 });
check('empty file rejected', !r.passedAll);

r = verifyUploadIntegrity({ buffer: Buffer.from('%PDF-'), originalName: 'stub.pdf', mimeType: 'application/pdf', sizeBytes: 5 });
check('PDF stub without structure rejected', !r.passedAll);

// --- 3. Low resolution is a warning, never a silent rejection ---------------
const tiny = png(80, 60);
r = verifyUploadIntegrity({ buffer: tiny, originalName: 'thumb.png', mimeType: 'image/png', sizeBytes: tiny.length });
check('low-res image accepted but flagged', r.passedAll && r.checks.some((c) => c.code === 'READABILITY' && !c.passed));

// --- 4. Hashing is real and deterministic ----------------------------------
check('SHA-256 deterministic', sha256Hex(Buffer.from('abc')) === sha256Hex(Buffer.from('abc')));
check('SHA-256 collision-free', sha256Hex(Buffer.from('abc')) !== sha256Hex(Buffer.from('abd')));
check('SHA-256 matches known vector', sha256Hex(Buffer.from('abc')) === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
check('magic-byte detection', detectFileKind(pdf()) === 'pdf' && detectFileKind(png(1, 1)) === 'png' && detectFileKind(Buffer.from('hello world!!!')) === null);

// --- Report -----------------------------------------------------------------
const failed = results.filter((x) => !x.pass);
console.log('\nTribalScholar AI — document file-integrity test');
console.log('─'.repeat(64));
for (const x of results) console.log(`  ${x.pass ? '✓' : '✗'} ${x.name}${x.extra ? `  (${x.extra})` : ''}`);
console.log('─'.repeat(64));
console.log(
  failed.length === 0
    ? `✓ PASS — ${results.length}/${results.length} checks\n`
    : `✗ FAIL — ${failed.length} of ${results.length} checks failed\n`
);
process.exit(failed.length ? 1 : 0);
