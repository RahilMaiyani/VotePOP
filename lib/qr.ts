// Pure TypeScript QR Code generator (Version 1-7, Error Correction M/L)
const PAD0 = 0xec;
const PAD1 = 0x11;

const EXP_TABLE = new Uint8Array(256);
const LOG_TABLE = new Uint8Array(256);

(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    LOG_TABLE[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  LOG_TABLE[0] = 0;
})();

function glog(n: number) {
  if (n < 1) throw new Error('glog(' + n + ')');
  return LOG_TABLE[n];
}

function gexp(n: number) {
  while (n < 0) n += 255;
  while (n >= 255) n -= 255;
  return EXP_TABLE[n];
}

function polyMul(p1: number[], p2: number[]) {
  const result = new Array(p1.length + p2.length - 1).fill(0);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] ^= gexp(glog(p1[i]) + glog(p2[j]));
    }
  }
  return result;
}

function getErrorCorrectionPoly(ecLength: number): number[] {
  let poly = [1];
  for (let i = 0; i < ecLength; i++) {
    poly = polyMul(poly, [1, gexp(i)]);
  }
  return poly;
}

function rsEncode(data: number[], ecLength: number): number[] {
  const genPoly = getErrorCorrectionPoly(ecLength);
  const result = new Array(data.length + ecLength).fill(0);
  for (let i = 0; i < data.length; i++) result[i] = data[i];

  for (let i = 0; i < data.length; i++) {
    const factor = result[i];
    if (factor !== 0) {
      for (let j = 0; j < genPoly.length; j++) {
        result[i + j] ^= gexp(glog(genPoly[j]) + glog(factor));
      }
    }
  }
  return result.slice(data.length);
}

interface QRVersionSpec {
  version: number;
  dataBytes: number;
  ecBytes: number;
  size: number;
  alignment: number[];
}

const VERSIONS: QRVersionSpec[] = [
  { version: 1, dataBytes: 16, ecBytes: 10, size: 21, alignment: [] },
  { version: 2, dataBytes: 28, ecBytes: 16, size: 25, alignment: [6, 18] },
  { version: 3, dataBytes: 44, ecBytes: 26, size: 29, alignment: [6, 22] },
  { version: 4, dataBytes: 64, ecBytes: 36, size: 33, alignment: [6, 26] },
  { version: 5, dataBytes: 86, ecBytes: 48, size: 37, alignment: [6, 30] },
  { version: 6, dataBytes: 108, ecBytes: 64, size: 41, alignment: [6, 34] },
  { version: 7, dataBytes: 124, ecBytes: 72, size: 45, alignment: [6, 22, 38] },
];

export function generateQRCodeMatrix(text: string): boolean[][] {
  const encoder = new TextEncoder();
  const utf8 = Array.from(encoder.encode(text));

  let spec = VERSIONS.find((v) => v.dataBytes >= utf8.length + 3);
  if (!spec) {
    spec = VERSIONS[VERSIONS.length - 1];
  }

  const { size, dataBytes, ecBytes, alignment } = spec;

  const bitBuf: number[] = [];
  function pushBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bitBuf.push((val >> i) & 1);
    }
  }

  pushBits(0b0100, 4);
  pushBits(Math.min(utf8.length, 255), 8);
  for (const b of utf8) {
    pushBits(b, 8);
  }

  while (bitBuf.length < dataBytes * 8 && bitBuf.length % 8 !== 0) {
    bitBuf.push(0);
  }
  while (bitBuf.length < dataBytes * 8 && bitBuf.length < (dataBytes - 1) * 8) {
    pushBits(0, 4);
    break;
  }

  const data: number[] = [];
  for (let i = 0; i < bitBuf.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | (bitBuf[i + j] || 0);
    }
    data.push(byte);
  }

  let padToggle = false;
  while (data.length < dataBytes) {
    data.push(padToggle ? PAD1 : PAD0);
    padToggle = !padToggle;
  }

  const ec = rsEncode(data, ecBytes);
  const fullCodewords = [...data, ...ec];

  const matrix: (boolean | null)[][] = Array.from({ length: size }, () =>
    Array(size).fill(null)
  );

  function setFinder(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const mr = row + r;
        const mc = col + c;
        if (mr >= 0 && mr < size && mc >= 0 && mc < size) {
          if (
            (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
            (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            matrix[mr][mc] = true;
          } else {
            matrix[mr][mc] = false;
          }
        }
      }
    }
  }

  setFinder(0, 0);
  setFinder(0, size - 7);
  setFinder(size - 7, 0);

  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === null) matrix[6][i] = i % 2 === 0;
    if (matrix[i][6] === null) matrix[i][6] = i % 2 === 0;
  }

  if (alignment.length > 0) {
    for (const r of alignment) {
      for (const c of alignment) {
        if (matrix[r][c] !== null) continue;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            matrix[r + dr][c + dc] =
              Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
          }
        }
      }
    }
  }

  for (let i = 0; i < 9; i++) {
    if (matrix[8][i] === null) matrix[8][i] = false;
    if (matrix[i][8] === null) matrix[i][8] = false;
    if (matrix[8][size - 1 - i] === null) matrix[8][size - 1 - i] = false;
    if (matrix[size - 1 - i][8] === null) matrix[size - 1 - i][8] = false;
  }
  matrix[size - 8][8] = true;

  let bitIdx = 0;
  const allBits: number[] = [];
  for (const b of fullCodewords) {
    for (let i = 7; i >= 0; i--) allBits.push((b >> i) & 1);
  }

  let upward = true;
  for (let rightCol = size - 1; rightCol > 0; rightCol -= 2) {
    if (rightCol === 6) rightCol--;
    const rows = upward
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);

    for (const r of rows) {
      for (const c of [rightCol, rightCol - 1]) {
        if (matrix[r][c] === null) {
          const bit = bitIdx < allBits.length ? allBits[bitIdx++] : 0;
          const mask = (r + c) % 2 === 0;
          matrix[r][c] = (bit === 1) !== mask;
        }
      }
    }
    upward = !upward;
  }

  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
  for (let i = 0; i < 6; i++) matrix[8][i] = formatBits[i] === 1;
  matrix[8][7] = formatBits[6] === 1;
  matrix[8][8] = formatBits[7] === 1;
  matrix[7][8] = formatBits[8] === 1;
  for (let i = 9; i < 15; i++) matrix[14 - i][8] = formatBits[i] === 1;

  for (let i = 0; i < 8; i++) matrix[size - 1 - i][8] = formatBits[i] === 1;
  for (let i = 8; i < 15; i++) matrix[8][size - 15 + i] = formatBits[i] === 1;

  return matrix.map((row) => row.map((cell) => !cell ? false : true));
}

export function generateQRCodeSVG(
  text: string,
  options: {
    size?: number;
    fgColor?: string;
    bgColor?: string;
    margin?: number;
  } = {}
): string {
  const matrix = generateQRCodeMatrix(text);
  const matrixSize = matrix.length;
  const margin = options.margin ?? 3;
  const totalSize = matrixSize + margin * 2;
  const fgColor = options.fgColor || '#000000';
  const bgColor = options.bgColor || '#FFFFFF';
  const size = options.size || 240;

  let pathData = '';
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (matrix[r][c]) {
        const x = c + margin;
        const y = r + margin;
        pathData += `M${x},${y}h1v1h-1z `;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${size}" height="${size}" shape-rendering="crispEdges">
    <rect width="${totalSize}" height="${totalSize}" fill="${bgColor}" />
    <path d="${pathData}" fill="${fgColor}" />
  </svg>`;
}
