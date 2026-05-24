// Replace with your Application (Client) ID from the Discord Developer Portal
const CLIENT_ID = '1507748987862777926';

// Permissions: Send Messages + Embed Links + Read Message History
const PERMISSIONS = 84032; // Send Messages + Embed Links + Read Message History + Add Reactions

const inviteUrl =
  `https://discord.com/api/oauth2/authorize` +
  `?client_id=${CLIENT_ID}` +
  `&permissions=${PERMISSIONS}` +
  `&scope=bot%20applications.commands`;

document.getElementById('invite-btn').href = inviteUrl;
document.getElementById('nav-invite-btn').href = inviteUrl;
document.getElementById('cta-invite-btn').href = inviteUrl;

// Live server count
fetch('/api/stats')
  .then(r => r.json())
  .then(data => {
    if (data.servers !== undefined) {
      document.getElementById('server-count').textContent = data.servers.toLocaleString();
    }
  })
  .catch(() => {});  // silently ignore if server isn't running
