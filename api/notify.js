export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, address, items, time } = req.body;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const toNumber   = process.env.TWILIO_TO_NUMBER;   // +15164469064
  const fromNumber = process.env.TWILIO_FROM_NUMBER; // +14155238886

  const body = [
    `🚨 *New Salon Sprint Order!*`,
    ``,
    `👤 Stylist: ${name}`,
    `📍 Address: ${address}`,
    `🕐 Time: ${time}`,
    ``,
    `📦 Items:`,
    ...items.map(i => `  • ${i}`),
  ].join('\n');

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const params = new URLSearchParams({
    From: `whatsapp:${fromNumber}`,
    To:   `whatsapp:${toNumber}`,
    Body: body,
  });

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Twilio error:', data);
      return res.status(500).json({ error: data.message || 'Twilio error' });
    }

    return res.status(200).json({ success: true, sid: data.sid });
  } catch (err) {
    console.error('Notify error:', err);
    return res.status(500).json({ error: err.message });
  }
}
