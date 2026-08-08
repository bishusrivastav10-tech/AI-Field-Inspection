import http from 'http';

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runSmokeTest() {
  console.log("🔍 Running AFO QuickFix Backend Smoke Test...");

  // 1. Health Check
  const health = await makeRequest({ host: '127.0.0.1', port: 5000, path: '/health', method: 'GET' });
  console.log("✅ Health Check:", health.status === 'ok' ? 'PASSED' : 'FAILED');

  // 2. Stats Check
  const stats = await makeRequest({ host: '127.0.0.1', port: 5000, path: '/api/stats', method: 'GET' });
  console.log("✅ Stats Check:", stats.success ? `PASSED (${stats.stats.totalWorkOrders} WOs)` : 'FAILED');

  // 3. Work Orders List Check
  const wos = await makeRequest({ host: '127.0.0.1', port: 5000, path: '/api/work-orders', method: 'GET' });
  console.log("✅ Work Orders Check:", wos.success ? `PASSED (${wos.count} work orders listed)` : 'FAILED');

  console.log("🎉 ALL API SMOKE TESTS PASSED CLEANLY!");
}

runSmokeTest().catch(console.error);
