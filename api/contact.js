const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// ── Connexion MongoDB cached pour Vercel ──────────────────
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

// ── Modèle Contact ────────────────────────────────────────
const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, trim: true, lowercase: true },
  service: { type: String, default: 'Non précisé' },
  message: { type: String, required: true, trim: true },
  ip:      { type: String, default: '' }
}, { timestamps: true });

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// ── Nodemailer ────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

async function sendNotificationEmail(contact) {
  const { name, email, service, message, createdAt } = contact;
  const date = new Date(createdAt).toLocaleString('fr-FR');

  await transporter.sendMail({
    from: `"Portfolio Samuel" <${process.env.GMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `🚀 Nouveau message de ${name} — Portfolio`,
    html: `
      <div style="max-width:560px;margin:0 auto;font-family:Arial,sans-serif;">
        <div style="background:linear-gradient(135deg,#63d3b2,#7c6dfa);padding:28px;border-radius:16px 16px 0 0;text-align:center;">
          <h1 style="margin:0;color:#060608;font-size:1.3rem;">📨 Nouveau message reçu !</h1>
          <p style="margin:8px 0 0;color:rgba(0,0,0,0.6);font-size:0.85rem;">${date}</p>
        </div>
        <div style="background:#13131e;padding:28px;border-radius:0 0 16px 16px;">
          <div style="background:#0d0d14;border-radius:10px;padding:16px;margin-bottom:12px;border:1px solid rgba(99,211,178,0.2);">
            <p style="margin:0 0 4px;font-size:0.7rem;color:#63d3b2;text-transform:uppercase;letter-spacing:0.1em;">Expéditeur</p>
            <p style="margin:0;color:#eeeef5;font-size:1rem;font-weight:700;">${name}</p>
            <a href="mailto:${email}" style="color:#7c6dfa;font-size:0.88rem;">${email}</a>
          </div>
          <div style="background:#0d0d14;border-radius:10px;padding:16px;margin-bottom:12px;">
            <p style="margin:0 0 4px;font-size:0.7rem;color:#f0a500;text-transform:uppercase;letter-spacing:0.1em;">Service</p>
            <p style="margin:0;color:#eeeef5;">${service}</p>
          </div>
          <div style="background:#0d0d14;border-radius:10px;padding:16px;margin-bottom:20px;">
            <p style="margin:0 0 8px;font-size:0.7rem;color:#7e7e99;text-transform:uppercase;letter-spacing:0.1em;">Message</p>
            <p style="margin:0;color:#eeeef5;line-height:1.7;white-space:pre-wrap;">${message}</p>
          </div>
          <div style="text-align:center;">
            <a href="mailto:${email}?subject=Re: Votre demande" style="display:inline-block;background:#63d3b2;color:#060608;padding:12px 28px;border-radius:100px;text-decoration:none;font-weight:700;">
              ✉ Répondre à ${name}
            </a>
          </div>
        </div>
        <p style="text-align:center;color:#7e7e99;font-size:0.72rem;margin-top:16px;">•SAMUEL• Portfolio</p>
      </div>
    `,
    text: `Nouveau message de ${name}\nEmail: ${email}\nService: ${service}\n\n${message}`
  });
}

async function sendConfirmationEmail(contact) {
  const { name, email } = contact;

  await transporter.sendMail({
    from: `"Samuel CHETKOU" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `✅ Message bien reçu — Samuel CHETKOU`,
    html: `
      <div style="max-width:520px;margin:0 auto;font-family:Arial,sans-serif;">
        <div style="background:#fff;border-radius:20px;padding:36px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:60px;height:60px;background:#63d3b2;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:1.6rem;margin-bottom:14px;">✅</div>
            <h1 style="margin:0;font-size:1.3rem;font-weight:900;color:#0d0d1a;">Message bien reçu, ${name} !</h1>
          </div>
          <p style="color:#6b6b88;font-size:0.92rem;line-height:1.7;margin-bottom:14px;">
            Merci pour votre message. Je vous répondrai <strong style="color:#0d0d1a;">dans les 24 heures</strong>.
          </p>
          <p style="color:#6b6b88;font-size:0.92rem;line-height:1.7;margin-bottom:24px;">
            En attendant, n'hésitez pas à consulter mon profil LinkedIn ou Upwork.
          </p>
          <div style="display:flex;gap:10px;margin-bottom:24px;">
            <a href="https://www.linkedin.com/in/samuel-chetkou-b3a32a306/" style="flex:1;text-align:center;padding:11px;background:#0a66c2;color:#fff;border-radius:100px;text-decoration:none;font-size:0.82rem;font-weight:600;">LinkedIn</a>
            <a href="https://www.upwork.com/freelancers/~010cf4ff1b7983a0d8" style="flex:1;text-align:center;padding:11px;background:#6fda44;color:#fff;border-radius:100px;text-decoration:none;font-size:0.82rem;font-weight:600;">Upwork</a>
          </div>
          <hr style="border:none;border-top:1px solid #f0f0f8;margin:0 0 16px;">
          <p style="margin:0;color:#9b9bb8;font-size:0.75rem;text-align:center;">
            •SAMUEL• · <a href="mailto:samuelchetk@gmail.com" style="color:#0f9b7a;">samuelchetk@gmail.com</a>
          </p>
        </div>
      </div>
    `
  });
}

// ── Anti-spam ─────────────────────────────────────────────
const tracker = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const window = 60 * 60 * 1000;
  if (!tracker.has(ip)) tracker.set(ip, []);
  const times = tracker.get(ip).filter(t => now - t < window);
  tracker.set(ip, times);
  if (times.length >= 3) return false;
  times.push(now);
  return true;
}

// ── Handler principal Vercel ──────────────────────────────
module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET → liste des contacts (admin)
  if (req.method === 'GET') {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ success: false, message: 'Accès refusé.' });
    }
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 }).select('-ip -__v');
    return res.status(200).json({ success: true, count: contacts.length, data: contacts });
  }

  // POST → soumettre le formulaire
  if (req.method === 'POST') {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

    if (!checkRateLimit(ip)) {
      return res.status(429).json({ success: false, message: 'Trop de soumissions. Attendez une heure.' });
    }

    const { name, email, service, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Nom, email et message obligatoires.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Email invalide.' });
    }

    try {
      await connectDB();

      const contact = await Contact.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        service: service?.trim() || 'Non précisé',
        message: message.trim(),
        ip
      });

      await Promise.allSettled([
        sendNotificationEmail(contact),
        sendConfirmationEmail(contact)
      ]);

      return res.status(201).json({
        success: true,
        message: 'Message envoyé avec succès ! Je vous réponds sous 24h.'
      });

    } catch (err) {
      console.error('Erreur:', err);
      return res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  }

  return res.status(405).json({ success: false, message: 'Méthode non autorisée.' });
};
