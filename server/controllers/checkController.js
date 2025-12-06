const Detection = require('../models/detection');
const {classifyText} = require('../utils/gemini');
const {transcribeAudio} = require('../utils/transcribeAudio');

async function checkText(text, source = 'unknown') {
  let analysis;
    try {
      analysis = await classifyText(text);
    } catch (e) {
      console.error('Gemini classification failed, falling back', e.message || e);
    }

  try {
    const data = new Detection({ type: 'text', source, text, score: analysis.score, category: analysis.category, explanation: analysis.explanation });
    await data.save();
  } catch (e) {
    console.error('DB save failed', e.message);
  }

  return analysis;
}

async function checkAudio(buffer, mimetype){
  const text = await transcribeAudio(buffer);
  const analysis = await checkText(text,"audio");

  return {text,analysis};
}

async function stats() {
  const agg = await Detection.aggregate([
    { $match: { score: { $exists: true } } },
    { $group: { _id: '$category', count: { $sum: 1 }, avgScore: { $avg: '$score' } } },
    { $sort: { count: -1 } }
  ]);

  const total = agg.reduce((s, a) => s + a.count, 0);
  const avgScore = agg.length ? Math.round(agg.reduce((s, a) => s + (a.avgScore * a.count), 0) / total) : 0;

  return {
    count: total,
    avgScore,
    byCategory: agg.map(a => ({ category: a._id, count: a.count, avgScore: Math.round(a.avgScore) }))
  };
}


module.exports = { checkText, checkAudio, stats };