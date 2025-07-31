import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import open from 'open';

const interpolate = (html, data) => {
    return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
        return data[placeholder] || '';
    });
};

const formatNotes = (notes) => {
    return notes
        .map((note) => {
            return `
      <div class="note">
        <p>${note.content}</p>
        <div class="tags">
          ${note.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;
        })
        .join('\n');
};

const createServer = (notes) => {
    return http.createServer(async (req, res) => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const HTML_PATH = path.join(__dirname, 'templates', 'template.html');
        const template = await fs.readFile(HTML_PATH, 'utf-8');
        const html = interpolate(template, { notes: formatNotes(notes) });

        if (req.url === '/css/styles.css') {
            const CSS_PATH = path.join(__dirname, 'css', 'styles.css');
            const css = await fs.readFile(CSS_PATH, 'utf-8');

            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(css);

            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    });
};

export const start = (notes, port) => {
    const server = createServer(notes);

    server.listen(port, () => {
        const address = `http://localhost:${port}`;
        console.log(`Server running at ${address}`);
        open(address);
    });
};
