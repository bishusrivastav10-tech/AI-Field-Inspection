import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 AFO QuickFix Express Server running on port ${PORT}`);
  console.log(`📡 API Health: http://127.0.0.1:${PORT}/health`);
  console.log(`====================================================`);
});
