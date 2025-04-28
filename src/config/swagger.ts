import swaggerJsdoc from 'swagger-jsdoc';

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
  apis: ['./src/controllers/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options); 