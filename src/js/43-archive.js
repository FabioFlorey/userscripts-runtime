/*
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ ARCHIVES                                                                     │
  └──────────────────────────────────────────────────────────────────────────────┘
  */

  const ZIP_CRC32_TABLE = (() => {
    const table = new Uint32Array(256);

    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) {
        c = (c & 1)
          ? (0xEDB88320 ^ (c >>> 1))
          : (c >>> 1);
      }
      table[n] = c >>> 0;
    }

    return table;
  })();

  function zipCrc32(bytes) {
    let crc = 0xFFFFFFFF;

    for (let i = 0; i < bytes.length; i += 1) {
      crc = ZIP_CRC32_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
    }

    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  async function zipEntryBytes(data) {
    if (data instanceof Uint8Array) {
      return data;
    }

    if (data instanceof ArrayBuffer) {
      return new Uint8Array(data);
    }

    if (ArrayBuffer.isView(data)) {
      return new Uint8Array(
        data.buffer,
        data.byteOffset,
        data.byteLength
      );
    }

    if (data instanceof Blob) {
      return new Uint8Array(
        await data.arrayBuffer()
      );
    }

    if (typeof data === 'string') {
      return new TextEncoder().encode(data);
    }

    throw new TypeError(
      'ZIP entry data must be a string, Blob, ArrayBuffer, or typed array.'
    );
  }

  function zipDosDateTime(value = new Date()) {
    const date =
      value instanceof Date
        ? value
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new TypeError('ZIP entry date is invalid.');
    }

    const year =
      Math.max(
        1980,
        Math.min(2107, date.getFullYear())
      );

    return {
      date:
        ((year - 1980) << 9) |
        ((date.getMonth() + 1) << 5) |
        date.getDate(),
      time:
        (date.getHours() << 11) |
        (date.getMinutes() << 5) |
        Math.floor(date.getSeconds() / 2)
    };
  }

  function zipU16(value) {
    const bytes = new Uint8Array(2);
    new DataView(bytes.buffer).setUint16(
      0,
      value,
      true
    );
    return bytes;
  }

  function zipU32(value) {
    const bytes = new Uint8Array(4);
    new DataView(bytes.buffer).setUint32(
      0,
      value >>> 0,
      true
    );
    return bytes;
  }

  function zipConcat(parts) {
    const total =
      parts.reduce(
        (sum, part) => sum + part.byteLength,
        0
      );

    const output =
      new Uint8Array(total);

    let offset = 0;

    for (const part of parts) {
      output.set(part, offset);
      offset += part.byteLength;
    }

    return output;
  }

  async function createZipBlob(entries, options = {}) {
    if (!Array.isArray(entries)) {
      throw new TypeError('ZIP entries must be an array.');
    }

    if (entries.length > 0xFFFF) {
      throw new RangeError(
        'ZIP32 supports at most 65535 entries.'
      );
    }

    const encoder =
      new TextEncoder();

    const localParts = [];
    const centralParts = [];

    let localOffset = 0;

    for (const entry of entries) {
      if (!entry || typeof entry.name !== 'string') {
        throw new TypeError(
          'Each ZIP entry must have a string name.'
        );
      }

      const normalizedName =
        entry.name
          .replace(/\\/g, '/')
          .replace(/^\/+/, '');

      if (!normalizedName) {
        throw new RangeError(
          'ZIP entry names must not be empty.'
        );
      }

      const nameBytes =
        encoder.encode(normalizedName);

      if (nameBytes.byteLength > 0xFFFF) {
        throw new RangeError(
          'ZIP entry name is too long.'
        );
      }

      const dataBytes =
        await zipEntryBytes(entry.data);

      if (dataBytes.byteLength > 0xFFFFFFFF) {
        throw new RangeError(
          'ZIP32 entry exceeds 4 GiB.'
        );
      }

      const crc =
        zipCrc32(dataBytes);

      const stamp =
        zipDosDateTime(
          entry.date || options.date || new Date()
        );

      const flags = 0x0800;
      const method = 0;

      const localHeader =
        zipConcat([
          zipU32(0x04034B50),
          zipU16(20),
          zipU16(flags),
          zipU16(method),
          zipU16(stamp.time),
          zipU16(stamp.date),
          zipU32(crc),
          zipU32(dataBytes.byteLength),
          zipU32(dataBytes.byteLength),
          zipU16(nameBytes.byteLength),
          zipU16(0),
          nameBytes
        ]);

      const localRecord =
        zipConcat([
          localHeader,
          dataBytes
        ]);

      if (
        localOffset + localRecord.byteLength >
        0xFFFFFFFF
      ) {
        throw new RangeError(
          'ZIP32 archive exceeds 4 GiB.'
        );
      }

      localParts.push(localRecord);

      centralParts.push(
        zipConcat([
          zipU32(0x02014B50),
          zipU16(20),
          zipU16(20),
          zipU16(flags),
          zipU16(method),
          zipU16(stamp.time),
          zipU16(stamp.date),
          zipU32(crc),
          zipU32(dataBytes.byteLength),
          zipU32(dataBytes.byteLength),
          zipU16(nameBytes.byteLength),
          zipU16(0),
          zipU16(0),
          zipU16(0),
          zipU16(0),
          zipU32(0),
          zipU32(localOffset),
          nameBytes
        ])
      );

      localOffset +=
        localRecord.byteLength;
    }

    const centralDirectory =
      zipConcat(centralParts);

    if (
      localOffset + centralDirectory.byteLength >
      0xFFFFFFFF
    ) {
      throw new RangeError(
        'ZIP32 central directory exceeds 4 GiB.'
      );
    }

    const commentBytes =
      encoder.encode(
        options.comment || ''
      );

    if (commentBytes.byteLength > 0xFFFF) {
      throw new RangeError(
        'ZIP comment is too long.'
      );
    }

    const endRecord =
      zipConcat([
        zipU32(0x06054B50),
        zipU16(0),
        zipU16(0),
        zipU16(entries.length),
        zipU16(entries.length),
        zipU32(centralDirectory.byteLength),
        zipU32(localOffset),
        zipU16(commentBytes.byteLength),
        commentBytes
      ]);

    return new Blob(
      [
        ...localParts,
        centralDirectory,
        endRecord
      ],
      {
        type: 'application/zip'
      }
    );
  }
