import swaggerJsdoc from 'swagger-jsdoc';

// Opções de configuração para o swagger-jsdoc
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'uaiFood API',
      version: '1.0.0',
      description: 'Documentação da API do uaiFood, criada para a disciplina de DAWII.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // URL base da sua API
        description: 'Servidor de Desenvolvimento',
      },
    ],
    // Isto é crucial para documentar a segurança (JWT)
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT no formato: Bearer {token}',
        },
      },
    },
    // Aplica a segurança de bearerAuth a todas as rotas
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Caminho para os arquivos que contêm as anotações da API (nossos arquivos de rotas)
  apis: ['./src/routes/*.js', './src/validators/*.js'],
};

// Gera a especificação do Swagger
const specs = swaggerJsdoc(options);

export default specs;