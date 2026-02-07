import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware
app.use(cors());
app.use(express.json());

// API endpoints
app.get('/api/gold', async (req, res) => {
  try {
    const response = await fetch('https://static.altinkaynak.com/Gold');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching gold prices:', error);
    res.status(500).json({ error: 'Failed to fetch gold prices' });
  }
});

app.get('/api/currency', async (req, res) => {
  try {
    const response = await fetch('https://static.altinkaynak.com/Currency');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching currency prices:', error);
    res.status(500).json({ error: 'Failed to fetch currency prices' });
  }
});

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle client-side routing - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
