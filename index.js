const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ফায়ারবেস সার্ভিস অ্যাকাউন্ট কি Vercel Environment Variable থেকে নেওয়া হচ্ছে
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

app.post('/send-notification', async (req, res) => {
  const { title, message } = req.body;
  
  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are required' });
  }

  const payload = {
    notification: {
      title: title,
      body: message
    },
    topic: 'all_users' // সকল ইউজার এই টপিকে নোটিফিকেশন পাবে
  };

  try {
    const response = await admin.messaging().send(payload);
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// হোমপেজ রাউট
app.get('/', (req, res) => {
  res.send('Abhaynagar FCM Server is Running perfectly!');
});

// Vercel এর জন্য শুধুমাত্র অ্যাপ এক্সপোর্ট করতে হবে, app.listen রাখা যাবে না
module.exports = app;
