// ── Quick Launcher ────────────────────────────────────────
// Starts the server and opens both pages in your browser.
// Usage:  node launch.js  OR  npm run launch

const { exec } = require('child_process');
const http = require('http');

const PORT = 3000;

// 1️⃣ Check if server is already running
function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}/api/menu`, () => resolve(true));
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => { req.destroy(); resolve(false); });
  });
}

// 2️⃣ Open a URL in the default browser (works on Windows)
function openBrowser(url) {
  exec(`start "" "${url}"`);
}

// 3️⃣ Wait until server is ready, then open both pages
function waitAndOpen(retries = 15) {
  checkServer().then((isUp) => {
    if (isUp) {
      console.log('\n🌐 Opening browser...');
      console.log(`   Customer Page : http://localhost:${PORT}`);
      console.log(`   Vendor Dashboard: http://localhost:${PORT}/vendor.html\n`);
      openBrowser(`http://localhost:${PORT}`);
      setTimeout(() => openBrowser(`http://localhost:${PORT}/vendor.html`), 800);
    } else if (retries > 0) {
      setTimeout(() => waitAndOpen(retries - 1), 500);
    } else {
      console.log('❌ Server did not start in time.');
    }
  });
}

// 4️⃣ Main
async function main() {
  const alreadyRunning = await checkServer();

  if (alreadyRunning) {
    console.log('✅ Server is already running on port ' + PORT);
    waitAndOpen();
  } else {
    console.log('🚀 Starting server...');
    const server = require('child_process').fork('server.js', { cwd: __dirname, stdio: 'inherit' });

    server.on('error', (err) => {
      console.error('❌ Failed to start server:', err.message);
      process.exit(1);
    });

    waitAndOpen();
  }
}

main();
