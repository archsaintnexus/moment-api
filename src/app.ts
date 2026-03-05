import compression from 'compression';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { ConfigService } from './config/env';
import { IApiResponse } from './types';
import { apiLimiter } from './middlewares/rate-limiter.middleware';
import { globalErrorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/not-found.middleware';

/**
 * Application class to initialize the Express engine.
 * Separating the app definition from the server listener enables cleaner testing.
 */
class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    /**
     * Configures standard security and performance middlewares.
     */
    private initializeMiddlewares(): void {
        this.app.use(helmet());
        this.app.use(apiLimiter);
        this.app.use(cors({
            origin: ConfigService.cors.origins,
            credentials: true,
        }));
        this.app.use(compression());
        this.app.use(hpp());

        // Request logging in development
        if (ConfigService.server.isDevelopment) {
            this.app.use(morgan('dev'));
        }

        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
    }

<<<<<<< Updated upstream
    /**
     * Mounts the application routes.
     */
    private initializeRoutes(): void {
        // const apiPrefix = ConfigService.api.prefix;
=======
    // Mount routes under API prefix
    this.app.use(apiPrefix, routes);
  }
>>>>>>> Stashed changes

        // Health check for load balancers and David's peace of mind
        this.app.get('/health', (_req: Request, res: Response) => {
            const response: IApiResponse = {
                success: true,
                message: 'API is operational',
                data: { timestamp: new Date().toISOString() }
            };
            res.status(200).json(response);
        });

        // Mount routes under API prefix
        // this.app.use(`${apiPrefix}/auth`, authRoutes);
    }

    /**
     * Global error interceptor. Must be the last middleware mounted.
     */
    private initializeErrorHandling(): void {
        this.app.use(notFoundHandler);
        this.app.use(globalErrorHandler);
    }
}

export default new App().app;