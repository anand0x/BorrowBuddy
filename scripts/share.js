import localtunnel from 'localtunnel';

async function startTunnel() {
  try {
    const tunnel = await localtunnel({ port: 5173, local_host: '127.0.0.1' });
    console.log(`\n🚀 Public URL: ${tunnel.url}\n`);

    tunnel.on('close', () => {
      console.log('Tunnel connection closed. Reconnecting in 3s...');
      setTimeout(startTunnel, 3000);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err.message);
      try {
        tunnel.close();
      } catch (e) {}
    });
  } catch (err) {
    console.error('Failed to establish tunnel:', err.message);
    setTimeout(startTunnel, 3000);
  }
}

// Keep Node.js process alive permanently
setInterval(() => {}, 60000);

startTunnel();
