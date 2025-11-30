export function getPerformanceMessage(value: number): string {
  const hour = new Date().getHours();

  const positiveMessages = [
    "Gains unlocked!",
    "Green Is Good.",
    "Winning The Day.",
    "Crushing It Today!",
    "Portfolio Looking Sharp.",
    "Profits Made Easy.",
    "Money Printer Go!",
    "Highest Peak Yet!",
    "Keep That Momentum.",
    "Up Up Up!",
  ];

  const negativeMessages = [
    "Stay Rational Now.",
    "It Happens, Hold.",
    "Red Day Sale.",
    "Plan, Not Panic.",
    "Volatility Alert!",
    "Evaluate The Dip.",
    "Think Long Term.",
    "Tomorrow Is Better.",
    "Time To Review.",
    "Stick To Plan.",
  ];

  const neutralMessages = [
    "Staying The Course.",
    "Holding Steady Now.",
    "Patience Pays Off.",
    "Waiting For Action.",
    "Quiet Before Move.",
    "Zero Drama Today.",
    "Consolidate and Wait.",
    "Market Taking Nap.",
    "Stability Is Key.",
    "No Major Change.",
  ];

  const nightMessages = [
    "Market Is Closed.",
    "See You Tomorrow.",
    "Rest And Recharge.",
    "Trading Day Done.",
    "Final Tally In.",
    "Unplug and Relax.",
    "Log Off Now.",
    "Check Back Soon.",
    "Good Night Gains.",
    "Sleep On It.",
  ];

  // 🌙 Check Night Time First
  if (hour >= 20) {
    return nightMessages[Math.floor(Math.random() * nightMessages.length)];
  }

  // ➕ Positive
  if (value > 0) {
    return positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
  }

  // 🔴 Negative
  if (value < 0) {
    return negativeMessages[Math.floor(Math.random() * negativeMessages.length)];
  }

  // ↔️ Neutral
  return neutralMessages[Math.floor(Math.random() * neutralMessages.length)];
}
