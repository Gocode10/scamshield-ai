const speechClient = require('../utils/speechClient');


async function transcribeAudio(buffer){
  const audioBytes = buffer.toString("base64");

  const request = {
    audio: { content: audioBytes },
    config: {
      encoding: "MP3",     
      languageCode: "en-US",
      enableAutomaticPunctuation: true
    }
  };

  const [response] = await speechClient.recognize(request);

  return response.results
    .map(r => r.alternatives[0].transcript)
    .join(" ");
}   

module.exports = {transcribeAudio};