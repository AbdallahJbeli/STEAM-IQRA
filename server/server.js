import app from './app.js';
import { SERVER_PORT } from './config/env.js';

const server = app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});

// Graceful Shutdown Handling
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});