import QRCode from 'qrcode';

const STATIC_QRIS_PAYLOAD =
  '00020101021126580013ID.CO.BRI.WWW01189360000200420653700208420653700303UMI51440014ID.CO.QRIS.WWW0215ID10254115846300303UMI5204721153033605802ID5925SALVE CLEANING SHOES CINU6007BANDUNG61054062462070703A016304A966';

type QrisTag = {
  id: string;
  value: string;
};

function calculateCrc16(value: string): string {
  let crc = 0xffff;

  for (let index = 0; index < value.length; index += 1) {
    crc ^= value.charCodeAt(index) << 8;

    for (let bit = 0; bit < 8; bit += 1) {
      crc =
        (crc & 0x8000) !== 0
          ? ((crc << 1) ^ 0x1021) & 0xffff
          : (crc << 1) & 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function parseQrisTags(payload: string): QrisTag[] {
  const tags: QrisTag[] = [];
  let cursor = 0;

  while (cursor < payload.length) {
    if (cursor + 4 > payload.length) {
      throw new Error('Payload QRIS tidak valid.');
    }

    const id = payload.slice(cursor, cursor + 2);
    const length = Number(payload.slice(cursor + 2, cursor + 4));
    const valueStart = cursor + 4;
    const valueEnd = valueStart + length;

    if (!Number.isInteger(length) || valueEnd > payload.length) {
      throw new Error('Payload QRIS tidak valid.');
    }

    tags.push({
      id,
      value: payload.slice(valueStart, valueEnd),
    });

    cursor = valueEnd;
  }

  return tags;
}

function encodeQrisTag(tag: QrisTag): string {
  return `${tag.id}${String(tag.value.length).padStart(2, '0')}${tag.value}`;
}

function createDynamicQrisPayload(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Nominal QRIS harus lebih dari nol.');
  }

  const payloadWithoutCrc = STATIC_QRIS_PAYLOAD.slice(0, -4);
  const payloadBody = payloadWithoutCrc.endsWith('6304')
    ? payloadWithoutCrc.slice(0, -4)
    : payloadWithoutCrc;

  const sourceTags = parseQrisTags(payloadBody);
  const dynamicTags: QrisTag[] = [];
  let currencyTagFound = false;

  sourceTags.forEach((tag) => {
    if (tag.id === '54') {
      return;
    }

    dynamicTags.push({
      id: tag.id,
      value: tag.id === '01' ? '12' : tag.value,
    });

    if (tag.id === '53') {
      dynamicTags.push({
        id: '54',
        value: String(Math.round(amount)),
      });

      currencyTagFound = true;
    }
  });

  if (!currencyTagFound) {
    throw new Error('Kode mata uang tidak ditemukan dalam payload QRIS.');
  }

  const checksumSource = `${dynamicTags.map(encodeQrisTag).join('')}6304`;

  return `${checksumSource}${calculateCrc16(checksumSource)}`;
}

function drawSalveLogo(canvas: HTMLCanvasElement): void {
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas QRIS tidak tersedia.');
  }

  const boxWidth = Math.round(canvas.width * 0.34);
  const boxHeight = Math.round(canvas.height * 0.13);
  const boxX = Math.round((canvas.width - boxWidth) / 2);
  const boxY = Math.round((canvas.height - boxHeight) / 2);

  context.fillStyle = '#ffffff';
  context.fillRect(boxX, boxY, boxWidth, boxHeight);

  context.fillStyle = '#15346f';
  context.font = `900 ${Math.round(canvas.width * 0.065)}px Arial, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('SALVE', canvas.width / 2, canvas.height / 2);
}

export async function createQrisDataUrl(
  amount: number,
  size = 480,
): Promise<string> {
  const canvas = document.createElement('canvas');

  await QRCode.toCanvas(canvas, createDynamicQrisPayload(amount), {
    width: size,
    margin: 4,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });

  drawSalveLogo(canvas);

  return canvas.toDataURL('image/png');
}