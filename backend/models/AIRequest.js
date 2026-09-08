const mongoose = require('mongoose');

const aiRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inputParams: {
    age: Number,
    height: Number,
    weight: Number,
    gender: String,
    goal: String,
    fitnessLevel: String,
    daysPerWeek: Number,
    workoutDuration: Number,
    equipmentAvailable: String
  },
  response: { type: Object }, // Store the parsed JSON plan
}, { timestamps: true });

module.exports = mongoose.model('AIRequest', aiRequestSchema);
