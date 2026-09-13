export function parseCsvLine(line: string): string[] {
    const cells: string[] = [];
    let cell = '';
    let quoted = false;

    for (let i = 0; i < line.length; i += 1) {
        const char = line[i];

        if (quoted) {
            if (char !== '"') {
                cell += char;
            } else if (line[i + 1] === '"') {
                cell += '"';
                i += 1;
            } else {
                quoted = false;
            }
            continue;
        }

        if (char === '"') {
            quoted = true;
        } else if (char === ',') {
            cells.push(cell.trim());
            cell = '';
        } else {
            cell += char;
        }
    }

    cells.push(cell.trim());

    return cells;
}
