import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gym Buddy User Service API',
      version: '1.0.0',
      description: 'API documentation for the Gym Buddy User Service',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: [path.join(__dirname, '../controllers/*.{js,ts}')], // Use relative path that works in both dev and prod
};

export const swaggerSpec = swaggerJsdoc(options); 