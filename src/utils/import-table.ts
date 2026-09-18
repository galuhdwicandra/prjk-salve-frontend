import { parseCsvLine } from './csv';

const decoder = new TextDecoder();

function columnIndex(ref: string): number {
    let index = 0;

    for (const char of ref) {
        const code = char.charCodeAt(0);
        if (code < 65 || code > 90) break;
        index = index * 26 + (code - 64);
    }

    return index - 1;
}

async function inflateRaw(bytes: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
    if (typeof DecompressionStream === 'undefined') {
        throw new Error('Browser ini belum mendukung pembacaan .xlsx. Gunakan berkas .csv.');
    }

    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));

    return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function unzip(buffer: ArrayBuffer): Promise<Map<string, string>> {
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);

    let eocd = buffer.byteLength - 22;
    while (eocd >= 0 && view.getUint32(eocd, true) !== 0x06054b50) eocd -= 1;
    if (eocd < 0) throw new Error('Berkas .xlsx tidak valid.');

    const total = view.getUint16(eocd + 10, true);
    const entries = new Map<string, string>();
    let offset = view.getUint32(eocd + 16, true);

    for (let i = 0; i < total; i += 1) {
        const method = view.getUint16(offset + 10, true);
        const size = view.getUint32(offset + 20, true);
        const nameLength = view.getUint16(offset + 28, true);
        const extraLength = view.getUint16(offset + 30, true);
        const commentLength = view.getUint16(offset + 32, true);
        const localOffset = view.getUint32(offset + 42, true);
        const name = decoder.decode(bytes.subarray(offset + 46, offset + 46 + nameLength));
        const dataStart =
            localOffset + 30 + view.getUint16(localOffset + 26, true) + view.getUint16(localOffset + 28, true);
        const raw = bytes.slice(dataStart, dataStart + size);

        entries.set(name, decoder.decode(method === 0 ? raw : await inflateRaw(raw)));
        offset += 46 + nameLength + extraLength + commentLength;
    }

    return entries;
}

function sharedStrings(xml: string | undefined): string[] {
    if (!xml) return [];

    const doc = new DOMParser().parseFromString(xml, 'application/xml');

    return Array.from(doc.getElementsByTagName('si'), (node) => node.textContent ?? '');
}

function sheetRows(xml: string, shared: string[]): string[][] {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');

    return Array.from(doc.getElementsByTagName('row'), (row) => {
        const cells: (string | undefined)[] = [];

        Array.from(row.getElementsByTagName('c')).forEach((cell) => {
            const type = cell.getAttribute('t');
            const index = columnIndex(cell.getAttribute('r') ?? '');
            const value =
                type === 'inlineStr'
                    ? cell.textContent ?? ''
                    : cell.getElementsByTagName('v')[0]?.textContent ?? '';

            cells[index < 0 ? cells.length : index] = type === 's' ? shared[Number(value)] ?? '' : value;
        });

        return Array.from(cells, (cell) => cell ?? '');
    }).filter((row) => row.some((cell) => cell.trim() !== ''));
}

export async function readTableFile(file: File): Promise<string[][]> {
    if (!/\.xlsx$/i.test(file.name)) {
        return (await file.text())
            .split(/\r?\n/)
            .filter((line) => line.trim() !== '')
            .map(parseCsvLine);
    }

    const entries = await unzip(await file.arrayBuffer());
    const names = [...entries.keys()];
    const sheetName =
        names.find((name) => name === 'xl/worksheets/sheet1.xml') ??
        names.find((name) => name.startsWith('xl/worksheets/') && name.endsWith('.xml'));
    const sheet = sheetName ? entries.get(sheetName) : undefined;

    if (!sheet) throw new Error('Sheet tidak ditemukan di dalam berkas .xlsx.');

    return sheetRows(sheet, sharedStrings(entries.get('xl/sharedStrings.xml')));
}
