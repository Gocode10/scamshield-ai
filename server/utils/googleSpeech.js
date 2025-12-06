const fs = require('fs');
const path = require('path');
const {SpeechClient} = require('@google-cloud/speech');


async function transcribeAudio(filePath, mimetype = '') {
  // build credentials if provided as env var string
  let clientConfig = {};
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      clientConfig.credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    } catch (e) {
      console.warn('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY', e.message);
    }
  }

  const client = new SpeechClient(clientConfig);

  const audioBytes = fs.readFileSync(filePath).toString('base64');

  // best-effort config; allow overriding language via env
  const config = {
    languageCode: process.env.GOOGLE_SPEECH_LANG || 'en-US',
    enableAutomaticPunctuation: true,
    // Let Speech-to-Text auto-detect encoding where possible
  };

  // add hint for common browser recording codecs
  if (mimetype && /webm/.test(mimetype)) {
    config.encoding = 'WEBM_OPUS';
  }

  const request = {
    audio: {content: audioBytes},
    config
  };

  const [response] = await client.recognize(request);
  if (!response || !response.results) return '';

  const transcript = response.results.map(r => (r.alternatives && r.alternatives[0] && r.alternatives[0].transcript) || '').join(' ');
  return transcript;
}

module.exports = { transcribeAudio };
