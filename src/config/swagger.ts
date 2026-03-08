import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Moment API",
      version: "1.0.0",
      description:
        "API documentation for the Moment multimedia services platform",
    },
    servers: [
      {
        url: "http://localhost:8000/api/v1",
        description: "Local server",
      },
      {
        url: "https://moment-api-fhjj.onrender.com/api/v1",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
