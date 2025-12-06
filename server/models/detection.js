const mongoose = require('mongoose');

const DetectionSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'audio'], default: 'text' },
  source: { type: String },
  text: { type: String },
  score: { type: Number },
  category: { type: String },
  explanation: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Detection || mongoose.model('Detection', DetectionSchema);