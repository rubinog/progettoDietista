import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, 'data', 'categories.json');
const settingsPath = path.join(__dirname, 'data', 'settings.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const sanitizeKey = (value) => String(value || '')
  .trim()
  .toUpperCase()
  .replace(/\s+/g, '_')
  .replace(/[^A-Z0-9_]/g, '_')
  .replace(/_+/g, '_')
  .replace(/^_|_$/g, '');

const readCategories = async () => {
  const raw = await fs.readFile(dataPath, 'utf-8');
  return JSON.parse(raw);
};

const writeCategories = async (categories) => {
  await fs.writeFile(dataPath, `${JSON.stringify(categories, null, 2)}\n`, 'utf-8');
};

const readSettings = async () => {
  const raw = await fs.readFile(settingsPath, 'utf-8');
  return JSON.parse(raw);
};

const writeSettings = async (settings) => {
  await fs.writeFile(settingsPath, `${JSON.stringify(settings, null, 2)}\n`, 'utf-8');
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/categories', async (_req, res) => {
  try {
    const categories = await readCategories();
    res.json({ categories });
  } catch {
    res.status(500).json({ error: 'Unable to read categories file.' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { key, label, color } = req.body || {};
    const normalizedKey = sanitizeKey(key || label);

    if (!normalizedKey || !String(label || '').trim() || !String(color || '').trim()) {
      res.status(400).json({ error: 'key/label/color are required.' });
      return;
    }

    const categories = await readCategories();

    categories[normalizedKey] = {
      id: normalizedKey.toLowerCase(),
      label: String(label).trim(),
      color: String(color).trim(),
    };

    await writeCategories(categories);
    res.status(201).json({ categories, key: normalizedKey });
  } catch {
    res.status(500).json({ error: 'Unable to save category.' });
  }
});

app.put('/api/categories/:key', async (req, res) => {
  try {
    const key = sanitizeKey(req.params.key);
    const { label, color } = req.body || {};

    if (!key) {
      res.status(400).json({ error: 'Invalid key.' });
      return;
    }

    const categories = await readCategories();

    if (!categories[key]) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }

    categories[key] = {
      ...categories[key],
      label: String(label || categories[key].label).trim(),
      color: String(color || categories[key].color).trim(),
    };

    await writeCategories(categories);
    res.json({ categories });
  } catch {
    res.status(500).json({ error: 'Unable to update category.' });
  }
});

app.delete('/api/categories/:key', async (req, res) => {
  try {
    const key = sanitizeKey(req.params.key);

    if (!key) {
      res.status(400).json({ error: 'Invalid key.' });
      return;
    }

    const categories = await readCategories();

    if (!categories[key]) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }

    delete categories[key];
    await writeCategories(categories);
    res.json({ categories });
  } catch {
    res.status(500).json({ error: 'Unable to delete category.' });
  }
});

app.get('/api/settings/disclaimer', async (_req, res) => {
  try {
    const settings = await readSettings();
    res.json({ disclaimer: String(settings?.disclaimer || '') });
  } catch {
    res.status(500).json({ error: 'Unable to read disclaimer settings.' });
  }
});

app.put('/api/settings/disclaimer', async (req, res) => {
  try {
    const disclaimer = String(req.body?.disclaimer || '').trim();

    if (!disclaimer) {
      res.status(400).json({ error: 'disclaimer is required.' });
      return;
    }

    const settings = await readSettings();
    settings.disclaimer = disclaimer;
    await writeSettings(settings);

    res.json({ disclaimer: settings.disclaimer });
  } catch {
    res.status(500).json({ error: 'Unable to save disclaimer settings.' });
  }
});

app.listen(PORT, () => {
  console.log(`Category API running on http://localhost:${PORT}`);
});
