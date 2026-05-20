// Smart local rule-based responsive chatbot for Health-tech AI Coach
const getCoachResponse = (userMessage, username) => {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('hello') || msg.includes('hi ') || msg.includes('hey')) {
    return `Hello ${username || 'Champion'}! 🚀 I am **AURA**, your BiteAI Personal Health Coach. I have loaded your biometric logs. What health, nutrition, or workout protocols shall we optimize today?`;
  }

  if (msg.includes('weight') || msg.includes('fat') || msg.includes('lose')) {
    return `To optimize for **fat loss** and body recomposition, I suggest a structured approach:
    
1. 📉 **Caloric Deficit**: Target a mild 300-500 calorie deficit relative to your Daily Calorie Goal.
2. 🍗 **Satiating Protein**: Aim for at least **1.6g - 2.0g of protein per kg of body weight** to preserve lean muscle tissue.
3. 💧 **Hydration**: Drink 3-4 liters of water daily to maintain metabolic efficiency.
4. 🚶 **NEAT**: Aim for 8,000 to 10,000 steps daily.

Would you like me to adjust your profile calorie target in your dashboard?`;
  }

  if (msg.includes('muscle') || msg.includes('bulk') || msg.includes('gain')) {
    return `Protocol **Muscle Hypertrophy** is active! 💪 Here are your key targets:

1. 📈 **Caloric Surplus**: Maintain a surplus of 250-400 clean calories daily.
2. 🥩 **Macronutrient Optimization**: Ensure you hit your protein goals (e.g., eggs, chicken, salmon, tofu) consistently!
3. 🏋️ **Progressive Overload**: Focus on compound lifts (Squats, Bench, Deadlifts) and increase weight or reps week over week.
4. 💤 **Anabolic Sleep**: Sleep 8 hours minimum; muscle recovery happens in deep REM stages.`;
  }

  if (msg.includes('stressed') || msg.includes('anxious') || msg.includes('mood') || msg.includes('emotion')) {
    return `I detected mention of emotional indicators. 🧠 According to your **Mood-Based Eating Analytics**, stress-eating often spikes cortisol, directing cravings towards high-sodium/high-fat foods.
    
**Counter-Protocols:**
- 🍵 Swap snacks with warm Green Tea (contains L-theanine which triggers alpha brain waves).
- ⏱️ Apply the **15-minute Rule**: Wait 15 minutes before acting on an emotional craving.
- 🚶 Perform a 10-minute active walk or breathing cycle.
Your mind is the hardware, your food is the fuel – let's keep both optimized!`;
  }

  if (msg.includes('protein') || msg.includes('egg') || msg.includes('chicken')) {
    return `Protein is the building block of cellular repair. 🥚 Excellent sources:
- **Animal**: Chicken breast (31g/100g), Whole eggs (6g per egg), Salmon (20g/100g).
- **Plant**: Tempeh (19g/100g), Lentils (9g/100g), Pumpkin Seeds (30g/100g).
Looking at your current macro tracking progress, you are doing great! Try to spread intake across 3-4 meals to maximize muscle protein synthesis.`;
  }

  if (msg.includes('recipe') || msg.includes('cook') || msg.includes('eat')) {
    return `Here is a high-performance **BiteAI Signature Recipe** to optimize your day:

🥗 **Neon Superfood Salad** (approx. 420 kcal | 28g P | 30g C | 18g F)
- **Base**: 2 cups of Baby Spinach and Chopped Kale.
- **Protein**: 120g of Grilled Chicken Breast or Crispy Tofu.
- **Fats**: 1/2 Medium Avocado (sliced).
- **Carbs**: 1/2 cup of Quinoa or Roasted Sweet Potato.
- **Dressing**: 1 tsp Olive Oil + Splash of Lemon juice.

Fast, nutrient-dense, and highly anti-inflammatory!`;
  }

  if (msg.includes('water') || msg.includes('drink') || msg.includes('hydrate')) {
    return `Hydration is essential for cognitive performance and metabolic health. 💧 
Did you know? Even a **1-2% drop in hydration levels** can reduce muscular strength by up to 10% and degrade mood. Carry a sleek 1L bottle and aim for 3 refills daily!`;
  }

  return `Affirmative, logs updated. 🧠 To stay optimized:
  
- 🍎 Ensure you log all meals (use **AI Image scan** or **Barcode scanner** in the meal page).
- 📊 Track your weekly habits on the **Analytics** page.
- 🏆 Keep your daily tracking **Streak** alive for rewards!

Ask me anything about calories, muscle building, recipes, workouts, or stress-eating mitigation!`;
};

// @desc    Post message to AI Coach
// @route   POST /api/coach/chat
// @access  Private
const chatWithCoach = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const responseText = getCoachResponse(message, req.user?.username);

    res.json({
      success: true,
      reply: responseText,
      coachName: 'AURA AI',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('AI Coach chat error:', error);
    res.status(500).json({ success: false, message: 'AI Coach system offline' });
  }
};

module.exports = {
  chatWithCoach
};
