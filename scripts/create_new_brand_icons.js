import fs from 'fs';
import zlib from 'zlib';

function createPngChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  
  let crc = 0xffffffff;
  for (let i = 4; i < 8 + len; i++) {
    const byte = buf[i];
    crc ^= byte;
    for (let k = 0; k < 8; k++) {
      crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
  }
  buf.writeUInt32BE((crc ^ 0xffffffff) >>> 0, 8 + len);
  return buf;
}

function createExactOfficialLogoPng(width, height) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = createPngChunk('IHDR', ihdr);

  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);
  
  const scale = width / 200;
  const cx = 100 * scale;
  const cy = 100 * scale;
  const bgR = 92 * scale;

  const dotX = 124 * scale;
  const dotY = 74 * scale;
  const dotR = 14 * scale;

  const rOuter = 53 * scale;
  const rInner = 31 * scale;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > bgR) {
        rawData[pxOffset] = 0x07;
        rawData[pxOffset + 1] = 0x12;
        rawData[pxOffset + 2] = 0x17;
        rawData[pxOffset + 3] = 0x00;
        continue;
      }

      const dDot = Math.sqrt((x - dotX) * (x - dotX) + (y - dotY) * (y - dotY));
      const inDot = (dDot <= dotR);

      let angleRad = Math.atan2(dy, dx);
      let angleDeg = angleRad * (180 / Math.PI);
      const isAngleInCArc = (angleDeg <= 25 || angleDeg >= -90);
      const inCArc = (dist >= rInner && dist <= rOuter && isAngleInCArc);

      if (inDot || inCArc) {
        rawData[pxOffset] = 0x10;
        rawData[pxOffset + 1] = 0xb9;
        rawData[pxOffset + 2] = 0x81;
        rawData[pxOffset + 3] = 0xff;
      } else {
        rawData[pxOffset] = 0x07;
        rawData[pxOffset + 1] = 0x12;
        rawData[pxOffset + 2] = 0x17;
        rawData[pxOffset + 3] = 0xff;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createPngChunk('IDAT', compressedData);
  const iendChunk = createPngChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

fs.writeFileSync('public/logo-orderconfirm-192.png', createExactOfficialLogoPng(192, 192));
fs.writeFileSync('public/logo-orderconfirm-512.png', createExactOfficialLogoPng(512, 512));
fs.writeFileSync('public/logo-orderconfirm-maskable.png', createExactOfficialLogoPng(512, 512));

const pureSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="512" height="512">
  <circle cx="100" cy="100" r="92" fill="#071217" stroke="#16313B" stroke-width="2.5" />
  <circle cx="124" cy="74" r="14" fill="#10B981" />
  <path d="M 100 47 A 53 53 0 1 0 148 122 A 11 11 0 0 0 128 113 A 31 31 0 1 1 100 69 Z" fill="#10B981" />
  <path d="M 60 120 A 53 53 0 0 0 120 151 A 53 53 0 0 0 148 122 A 11 11 0 0 0 128 113 A 31 31 0 0 1 78 110 Z" fill="#059669" opacity="0.8" />
</svg>`;

fs.writeFileSync('public/logo-orderconfirm-192.svg', pureSvgContent);
fs.writeFileSync('public/logo-orderconfirm-512.svg', pureSvgContent);

console.log('New brand logo files successfully created in public/');
