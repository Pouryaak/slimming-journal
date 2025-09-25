import { DailyCheckin } from './data/checkins';

export function sendTelegramMessage(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Telegram token or chat ID is not configured.');
    return; // Silently fail in dev if not configured
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    }),
  }).catch((error) => {
    console.error('Failed to send Telegram message:', error);
  });
}

export const prepareAndSendTelegramMessage = (
  data: DailyCheckin,
  userName: string,
  userTimeZone: string,
) => {
  const message = `
🎉 *${userName}* just completed their daily check-in for *${new Date(
    data.date,
  ).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: userTimeZone,
  })}*!

🎯 Calories: *${data.calories_consumed?.toLocaleString()}* / *${data.calories_goal?.toLocaleString()}*
💪 Protein: *${data.protein_consumed_g}g*
🍞 Carbs: *${data.carbs_consumed_g}g*
🔥 Burned: *${data.calories_burned?.toLocaleString()} kcal*
👟 Steps: *${data.steps?.toLocaleString()}*
💧 Water: *${data.water_ml?.toLocaleString()}L*
⏳ Fasted: *${data.fasting_hours} hours*

Let's keep the momentum going! 👏
      `;

  sendTelegramMessage(message);
};
