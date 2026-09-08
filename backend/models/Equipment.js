const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  category: { type: String, required: true },
  muscles: [{ type: String }],
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
