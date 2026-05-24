require('dotenv').config();
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG, JPG, GIF, or WEBP images are allowed'));
    }
  },
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'change-me-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../website')));

// ─── Auth ────────────────────────────────────────────────────────────────────

app.get('/auth/login', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
    response_type: 'code',
    scope: 'identify guilds',
  });
  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('/dashboard.html?error=no_code');

  try {
    const tokenRes = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDIRECT_URI,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    req.session.token = tokenRes.data.access_token;
    res.redirect('/dashboard.html');
  } catch (err) {
    console.error('OAuth callback error:', err.response?.data || err.message);
    res.redirect('/dashboard.html?error=auth_failed');
  }
});

app.get('/auth/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// ─── Auth middleware ──────────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  if (!req.session.token) return res.status(401).json({ error: 'Not logged in' });
  next();
}

// ─── API ──────────────────────────────────────────────────────────────────────

app.get('/api/me', requireAuth, async (req, res) => {
  try {
    const { data } = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${req.session.token}` },
    });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.get('/api/guilds', requireAuth, async (req, res) => {
  try {
    // Fetch guilds the user can manage
    const [userRes, botRes] = await Promise.all([
      axios.get('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${req.session.token}` },
      }),
      axios.get('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
      }),
    ]);

    const MANAGE_GUILD = BigInt(0x20);
    const adminGuilds = userRes.data.filter(
      g => (BigInt(g.permissions) & MANAGE_GUILD) === MANAGE_GUILD
    );
    const botGuildIds = new Set(botRes.data.map(g => g.id));

    res.json(
      adminGuilds
        .filter(g => botGuildIds.has(g.id))
        .map(g => ({
          id: g.id,
          name: g.name,
          icon: g.icon
            ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=64`
            : null,
        }))
    );
  } catch (err) {
    console.error('Guilds error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch servers' });
  }
});

app.get('/api/stats', async (_, res) => {
  try {
    const { data } = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
    });
    res.json({ servers: data.length });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/guild/:guildId/botmember', requireAuth, async (req, res) => {
  try {
    const [memberRes, botRes] = await Promise.all([
      axios.get(`https://discord.com/api/v10/guilds/${req.params.guildId}/members/${process.env.CLIENT_ID}`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
      }),
      axios.get('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
      }),
    ]);

    const member = memberRes.data;
    const bot = botRes.data;

    const guildAvatar = member.avatar
      ? `https://cdn.discordapp.com/guilds/${req.params.guildId}/users/${process.env.CLIENT_ID}/avatars/${member.avatar}.png?size=128`
      : null;
    const globalAvatar = bot.avatar
      ? `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png?size=128`
      : null;

    res.json({
      nick: member.nick || null,
      username: bot.username,
      avatar: guildAvatar || globalAvatar,
    });
  } catch (err) {
    console.error('Bot member error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch bot info' });
  }
});

app.post('/api/customize', requireAuth, upload.single('avatar'), async (req, res) => {
  const { guild_id, name } = req.body;
  if (!guild_id) return res.status(400).json({ error: 'guild_id is required' });

  // Verify the user is actually an admin of that guild
  try {
    const { data: guilds } = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${req.session.token}` },
    });
    const MANAGE_GUILD = BigInt(0x20);
    const guild = guilds.find(g => g.id === guild_id);
    if (!guild || (BigInt(guild.permissions) & MANAGE_GUILD) !== MANAGE_GUILD) {
      return res.status(403).json({ error: 'You are not an admin of that server' });
    }
  } catch {
    return res.status(500).json({ error: 'Could not verify permissions' });
  }

  const body = {};
  if (typeof name === 'string') body.nick = name.trim().slice(0, 32);
  if (req.file) {
    const base64 = req.file.buffer.toString('base64');
    body.avatar = `data:${req.file.mimetype};base64,${base64}`;
  }

  if (!Object.keys(body).length) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  try {
    await axios.patch(
      `https://discord.com/api/v10/guilds/${guild_id}/members/@me`,
      body,
      { headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` } }
    );
    res.json({ success: true });
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to update bot';
    console.error('Customize error:', err.response?.data || err.message);
    res.status(500).json({ error: msg });
  }
});

// ─── Multer error handler ─────────────────────────────────────────────────────

app.use((err, req, res, _next) => {
  if (err.message) return res.status(400).json({ error: err.message });
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
