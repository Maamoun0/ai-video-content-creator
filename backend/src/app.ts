import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { authenticate } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import { generateScript } from './services/ai';

// ... (existing middleware)

import { renderVideo } from './services/video';

// Project Routes
app.post('/api/projects/render', async (req, res) => {
  try {
    const { project } = req.body;
    console.log(`Rendering project: ${project.id}...`);
    const result = await renderVideo(project);
    res.json(result);
  } catch (error: any) {
    console.error("Render error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects/generate-script', async (req, res) => {
  try {
    const { idea, language, durationSeconds } = req.body;
    if (!idea) return res.status(400).json({ error: "Idea is required" });
    
    console.log(`Generating script for idea: ${idea.substring(0, 30)}...`);
    const script = await generateScript(idea, language, durationSeconds);
    res.json(script);
  } catch (error: any) {
    console.error("Script generation error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/me', authenticate, (req: any, res) => {
  res.json({ user: req.user });
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});

// Force event loop to stay alive (temporary workaround for environment issue)
setInterval(() => {}, 1000 * 60 * 60);

export default app;
