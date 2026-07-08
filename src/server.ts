import app from './app';
import config from './app/config/index';
import prisma from './app/lib/prisma';

// Server start function
function startServer() {
  const server = app.listen(config.port, () => {
    console.log(`🚀 App running on port ${config.port}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`📴 Received ${signal}, shutting down...`);
    await prisma.$disconnect();
    server.close(() => {
      console.log('🛑 Server closed, Prisma disconnected');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

// Main bootstrap
async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected to database');
    startServer();
  } catch (error) {
    console.error('❌ Error starting server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
