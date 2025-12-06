const express = require('express');
const router = express.Router();
const multer = require('multer');
const { checkText, checkAudio} = require('../controllers/checkController');

const upload = multer({
  storage: multer.memoryStorage()
});

router.post('/text', async (req, res) => {
  const { text, source } = req.body;
  if (!text) return res.status(400).json({ error: 'text is required' });
  try {
    const result = await checkText(text, source || 'unknown');
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

router.post('/audio', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file is required' });

  try {
    const result = await checkAudio(req.file.buffer, req.file.mimetype);
    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await require('../controllers/checkController').stats();
    res.json(stats);
  } catch (err) {
    console.error('stats error', err);
    res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;
