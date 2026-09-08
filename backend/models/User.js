const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  age: { type: Number },
  height: { type: Number }, // cm
  weight: { type: Number }, // kg
  gender: { type: String, enum: ['male', 'female', 'other'] },
  goal: { 
    type: String, 
    enum: ['lose_fat', 'build_muscle', 'maintain', 'improve_endurance'] 
  },
  fitnessLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'] 
  },
  daysPerWeek: { type: Number, min: 1, max: 7 },
  workoutDuration: { type: Number, enum: [15, 30, 45, 60, 90, 120] },
  equipmentAvailable: { 
    type: String, 
    enum: ['no_equipment', 'minimal', 'home_gym', 'full_gym'] 
  },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  membershipStatus: { type: String, enum: ['free', 'active', 'expired'], default: 'free' },
  membershipExpiry: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
