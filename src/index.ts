import 'dotenv/config'; // Absolute first import
import { createServer } from 'http';
import { LoggerBase } from './utils/logger';
import { prisma } from './config/prisma';
import { ConfigService } from './config/env';
import app from './app';

/**
 * Server class responsible for bootstrapping the environment and starting the listener.
 */
class Server extends LoggerBase {
    /**
     * Executes the pre-flight checks and starts the server.
     */
    public async bootstrap(): Promise<void> {
        try {
            this.log(`${ConfigService.app.name} engine initiating...`);

            // Ensure Database is reachable before accepting traffic
            await prisma.$connect();
            this.log('Database connection verified.');

            const port = ConfigService.server.port;

            // Create HTTP server
            const httpServer = createServer(app);

            // TODO: Initialize WebSocket service
            // SocketService.initialize(httpServer);
            // this.log('WebSocket service initialized.');

            // Start listening
            httpServer.listen(port, () => {
                this.log(`API is active in ${ConfigService.server.env} mode`);
                this.log(`Endpoint: http://localhost:${port}/health`);
            });

            // Graceful shutdown handling
            const gracefulShutdown = async (signal: string) => {
                this.log(`${signal} received. Starting graceful shutdown...`);

                // Close HTTP server
                httpServer.close(async () => {
                    this.log('HTTP server closed.');

                    // Close WebSocket connections
                    // await SocketService.close();
                    // this.log('WebSocket service closed.');

                    // Close database connection
                    await prisma.$disconnect();
                    this.log('Database connection closed.');

                    this.log('Graceful shutdown completed.');
                    process.exit(0);
                });

                // Force shutdown after 30 seconds
                setTimeout(() => {
                    this.error('Forced shutdown after timeout');
                    process.exit(1);
                }, 30000);
            };

            // Listen for shutdown signals
            process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
            process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        } catch (error) {
            this.error('Critical server startup failure', error);
            process.exit(1);
        }
    }
}

// Start the server
new Server().bootstrap();