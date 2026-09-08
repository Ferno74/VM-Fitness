const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const AIRequest = require('../models/AIRequest');
const { protect } = require('../middleware/authMiddleware');

const ALLOWED_GOALS = ["lose_fat", "build_muscle", "maintain", "improve_endurance"];
const ALLOWED_LEVELS = ["beginner", "intermediate", "advanced"];
const ALLOWED_EQUIPMENT = ["no_equipment", "minimal", "home_gym", "full_gym"];
const ALLOWED_DURATIONS = [15, 30, 45, 60, 90, 120];
const ALLOWED_GENDERS = ["male", "female", "other"];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

// Ensure user has an active membership
const paidMemberGuard = (req, res, next) => {
  const { membershipStatus, membershipExpiry } = req.user;
  if (membershipStatus !== 'active') return res.status(403).json({ message: 'No active membership.' });
  if (membershipExpiry && new Date(membershipExpiry) < new Date()) return res.status(403).json({ message: 'Membership expired.' });
  next();
};

router.post('/plan', protect, paidMemberGuard, async (req, res) => {
  try {
    const { age, height, weight, gender, goal, fitnessLevel, daysPerWeek, workoutDuration, equipmentAvailable } = req.body;

    // Input validation
    if (!age || age <= 0 || age > 100) return res.status(400).json({ message: 'Invalid age' });
    if (!height || height <= 0 || height > 300) return res.status(400).json({ message: 'Invalid height' });
    if (!weight || weight <= 0 || weight > 500) return res.status(400).json({ message: 'Invalid weight' });
    if (!ALLOWED_GENDERS.includes(gender)) return res.status(400).json({ message: 'Invalid gender' });
    if (!ALLOWED_GOALS.includes(goal)) return res.status(400).json({ message: 'Invalid goal' });
    if (!ALLOWED_LEVELS.includes(fitnessLevel)) return res.status(400).json({ message: 'Invalid fitness level' });
    if (daysPerWeek < 1 || daysPerWeek > 7) return res.status(400).json({ message: 'Invalid days per week' });
    if (!ALLOWED_DURATIONS.includes(workoutDuration)) return res.status(400).json({ message: 'Invalid duration' });
    if (!ALLOWED_EQUIPMENT.includes(equipmentAvailable)) return res.status(400).json({ message: 'Invalid equipment' });

    const prompt = `Act as an AI fitness planning assistant. Generate a general fitness plan based on the user's provided information.

User Profile:
- Age: ${age}, Gender: ${gender}
- Height: ${height}cm, Weight: ${weight}kg
- Goal: ${goal.replace('_', ' ')}
- Fitness Level: ${fitnessLevel}
- Days Per Week: ${daysPerWeek}
- Workout Duration: ${workoutDuration} minutes
- Equipment: ${equipmentAvailable.replace('_', ' ')}

Return ONLY a valid JSON object in exactly this structure:
{
  "weeks": [
    { "week": 1, "focus": "...", "schedule": [ { "day": "Monday", "workout": "...", "exercises": ["..."], "duration": "..." } ] },
    { "week": 2, "focus": "...", "schedule": [] },
    { "week": 3, "focus": "...", "schedule": [] },
    { "week": 4, "focus": "...", "schedule": [] }
  ],
  "dietPlan": { "breakfast": "...", "lunch": "...", "dinner": "...", "snacks": "..." },
  "tips": ["..."],
  "disclaimer": "This plan is AI-generated for general guidance only. Consult a professional before starting."
}`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash", generationConfig: { responseMimeType: "application/json" } });
    const result = await model.generateContent(prompt);
    const planJson = JSON.parse(result.response.text());

    // Async audit log
    AIRequest.create({ userId: req.user._id, inputParams: req.body, response: planJson }).catch(console.error);

    res.json(planJson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate fitness plan.' });
  }
});


router.post('/chat', protect, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: 'Prompt is required.' });

    const systemPrompt = `You are the VM Fitness Gemini AI Coach. Answer the following fitness-related question concisely and professionally: ${prompt}`;
    
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();
    
    // Async audit log
    AIRequest.create({ userId: req.user._id, inputParams: { chat: prompt }, response: { reply: text } }).catch(console.error);

    res.json({ response: text });
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ message: 'Failed to generate chat response. Please try again.' });
  }
});
module.exports = router;
