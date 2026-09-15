import { Inquiry } from '../lib/supabase';

export async function sendTelegramLeadNotification(inquiry: Inquiry): Promise<boolean> {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  // If credentials are not configured, skip silently
  if (!token || !chatId || token.includes('YOUR_') || chatId.includes('YOUR_')) {
    return false;
  }

  const messageText = `
🔔 *New PSIS Admission Inquiry!*
───────────────────
👤 *Parent Name:* ${inquiry.parent_name}
👦 *Student Name:* ${inquiry.student_name}
🎂 *Student Age:* ${inquiry.student_age} years old
📞 *Phone:* \`${inquiry.phone}\`
📧 *Email:* ${inquiry.email || 'N/A'}
🏫 *Campus:* ${inquiry.campus}
📚 *Program:* ${inquiry.program}
📝 *Notes:* ${inquiry.notes || 'No extra notes provided.'}
───────────────────
⏰ *Received:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' })} (Cambodia Time)
  `.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'Markdown',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}
