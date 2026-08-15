import fs from 'fs';
import zlib from 'zlib';

function createPngChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  
  // CRC32 calculation
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

function createEmeraldPng(width, height) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = createPngChunk('IHDR', ihdr);

  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.38;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radius) {
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

fs.writeFileSync('public/icon-192.png', createEmeraldPng(192, 192));
fs.writeFileSync('public/icon-512.png', createEmeraldPng(512, 512));
fs.writeFileSync('public/icon-maskable.png', createEmeraldPng(512, 512));

console.log('PNG PWA icons successfully generated in public/');
