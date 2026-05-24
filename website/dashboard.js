const CLIENT_ID = '1507748987862777926';
const PERMISSIONS = 84032; // Send Messages + Embed Links + Read Message History + Add Reactions
const INVITE_URL =
  `https://discord.com/api/oauth2/authorize` +
  `?client_id=${CLIENT_ID}&permissions=${PERMISSIONS}&scope=bot%20applications.commands`;

// ─── State ───────────────────────────────────────────────────────────────────

let currentUser = null;
let selectedGuild = null;
let pendingAvatarFile = null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function show(id) {
  ['state-loading', 'state-login', 'state-guilds', 'state-form'].forEach(s => {
    document.getElementById(s).classList.toggle('hidden', s !== id);
  });
}

let toastTimer;
function toast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

function guildColor(name) {
  const colors = ['#5865F2','#57f287','#fee75c','#eb459e','#ed4245','#9c84ec','#f0b232'];
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return colors[Math.abs(hash) % colors.length];
}

function renderGuildIcon(guild, size = 44) {
  if (guild.icon) {
    const img = document.createElement('img');
    img.className = 'guild-icon';
    img.src = guild.icon;
    img.alt = guild.name;
    img.style.width = img.style.height = size + 'px';
    return img;
  }
  const div = document.createElement('div');
  div.className = 'guild-icon-fallback';
  div.style.cssText = `width:${size}px;height:${size}px;background:${guildColor(guild.name)}`;
  div.textContent = guild.name.charAt(0).toUpperCase();
  return div;
}

function setUserInfo(user) {
  const avatar = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
    : `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`;

  ['user-avatar', 'user-avatar2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.src = avatar; el.alt = user.username; }
  });
  ['user-name', 'user-name2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = user.global_name || user.username;
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

async function init() {
  show('state-loading');

  // Check for error param
  const params = new URLSearchParams(window.location.search);
  if (params.get('error')) {
    show('state-login');
    toast('Login failed. Please try again.', 'error');
    return;
  }

  try {
    const res = await fetch('/api/me');
    if (!res.ok) { show('state-login'); return; }
    currentUser = await res.json();
    setUserInfo(currentUser);
    loadGuilds();
  } catch {
    show('state-login');
  }
}

// ─── Guild picker ─────────────────────────────────────────────────────────────

async function loadGuilds() {
  show('state-guilds');
  document.getElementById('invite-link').href = INVITE_URL;

  const grid = document.getElementById('guild-grid');
  const empty = document.getElementById('no-guilds');

  grid.innerHTML = '<div style="color:var(--muted);font-size:.9rem">Loading servers…</div>';
  empty.classList.add('hidden');

  try {
    const res = await fetch('/api/guilds');
    const guilds = await res.json();

    grid.innerHTML = '';

    if (!guilds.length) {
      empty.classList.remove('hidden');
      return;
    }

    for (const guild of guilds) {
      const card = document.createElement('button');
      card.className = 'guild-card';
      card.appendChild(renderGuildIcon(guild));

      const name = document.createElement('span');
      name.className = 'guild-card-name';
      name.textContent = guild.name;
      card.appendChild(name);

      card.addEventListener('click', () => openForm(guild));
      grid.appendChild(card);
    }
  } catch {
    grid.innerHTML = '<div style="color:var(--danger);font-size:.9rem">Failed to load servers.</div>';
  }
}

// ─── Customize form ───────────────────────────────────────────────────────────

function openForm(guild) {
  selectedGuild = guild;
  pendingAvatarFile = null;

  // Guild header
  document.getElementById('form-guild-name').textContent = guild.name;
  const iconEl = document.getElementById('form-guild-icon');
  iconEl.innerHTML = '';
  iconEl.appendChild(renderGuildIcon(guild, 48));

  // Reset form state
  const preview = document.getElementById('avatar-preview');
  const nameInput = document.getElementById('name-input');
  const charCount = document.getElementById('char-count');

  preview.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90"%3E%3Crect width="90" height="90" fill="%2312151f"/%3E%3Ctext x="50%25" y="54%25" dominant-baseline="middle" text-anchor="middle" font-family="Inter,sans-serif" font-size="36" fill="%236b7099"%3E%3F%3C/text%3E%3C/svg%3E';
  nameInput.value = '';
  nameInput.placeholder = 'Loading current name…';
  charCount.textContent = '0 / 32';
  document.getElementById('save-status').textContent = '';
  document.getElementById('save-status').className = 'save-status';
  document.getElementById('remove-avatar').style.display = 'none';

  show('state-form');

  // Load the bot's current name and avatar for this guild
  fetch(`/api/guild/${guild.id}/botmember`)
    .then(r => r.json())
    .then(data => {
      if (data.avatar) preview.src = data.avatar;
      const currentName = data.nick || data.username || '';
      nameInput.value = currentName;
      nameInput.placeholder = 'Leave blank to keep the current name';
      charCount.textContent = `${currentName.length} / 32`;
    })
    .catch(() => {
      nameInput.placeholder = 'Leave blank to keep the current name';
    });
}

// ─── Avatar upload ────────────────────────────────────────────────────────────

document.getElementById('avatar-input').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 8 * 1024 * 1024) {
    toast('Image must be under 8 MB.', 'error');
    e.target.value = '';
    return;
  }

  pendingAvatarFile = file;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('avatar-preview').src = ev.target.result;
    document.getElementById('remove-avatar').style.display = 'inline';
  };
  reader.readAsDataURL(file);
});

document.getElementById('remove-avatar').addEventListener('click', () => {
  pendingAvatarFile = null;
  document.getElementById('avatar-input').value = '';
  document.getElementById('avatar-preview').src =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90"%3E%3Crect width="90" height="90" fill="%2312151f"/%3E%3Ctext x="50%25" y="54%25" dominant-baseline="middle" text-anchor="middle" font-family="Inter,sans-serif" font-size="36" fill="%236b7099"%3E%3F%3C/text%3E%3C/svg%3E';
  document.getElementById('remove-avatar').style.display = 'none';
});

// ─── Character counter ────────────────────────────────────────────────────────

document.getElementById('name-input').addEventListener('input', e => {
  const len = e.target.value.length;
  const counter = document.getElementById('char-count');
  counter.textContent = `${len} / 32`;
  counter.style.color = len > 28 ? '#f59e0b' : '';
});

// ─── Back button ─────────────────────────────────────────────────────────────

document.getElementById('back-btn').addEventListener('click', () => {
  selectedGuild = null;
  loadGuilds();
});

// ─── Save ─────────────────────────────────────────────────────────────────────

document.getElementById('save-btn').addEventListener('click', async () => {
  const name = document.getElementById('name-input').value.trim();
  if (!pendingAvatarFile && !name) {
    toast('Enter a name or upload an image first.', 'error');
    return;
  }

  const btn = document.getElementById('save-btn');
  const status = document.getElementById('save-status');
  btn.disabled = true;
  btn.textContent = 'Saving…';
  status.textContent = '';
  status.className = 'save-status';

  const form = new FormData();
  form.append('guild_id', selectedGuild.id);
  if (name) form.append('name', name);
  if (pendingAvatarFile) form.append('avatar', pendingAvatarFile);

  try {
    const res = await fetch('/api/customize', { method: 'POST', body: form });
    const data = await res.json();

    if (data.success) {
      toast('Changes saved!', 'success');
      status.textContent = '✓ Saved successfully';
      status.className = 'save-status success';
      pendingAvatarFile = null;
      document.getElementById('remove-avatar').style.display = 'none';
    } else {
      toast(data.error || 'Something went wrong.', 'error');
      status.textContent = data.error || 'Save failed';
      status.className = 'save-status error';
    }
  } catch {
    toast('Network error. Please try again.', 'error');
    status.textContent = 'Network error';
    status.className = 'save-status error';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Changes';
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

init();
