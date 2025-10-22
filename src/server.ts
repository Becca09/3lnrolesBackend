import app from './app.js';

const PORT = process.env.PORT || 3000;

// Start server (local/dev)
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📋 API endpoints:`);
  console.log(`   GET http://localhost:${PORT}/api/roles - Get all roles`);
  console.log(`   GET http://localhost:${PORT}/api/roles/:id - Get role by ID`);
  console.log(`   GET http://localhost:${PORT}/api/roles/status/:status - Get roles by status`);
  console.log(`   GET http://localhost:${PORT}/api/roles/type/:type - Get roles by type`);
});

export default app;
