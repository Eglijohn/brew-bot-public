import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function startPanelServer() {
    const app = express();
    const PORT = 3000;

    app.use(express.static(path.join(__dirname, '..', 'server')));

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    const configPath = path.join(__dirname, '..', '..', '..', 'config', 'config.json');
    app.get('/config', (req, res) => {
        try {
            const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            res.json(cfg);
        } catch (e) {
            res.status(500).json({ error: 'Failed to read config' });
        }
    });

    app.listen(PORT, () => {
        console.log(`Panel server running on http://localhost:${PORT}`);
    });
}