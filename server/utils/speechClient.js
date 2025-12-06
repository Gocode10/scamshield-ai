const speech = require('@google-cloud/speech');

const speechClient = new speech.SpeechClient();

module.exports = speechClient;