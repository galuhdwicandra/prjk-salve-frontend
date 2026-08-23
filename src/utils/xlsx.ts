const CONTENT_TYPES =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>';

const ROOT_RELS =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';

const WORKBOOK_RELS =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const CRC_TABLE = (() => {
    const table = new Uint32Array(256);

    for (let i = 0; i < 256; i += 1) {
        let value = i;
        for (let bit = 0; bit < 8; bit += 1) {
            value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
        }
        table[i] = value >>> 0;
    }

    return table;
})();

export function crc32(bytes: Uint8Array): number {
    let crc = 0xffffffff;

    for (let i = 0; i < bytes.length; i += 1) {
        crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }

    return (crc ^ 0xffffffff) >>> 0;
}

function stripControlChars(value: string): string {
    let out = '';

    for (let i = 0; i < value.length; i += 1) {
        const code = value.charCodeAt(i);
        if (code > 0x1f || code === 0x09 || code === 0x0a || code === 0x0d) {
            out += value[i];
        }
    }

    return out;
}

function escapeXml(value: string): string {
    return stripControlChars(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function columnRef(index: number): string {
    let ref = '';
    let rest = index;

    while (rest >= 0) {
        ref = String.fromCharCode(65 + (rest % 26)) + ref;
        rest = Math.floor(rest / 26) - 1;
    }

    return ref;
}

function cellXml(value: unknown, ref: string): string {
    if (value === null || value === undefined || value === '') {
        return '';
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
        return `<c r="${ref}"><v>${value}</v></c>`;
    }

    return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(String(value))}</t></is></c>`;
}

function sheetXml(rows: unknown[][]): string {
    const body = rows
        .map((row, rowIndex) => {
            const cells = row.map((value, colIndex) => cellXml(value, `${columnRef(colIndex)}${rowIndex + 1}`)).join('');
            return `<row r="${rowIndex + 1}">${cells}</row>`;
        })
        .join('');

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${body}</sheetData></worksheet>`;
}

function workbookXml(sheetName: string): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${escapeXml(sheetName)}" sheetId="1" r:id="rId1"/></sheets></workbook>`;
}

function safeSheetName(name: string): string {
    const cleaned = name.replace(/[\\/*?:[\]]/g, ' ').trim().slice(0, 31);
    return cleaned || 'Data';
}

interface ZipEntry {
    name: string;
    data: Uint8Array<ArrayBuffer>;
}

function zipStore(entries: ZipEntry[]): Blob {
    const encoder = new TextEncoder();
    const files: Uint8Array<ArrayBuffer>[] = [];
    const directory: Uint8Array<ArrayBuffer>[] = [];
    let offset = 0;

    for (const entry of entries) {
        const name = encoder.encode(entry.name);
        const crc = crc32(entry.data);
        const size = entry.data.byteLength;

        const local = new Uint8Array(30 + name.length);
        const localView = new DataView(local.buffer);
        localView.setUint32(0, 0x04034b50, true);
        localView.setUint16(4, 20, true);
        localView.setUint16(6, 0x0800, true);
        localView.setUint16(12, 0x0021, true);
        localView.setUint32(14, crc, true);
        localView.setUint32(18, size, true);
        localView.setUint32(22, size, true);
        localView.setUint16(26, name.length, true);
        local.set(name, 30);

        const central = new Uint8Array(46 + name.length);
        const centralView = new DataView(central.buffer);
        centralView.setUint32(0, 0x02014b50, true);
        centralView.setUint16(4, 20, true);
        centralView.setUint16(6, 20, true);
        centralView.setUint16(8, 0x0800, true);
        centralView.setUint16(14, 0x0021, true);
        centralView.setUint32(16, crc, true);
        centralView.setUint32(20, size, true);
        centralView.setUint32(24, size, true);
        centralView.setUint16(28, name.length, true);
        centralView.setUint32(42, offset, true);
        central.set(name, 46);

        files.push(local, entry.data);
        directory.push(central);
        offset += local.byteLength + size;
    }

    const directorySize = directory.reduce((total, part) => total + part.byteLength, 0);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(8, entries.length, true);
    endView.setUint16(10, entries.length, true);
    endView.setUint32(12, directorySize, true);
    endView.setUint32(16, offset, true);

    return new Blob([...files, ...directory, end], { type: XLSX_MIME });
}

export function aoaToXlsxBlob(rows: unknown[][], sheetName = 'Data'): Blob {
    const encoder = new TextEncoder();

    return zipStore([
        { name: '[Content_Types].xml', data: encoder.encode(CONTENT_TYPES) },
        { name: '_rels/.rels', data: encoder.encode(ROOT_RELS) },
        { name: 'xl/workbook.xml', data: encoder.encode(workbookXml(safeSheetName(sheetName))) },
        { name: 'xl/_rels/workbook.xml.rels', data: encoder.encode(WORKBOOK_RELS) },
        { name: 'xl/worksheets/sheet1.xml', data: encoder.encode(sheetXml(rows)) },
    ]);
}
