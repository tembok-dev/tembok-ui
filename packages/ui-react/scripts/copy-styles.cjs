// CommonJS (funciona aunque el paquete tenga "type": "module")
const fs = require("node:fs");
const path = require("node:path");

const from = path.resolve("src/styles");
const to = path.resolve("dist/styles");

fs.rmSync(to, { recursive: true, force: true });

if (fs.existsSync(from)) {
    fs.mkdirSync(to, { recursive: true });

    // Node 16.17+ tiene cpSync; si no, usa la función recursiva.
    if (typeof fs.cpSync === "function") {
        fs.cpSync(from, to, { recursive: true });
    } else {
        copyDir(from, to);
    }
}

function copyDir(src, dest) {
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const s = path.join(src, entry.name);
        const d = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            fs.mkdirSync(d, { recursive: true });
            copyDir(s, d);
        } else {
            fs.copyFileSync(s, d);
        }
    }
}
