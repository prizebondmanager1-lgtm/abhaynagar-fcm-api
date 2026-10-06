const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ফায়ারবেস সার্ভিস অ্যাকাউন্ট কি 
const serviceAccount = require('./serviceAccountKey.json');

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

app.get('/', (req, res) => {
  res.send('Abhaynagar FCM Server is Running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
