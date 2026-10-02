/**
 * Compact MD5 implementation (RFC 1321) for the hash tool.
 * MD5 is NOT in the Web Crypto API, so we compute it locally — it never leaves the browser.
 * MD5 is cryptographically broken; the tool labels it as non-secure, for checksums only.
 */
export function md5(bytes: Uint8Array): string {
  const rotl = (x: number, c: number) => (x << c) | (x >>> (32 - c));
  const add = (a: number, b: number) => (a + b) | 0;

  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const K = new Int32Array(64);
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) | 0;

  const origLen = bytes.length;
  const bitLen = origLen * 8;
  const withPad = (((origLen + 8) >> 6) + 1) << 6;
  const msg = new Uint8Array(withPad);
  msg.set(bytes);
  msg[origLen] = 0x80;
  const view = new DataView(msg.buffer);
  view.setUint32(withPad - 8, bitLen >>> 0, true);
  view.setUint32(withPad - 4, Math.floor(bitLen / 2 ** 32), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const M = new Int32Array(16);
  for (let off = 0; off < withPad; off += 64) {
    for (let i = 0; i < 16; i++) M[i] = view.getUint32(off + i * 4, true);
    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;

    for (let i = 0; i < 64; i++) {
      let F: number;
      let g: number;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = add(add(add(F, A), K[i]), M[g]);
      A = D;
      D = C;
      C = B;
      B = add(B, rotl(F, s[i]));
    }
    a0 = add(a0, A);
    b0 = add(b0, B);
    c0 = add(c0, C);
    d0 = add(d0, D);
  }

  const toHex = (n: number) =>
    [0, 8, 16, 24].map((sh) => ((n >>> sh) & 0xff).toString(16).padStart(2, '0')).join('');
  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}
